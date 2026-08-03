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
import { generateBlogDraft, generateMultilangBlogDraft, generateImage, generateSeoMeta, improveText, isAiConfigured, getAiModel } from "./_core/ai";
import { getClientIp } from "./_core/rateLimit";
import { checkRateLimitDb } from "./_core/dbRateLimit";
import { isHoneypotTriggered, HONEYPOT_FIELD } from "./_core/spam";
import { verifyTurnstile, isTurnstileConfigured } from "./_core/turnstile";
import { sendEmail, sendEmailWithId, isEmailConfigured, renderNotificationHtml } from "./_core/email";
import { areaLabels, areValidAreaKeys } from "@shared/careerAreas";
import {
  renderConfirmationEmailHtml,
  confirmationSubject,
  toLang,
  FIELD_LABELS,
  renderLeadMagnetWelcomeHtml,
  renderChecklistResultHtml,
  type Lang,
} from "./_core/emailTemplates";
import { getAutomation } from "./_core/automations";
import { generateSocialCopy } from "./_core/socialCopy";
import {
  loadBrandVoice,
  saveBrandVoice,
  EMPTY_BRAND_VOICE,
  type BrandVoice,
} from "./_core/brandVoice";
import { randomBytes } from "node:crypto";
import { hasPermission, parsePermissions, PERMISSION_KEYS, type Permission } from "@shared/permissions";
import { generateResetToken } from "./_core/password";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  // Suspended staff keep their row (and history) but lose access immediately.
  if (ctx.user.isActive === false) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Ez a hozzáférés fel van függesztve." });
  }
  return next({ ctx });
});

/**
 * Admin procedure additionally gated on one granular permission.
 *
 * Invited staff carry a permission list (`users.permissions`); the owner
 * bypasses it. Use this on routers that map to a section of the admin sidebar
 * so a limited account can't reach an area by calling the endpoint directly.
 */
function permissionProcedure(permission: Permission) {
  return adminProcedure.use(({ ctx, next }) => {
    if (!hasPermission(ctx.user, permission)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Ehhez a részhez nincs jogosultságod. Kérj hozzáférést az adminisztrátortól.",
      });
    }
    return next({ ctx });
  });
}

/**
 * Owner-only. User management (invite / edit permissions / remove) can grant
 * any permission, so whoever holds it effectively holds all of them — it must
 * NOT be a delegatable permission. Only the ADMIN_EMAIL owner (isOwner) passes.
 */
const ownerProcedure = adminProcedure.use(({ ctx, next }) => {
  if (!ctx.user.isOwner) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Ez a művelet csak a tulajdonosé." });
  }
  return next({ ctx });
});

/** Absolute origin for building invite / reset links in emails. */
function originFromRequest(req: { headers: Record<string, unknown>; protocol?: string; get?: (h: string) => string | undefined }): string {
  const origin = req.headers?.origin as string | undefined;
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get?.("host") ?? "g2amarketing.hu";
  return `${req.protocol ?? "https"}://${host}`;
}

/**
 * Which language to send a transactional email in. Prefers the explicit `lang`
 * the client form sends; falls back to the /en/ or /zh/ prefix on the page the
 * form was submitted from (Referer). Defaults to hu.
 */
function resolveFormLang(req: { headers: Record<string, unknown> }, explicit?: string | null): Lang {
  if (explicit === "hu" || explicit === "en" || explicit === "zh") return explicit;
  const referer = req.headers?.referer as string | undefined;
  if (referer) {
    try {
      const path = new URL(referer).pathname;
      if (/^\/en(\/|$)/.test(path)) return "en";
      if (/^\/zh(\/|$)/.test(path)) return "zh";
    } catch {
      /* malformed referer — fall through to default */
    }
  }
  return toLang(undefined);
}

function renderInviteEmail(name: string, link: string): string {
  const greeting = name ? `Szia ${name}!` : "Szia!";
  return `<div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1f2937">
  <h1 style="font-size:20px;color:#0f172a;border-left:4px solid #14B8A6;padding-left:14px;margin:0 0 20px">Meghívó a G2A admin felületre</h1>
  <p style="line-height:1.6;font-size:15px">${greeting}</p>
  <p style="line-height:1.6;font-size:15px">Hozzáférést kaptál a G2A Marketing admin felületéhez. Az alábbi gombbal tudod beállítani a jelszavad — a link <strong>1 óráig</strong> érvényes.</p>
  <p style="margin:26px 0"><a href="${link}" style="display:inline-block;background:#14B8A6;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600">Jelszó beállítása</a></p>
  <p style="line-height:1.6;font-size:13px;color:#6b7280">Ha a gomb nem működik, másold be ezt a linket a böngésződbe:<br><span style="word-break:break-all;color:#0d9488">${link}</span></p>
  <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:12px;color:#9ca3af;line-height:1.5">G2A Marketing · g2amarketing.hu</p>
</div>`;
}

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
  input: { website?: string | null | undefined; turnstileToken?: string | null | undefined },
  formKey: string,
  silentSuccess: T,
): Promise<T | null> {
  if (isHoneypotTriggered(input)) {
    // eslint-disable-next-line no-console
    console.warn(`[spam] Honeypot triggered for ${formKey} from ${getClientIp(ctx.req)}`);
    return silentSuccess;
  }
  const ip = getClientIp(ctx.req);

  // Cloudflare Turnstile — only enforced when TURNSTILE_SECRET_KEY is
  // set. Without the env var, verifyTurnstile() soft-passes so the
  // form stays working in local dev / pre-rollout. On bad tokens we
  // throw FORBIDDEN so the client can ask the user to re-do the check;
  // missing tokens (when configured) throw the same so we don't
  // silently silently accept submissions that bypassed the widget.
  if (isTurnstileConfigured()) {
    const verdict = await verifyTurnstile(input.turnstileToken, ip);
    if (!verdict.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[turnstile] Verification failed for ${formKey}: ${verdict.reason}`);
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Bot-ellenőrzés sikertelen. Frissítsd az oldalt és próbáld újra.",
      });
    }
  }

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
      name: z.string().min(2, "Kérjük adja meg a nevét").max(120),
      email: z.string().email("Érvényes email cím szükséges").max(320),
      phone: z.string().max(40).optional(),
      subject: z.string().max(200).optional(),
      message: z.string().min(10, "Az üzenet legalább 10 karakter legyen").max(5000),
      serviceInterest: z.string().max(200).optional(),
      // Honeypot — must remain empty for the submission to be persisted
      [HONEYPOT_FIELD]: z.string().optional(),
      // Cloudflare Turnstile widget token — verified server-side
      // against the secret key. Optional in the schema so legacy
      // clients still work; the guard enforces presence when the
      // feature flag is on.
      turnstileToken: z.string().optional(),
      // Optional form-origin marker. Lets shared endpoints (e.g. /karrier
      // posts to contact.submit) keep separate rate-limit buckets so a job
      // applicant doesn't burn through the contact form's quota.
      formContext: z.enum(["contact", "careers"]).optional(),
      // Visitor's language, so the confirmation email matches the site they
      // submitted from. Falls back to the Referer path, then hu.
      lang: z.enum(["hu", "en", "zh"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const bucket = input.formContext === "careers" ? "careers" : "contact";
      const guard = await guardPublicFormOrSilent(ctx, input, bucket, { success: true });
      if (guard) return guard;
      // Strip honeypot + form-origin marker + language before persistence —
      // none of them belong in the contact_submissions table.
      const { [HONEYPOT_FIELD]: _hp, formContext: _fc, turnstileToken: _tt, lang: _lang, ...submission } = input;
      void _hp; void _fc; void _tt; void _lang;
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
          const lang = resolveFormLang(ctx.req, input.lang);
          const L = FIELD_LABELS[lang];
          const submissionFields =
            formType === "career"
              ? [
                  { label: L.email, value: input.email },
                  { label: L.phone, value: input.phone || "" },
                  { label: L.position, value: input.subject?.replace(/^Karrier jelentkezés:\s*/, "") || "" },
                  { label: L.message, value: input.message },
                ]
              : [
                  { label: L.email, value: input.email },
                  { label: L.phone, value: input.phone || "" },
                  { label: L.subject, value: input.subject || "" },
                  { label: L.service, value: input.serviceInterest || "" },
                  { label: L.message, value: input.message },
                ];
          await sendEmail({
            to: input.email,
            subject: confirmationSubject(formType, lang),
            html: renderConfirmationEmailHtml({
              name: input.name,
              formType,
              submission: submissionFields,
              lang,
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
      name: z.string().min(2, "Kérjük adja meg a nevét").max(120),
      email: z.string().email("Érvényes email cím szükséges").max(320),
      phone: z.string().max(40).optional(),
      company: z.string().max(200).optional(),
      website: z.string().max(500).optional(),
      monthlyBudget: z.string().max(100).optional(),
      currentChallenges: z.string().max(3000).optional(),
      goals: z.string().max(3000).optional(),
      [AUDIT_HONEYPOT]: z.string().optional(),
      turnstileToken: z.string().optional(),
      // Visitor's language for the confirmation email. Not persisted.
      lang: z.enum(["hu", "en", "zh"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Honeypot uses a custom field name here; build a normalized object for the guard.
      const guard = await guardPublicFormOrSilent(
        ctx,
        {
          website: (input as Record<string, unknown>)[AUDIT_HONEYPOT] as string | undefined,
          turnstileToken: input.turnstileToken,
        },
        "audit",
        { success: true },
      );
      if (guard) return guard;
      // Strip the Turnstile token + language before persistence — both are
      // verified/used server-side and have no place in the audit_leads table.
      const { turnstileToken: _tt, lang: _lang, ...inputForDb } = input;
      void _tt; void _lang;
      // Normalize the website URL — visitors typically type bare hostnames
      // (`ceg.hu`, `www.ceg.hu`) without a protocol.
      const normalizedInput = { ...inputForDb, website: normalizeUrl(inputForDb.website) };
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
          const lang = resolveFormLang(ctx.req, input.lang);
          const L = FIELD_LABELS[lang];
          await sendEmail({
            to: normalizedInput.email,
            subject: confirmationSubject("audit", lang),
            html: renderConfirmationEmailHtml({
              name: normalizedInput.name,
              formType: "audit",
              lang,
              submission: [
                { label: L.email, value: normalizedInput.email },
                { label: L.phone, value: normalizedInput.phone || "" },
                { label: L.company, value: normalizedInput.company || "" },
                { label: L.website, value: normalizedInput.website || "" },
                { label: L.budget, value: normalizedInput.monthlyBudget || "" },
                { label: L.challenges, value: normalizedInput.currentChallenges || "" },
                { label: L.goals, value: normalizedInput.goals || "" },
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
  lang: Lang = "hu",
): string {
  return _renderWelcomeEmail({ name, unsubscribeUrl, topics, lang });
}

/** Localised welcome subject + plain-text fallback for the newsletter. */
const WELCOME_MISC: Record<Lang, { subject: string; text: (name: string, url: string) => string }> = {
  hu: {
    subject: "Üdv a G2A Marketing hírlevelében!",
    text: (name, url) =>
      `${name ? `Szia ${name}!` : "Szia!"}\n\nAttila vagyok a G2A Marketingtől — örülök, hogy itt vagy. Péntek reggelente írok egyszer, sose kéretlenül.\n\nLeiratkozás: ${url}\n\nG2A Marketing Bt. · Pécs · info@g2amarketing.hu`,
  },
  en: {
    subject: "Welcome to the G2A Marketing newsletter",
    text: (name, url) =>
      `${name ? `Hi ${name}!` : "Hi there!"}\n\nI'm Attila from G2A Marketing — glad you're here. I write once, on Friday mornings, never unsolicited.\n\nUnsubscribe: ${url}\n\nG2A Marketing Bt. · Pécs, Hungary · info@g2amarketing.hu`,
  },
  zh: {
    subject: "欢迎订阅 G2A Marketing 通讯",
    text: (name, url) =>
      `${name ? `${name}，您好！` : "您好！"}\n\n我是 G2A Marketing 的 Attila——很高兴您来到这里。我每周只在周五早上写一封，绝不打扰。\n\n退订：${url}\n\nG2A Marketing Bt. · 匈牙利佩奇 · info@g2amarketing.hu`,
  },
};

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
      // Cloudflare Turnstile widget token — verified server-side
      // against the secret key. Optional in the schema so legacy
      // clients still work; the guard enforces presence when the
      // feature flag is on.
      turnstileToken: z.string().optional(),
      // Visitor's language, so the welcome email matches the site they
      // signed up from. Falls back to the Referer path, then hu.
      lang: z.enum(["hu", "en", "zh"]).optional(),
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
        const lang = resolveFormLang(ctx.req, input.lang);
        await sendEmail({
          to: input.email,
          subject: WELCOME_MISC[lang].subject,
          html: renderWelcomeEmailHtml(input.name, unsubscribeUrl, input.topics, lang),
          text: WELCOME_MISC[lang].text(input.name ?? "", unsubscribeUrl),
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
    list: permissionProcedure("hero_slides").query(() => db.getAllHeroSlides()),
    create: permissionProcedure("hero_slides").input(z.object({
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
    update: permissionProcedure("hero_slides").input(z.object({ id: z.number(), data: z.object({
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
    delete: permissionProcedure("hero_slides").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteHeroSlide(input.id)),
  }),

  // Services
  services: router({
    list: permissionProcedure("services").query(() => db.getServices()),
    create: permissionProcedure("services").input(z.object({
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
      subtitle: z.string().optional(),
      subtitleEn: z.string().optional(),
      subtitleZh: z.string().optional(),
      intro: z.string().optional(),
      introEn: z.string().optional(),
      introZh: z.string().optional(),
      cta: z.string().optional(),
      ctaEn: z.string().optional(),
      ctaZh: z.string().optional(),
      color: z.string().optional(),
      benefits: z.string().optional(),
      process: z.string().optional(),
      faq: z.string().optional(),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createService(input)),
    update: permissionProcedure("services").input(z.object({ id: z.number(), data: z.object({
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
      subtitle: z.string().optional(),
      subtitleEn: z.string().optional(),
      subtitleZh: z.string().optional(),
      intro: z.string().optional(),
      introEn: z.string().optional(),
      introZh: z.string().optional(),
      cta: z.string().optional(),
      ctaEn: z.string().optional(),
      ctaZh: z.string().optional(),
      color: z.string().optional(),
      benefits: z.string().optional(),
      process: z.string().optional(),
      faq: z.string().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updateService(input.id, input.data)),
    delete: permissionProcedure("services").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteService(input.id)),
  }),

  // Categories
  categories: router({
    list: permissionProcedure("categories").query(() => db.getCategories()),
    create: permissionProcedure("categories").input(z.object({
      name: z.string(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
    })).mutation(({ input }) => db.createCategory(input)),
    update: permissionProcedure("categories").input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
    }) })).mutation(({ input }) => db.updateCategory(input.id, input.data)),
    delete: permissionProcedure("categories").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCategory(input.id)),
    deleteMany: permissionProcedure("categories").input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteCategoriesBulk(input.ids)),
  }),

  // Posts
  posts: router({
    list: permissionProcedure("posts").query(() => db.getAllPostsAdmin()),
    create: permissionProcedure("posts").input(z.object({
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
    update: permissionProcedure("posts").input(z.object({ id: z.number(), data: z.object({
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
    delete: permissionProcedure("posts").input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePost(input.id)),
    deleteMany: permissionProcedure("posts").input(z.object({ ids: z.array(z.number()).min(1).max(200) })).mutation(({ input }) => db.deletePostsBulk(input.ids)),
  }),

  // Testimonials
  testimonials: router({
    list: permissionProcedure("testimonials").query(() => db.getAllTestimonials()),
    create: permissionProcedure("testimonials").input(z.object({
      quote: z.string(), quoteEn: z.string().optional(), quoteZh: z.string().optional(),
      authorName: z.string(),
      authorTitle: z.string().optional(), authorTitleEn: z.string().optional(), authorTitleZh: z.string().optional(),
      authorCompany: z.string().optional(),
      authorImage: z.string().optional(),
      authorImageAlt: z.string().optional(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createTestimonial(input)),
    update: permissionProcedure("testimonials").input(z.object({ id: z.number(), data: z.object({
      quote: z.string().optional(), quoteEn: z.string().optional(), quoteZh: z.string().optional(),
      authorName: z.string().optional(),
      authorTitle: z.string().optional(), authorTitleEn: z.string().optional(), authorTitleZh: z.string().optional(),
      authorCompany: z.string().optional(),
      authorImage: z.string().optional(),
      authorImageAlt: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updateTestimonial(input.id, input.data)),
    delete: permissionProcedure("testimonials").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTestimonial(input.id)),
    deleteMany: permissionProcedure("testimonials").input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteTestimonialsBulk(input.ids)),
  }),

  // Partners
  partners: router({
    list: permissionProcedure("partners").query(() => db.getAllPartners()),
    create: permissionProcedure("partners").input(z.object({
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
    update: permissionProcedure("partners").input(z.object({ id: z.number(), data: z.object({
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
    delete: permissionProcedure("partners").input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePartner(input.id)),
    deleteMany: permissionProcedure("partners").input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deletePartnersBulk(input.ids)),
  }),

  // Industries
  industries: router({
    list: permissionProcedure("industries").query(() => db.getAllIndustries()),
    create: permissionProcedure("industries").input(z.object({
      name: z.string(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createIndustry(input)),
    update: permissionProcedure("industries").input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(), nameEn: z.string().optional(), nameZh: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateIndustry(input.id, input.data)),
    delete: permissionProcedure("industries").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteIndustry(input.id)),
    deleteMany: permissionProcedure("industries").input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteIndustriesBulk(input.ids)),
  }),

  // Technologies
  technologies: router({
    list: permissionProcedure("technologies").query(() => db.getAllTechnologies()),
    create: permissionProcedure("technologies").input(z.object({
      name: z.string(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      category: z.enum(["marketing", "ai", "analytics", "other"]).default("marketing"),
      website: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createTechnology(input)),
    update: permissionProcedure("technologies").input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      category: z.enum(["marketing", "ai", "analytics", "other"]).optional(),
      website: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateTechnology(input.id, input.data)),
    delete: permissionProcedure("technologies").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTechnology(input.id)),
    deleteMany: permissionProcedure("technologies").input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteTechnologiesBulk(input.ids)),
  }),

  // Values
  values: router({
    list: permissionProcedure("values").query(() => db.getAllValues()),
    create: permissionProcedure("values").input(z.object({
      title: z.string(), titleEn: z.string().optional(), titleZh: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createValue(input)),
    update: permissionProcedure("values").input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(), titleEn: z.string().optional(), titleZh: z.string().optional(),
      description: z.string().optional(), descriptionEn: z.string().optional(), descriptionZh: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateValue(input.id, input.data)),
    delete: permissionProcedure("values").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteValue(input.id)),
  }),

  // Contact Submissions
  contacts: router({
    list: permissionProcedure("contacts").query(() => db.getContactSubmissions()),
    markRead: permissionProcedure("contacts").input(z.object({ id: z.number() })).mutation(({ input }) => db.markContactRead(input.id)),
    delete: permissionProcedure("contacts").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteContactSubmission(input.id)),
    deleteMany: permissionProcedure("contacts").input(z.object({ ids: z.array(z.number()).min(1).max(200) })).mutation(({ input }) => db.deleteContactSubmissionsBulk(input.ids)),
  }),

  // Newsletter
  newsletter: router({
    list: permissionProcedure("newsletter").query(() => db.getAllNewsletterSubscribers()),
    /** Attribution: which funnel source turned subscribers into leads (they
     *  later submitted a contact or audit form — matched by email). */
    attribution: permissionProcedure("newsletter").query(async () => {
      const [subs, contacts, audits] = await Promise.all([
        db.getAllNewsletterSubscribers(),
        db.getContactSubmissions(),
        db.getAllAuditLeads(),
      ]);
      const leadEmails = new Set<string>();
      for (const c of contacts as Array<{ email?: string | null }>) if (c.email) leadEmails.add(c.email.toLowerCase());
      for (const a of audits as Array<{ email?: string | null }>) if (a.email) leadEmails.add(a.email.toLowerCase());
      const bySource: Record<string, { source: string; subscribers: number; converted: number }> = {};
      let totalSubs = 0, totalConverted = 0;
      for (const s of subs as Array<{ source?: string | null; email?: string | null }>) {
        const src = s.source || "(nincs)";
        (bySource[src] ??= { source: src, subscribers: 0, converted: 0 }).subscribers++;
        totalSubs++;
        if (s.email && leadEmails.has(s.email.toLowerCase())) { bySource[src].converted++; totalConverted++; }
      }
      const rate = (c: number, n: number) => (n ? Math.round((c / n) * 1000) / 10 : 0);
      const rows = Object.values(bySource)
        .map((r) => ({ ...r, rate: rate(r.converted, r.subscribers) }))
        .sort((a, b) => b.subscribers - a.subscribers);
      return { rows, totalSubs, totalConverted, totalRate: rate(totalConverted, totalSubs) };
    }),
    updateSegment: permissionProcedure("newsletter").input(z.object({
      id: z.number(),
      segment: z.string().optional(),
      source: z.string().optional(),
      tags: z.string().optional(),
    })).mutation(({ input }) => db.updateNewsletterSubscriberSegment(input)),
    delete: permissionProcedure("newsletter").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteNewsletterSubscriber(input.id)),
    deleteMany: permissionProcedure("newsletter").input(z.object({ ids: z.array(z.number()).min(1).max(500) })).mutation(({ input }) => db.deleteNewsletterSubscribersBulk(input.ids)),

    // ─── Campaigns ────────────────────────────────────────────────────────────
    /** Count recipients for a given segment (preview before send). */
    estimateRecipients: permissionProcedure("newsletter")
      .input(z.object({ segment: z.string().nullable().optional() }))
      .query(async ({ input }) => {
        const subs = await db.getActiveSubscribersForCampaign(input.segment ?? null);
        return { count: subs.length };
      }),

    /** List past + draft campaigns. */
    campaignList: permissionProcedure("newsletter").query(() => db.listEmailCampaigns()),

    /**
     * Per-campaign event stats (delivered / opened / clicked / bounced /
     * complained — unique recipients). Powers the campaign-history table
     * in /admin/newsletter/campaigns. Returns zeros when the webhook
     * isn't yet configured (no events collected).
     */
    campaignStats: permissionProcedure("newsletter")
      .input(z.object({ campaignId: z.number() }))
      .query(({ input }) => db.getCampaignEventStats(input.campaignId)),

    /** Send a test email to a single address (admin's own email is the typical target). */
    sendTest: permissionProcedure("newsletter")
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
        const result = await sendEmailWithId({
          to: input.to,
          subject: `[TEST] ${input.subject}`,
          html: `<div style="background:#fef3c7;padding:8px 12px;font-family:monospace;font-size:12px;color:#92400e;border-radius:4px;margin-bottom:16px">⚠ Ez egy TESZT email — nem ment ki a teljes listának.</div>${html}`,
        });
        if (!result.ok) {
          // Surface the real Resend reason (e.g. sandbox: "you can only send
          // to your own address until a domain is verified") so the admin sees
          // WHY it failed instead of a silent success.
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error || "A küldés sikertelen — ellenőrizd a Resend beállításokat." });
        }
        return { success: true };
      }),

    /**
     * Send a campaign to all active subscribers (optionally filtered by segment).
     * Each email gets a personalized one-click unsubscribe link substituted
     * into the `{{unsubscribeUrl}}` placeholder.
     *
     * Resend rate limit: 2 req/s on free tier. We send sequentially with a
     * small delay between batches to stay safely under the limit.
     */
    sendCampaign: permissionProcedure("newsletter")
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

        let sent = 0, failed = 0, lastError: string | undefined;
        // Sequential send with a 600ms gap = ~1.6 req/sec (safely under Resend free tier's 2/sec)
        for (const sub of subs) {
          const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
          const personalizedHtml = input.html.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
          const personalizedText = input.text?.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
          try {
            // Attach the campaign_id tag so the Resend webhook can attribute
            // delivered/opened/clicked events back to this campaign for the
            // stats dashboard. Tag values are strings only (Resend constraint).
            const r = await sendEmailWithId({
              to: sub.email,
              subject: input.subject,
              html: personalizedHtml,
              text: personalizedText,
              tags: [{ name: "campaign_id", value: String(campaignId) }],
            });
            if (r.ok) sent++; else { failed++; lastError = r.error; }
          } catch (err) {
            console.error(`[campaign] send failed for ${sub.email}:`, err);
            failed++;
            lastError = String(err instanceof Error ? err.message : err);
          }
          // Early bail-out: if nothing has gone out after the first few tries
          // it's almost certainly a config problem (unverified domain / bad
          // key). No point hammering the whole list at 600ms each.
          if (sent === 0 && failed >= 3) break;
          // Throttle
          await new Promise((r) => setTimeout(r, 600));
        }

        await db.updateEmailCampaign(campaignId, {
          status: sent === 0 ? "failed" : "sent",
          sentCount: sent,
          failedCount: failed,
          sentAt: new Date(),
        });

        if (sent === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: lastError ? `Egyetlen email sem ment ki. ${lastError}` : "Egyetlen email sem ment ki — ellenőrizd a Resend beállításokat (hitelesített domain).",
          });
        }

        return { campaignId, recipientCount: subs.length, sent, failed };
      }),
  }),

  // Pages SEO
  pages: router({
    list: permissionProcedure("seo").query(() => db.getAllPages()),
    upsert: permissionProcedure("seo").input(z.object({
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
    list: permissionProcedure("case_studies").query(() => db.getAllCaseStudies()),
    upsert: permissionProcedure("case_studies").input(z.object({
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
    delete: permissionProcedure("case_studies").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCaseStudy(input.id)),
    deleteMany: permissionProcedure("case_studies").input(z.object({ ids: z.array(z.number()).min(1).max(100) })).mutation(({ input }) => db.deleteCaseStudiesBulk(input.ids)),
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
        wordCount: z.number().int().min(200).max(3000).optional(),
        lang: z.enum(["hu", "en", "zh"]).optional(),
        tone: z.enum(["professional", "conversational", "technical"]).optional(),
      }))
      .mutation(({ input }) => generateBlogDraft(input)),
    /**
     * Run the draft generator in parallel for HU + EN + ZH. The admin UI
     * gets one return value to fill all three language tabs in one go.
     */
    generateMultilangBlogDraft: adminProcedure
      .input(z.object({
        topic: z.string().min(3),
        audience: z.string().optional(),
        wordCount: z.number().int().min(200).max(3000).optional(),
        tone: z.enum(["professional", "conversational", "technical"]).optional(),
        // Optional client-generated UUID for progress tracking. The
        // mutation creates the ai_jobs row, the worker increments
        // completedSteps after each OpenAI call, and a parallel
        // polling query (getAiJobStatus below) lets the UI render
        // real progress instead of a static spinner.
        jobId: z.string().uuid().optional(),
      }))
      .mutation(async ({ input }) => {
        const { jobId, ...gen } = input;
        if (jobId) {
          await db.createAiJob({ id: jobId, type: "multilang_blog_draft", totalSteps: 3 });
        }
        try {
          const result = await generateMultilangBlogDraft(gen, jobId);
          return result;
        } catch (err) {
          if (jobId) {
            await db.updateAiJob(jobId, {
              status: "failed",
              errorMessage: err instanceof Error ? err.message : String(err),
            }).catch(() => {});
          }
          throw err;
        }
      }),
    /**
     * Best-effort progress reader for the multilang blog draft job.
     * Called once per second from the admin UI while the mutation is
     * in flight. Returns null if the job hasn't been created yet (the
     * UUID just bounced across a slow network) so the UI shows a soft
     * "Inicializálás..." instead of crashing.
     */
    getAiJobStatus: adminProcedure
      .input(z.object({ jobId: z.string().uuid() }))
      .query(({ input }) => db.getAiJob(input.jobId)),
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
        // `style` ("vivid" / "natural") is accepted but ignored — the
        // legacy DALL·E 3 parameter is gone. We keep the field in the
        // schema so older clients don't get a validation error.
        style: z.enum(["vivid", "natural"]).optional(),
        /** Cloudinary folder for the uploaded asset. Default "g2a/ai-generated". */
        folder: z.string().optional(),
        /** Filename hint — used as the public_id base. Slugified. */
        filenameHint: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // 1. Call OpenAI (gpt-image-1) — bytes come back inline as base64,
        //    no temporary URL to fetch.
        const result = await generateImage({
          prompt: input.prompt,
          size: input.size,
          quality: input.quality,
        });
        const buffer = result.imageBuffer;

        // 2. Re-host on Cloudinary if configured. If not, fall back to a
        //    data: URL so the admin can at least see / save the image —
        //    it's a few hundred KB inline, which is fine for the editor.
        if (!isCloudinaryConfigured()) {
          const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
          return {
            url: dataUrl,
            revisedPrompt: result.revisedPrompt,
            ephemeral: true as const,
            warning: "Cloudinary nincs konfigurálva — a kép inline (data URL) formában érkezik. Cloudinary beállításával CDN-re kerül.",
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
    list: permissionProcedure("audit_leads").query(() => db.getAllAuditLeads()),
    markContacted: permissionProcedure("audit_leads").input(z.object({ id: z.number() })).mutation(({ input }) => db.markAuditLeadContacted(input.id)),
    delete: permissionProcedure("audit_leads").input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteAuditLead(input.id)),
    deleteMany: permissionProcedure("audit_leads").input(z.object({ ids: z.array(z.number()).min(1).max(200) })).mutation(({ input }) => db.deleteAuditLeadsBulk(input.ids)),
  }),
  // Site Settings
  settings: router({
    list: permissionProcedure("settings").query(() => db.getAllSiteSettings()),
    upsert: permissionProcedure("settings").input(z.object({ key: z.string(), value: z.string() })).mutation(({ input }) => db.upsertSiteSetting(input.key, input.value)),
  }),

  // Brand voice — used by every AI generator (social copy, blog drafts,
  // SEO meta) to write in the G2A house style instead of generic agency tone.
  brandVoice: router({
    get: permissionProcedure("brand_voice").query(async () => {
      const voice = await loadBrandVoice();
      return voice ?? EMPTY_BRAND_VOICE;
    }),
    update: permissionProcedure("brand_voice")
      .input(
        z.object({
          companyDescription: z.string().max(4000),
          audience: z.string().max(2000),
          toneOfVoice: z.string().max(2000),
          dos: z.array(z.string().max(300)).max(30),
          donts: z.array(z.string().max(300)).max(30),
          examples: z.object({
            linkedin: z
              .array(z.object({ context: z.string().max(200).optional(), text: z.string().max(5000) }))
              .max(10),
            facebook: z
              .array(z.object({ context: z.string().max(200).optional(), text: z.string().max(5000) }))
              .max(10),
            instagram: z
              .array(z.object({ context: z.string().max(200).optional(), text: z.string().max(5000) }))
              .max(10),
            blog: z
              .array(z.object({ context: z.string().max(200).optional(), text: z.string().max(5000) }))
              .max(10)
              .optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => {
        const voice: BrandVoice = {
          ...input,
          examples: {
            ...input.examples,
            blog: input.examples.blog ?? [],
          },
        };
        await saveBrandVoice(voice);
        return { success: true };
      }),
  }),

  // Stats
  stats: permissionProcedure("brand_voice").query(async () => {
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
  statsTimeSeries: permissionProcedure("brand_voice")
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

  /**
   * Unified activity feed across the three lead-collection tables.
   * Gives the dashboard a single "what just happened" scrollback so
   * the admin can see new contacts, audit requests, and newsletter
   * signups interleaved by time without bouncing between three list
   * pages.
   *
   * Limit caps at 50 rows; the UI typically shows 8-10. Each row is
   * normalised to a small shape with a `type` discriminator so the
   * client can render the right icon and link per row.
   */
  recentActivity: permissionProcedure("brand_voice")
    .input(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const [contactsData, subscribersData, auditLeadsData] = await Promise.all([
        db.getContactSubmissions(),
        db.getAllNewsletterSubscribers(),
        db.getAllAuditLeads(),
      ]);

      type ActivityEvent = {
        type: "contact" | "audit" | "newsletter";
        id: number;
        title: string;
        subtitle: string | null;
        at: string;
        href: string;
        unread: boolean;
      };

      const events: ActivityEvent[] = [
        ...contactsData.map((c): ActivityEvent => ({
          type: "contact",
          id: c.id,
          title: c.name || c.email,
          subtitle: c.subject || c.email,
          at: typeof c.createdAt === "string" ? c.createdAt : c.createdAt?.toISOString() ?? new Date(0).toISOString(),
          href: `/admin/contacts`,
          unread: !c.isRead,
        })),
        ...auditLeadsData.map((l: {
          id: number; name?: string | null; company?: string | null; email: string;
          website?: string | null; createdAt: Date | string; isContacted: boolean;
        }): ActivityEvent => ({
          type: "audit",
          id: l.id,
          title: l.name || l.email,
          subtitle: l.company || l.website || l.email,
          at: typeof l.createdAt === "string" ? l.createdAt : l.createdAt?.toISOString() ?? new Date(0).toISOString(),
          href: `/admin/audit-leads`,
          unread: !l.isContacted,
        })),
        ...subscribersData.map((s): ActivityEvent => ({
          type: "newsletter",
          id: s.id,
          title: s.name || s.email,
          subtitle: s.email,
          at: typeof s.createdAt === "string" ? s.createdAt : s.createdAt?.toISOString() ?? new Date(0).toISOString(),
          href: `/admin/newsletter`,
          // Newsletter signups are informational only — never marked unread.
          unread: false,
        })),
      ];

      events.sort((a, b) => b.at.localeCompare(a.at));
      return { events: events.slice(0, input.limit), totalEvents: events.length };
    }),

  /**
   * Backend integration status snapshot. Lets the admin see at a
   * glance whether each external service is wired up via env vars.
   *
   * We deliberately do NOT call out to the actual APIs (no
   * heartbeat) — that would slow the dashboard load and burn cost.
   * Configuration presence is the right signal: if a key is missing
   * we know the feature is dark; if it's set we trust the runtime
   * was tested at the relevant feature surface (forms, generators).
   */
  systemHealth: permissionProcedure("brand_voice").query(async () => {
    return {
      openai: {
        configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      },
      resend: {
        configured: Boolean(process.env.RESEND_API_KEY?.trim()),
        notifyAddress: process.env.RESEND_NOTIFY_EMAIL || null,
      },
      cloudinary: {
        configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME?.trim() && process.env.CLOUDINARY_API_KEY?.trim()),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
      },
      turnstile: {
        // VITE_ vars aren't readable from Node at runtime in production
        // Vercel — they're inlined at build time. We use the server-side
        // secret as the proxy for "feature on", since both are set together.
        configured: Boolean(process.env.TURNSTILE_SECRET_KEY?.trim()),
      },
      deepl: {
        configured: Boolean(process.env.DEEPL_API_KEY?.trim()),
      },
      database: {
        configured: Boolean(process.env.DATABASE_URL?.trim() || process.env.TIDB_HOST?.trim()),
      },
      calendly: {
        configured: Boolean(process.env.VITE_CALENDLY_URL || process.env.CALENDLY_URL),
      },
    };
  }),

  /**
   * Content + AI usage snapshot — what's been published recently,
   * what AI features are in play. Cheap roll-up over the posts table
   * — we don't track per-call AI cost yet, so this gives the admin
   * "content velocity" instead of a token meter.
   */
  contentSummary: permissionProcedure("brand_voice").query(async () => {
    const posts = await db.getAllPostsAdmin();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const lastNDays = (n: number) =>
      posts.filter((p) => {
        const created = p.createdAt instanceof Date ? p.createdAt.getTime() : new Date(p.createdAt as string | number).getTime();
        return !Number.isNaN(created) && now - created < n * oneDay;
      }).length;

    const recentPublished = posts
      .filter((p) => p.status === "published")
      .sort((a, b) => {
        const aT = new Date((a.publishedAt ?? a.createdAt ?? 0) as string | number | Date).getTime();
        const bT = new Date((b.publishedAt ?? b.createdAt ?? 0) as string | number | Date).getTime();
        return bT - aT;
      })
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        publishedAt: p.publishedAt ?? null,
      }));

    return {
      postsLast7Days: lastNDays(7),
      postsLast30Days: lastNDays(30),
      draftCount: posts.filter((p) => p.status === "draft").length,
      publishedCount: posts.filter((p) => p.status === "published").length,
      recentPublished,
    };
  }),
  users: router({
    list: ownerProcedure.query(async () => {
      const rows = await db.listStaffUsers();
      // Never ship the hash or a live invite token to the browser.
      return rows.map((u) => ({
        id: u.id,
        name: u.name ?? "",
        email: u.email ?? "",
        permissions: parsePermissions(u.permissions),
        isActive: Boolean(u.isActive),
        isOwner: Boolean(u.isOwner),
        hasPassword: Boolean(u.passwordHash),
        invitedAt: u.invitedAt,
        lastSignedIn: u.lastSignedIn,
      }));
    }),

    /**
     * Invite a colleague. Creates the row with no password and a one-hour
     * set-password token, emails the link, and ALSO returns it so the owner
     * can pass it on by hand — deliverability shouldn't block onboarding.
     */
    invite: ownerProcedure
      .input(z.object({
        name: z.string().min(2).max(120),
        email: z.string().email(),
        permissions: z.array(z.enum(PERMISSION_KEYS)).max(PERMISSION_KEYS.length),
      }))
      .mutation(async ({ input, ctx }) => {
        const email = input.email.trim().toLowerCase();
        const existing = await db.getUserByEmail(email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Ezzel az email címmel már létezik felhasználó." });
        }
        const token = generateResetToken();
        const created = await db.createStaffUser({
          openId: `staff-${randomBytes(12).toString("hex")}`,
          name: input.name.trim(),
          email,
          permissions: JSON.stringify(input.permissions),
          resetToken: token,
          resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });
        const link = `${originFromRequest(ctx.req)}/admin/reset-password?token=${token}`;
        let emailSent = false;
        let emailError: string | undefined;
        const result = await sendEmailWithId({
          to: email,
          subject: "Meghívó a G2A admin felületre",
          html: renderInviteEmail(input.name.trim(), link),
          text: `Meghívtak a G2A admin felületre. Állítsd be a jelszavad: ${link} (a link 1 óráig érvényes)`,
        });
        emailSent = result.ok;
        if (!result.ok) emailError = result.error;
        return { id: created?.id ?? 0, link, emailSent, emailError };
      }),

    update: ownerProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(2).max(120).optional(),
        permissions: z.array(z.enum(PERMISSION_KEYS)).optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const target = await db.getUserById(input.id);
        if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "Nincs ilyen felhasználó." });
        if (target.isOwner) {
          throw new TRPCError({ code: "FORBIDDEN", message: "A tulajdonos hozzáférése nem módosítható — mindig teljes jogosultsága van." });
        }
        await db.updateStaffUser(input.id, {
          ...(input.name !== undefined ? { name: input.name.trim() } : {}),
          ...(input.permissions !== undefined ? { permissions: JSON.stringify(input.permissions) } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        });
        return { success: true };
      }),

    /** New set-password link for someone who never used (or lost) the first. */
    resendInvite: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const target = await db.getUserById(input.id);
        if (!target || !target.email) throw new TRPCError({ code: "NOT_FOUND", message: "Nincs ilyen felhasználó." });
        const token = generateResetToken();
        await db.updateStaffUser(target.id, {
          resetToken: token,
          resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });
        const link = `${originFromRequest(ctx.req)}/admin/reset-password?token=${token}`;
        const result = await sendEmailWithId({
          to: target.email,
          subject: "G2A Admin — jelszó beállítása",
          html: renderInviteEmail(target.name ?? "", link),
          text: `Jelszó beállítása: ${link} (a link 1 óráig érvényes)`,
        });
        return { link, emailSent: result.ok, emailError: result.error };
      }),

    remove: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const target = await db.getUserById(input.id);
        if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "Nincs ilyen felhasználó." });
        if (target.isOwner) {
          throw new TRPCError({ code: "FORBIDDEN", message: "A tulajdonos nem törölhető." });
        }
        if (target.id === ctx.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Saját magadat nem törölheted." });
        }
        await db.deleteStaffUser(input.id);
        return { success: true };
      }),
  }),

  careers: router({
    listPositions: permissionProcedure("careers").query(() => db.listAllJobPositions()),
    createPosition: permissionProcedure("careers")
      .input(z.object({
        titleHu: z.string().min(1).max(256),
        titleEn: z.string().max(256).optional(),
        titleZh: z.string().max(256).optional(),
        descHu: z.string().optional(),
        descEn: z.string().optional(),
        descZh: z.string().optional(),
        location: z.string().max(128).optional(),
        employmentType: z.string().max(128).optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      }))
      .mutation(async ({ input }) => { await db.createJobPosition(input); return { success: true }; }),
    updatePosition: permissionProcedure("careers")
      .input(z.object({ id: z.number(), data: z.object({
        titleHu: z.string().min(1).max(256).optional(),
        titleEn: z.string().max(256).optional(),
        titleZh: z.string().max(256).optional(),
        descHu: z.string().optional(),
        descEn: z.string().optional(),
        descZh: z.string().optional(),
        location: z.string().max(128).optional(),
        employmentType: z.string().max(128).optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      }) }))
      .mutation(async ({ input }) => { await db.updateJobPosition(input.id, input.data); return { success: true }; }),
    deletePosition: permissionProcedure("careers")
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => { await db.deleteJobPosition(input.id); return { success: true }; }),
    listApplications: permissionProcedure("careers").query(() => db.listJobApplications()),
    updateApplicationStatus: permissionProcedure("careers")
      .input(z.object({ id: z.number(), status: z.enum(["new", "reviewed", "archived"]) }))
      .mutation(async ({ input }) => { await db.updateJobApplicationStatus(input.id, input.status); return { success: true }; }),
    deleteApplication: permissionProcedure("careers")
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => { await db.deleteJobApplication(input.id); return { success: true }; }),
  }),
});

// ─── Social Media Router ──────────────────────────────────────────────────
// Phase 1: copy generation + draft management. OAuth / publishing flows
// will be added in phase 2 once the LinkedIn/Meta apps are approved.
const SOCIAL_PLATFORM = z.enum(["linkedin", "facebook", "instagram"]);

const socialRouter = router({
  /** List all connected social accounts (admin sees status per platform). */
  listAccounts: permissionProcedure("brand_voice").query(() => db.listSocialAccounts()),

  /** All drafts/published posts attached to a given blog post — latest per
   *  platform. The admin UI uses this to render the per-platform share rows. */
  listForPost: permissionProcedure("brand_voice")
    .input(z.object({ postId: z.number().int().positive() }))
    .query(({ input }) => db.getLatestSocialPostsForBlogPost(input.postId)),

  /** Generate AI copy for a (blog post, platform) combination. Doesn't
   *  persist on its own — the UI lets the admin tweak the result before
   *  saving via `saveDraft`. */
  generateCopy: permissionProcedure("brand_voice")
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
  saveDraft: permissionProcedure("brand_voice")
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

const leadMagnetRouter = router({
  /** Public — AI Marketing Csomag opt-in (HU-only funnel). Stores into the
   *  newsletter list with source + segmentation, and emails the 4 downloads. */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Érvényes email cím szükséges"),
        name: z.string().max(256).optional(),
        source: z.enum(["ai-csomag", "marketing-teszt"]).default("ai-csomag"),
        // From the interactive checklist (/marketing-teszt); absent on the plain landing.
        score: z.number().int().min(0).max(100).optional(),
        band: z.string().max(64).optional(),
        weakestAreas: z.string().max(512).optional(),
        [HONEYPOT_FIELD]: z.string().optional(),
        turnstileToken: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const guard = await guardPublicFormOrSilent(ctx, input, "newsletter", { success: true });
      if (guard) return guard;

      const seg = {
        score: input.score ?? null,
        band: input.band ?? null,
        weakestAreas: input.weakestAreas ?? null,
      };
      const origin =
        (ctx.req.headers.origin as string | undefined) ||
        `${ctx.req.protocol}://${ctx.req.get("host")}`;

      const existing = await db.getNewsletterSubscriberByEmail(input.email);
      let unsubscribeToken = existing?.unsubscribeToken ?? null;

      if (existing) {
        // Update segmentation only when the checklist actually supplied it, so a
        // later plain-landing opt-in doesn't wipe an earlier checklist score.
        await db.updateNewsletterSubscriberSegmentation(input.email, {
          source: input.source,
          ...(input.score !== undefined ? seg : {}),
        });
      } else {
        unsubscribeToken = randomBytes(16).toString("hex");
        await db.createNewsletterSubscriber({
          email: input.email,
          name: input.name ?? null,
          source: input.source,
          tags: input.source,
          unsubscribeToken,
          ...seg,
        });
        await notifyOwner({
          title: "Új lead-magnet feliratkozó",
          content:
            `**Email:** ${input.email}\n**Név:** ${input.name || "–"}\n**Forrás:** ${input.source}\n` +
            `**Pontszám:** ${input.score ?? "–"}\n**Sáv:** ${input.band || "–"}\n**Leggyengébb:** ${input.weakestAreas || "–"}`,
          replyTo: input.email,
        });
      }

      // Enrol into the nurture drip once (survives across landing/checklist opt-ins).
      const NURTURE = "leadmagnet-nurture";
      if (!(await db.hasActiveEnrollment(input.email, NURTURE))) {
        const first = getAutomation(NURTURE)?.steps[0];
        if (first) {
          await db.createEnrollment({
            email: input.email, automationKey: NURTURE,
            band: input.band ?? null, name: input.name ?? null,
            nextRunAt: new Date(Date.now() + first.dayOffset * 24 * 60 * 60 * 1000),
          });
        }
      }

      if (isEmailConfigured() && unsubscribeToken) {
        const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
        // The checklist promises the *evaluated result* by email, not just the
        // downloads — send the scored result email when we have a score.
        if (input.source === "marketing-teszt" && input.score !== undefined && input.band) {
          await sendEmail({
            to: input.email,
            subject: `A teszted eredménye: ${input.score}/34 pont — ${input.band}`,
            html: renderChecklistResultHtml({
              name: input.name,
              score: input.score,
              band: input.band,
              weakestAreas: input.weakestAreas ?? "",
              unsubscribeUrl,
            }),
          });
        } else {
          // Plain landing opt-in: deliver the 4 downloads.
          await sendEmail({
            to: input.email,
            subject: "Itt a 4 anyag — G2A AI Marketing Csomag",
            html: renderLeadMagnetWelcomeHtml({ name: input.name, unsubscribeUrl }),
          });
        }
      }

      return { success: true };
    }),
});

const careersRouter = router({
  /** Public — active positions for the career page. Empty is the normal state. */
  positions: publicProcedure.query(() => db.listActiveJobPositions()),

  /** Public — submit a job application. The CV (if any) is emailed to the owner
   *  as an attachment; only metadata is stored (PII stays out of the DB/CDN).
   *  Named `submit` not `apply` — tRPC reserves `apply` (a Function method). */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "A név megadása kötelező").max(256),
        email: z.string().email("Érvényes email cím szükséges"),
        phone: z.string().max(64).optional(),
        positionId: z.number().int().positive().optional(),
        areas: z.array(z.string().max(64)).max(20).optional(),
        message: z.string().max(4000).optional(),
        cv: z
          .object({
            filename: z.string().min(1).max(256),
            // base64 without the `data:` prefix; ~4.5MB cap keeps us under the
            // Vercel serverless request-body limit (a ~3MB file).
            contentBase64: z.string().min(1).max(4_500_000),
            contentType: z.string().max(128).optional(),
          })
          .optional(),
        lang: z.enum(["hu", "en", "zh"]).optional(),
        [HONEYPOT_FIELD]: z.string().optional(),
        turnstileToken: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const guard = await guardPublicFormOrSilent(ctx, input, "careers", { success: true });
      if (guard) return guard;

      const areas = (input.areas ?? []).filter((a) => areValidAreaKeys([a]));
      let positionTitle: string | undefined;
      if (input.positionId) {
        const pos = await db.getJobPosition(input.positionId);
        positionTitle = pos?.titleHu ?? undefined;
      }

      await db.createJobApplication({
        name: input.name,
        email: input.email,
        phone: input.phone,
        positionId: input.positionId,
        positionTitle,
        areas: areas.length ? areas.join(",") : null,
        message: input.message,
        cvFilename: input.cv?.filename ?? null,
      });

      const lang = toLang(input.lang);
      if (isEmailConfigured()) {
        // Owner notification, CV attached.
        const content =
          `**Név:** ${input.name}\n**Email:** ${input.email}\n**Telefon:** ${input.phone || "–"}\n` +
          `**Pozíció:** ${positionTitle || "Spontán jelentkezés"}\n` +
          `**Területek:** ${areaLabels(areas, "hu").join(", ") || "–"}\n` +
          `**CV:** ${input.cv ? input.cv.filename : "nincs csatolva"}\n\n` +
          `**Üzenet:**\n${input.message || "–"}`;
        await sendEmail({
          subject: `Új karrier-jelentkezés: ${input.name}`,
          html: renderNotificationHtml(content),
          replyTo: input.email,
          attachments: input.cv ? [{ filename: input.cv.filename, content: input.cv.contentBase64 }] : undefined,
        });

        // Applicant confirmation (career email — the no-reply automated notice).
        const L = FIELD_LABELS[lang];
        await sendEmail({
          to: input.email,
          subject: confirmationSubject("career", lang),
          html: renderConfirmationEmailHtml({
            name: input.name,
            formType: "career",
            lang,
            submission: [
              { label: L.email, value: input.email },
              { label: L.phone, value: input.phone || "" },
              { label: L.areas, value: areaLabels(areas, lang).join(", ") },
            ],
          }),
          replyTo: "info@g2amarketing.hu",
        });
      }

      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => {
      const u = opts.ctx.user;
      if (!u) return null;
      // Sanitised projection — the raw row now carries a password hash and a
      // live reset token, neither of which may reach the client.
      return {
        id: u.id,
        openId: u.openId,
        name: u.name,
        email: u.email,
        role: u.role,
        isOwner: Boolean(u.isOwner),
        isActive: u.isActive !== false,
        permissions: parsePermissions(u.permissions),
      };
    }),
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
  careers: careersRouter,
  leadmagnet: leadMagnetRouter,
  admin: adminRouter,
  upload: uploadRouter,
  social: socialRouter,
});

export type AppRouter = typeof appRouter;
