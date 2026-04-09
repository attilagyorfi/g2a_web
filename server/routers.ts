import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import * as db from "./db";
import { sendWelcomeEmail, syncToBrevoList } from "./emailService";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

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
      const ext = input.filename.split(".").pop() || "bin";
      const key = `g2a-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(input.base64Data, "base64");
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
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
    }))
    .mutation(async ({ input }) => {
      await db.createContactSubmission(input);
      // Notify admin
      await notifyOwner({
        title: `Új kapcsolatfelvétel: ${input.name}`,
        content: `**Feladó:** ${input.name}\n**Email:** ${input.email}\n**Telefon:** ${input.phone || "–"}\n**Tárgy:** ${input.subject || "–"}\n**Szolgáltatás:** ${input.serviceInterest || "–"}\n\n**Üzenet:**\n${input.message}`,
      });
      return { success: true };
    }),
});

// ─── Audit Router ───────────────────────────────────────────────────────────
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
    }))
    .mutation(async ({ input }) => {
      await db.createAuditLead(input);
      await notifyOwner({
        title: `Új ingyenes audit kérés: ${input.name}`,
        content: `**Név:** ${input.name}\n**Email:** ${input.email}\n**Telefon:** ${input.phone || "–"}\n**Cég:** ${input.company || "–"}\n**Weboldal:** ${input.website || "–"}\n**Havi büdzsé:** ${input.monthlyBudget || "–"}\n\n**Kihívások:**\n${input.currentChallenges || "–"}\n\n**Célok:**\n${input.goals || "–"}`,
      });
      return { success: true };
    }),
});

// ─── Newsletter Router ────────────────────────────────────────────────────────
const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email("Érvényes email cím szükséges"), name: z.string().optional() }))
    .mutation(async ({ input }) => {
      const exists = await db.checkNewsletterSubscriberExists(input.email);
      if (exists) return { success: true, alreadySubscribed: true };
      await db.createNewsletterSubscriber({ email: input.email, name: input.name });
      // Notify owner
      await notifyOwner({
        title: `Új hírlevél feliratkozó`,
        content: `**Email:** ${input.email}\n**Név:** ${input.name || "–"}`,
      });
      // Send welcome email (non-blocking – fails gracefully if Brevo not configured)
      sendWelcomeEmail(input.email, input.name).catch(console.warn);
      // Sync to Brevo contact list (non-blocking)
      syncToBrevoList(input.email, input.name).catch(console.warn);
      return { success: true, alreadySubscribed: false };
    }),
});

// ─── Admin Router ─────────────────────────────────────────────────────────────
const adminRouter = router({
  // Hero Slides
  heroSlides: router({
    list: adminProcedure.query(() => db.getAllHeroSlides()),
    create: adminProcedure.input(z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      backgroundImage: z.string().optional(),
      backgroundImageAlt: z.string().optional(),
      ctaPrimaryText: z.string().optional(),
      ctaPrimaryUrl: z.string().optional(),
      ctaSecondaryText: z.string().optional(),
      ctaSecondaryUrl: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createHeroSlide(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      backgroundImage: z.string().optional(),
      backgroundImageAlt: z.string().optional(),
      ctaPrimaryText: z.string().optional(),
      ctaPrimaryUrl: z.string().optional(),
      ctaSecondaryText: z.string().optional(),
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
      shortDescription: z.string().optional(),
      heroTitle: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
      content: z.string().optional(),
      icon: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createService(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      slug: z.string().optional(),
      number: z.string().optional(),
      title: z.string().optional(),
      shortDescription: z.string().optional(),
      heroTitle: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
      content: z.string().optional(),
      icon: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updateService(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteService(input.id)),
  }),

  // Categories
  categories: router({
    list: adminProcedure.query(() => db.getCategories()),
    create: adminProcedure.input(z.object({ name: z.string(), slug: z.string(), description: z.string().optional() })).mutation(({ input }) => db.createCategory(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({ name: z.string().optional(), slug: z.string().optional(), description: z.string().optional() }) })).mutation(({ input }) => db.updateCategory(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCategory(input.id)),
  }),

  // Posts
  posts: router({
    list: adminProcedure.query(() => db.getAllPostsAdmin()),
    create: adminProcedure.input(z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().optional(),
      content: z.string(),
      featuredImage: z.string().optional(),
      featuredImageAlt: z.string().optional(),
      categoryId: z.number().optional(),
      authorName: z.string().optional(),
      status: z.enum(["draft", "published"]).default("draft"),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      publishedAt: z.date().optional(),
    })).mutation(({ input }) => db.createPost(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      featuredImageAlt: z.string().optional(),
      categoryId: z.number().optional(),
      authorName: z.string().optional(),
      status: z.enum(["draft", "published"]).optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      publishedAt: z.date().optional(),
    }) })).mutation(({ input }) => db.updatePost(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePost(input.id)),
  }),

  // Testimonials
  testimonials: router({
    list: adminProcedure.query(() => db.getAllTestimonials()),
    create: adminProcedure.input(z.object({
      quote: z.string(),
      authorName: z.string(),
      authorTitle: z.string().optional(),
      authorCompany: z.string().optional(),
      authorImage: z.string().optional(),
      authorImageAlt: z.string().optional(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().default(0),
    })).mutation(({ input }) => db.createTestimonial(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      quote: z.string().optional(),
      authorName: z.string().optional(),
      authorTitle: z.string().optional(),
      authorCompany: z.string().optional(),
      authorImage: z.string().optional(),
      authorImageAlt: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updateTestimonial(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTestimonial(input.id)),
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
      description: z.string().optional(),
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
      description: z.string().optional(),
      category: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }) })).mutation(({ input }) => db.updatePartner(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deletePartner(input.id)),
  }),

  // Industries
  industries: router({
    list: adminProcedure.query(() => db.getAllIndustries()),
    create: adminProcedure.input(z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createIndustry(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateIndustry(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteIndustry(input.id)),
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
      description: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createTechnology(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      logo: z.string().optional(),
      logoAlt: z.string().optional(),
      category: z.enum(["marketing", "ai", "analytics", "other"]).optional(),
      website: z.string().optional(),
      description: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }) })).mutation(({ input }) => db.updateTechnology(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTechnology(input.id)),
  }),

  // Values
  values: router({
    list: adminProcedure.query(() => db.getAllValues()),
    create: adminProcedure.input(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.boolean().default(true),
    })).mutation(({ input }) => db.createValue(input)),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
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
  }),

  // Newsletter
  newsletter: router({
    list: adminProcedure.query(() => db.getAllNewsletterSubscribers()),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteNewsletterSubscriber(input.id)),
  }),

  // Pages SEO
  pages: router({
    list: adminProcedure.query(() => db.getAllPages()),
    upsert: adminProcedure.input(z.object({
      slug: z.string(),
      title: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
      schemaJson: z.string().optional(),
    })).mutation(({ input }) => db.upsertPageSeo(input)),
  }),

  // Case Studies
  caseStudies: router({
    list: adminProcedure.query(() => db.getAllCaseStudies()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(),
      slug: z.string(),
      client: z.string().optional(),
      industry: z.string().optional(),
      challenge: z.string().optional(),
      solution: z.string().optional(),
      results: z.string().optional(),
      featuredImage: z.string().optional(),
      featuredImageAlt: z.string().optional(),
      tags: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })).mutation(({ input }) => db.upsertCaseStudy(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCaseStudy(input.id)),
  }),
  // Audit Leads
  auditLeads: router({
    list: adminProcedure.query(() => db.getAllAuditLeads()),
    markContacted: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.markAuditLeadContacted(input.id)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteAuditLead(input.id)),
  }),
  // Site Settings
  settings: router({
    list: adminProcedure.query(() => db.getAllSiteSettings()),
    upsert: adminProcedure.input(z.object({ key: z.string(), value: z.string() })).mutation(({ input }) => db.upsertSiteSetting(input.key, input.value)),
  }),

  // Stats
  stats: adminProcedure.query(async () => {
    const [contactsData, subscribersData, postsData, partnersData] = await Promise.all([
      db.getContactSubmissions(),
      db.getAllNewsletterSubscribers(),
      db.getAllPostsAdmin(),
      db.getAllPartners(),
    ]);
    return {
      totalContacts: contactsData.length,
      unreadContacts: contactsData.filter(c => !c.isRead).length,
      totalSubscribers: subscribersData.length,
      totalPosts: postsData.length,
      publishedPosts: postsData.filter(p => p.status === "published").length,
      totalPartners: partnersData.length,
    };
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
});

export type AppRouter = typeof appRouter;
