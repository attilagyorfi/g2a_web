import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import * as db from "./db";
import { translate, isTranslateConfigured } from "./_core/translate";
import { cloudinaryUpload, isCloudinaryConfigured } from "./_core/cloudinary";
import { generateBlogDraft, generateImage, generateSeoMeta, improveText, isAiConfigured, getAiModel } from "./_core/ai";
import { getClientIp } from "./_core/rateLimit";
import { checkRateLimitDb } from "./_core/dbRateLimit";
import { isHoneypotTriggered, HONEYPOT_FIELD } from "./_core/spam";
import { sendEmail, isEmailConfigured } from "./_core/email";
import {
  renderConfirmationEmailHtml,
  CONFIRMATION_SUBJECTS,
} from "./_core/emailTemplates";
import { generateSocialCopy } from "./_core/socialCopy";
import { randomBytes } from "node:crypto";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

/**
 * Apply rate-limit + honeypot guard to a public form submission.
 *
 * - `formKey`: namespace for the bucket (e.g. "contact"). Different forms
 *   get separate buckets so a contact submission doesn't burn audit capacity.
 * - Honeypot: when triggered, silently returns the resolver's "successful"
 *   shape via `silentSuccess` (caller picks the shape) — bots think it worked.
 * - Rate limit: 5 submissions / 15 min / IP per form. Generous enough for
 *   legit users (even if a family shares one IP), tight enough to stop spam.
 *   Stored in DB (TiDB) — Vercel serverless cold starts wipe in-memory state,
 *   so per-IP limits would not survive across requests otherwise.
 */
async function guardPublicFormOrSilent<T>(
  ctx: { req: import("express").Request },
  input: { website?: string | null | undefined },
  formKey: string,
  silentSuccess: T,
): Promise<T | null> {
  if (isHoneypotTriggered(input)) {
    // eslint-disable-next-line no-console
    console.warn(`[spam] Honeypot triggered for ${formKey} from ${getClientIp(ctx.req)}`);
    return silentSuccess;
  }
  const ip = getClientIp(ctx.req);
  const limit = await checkRateLimitDb(`${formKey}:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    const minutes = Math.ceil(((limit.retryAt ?? Date.now()) - Date.now()) / 60000);
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Túl sok küldés erről az IP-ről. Próbáld újra ${minutes} perc múlva.`,
    });
  }
  return null; // Caller continues with normal flow
}

// ─── Upload Router ────────────────────────────────────────────────────────────
const uploadRouter = router({
  getUploadUrl: adminProcedure
    .input(z.object({ filename: z.string(), contentType: z.string() }))
    .mutation(async ({ input }) => {
      const ext = input.filename.split(".").pop() || "bin";
      const key = `g2a-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      // Return a pre-upload key; actual upload happens via storagePut
      return { key, uploadReady: true };
    }),
  uploadFile: adminProcedure
    .input(z.object({ filename: z.string(), contentType: z.string(), base64Data: z.string() }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64Data, "base64");
      // Prefer Cloudinary (auto WebP/AVIF, CDN, transforms). Fall back to Forge storage.
      if (isCloudinaryConfigured() && input.contentType.startsWith("image/")) {
        const result = await cloudinaryUpload(buffer, input.contentType, input.filename);
        return { url: result.secureUrl, key: result.publicId, provider: "cloudinary" as const };
      }
      const ext = input.filename.split(".").pop() || "bin";
      const key = `g2a-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key, provider: "forge" as const };
    }),
});

// ─── Public Content Router ────────────────────────────────────────────────────
const contentRouter = router({
  heroSlides: publicProcedure.query(() => db.getHeroSlides()),
  services: publicProcedure.query(() => db.getServices()),
  serviceBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getServiceBySlug(input.slug)),
  testimonials: publicProcedure.query(() => db.getTestimonials()),
  partners: publicProcedure.query(() => db.getPartners()),
  industries: publicProcedure.query(() => db.getIndustries()),
  technologies: publicProcedure.query(() => db.getTechnologies()),
  values: publicProcedure.query(() => db.getValues()),
  categories: publicProcedure.query(() => db.getCategories()),
  siteSettings: publicProcedure.query(() => db.getAllSiteSettings()),
  pageSeo: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getPageSeo(input.slug)),
  caseStudies: publicProcedure.query(() => db.getActiveCaseStudies()),
  caseStudyBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getCaseStudyBySlug(input.slug)),
  posts: publicProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(10), categoryId: z.number().optional() }))
    .query(({ input }) => db.getPosts({ page: input.page, limit: input.limit, categoryId: input.categoryId, status: "published" })),
  postBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getPostBySlug(input.slug)),

  /**
   * Site-wide search across published blog posts + active case studies.
   * Substring match on title, excerpt/challenge, content/solution in HU/EN/ZH.
   * Returns combined results with type marker so the UI can render them differently.
   */
  search: publicProcedure
    .input(z.object({ q: z.string().min(2).max(80), limit: z.number().int().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      const q = input.q.trim().toLowerCase();
      if (q.length < 2) return { posts: [], caseStudies: [], total: 0 };

      const [posts, caseStudies] = await Promise.all([
        db.getPosts({ page: 1, limit: 100, status: "published" }),
        db.getActiveCaseStudies(),
      ]);

      const matches = (haystack: (string | null | undefined)[]) =>
        haystack.some((s) => typeof s === "string" && s.toLowerCase().includes(q));

      const matchedPosts = (posts.posts || []).filter((p) =>
        matches([p.title, p.titleEn, p.titleZh, p.excerpt, p.excerptEn, p.excerptZh, p.content, p.contentEn, p.contentZh]),
      ).slice(0, input.limit);

      const matchedCaseStudies = (caseStudies || []).filter((c) =>
        matches([c.title, c.titleEn, c.titleZh, c.client, c.clientEn, c.clientZh, c.industry, c.challenge, c.challengeEn, c.challengeZh, c.solution, c.solutionEn, c.solutionZh]),
      ).slice(0, input.limit);

      return {
        posts: matchedPosts.map((p) => ({
          type: "post" as const,
          id: p.id,
          slug: p.slug,
          title: p.title, titleEn: p.titleEn, titleZh: p.titleZh,
          excerpt: p.excerpt, excerptEn: p.excerptEn, excerptZh: p.excerptZh,
          publishedAt: p.publishedAt,
          featuredImage: p.featuredImage,
        })),
        caseStudies: matchedCaseStudies.map((c) => ({
          type: "caseStudy" as const,
          id: c.id,
          slug: c.slug,
          title: c.title, titleEn: c.titleEn, titleZh: c.titleZh,
          client: c.client, clientEn: c.clientEn, clientZh: c.clientZh,
          industry: c.industry,
          featuredImage: c.featuredImage,
        })),
        total: matchedPosts.length + matchedCaseStudies.length,
      };
    }),
});

// ─── Contact Router ───────────────────────────────────────────────────────────
const contactRouter = router({
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(2, "Kérjük adja meg a nevét"),
      email: z.string().email("Érvényes email cím szükséges"),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(10, "Az üzenet legalább 10 karakter legyen"),
      serviceInterest: z.string().optional(),
      // Honeypot — must remain empty for the submission to be persisted
      [HONEYPOT_FIELD]: z.string().optional(),
      // Optional form-origin marker. Lets shared endpoints (e.g. /karrier
      // posts to contact.submit) keep separate rate-limit buckets so a job
      // applicant doesn't burn through the contact form's quota.
      formContext: z.enum(["contact", "careers"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const bucket = input.formContext === "careers" ? "careers" : "contact";
      const guard = await guardPublicFormOrSilent(ctx, input, bucket, { success: true });
      if (guard) return guard;
      // Strip honeypot + form-origin marker before persistence — neither
      // belongs in the contact_submissions table.
      const { [HONEYPOT_FIELD]: _hp, formContext: _fc, ...submission } = input;
      void _hp; void _fc;
      await db.createContactSubmission(submission);
      // Notify admin (best-effort — never blocks form submission)
      await notifyOwner({
        title: `Új kapcsolatfelvétel: ${input.name}`,
        content: `**Feladó:** ${input.name}\n**Email:** ${input.email}\n**Telefon:** ${input.phone || "–"}\n**Tárgy:** ${input.subject || "–"}\n**Szolgáltatás:** ${input.serviceInterest || "–"}\n\n**Üzenet:**\n${input.message}`,
        replyTo: input.email,
      });

      // Confirmation to the sender. Careers applications get the career
      // template; everyone else gets the generic contact template.
      if (isEmailConfigured()) {
        try {
          const formType = input.formContext === "careers" ? "career" : "contact";
          const submissionFields =
            formType === "career"
              ? [
                  { label: "Email", value: input.email },
                  { label: "Telefon", value: input.phone || "" },
                  { label: "Pozíció", value: input.subject?.replace(/^Karrier jelentkezés:\s*/, "") || "" },
                  { label: "Üzenet", value: input.message },
                ]
              : [
                  { label: "Email", value: input.email },
                  { label: "Telefon", value: input.phone || "" },
                  { label: "Tárgy", value: input.subject || "" },
                  { label: "Szolgáltatás", value: input.serviceInterest || "" },
                  { label: "Üzenet", value: input.message },
                ];
          await sendEmail({
            to: input.email,
            subject: CONFIRMATION_SUBJECTS[formType],
            html: renderConfirmationEmailHtml({
              name: input.name,
              formType,
              submission: submissionFields,
            }),
            replyTo: "info@g2amarketing.hu",
          });
        } catch (err) {
          console.warn("[contact.submit] confirmation send failed:", err);
        }
      }

      return { success: true };
    }),
});

// ─── Audit Router ───────────────────────────────────────────────────────────
// NOTE: this form has a legitimate `website` field (the audit subject's URL),
// so the honeypot uses a different name here — `botField`. Real users never
// see/touch it; bots filling everything fail silently.
const AUDIT_HONEYPOT = "botField";

/** Add `https://` if the user typed a bare hostname like `ceg.hu` or
 *  `www.ceg.hu`. Most visitors don't type the protocol, so the previous
 *  `type="url"` HTML5 validation was rejecting otherwise-valid input. We now
 *  accept anything and normalize server-side. Returns empty string for empty
 *  input; falls back to the original string if it parses as a known
 *  non-http scheme (mailto:, tel:) so we don't silently rewrite it. */
function normalizeUrl(input: string | null | undefined): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  // Already has a scheme — leave alone
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  if (/^(mailto|tel):/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
const auditRouter = router({
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(2, "Kérjük adja meg a nevét"),
      email: z.string().email("Érvényes email cím szükséges"),
      phone: z.string().optional(),
      company: z.string().optional(),
      website: z.string().optional(),
      monthlyBudget: z.string().optional(),
      currentChallenges: z.string().optional(),
      goals: z.string().optional(),
      [AUDIT_HONEYPOT]: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Honeypot uses a custom field name here; build a normalized object for the guard.
      const guard = await guardPublicFormOrSilent(
        ctx,
        { website: (input as Record<string, unknown>)[AUDIT_HONEYPOT] as string | undefined },
        "audit",
        { success: true },
      );
      if (guard) return guard;
      // Normalize the website URL — visitors typically type bare hostnames
      // (`ceg.hu`, `www.ceg.hu`) without a protocol.
      const normalizedInput = { ...input, website: normalizeUrl(input.website) };
      await db.createAuditLead(normalizedInput);

      // Notify admin (RESEND_NOTIFY_EMAIL) — best-effort
      await notifyOwner({
        title: `Új ingyenes audit kérés: ${normalizedInput.name}`,
        content: `**Név:** ${normalizedInput.name}\n**Email:** ${normalizedInput.email}\n**Telefon:** ${normalizedInput.phone || "–"}\n**Cég:** ${normalizedInput.company || "–"}\n**Weboldal:** ${normalizedInput.website || "–"}\n**Havi büdzsé:** ${normalizedInput.monthlyBudget || "–"}\n\n**Kihívások:**\n${normalizedInput.currentChallenges || "–"}\n\n**Célok:**\n${normalizedInput.goals || "–"}`,
        replyTo: normalizedInput.email,
      });

      // Confirmation to the visitor — "got your request, here's what happens
      // next". Best-effort; failure shouldn't block the form success state.
      if (isEmailConfigured()) {
        try {
          await sendEmail({
            to: normalizedInput.email,
            subject: CONFIRMATION_SUBJECTS.audit,
            html: renderConfirmationEmailHtml({
              name: normalizedInput.name,
              formType: "audit",
              submission: [
                { label: "Email", value: normalizedInput.email },
                { label: "Telefon", value: normalizedInput.phone || "" },
                { label: "Cég", value: normalizedInput.company || "" },
                { label: "Weboldal", value: normalizedInput.website || "" },
                { label: "Havi büdzsé", value: normalizedInput.monthlyBudget || "" },
                { label: "Kihívások", value: normalizedInput.currentChallenges || "" },
                { label: "Célok", value: normalizedInput.goals || "" },
              ],
            }),
            replyTo: "info@g2amarketing.hu",
          });
        } catch (err) {
          console.warn("[audit.submit] confirmation send failed:", err);
        }
      }

      return { success: true };
    }),
});

// ─── Newsletter Router ────────────────────────────────────────────────────────
// Email template implementations live in `_core/emailTemplates.ts` so they
// can be reused by the digest-send cron + manual test scripts. We just
// re-export the welcome renderer with the legacy signature so any existing
// callers don't break.
import { renderWelcomeEmailHtml as _renderWelcomeEmail } from "./_core/emailTemplates";

/** Renders the welcome email body. Every campaign / transactional email MUST
 *  include the unsubscribe link (GDPR + CAN-SPAM + EU ePrivacy). */
function renderWelcomeEmailHtml(
  name: string | undefined,
  unsubscribeUrl: string,
  topics?: string[],
): string {
  return _renderWelcomeEmail({ name, unsubscribeUrl, topics });
}

const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email("Érvényes email cím szükséges"),
      // Name is now required (the signup forms enforce it client-side too).
      // Compact one-line forms — like the footer band — bypass with a placeholder
      // name "(footer)" since they only collect the email; admin can fix later.
      name: z.string().min(1, "Keresztnév megadása kötelező").max(256),
      source: z.string().optional(),
      // Topics the subscriber chose. Stored as comma-separated `tags` so the
      // existing admin segment/filter UI keeps working without a migration.
      // Allowed values are validated client-side; server accepts any string
      // (the admin can also add tags manually).
      topics: z.array(z.string().max(64)).max(10).optional(),
      [HONEYPOT_FIELD]: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const guard = await guardPublicFormOrSilent(ctx, input, "newsletter", { success: true, alreadySubscribed: false });
      if (guard) return guard;
      const exists = await db.checkNewsletterSubscriberExists(input.email);
      if (exists) return { success: true, alreadySubscribed: true };

      // Generate one-click unsubscribe token (32 hex chars = 128 bits, plenty of entropy)
      const unsubscribeToken = randomBytes(16).toString("hex");
      await db.createNewsletterSubscriber({
        email: input.email,
        name: input.name,
        source: input.source ?? "website",
        tags: input.topics && input.topics.length > 0 ? input.topics.join(",") : null,
        unsubscribeToken,
      });

      // Notify admin
      await notifyOwner({
        title: `Új hírlevél feliratkozó`,
        content: `**Email:** ${input.email}\n**Név:** ${input.name}\n**Témák:** ${input.topics?.join(", ") || "–"}\n**Forrás:** ${input.source || "website"}`,
        replyTo: input.email,
      });

      // Send welcome email to subscriber (best-effort, never blocks signup)
      if (isEmailConfigured()) {
        const origin = (ctx.req.headers.origin as string | undefined)
          || `${ctx.req.protocol}://${ctx.req.get("host")}`;
        const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
        await sendEmail({
          to: input.email,
          subject: "Üdv a G2A Marketing hírlevelében!",
          html: renderWelcomeEmailHtml(input.name, unsubscribeUrl, input.topics),
          text: `${input.name ? `Szia ${input.name}!` : "Szia!"}\n\nKöszönjük, hogy feliratkoztál a G2A Marketing hírlevelére. Heti max 1 emailt küldünk, sose kéretlenül.\n\nLeiratkozás: ${unsubscribeUrl}\n\nG2A Marketing Bt. · Pécs · info@g2amarketing.hu`,
        });
      }

      return { success: true, alreadySubscribed: false };
    }),

  /** Public — confirm unsubscribe by token. Used by the GET /api/newsletter/unsubscribe page. */
  unsubscribe: publicProcedure
    .input(z.object({ token: z.string().min(8) }))
    .mutation(async ({ input }) => {
      const email = await db.unsubscribeByToken(input.token);
      return { success: Boolean(email), email };
    }),
});

// ─── Admin Router ─────────────────────────────────────────────────────────────
const adminRouter = router({
  // Hero Slides
  heroSlides: router({
    list: adminProcedure.query(() => db.getAllHeroSlides()),
    create: adminProcedure.input(z.object({
      title: z.string(),
      titleEn: z.string().optional(),
      titleZh: z.string().optional(),
      subtitle: z.string().optional(),
      subtitleEn: z.string().optional(),
      subtitleZh: z.string().optional(),
      backgroundImage: z.string().optional(),
      backgroundImageAlt: z.string().optional(),
      ctaPrimaryText: z.string().optional(),
      ctaPrimaryTextEn: z.string().optional(),
      ctaPrimaryTextZh: z.string().optional(),
      ctaPrimaryUrl: z.string().optional(),
      ctaSecondaryText: z.string().optional(),
      ctaSecondaryTextEn: z.string().optional(),
      ctaSecondaryTextZh: z.string().optional(),
      ctaSecondaryUrl: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createHeroSlide(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(),
      titleEn: z.string().optional(),
      titleZh: z.string().optional(),
      subtitle: z.string().optional(),
      subtitleEn: z.string().optional(),
      subtitleZh: z.string().optional(),
      backgroundImage: z.string().optional(),
      backgroundImageAlt: z.string().optional(),
      ctaPrimaryText: z.string().optional(),
      ctaPrimaryTextEn: z.string().optional(),
      ctaPrimaryTextZh: z.string().optional(),
      ctaPrimaryUrl: z.string().optional(),
      ctaSecondaryText: z.string().optional(),
      ctaSecondaryTextEn: z.string().optional(),
      ctaSecondaryTextZh: z.string().optional(),
      ctaSecondaryUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateHeroSlide(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteHeroSlide(input.id)),
  }),

  // Services
  services: router({
    list: adminProcedure.query(() => db.getServices()),
    create: adminProcedure.input(z.object({
      slug: z.string(),
      number: z.string().optional(),
      title: z.string(),
      titleEn: z.string().optional(),
      titleZh: z.string().optional(),
      shortDescription: z.string().optional(),
      shortDescriptionEn: z.string().optional(),
      shortDescriptionZh: z.string().optional(),
      heroTitle: z.string().optional(),
      heroTitleEn: z.string().optional(),
      heroTitleZh: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroSubtitleEn: z.string().optional(),
      heroSubtitleZh: z.string().optional(),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
      content: z.string().optional(),
      contentEn: z.string().optional(),
      contentZh: z.string().optional(),
      icon: z.string().optional(),
      metaTitle: z.string().optional(),
      metaTitleEn: z.string().optional(),
      metaTitleZh: z.string().optional(),
      metaDescription: z.string().optional(),
      metaDescriptionEn: z.string().optional(),
      metaDescriptionZh: z.string().optional(),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createService(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      slug: z.string().optional(),
      number: z.string().optional(),
      title: z.string().optional(),
      titleEn: z.string().optional(),
      titleZh: z.string().optional(),
      shortDescription: z.string().optional(),
      shortDescriptionEn: z.string().optional(),
      shortDescriptionZh: z.string().optional(),
      heroTitle: z.string().optional(),
      heroTitleEn: z.string().optional(),
      heroTitleZh: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroSubtitleEn: z.string().optional(),
      heroSubtitleZh: z.string().optional(),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
      content: z.string().optional(),
      contentEn: z.string().optional(),
      contentZh: z.string().optional(),
      icon: z.string().optional(),
      metaTitle: z.string().optional(),
      metaTitleEn: z.string().optional(),
      metaTitleZh: z.string().optional(),
      metaDescription: z.string().optional(),
      metaDescriptionEn: z.string().optional(),
      metaDescriptionZh: z.string().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updateService(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteService(input.id)),
  }),

  // Categories
  categories: router({
    list: adminProcedure.query(() => db.getCategories()),
    create: adminProcedure.input(z.object({
      name: z.string(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
    })).mutation(({ input }) => db.createCategory(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
    }) })).mutation(({ input }) => db.updateCategory(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCategory(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteCategoriesBulk(input.ids)),
  }),

  // Posts
  posts: router({
    list: adminProcedure.query(() => db.getAllPostsAdmin()),
    create: adminProcedure.input(z.object({
      title: z.string(),
      titleEn: z.string().optional(),
      titleZh: z.string().optional(),
      slug: z.string(),
      excerpt: z.string().optional(),
      excerptEn: z.string().optional(),
      excerptZh: z.string().optional(),
      content: z.string(),
      contentEn: z.string().optional(),
      contentZh: z.string().optional(),
      featuredImage: z.string().optional(),
      featuredImageAlt: z.string().optional(),
      categoryId: z.number().optional(),
      authorName: z.string().optional(),
      status: z.enum(["draft", "published"]).default("draft"),
      metaTitle: z.string().optional(),
      metaTitleEn: z.string().optional(),
      metaTitleZh: z.string().optional(),
      metaDescription: z.string().optional(),
      metaDescriptionEn: z.string().optional(),
      metaDescriptionZh: z.string().optional(),
      ogImage: z.string().optional(),
      publishedAt: z.date().optional(),
    })).mutation(({ input }) => db.createPost(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(),
      titleEn: z.string().optional(),
      titleZh: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      excerptEn: z.string().optional(),
      excerptZh: z.string().optional(),
      content: z.string().optional(),
      contentEn: z.string().optional(),
      contentZh: z.string().optional(),
      featuredImage: z.string().optional(),
      featuredImageAlt: z.string().optional(),
      categoryId: z.number().optional(),
      authorName: z.string().optional(),
      status: z.enum(["draft", "published"]).optional(),
      metaTitle: z.string().optional(),
      metaTitleEn: z.string().optional(),
      metaTitleZh: z.string().optional(),
      metaDescription: z.string().optional(),
      metaDescriptionEn: z.string().optional(),
      metaDescriptionZh: z.string().optional(),
      ogImage: z.string().optional(),
      publishedAt: z.date().optional(),
    }) })).mutation(({ input }) => db.updatePost(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePost(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(200) })).mutation(({ input }) => db.deletePostsBulk(input.ids)),
  }),

  // Testimonials
  testimonials: router({
    list: adminProcedure.query(() => db.getAllTestimonials()),
    create: adminProcedure.input(z.object({
      quote: z.string(), quoteEn: z.string().optional(), quoteZh: z.string().optional(),
      authorName: z.string(),
      authorTitle: z.string().optional(), authorTitleEn: z.string().optional(), authorTitleZh: z.string().optional(),
      authorCompany: z.string().optional(),
      authorImage: z.string().optional(),
      authorImageAlt: z.string().optional(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createTestimonial(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      quote: z.string().optional(), quoteEn: z.string().optional(), quoteZh: z.string().optional(),
      authorName: z.string().optional(),
      authorTitle: z.string().optional(), authorTitleEn: z.string().optional(), authorTitleZh: z.string().optional(),
      authorCompany: z.string().optional(),
      authorImage: z.string().optional(),
      authorImageAlt: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updateTestimonial(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTestimonial(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteTestimonialsBulk(input.ids)),
  }),

  // Partners
  partners: router({
    list: adminProcedure.query(() => db.getAllPartners()),
    create: adminProcedure.input(z.object({
      name: z.string(),
      slug: z.string().optional(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      website: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      category: z.string().optional(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createPartner(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      slug: z.string().optional(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      website: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      category: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updatePartner(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePartner(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deletePartnersBulk(input.ids)),
  }),

  // Industries
  industries: router({
    list: adminProcedure.query(() => db.getAllIndustries()),
    create: adminProcedure.input(z.object({
      name: z.string(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createIndustry(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateIndustry(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteIndustry(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteIndustriesBulk(input.ids)),
  }),

  // Technologies
  technologies: router({
    list: adminProcedure.query(() => db.getAllTechnologies()),
    create: adminProcedure.input(z.object({
      name: z.string(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      category: z.enum(["marketing", "ai", "analytics", "other"]).default("marketing"),
      website: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createTechnology(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      category: z.enum(["marketing", "ai", "analytics", "other"]).optional(),
      website: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateTechnology(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTechnology(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteTechnologiesBulk(input.ids)),
  }),

  // Values
  values: router({
    list: adminProcedure.query(() => db.getAllValues()),
    create: adminProcedure.input(z.object({
      title: z.string(), titleEn: z.string().optional(), titleZh: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createValue(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(), titleEn: z.string().optional(), titleZh: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateValue(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteValue(input.id)),
  }),

  // Contact Submissions
  contacts: router({
    list: adminProcedure.query(() => db.getContactSubmissions()),
    markRead: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.markContactRead(input.id)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteContactSubmission(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(200) })).mutation(({ input }) => db.deleteContactSubmissionsBulk(input.ids)),
  }),

  // Newsletter
  newsletter: router({
    list: adminProcedure.query(() => db.getAllNewsletterSubscribers()),
    updateSegment: adminProcedure.input(z.object({
      id: z.number(),
      segment: z.string().optional(),
      source: z.string().optional(),
      tags: z.string().optional(),
    })).mutation(({ input }) => db.updateNewsletterSubscriberSegment(input)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteNewsletterSubscriber(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(500) })).mutation(({ input }) => db.deleteNewsletterSubscribersBulk(input.ids)),

    // ─── Campaigns ────────────────────────────────────────────────────────────
    /** Count recipients for a given segment (preview before send). */
    estimateRecipients: adminProcedure
      .input(z.object({ segment: z.string().nullable().optional() }))
      .query(async ({ input }) => {
        const subs = await db.getActiveSubscribersForCampaign(input.segment ?? null);
        return { count: subs.length };
      }),

    /** List past + draft campaigns. */
    campaignList: adminProcedure.query(() => db.listEmailCampaigns()),

    /**
     * Per-campaign event stats (delivered / opened / clicked / bounced /
     * complained — unique recipients). Powers the campaign-history table
     * in /admin/newsletter/campaigns. Returns zeros when the webhook
     * isn't yet configured (no events collected).
     */
    campaignStats: adminProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(({ input }) => db.getCampaignEventStats(input.campaignId)),

    /** Send a test email to a single address (admin's own email is the typical target). */
    sendTest: adminProcedure
      .input(z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        html: z.string().min(20),
      }))
      .mutation(async ({ input }) => {
        if (!isEmailConfigured()) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Resend nincs konfigurálva (.env: RESEND_API_KEY + RESEND_NOTIFY_EMAIL)" });
        }
        // Fake unsubscribe link with placeholder so the test looks real
        const html = input.html.replace(/\{\{unsubscribeUrl\}\}/g, "https://g2amarketing.hu/api/newsletter/unsubscribe?token=TEST_TOKEN");
        const ok = await sendEmail({
          to: input.to,
          subject: `[TEST] ${input.subject}`,
          html: `<div style="background:#fef3c7;padding:8px 12px;font-family:monospace;font-size:12px;color:#92400e;border-radius:4px;margin-bottom:16px">⚠ Ez egy TESZT email — nem ment ki a teljes listának.</div>${html}`,
        });
        return { success: ok };
      }),

    /**
     * Send a campaign to all active subscribers (optionally filtered by segment).
     * Each email gets a personalized one-click unsubscribe link substituted
     * into the `{{unsubscribeUrl}}` placeholder.
     *
     * Resend rate limit: 2 req/s on free tier. We send sequentially with a
     * small delay between batches to stay safely under the limit.
     */
    sendCampaign: adminProcedure
      .input(z.object({
        subject: z.string().min(1),
        html: z.string().min(20),
        text: z.string().optional(),
        segment: z.string().nullable().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!isEmailConfigured()) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Resend nincs konfigurálva." });
        }
        const subs = await db.getActiveSubscribersForCampaign(input.segment ?? null);
        if (subs.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Nincs címzett a kiválasztott szegmensben." });
        }

        // Persist a campaign row (start as "sending", flip at end)
        const campaignId = await db.createEmailCampaign({
          subject: input.subject,
          html: input.html,
          text: input.text,
          segment: input.segment ?? null,
          sentByUserId: ctx.user.id,
        });
        if (!campaignId) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB write failed" });
        }
        await db.updateEmailCampaign(campaignId, { status: "sending", recipientCount: subs.length });

        const origin = (ctx.req.headers.origin as string | undefined)
          || `${ctx.req.protocol}://${ctx.req.get("host")}`;

        let sent = 0, failed = 0;
        // Sequential send with a 600ms gap = ~1.6 req/sec (safely under Resend free tier's 2/sec)
        for (const sub of subs) {
          const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
          const personalizedHtml = input.html.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
          const personalizedText = input.text?.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
          try {
            // Attach the campaign_id tag so the Resend webhook can attribute
            // delivered/opened/clicked events back to this campaign for the
            // stats dashboard. Tag values are strings only (Resend constraint).
            const ok = await sendEmail({
              to: sub.email,
              subject: input.subject,
              html: personalizedHtml,
              text: personalizedText,
              tags: [{ name: "campaign_id", value: String(campaignId) }],
            });
            if (ok) sent++; else failed++;
          } catch (err) {
            console.error(`[campaign] send failed for ${sub.email}:`, err);
            failed++;
          }
          // Throttle
          await new Promise((r) => setTimeout(r, 600));
        }

        await db.updateEmailCampaign(campaignId, {
          status: failed === subs.length ? "failed" : "sent",
          sentCount: sent,
          failedCount: failed,
          sentAt: new Date(),
        });

        return { campaignId, recipientCount: subs.length, sent, failed };
      }),
  }),

  // Pages SEO
  pages: router({
    list: adminProcedure.query(() => db.getAllPages()),
    upsert: adminProcedure.input(z.object({
      slug: z.string(),
      title: z.string().optional(), titleEn: z.string().optional(), titleZh: z.string().optional(),
      metaTitle: z.string().optional(), metaTitleEn: z.string().optional(), metaTitleZh: z.string().optional(),
      metaDescription: z.string().optional(), metaDescriptionEn: z.string().optional(), metaDescriptionZh: z.string().optional(),
      ogTitle: z.string().optional(), ogTitleEn: z.string().optional(), ogTitleZh: z.string().optional(),
      ogDescription: z.string().optional(), ogDescriptionEn: z.string().optional(), ogDescriptionZh: z.string().optional(),
      ogImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
      schemaJson: z.string().optional(),
      keywords: z.string().optional(), keywordsEn: z.string().optional(), keywordsZh: z.string().optional(),
    })).mutation(({ input }) => db.upsertPageSeo(input)),
  }),

  // Case Studies
  caseStudies: router({
    list: adminProcedure.query(() => db.getAllCaseStudies()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(), titleEn: z.string().optional(), titleZh: z.string().optional(),
      slug: z.string(),
      client: z.string().optional(), clientEn: z.string().optional(), clientZh: z.string().optional(),
      industry: z.string().optional(), industryEn: z.string().optional(), industryZh: z.string().optional(),
      challenge: z.string().optional(), challengeEn: z.string().optional(), challengeZh: z.string().optional(),
      solution: z.string().optional(), solutionEn: z.string().optional(), solutionZh: z.string().optional(),
      results: z.string().optional(), resultsEn: z.string().optional(), resultsZh: z.string().optional(),
      featuredImage: z.string().optional(),
      featuredImageAlt: z.string().optional(),
      tags: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
      metaTitle: z.string().optional(), metaTitleEn: z.string().optional(), metaTitleZh: z.string().optional(),
      metaDescription: z.string().optional(), metaDescriptionEn: z.string().optional(), metaDescriptionZh: z.string().optional(),
    })).mutation(({ input }) => db.upsertCaseStudy(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCaseStudy(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteCaseStudiesBulk(input.ids)),
  }),
  // Translate (DeepL bridge)
  translate: router({
    status: adminProcedure.query(() => ({ configured: isTranslateConfigured() })),
    run: adminProcedure
      .input(z.object({ text: z.string().min(1), target: z.enum(["en", "zh"]) }))
      .mutation(async ({ input }) => {
        const text = await translate(input.text, input.target);
        return { text };
      }),
    // Translate multiple fields at once (used by "Fill all from HU" bulk button)
    runBatch: adminProcedure
      .input(z.object({
        items: z.array(z.object({ key: z.string(), text: z.string().min(1) })),
        target: z.enum(["en", "zh"]),
      }))
      .mutation(async ({ input }) => {
        const results: Record<string, string> = {};
        for (const item of input.items) {
          try {
            results[item.key] = await translate(item.text, input.target);
          } catch (err) {
            results[item.key] = "";
            // Log but keep going — partial success is better than total failure
            // eslint-disable-next-line no-console
            console.error(`[translate] Failed for key ${item.key}:`, err);
          }
        }
        return { results };
      }),
  }),

  // AI (OpenAI bridge) — admin-only blog draft + SEO meta + text improve
  ai: router({
    status: adminProcedure.query(() => ({
      configured: isAiConfigured(),
      model: isAiConfigured() ? getAiModel() : null,
    })),
    generateBlogDraft: adminProcedure
      .input(z.object({
        topic: z.string().min(3),
        audience: z.string().optional(),
        wordCount: z.number().int().min(200).max(2000).optional(),
        lang: z.enum(["hu", "en", "zh"]).optional(),
        tone: z.enum(["professional", "conversational", "technical"]).optional(),
      }))
      .mutation(({ input }) => generateBlogDraft(input)),
    generateSeoMeta: adminProcedure
      .input(z.object({
        topic: z.string().min(3),
        slug: z.string().optional(),
        context: z.string().optional(),
        lang: z.enum(["hu", "en", "zh"]).optional(),
      }))
      .mutation(({ input }) => generateSeoMeta(input)),
    improveText: adminProcedure
      .input(z.object({
        text: z.string().min(10),
        mode: z.enum(["tighten", "expand", "rephrase"]).optional(),
        lang: z.enum(["hu", "en", "zh"]).optional(),
        instruction: z.string().optional(),
      }))
      .mutation(async ({ input }) => ({ text: await improveText(input) })),

    /**
     * Generate an image via OpenAI DALL·E 3, then re-host on Cloudinary so the
     * URL is permanent (DALL·E URLs expire after ~1 hour). Returns the
     * Cloudinary CDN URL ready to drop into a hero/featured image field.
     *
     * Cost: ~$0.04 (square standard) to $0.12 (wide HD). The UI should warn.
     */
    generateImage: adminProcedure
      .input(z.object({
        prompt: z.string().min(8).max(1000),
        size: z.enum(["1024x1024", "1792x1024", "1024x1792"]).optional(),
        quality: z.enum(["standard", "hd"]).optional(),
        style: z.enum(["vivid", "natural"]).optional(),
        /** Cloudinary folder for the uploaded asset. Default "g2a/ai-generated". */
        folder: z.string().optional(),
        /** Filename hint — used as the public_id base. Slugified. */
        filenameHint: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // 1. Call OpenAI to generate the image
        const result = await generateImage({
          prompt: input.prompt,
          size: input.size,
          quality: input.quality,
          style: input.style,
        });

        // 2. Download the image bytes from OpenAI's temporary URL
        const dl = await fetch(result.url);
        if (!dl.ok) {
          throw new TRPCError({ code: "BAD_GATEWAY", message: `Failed to download generated image: ${dl.status}` });
        }
        const arrayBuf = await dl.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // 3. Re-host on Cloudinary if configured (else return the temp URL with a warning)
        if (!isCloudinaryConfigured()) {
          return {
            url: result.url,
            revisedPrompt: result.revisedPrompt,
            ephemeral: true as const,
            warning: "Cloudinary nincs konfigurálva — a kép URL ~1 óra múlva lejár.",
          };
        }

        const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "ai-image";
        const filename = `${slugify(input.filenameHint || "ai-image")}.png`;
        const upload = await cloudinaryUpload(
          buffer,
          "image/png",
          filename,
          input.folder || "g2a/ai-generated",
        );

        return {
          url: upload.secureUrl,
          publicId: upload.publicId,
          revisedPrompt: result.revisedPrompt,
          ephemeral: false as const,
        };
      }),
  }),

  // Audit Leads
  auditLeads: router({
    list: adminProcedure.query(() => db.getAllAuditLeads()),
    markContacted: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.markAuditLeadContacted(input.id)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteAuditLead(input.id)),
    deleteMany: adminProcedure.input(z.object({ ids: z.array(z.number()).min(1).max(200) })).mutation(({ input }) => db.deleteAuditLeadsBulk(input.ids)),
  }),
  // Site Settings
  settings: router({
    list: adminProcedure.query(() => db.getAllSiteSettings()),
    upsert: adminProcedure.input(z.object({ key: z.string(), value: z.string() })).mutation(({ input }) => db.upsertSiteSetting(input.key, input.value)),
  }),

  // Stats
  stats: adminProcedure.query(async () => {
    const [contactsData, subscribersData, postsData, partnersData, auditLeadsData] = await Promise.all([
      db.getContactSubmissions(),
      db.getAllNewsletterSubscribers(),
      db.getAllPostsAdmin(),
      db.getAllPartners(),
      db.getAllAuditLeads(),
    ]);
    return {
      totalContacts: contactsData.length,
      unreadContacts: contactsData.filter(c => !c.isRead).length,
      totalSubscribers: subscribersData.length,
      totalPosts: postsData.length,
      publishedPosts: postsData.filter(p => p.status === "published").length,
      totalPartners: partnersData.length,
      totalAuditLeads: auditLeadsData.length,
      openAuditLeads: auditLeadsData.filter((l: { isContacted: boolean }) => !l.isContacted).length,
    };
  }),

  /**
   * Daily time-series for the dashboard chart — last N days.
   * Buckets contact submissions, audit leads, and newsletter signups by day.
   * All counted client-side from the full lists; for tables under 50K rows this
   * is fast enough and avoids per-day SQL roundtrips.
   */
  statsTimeSeries: adminProcedure
    .input(z.object({ days: z.number().int().min(7).max(365).default(30) }))
    .query(async ({ input }) => {
      const [contactsData, subscribersData, auditLeadsData] = await Promise.all([
        db.getContactSubmissions(),
        db.getAllNewsletterSubscribers(),
        db.getAllAuditLeads(),
      ]);

      const now = new Date();
      const startMs = now.getTime() - input.days * 24 * 60 * 60 * 1000;
      const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      // Initialize all bucket dates so the chart shows continuous time even on quiet days
      const buckets: Record<string, { date: string; contacts: number; auditLeads: number; subscribers: number }> = {};
      for (let i = input.days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = dayKey(d);
        buckets[key] = { date: key, contacts: 0, auditLeads: 0, subscribers: 0 };
      }

      const tally = (createdAt: Date | string | null | undefined, field: "contacts" | "auditLeads" | "subscribers") => {
        if (!createdAt) return;
        const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
        if (isNaN(d.getTime()) || d.getTime() < startMs) return;
        const key = dayKey(d);
        if (buckets[key]) buckets[key][field]++;
      };

      contactsData.forEach((c: { createdAt: Date | string }) => tally(c.createdAt, "contacts"));
      auditLeadsData.forEach((l: { createdAt: Date | string }) => tally(l.createdAt, "auditLeads"));
      subscribersData.forEach((s: { createdAt: Date | string }) => tally(s.createdAt, "subscribers"));

      const series = Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
      const totals = series.reduce(
        (acc, b) => ({ contacts: acc.contacts + b.contacts, auditLeads: acc.auditLeads + b.auditLeads, subscribers: acc.subscribers + b.subscribers }),
        { contacts: 0, auditLeads: 0, subscribers: 0 },
      );
      return { series, totals, days: input.days };
    }),
});

// ─── Social Media Router ──────────────────────────────────────────────────
// Phase 1: copy generation + draft management. OAuth / publishing flows
// will be added in phase 2 once the LinkedIn/Meta apps are approved.
const SOCIAL_PLATFORM = z.enum(["linkedin", "facebook", "instagram"]);

const socialRouter = router({
  /** List all connected social accounts (admin sees status per platform). */
  listAccounts: adminProcedure.query(() => db.listSocialAccounts()),

  /** All drafts/published posts attached to a given blog post — latest per
   *  platform. The admin UI uses this to render the per-platform share rows. */
  listForPost: adminProcedure
    .input(z.object({ postId: z.number().int().positive() }))
    .query(({ input }) => db.getLatestSocialPostsForBlogPost(input.postId)),

  /** Generate AI copy for a (blog post, platform) combination. Doesn't
   *  persist on its own — the UI lets the admin tweak the result before
   *  saving via `saveDraft`. */
  generateCopy: adminProcedure
    .input(
      z.object({
        postId: z.number().int().positive(),
        platform: SOCIAL_PLATFORM,
      }),
    )
    .mutation(async ({ input }) => {
      if (!isAiConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "OPENAI_API_KEY nincs konfigurálva.",
        });
      }
      // Fetch the blog post first — need title/excerpt/content for the prompt
      const post = await db.getAllPostsAdmin().then((rows) =>
        rows.find((p) => p.id === input.postId),
      );
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog cikk nem található" });
      }
      const url = `https://g2amarketing.hu/hirek/${post.slug}`;
      const copy = await generateSocialCopy({
        platform: input.platform,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        url,
        lang: "hu",
      });
      return { copy };
    }),

  /** Persist a draft (or overwrite the latest one for this platform). */
  saveDraft: adminProcedure
    .input(
      z.object({
        postId: z.number().int().positive(),
        platform: SOCIAL_PLATFORM,
        copy: z.string().min(1).max(10_000),
      }),
    )
    .mutation(async ({ input }) => {
      const id = await db.createSocialPost({
        postId: input.postId,
        platform: input.platform,
        copy: input.copy,
        status: "draft",
      });
      return { id, success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: contentRouter,
  contact: contactRouter,
  audit: auditRouter,
  newsletter: newsletterRouter,
  admin: adminRouter,
  upload: uploadRouter,
  social: socialRouter,
});

export type AppRouter = typeof appRouter;
