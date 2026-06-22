var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";
var users, siteSettings, pages, categories, posts, services, heroSlides, testimonials, partners, industries, technologies, values, contactSubmissions, emailCampaigns, emailEvents, rateLimitHits, socialAccounts, socialPosts, newsletterSubscribers, caseStudies, aiJobs, auditLeads;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    siteSettings = mysqlTable("site_settings", {
      id: int("id").autoincrement().primaryKey(),
      key: varchar("key", { length: 128 }).notNull().unique(),
      value: text("value"),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    pages = mysqlTable("pages", {
      id: int("id").autoincrement().primaryKey(),
      slug: varchar("slug", { length: 256 }).notNull().unique(),
      title: varchar("title", { length: 512 }),
      titleEn: varchar("titleEn", { length: 512 }),
      titleZh: varchar("titleZh", { length: 512 }),
      metaTitle: varchar("metaTitle", { length: 512 }),
      metaTitleEn: varchar("metaTitleEn", { length: 512 }),
      metaTitleZh: varchar("metaTitleZh", { length: 512 }),
      metaDescription: text("metaDescription"),
      metaDescriptionEn: text("metaDescriptionEn"),
      metaDescriptionZh: text("metaDescriptionZh"),
      ogTitle: varchar("ogTitle", { length: 512 }),
      ogTitleEn: varchar("ogTitleEn", { length: 512 }),
      ogTitleZh: varchar("ogTitleZh", { length: 512 }),
      ogDescription: text("ogDescription"),
      ogDescriptionEn: text("ogDescriptionEn"),
      ogDescriptionZh: text("ogDescriptionZh"),
      ogImage: text("ogImage"),
      canonicalUrl: text("canonicalUrl"),
      schemaJson: text("schemaJson"),
      keywords: text("keywords"),
      keywordsEn: text("keywordsEn"),
      keywordsZh: text("keywordsZh"),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    categories = mysqlTable("categories", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      nameEn: varchar("nameEn", { length: 256 }),
      nameZh: varchar("nameZh", { length: 256 }),
      slug: varchar("slug", { length: 256 }).notNull().unique(),
      description: text("description"),
      descriptionEn: text("descriptionEn"),
      descriptionZh: text("descriptionZh"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    posts = mysqlTable("posts", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 512 }).notNull(),
      titleEn: varchar("titleEn", { length: 512 }),
      titleZh: varchar("titleZh", { length: 512 }),
      slug: varchar("slug", { length: 512 }).notNull().unique(),
      excerpt: text("excerpt"),
      excerptEn: text("excerptEn"),
      excerptZh: text("excerptZh"),
      content: text("content").notNull(),
      contentEn: text("contentEn"),
      contentZh: text("contentZh"),
      featuredImage: text("featuredImage"),
      featuredImageAlt: varchar("featuredImageAlt", { length: 512 }),
      categoryId: int("categoryId"),
      authorName: varchar("authorName", { length: 256 }).default("G2A Marketing"),
      status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
      metaTitle: varchar("metaTitle", { length: 512 }),
      metaTitleEn: varchar("metaTitleEn", { length: 512 }),
      metaTitleZh: varchar("metaTitleZh", { length: 512 }),
      metaDescription: text("metaDescription"),
      metaDescriptionEn: text("metaDescriptionEn"),
      metaDescriptionZh: text("metaDescriptionZh"),
      ogImage: text("ogImage"),
      publishedAt: timestamp("publishedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    services = mysqlTable("services", {
      id: int("id").autoincrement().primaryKey(),
      slug: varchar("slug", { length: 256 }).notNull().unique(),
      number: varchar("number", { length: 8 }),
      title: varchar("title", { length: 256 }).notNull(),
      titleEn: varchar("titleEn", { length: 256 }),
      titleZh: varchar("titleZh", { length: 256 }),
      shortDescription: text("shortDescription"),
      shortDescriptionEn: text("shortDescriptionEn"),
      shortDescriptionZh: text("shortDescriptionZh"),
      heroTitle: varchar("heroTitle", { length: 512 }),
      heroTitleEn: varchar("heroTitleEn", { length: 512 }),
      heroTitleZh: varchar("heroTitleZh", { length: 512 }),
      heroSubtitle: text("heroSubtitle"),
      heroSubtitleEn: text("heroSubtitleEn"),
      heroSubtitleZh: text("heroSubtitleZh"),
      heroImage: text("heroImage"),
      heroImageAlt: varchar("heroImageAlt", { length: 512 }),
      content: text("content"),
      contentEn: text("contentEn"),
      contentZh: text("contentZh"),
      icon: varchar("icon", { length: 128 }),
      metaTitle: varchar("metaTitle", { length: 512 }),
      metaTitleEn: varchar("metaTitleEn", { length: 512 }),
      metaTitleZh: varchar("metaTitleZh", { length: 512 }),
      metaDescription: text("metaDescription"),
      metaDescriptionEn: text("metaDescriptionEn"),
      metaDescriptionZh: text("metaDescriptionZh"),
      sortOrder: int("sortOrder").default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    heroSlides = mysqlTable("hero_slides", {
      id: int("id").autoincrement().primaryKey(),
      subtitle: varchar("subtitle", { length: 512 }),
      subtitleEn: varchar("subtitleEn", { length: 512 }),
      subtitleZh: varchar("subtitleZh", { length: 512 }),
      title: varchar("title", { length: 512 }).notNull(),
      titleEn: varchar("titleEn", { length: 512 }),
      titleZh: varchar("titleZh", { length: 512 }),
      backgroundImage: text("backgroundImage"),
      backgroundImageAlt: varchar("backgroundImageAlt", { length: 512 }),
      ctaPrimaryText: varchar("ctaPrimaryText", { length: 256 }),
      ctaPrimaryTextEn: varchar("ctaPrimaryTextEn", { length: 256 }),
      ctaPrimaryTextZh: varchar("ctaPrimaryTextZh", { length: 256 }),
      ctaPrimaryUrl: varchar("ctaPrimaryUrl", { length: 512 }),
      ctaSecondaryText: varchar("ctaSecondaryText", { length: 256 }),
      ctaSecondaryTextEn: varchar("ctaSecondaryTextEn", { length: 256 }),
      ctaSecondaryTextZh: varchar("ctaSecondaryTextZh", { length: 256 }),
      ctaSecondaryUrl: varchar("ctaSecondaryUrl", { length: 512 }),
      sortOrder: int("sortOrder").default(0),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    testimonials = mysqlTable("testimonials", {
      id: int("id").autoincrement().primaryKey(),
      quote: text("quote").notNull(),
      quoteEn: text("quoteEn"),
      quoteZh: text("quoteZh"),
      authorName: varchar("authorName", { length: 256 }).notNull(),
      authorTitle: varchar("authorTitle", { length: 256 }),
      authorTitleEn: varchar("authorTitleEn", { length: 256 }),
      authorTitleZh: varchar("authorTitleZh", { length: 256 }),
      authorCompany: varchar("authorCompany", { length: 256 }),
      authorImage: text("authorImage"),
      authorImageAlt: varchar("authorImageAlt", { length: 512 }),
      isActive: boolean("isActive").default(true).notNull(),
      sortOrder: int("sortOrder").default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    partners = mysqlTable("partners", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      slug: varchar("slug", { length: 256 }),
      logo: text("logo"),
      logoAlt: varchar("logoAlt", { length: 512 }),
      website: text("website"),
      description: text("description"),
      descriptionEn: text("descriptionEn"),
      descriptionZh: text("descriptionZh"),
      category: varchar("category", { length: 128 }),
      isActive: boolean("isActive").default(true).notNull(),
      sortOrder: int("sortOrder").default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    industries = mysqlTable("industries", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      nameEn: varchar("nameEn", { length: 256 }),
      nameZh: varchar("nameZh", { length: 256 }),
      slug: varchar("slug", { length: 256 }).notNull().unique(),
      description: text("description"),
      descriptionEn: text("descriptionEn"),
      descriptionZh: text("descriptionZh"),
      icon: varchar("icon", { length: 128 }),
      image: text("image"),
      imageAlt: varchar("imageAlt", { length: 512 }),
      sortOrder: int("sortOrder").default(0),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    technologies = mysqlTable("technologies", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      logo: text("logo"),
      logoAlt: varchar("logoAlt", { length: 512 }),
      category: mysqlEnum("category", ["marketing", "ai", "analytics", "other"]).default("marketing").notNull(),
      website: text("website"),
      description: text("description"),
      descriptionEn: text("descriptionEn"),
      descriptionZh: text("descriptionZh"),
      sortOrder: int("sortOrder").default(0),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    values = mysqlTable("values", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 256 }).notNull(),
      titleEn: varchar("titleEn", { length: 256 }),
      titleZh: varchar("titleZh", { length: 256 }),
      description: text("description"),
      descriptionEn: text("descriptionEn"),
      descriptionZh: text("descriptionZh"),
      icon: varchar("icon", { length: 128 }),
      sortOrder: int("sortOrder").default(0),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    contactSubmissions = mysqlTable("contact_submissions", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 64 }),
      subject: varchar("subject", { length: 512 }),
      message: text("message").notNull(),
      serviceInterest: varchar("serviceInterest", { length: 256 }),
      isRead: boolean("isRead").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    emailCampaigns = mysqlTable("email_campaigns", {
      id: int("id").autoincrement().primaryKey(),
      subject: varchar("subject", { length: 512 }).notNull(),
      html: text("html").notNull(),
      text: text("text"),
      segment: varchar("segment", { length: 128 }),
      recipientCount: int("recipientCount").default(0).notNull(),
      sentCount: int("sentCount").default(0).notNull(),
      failedCount: int("failedCount").default(0).notNull(),
      status: varchar("status", { length: 32 }).default("draft").notNull(),
      // draft | sending | sent | failed
      sentAt: timestamp("sentAt"),
      sentByUserId: int("sentByUserId"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    emailEvents = mysqlTable("email_events", {
      id: int("id").autoincrement().primaryKey(),
      campaignId: int("campaignId"),
      // FK to emailCampaigns.id (nullable for transactional)
      recipient: varchar("recipient", { length: 320 }).notNull(),
      eventType: varchar("eventType", { length: 64 }).notNull(),
      // e.g. email.opened
      resendMessageId: varchar("resendMessageId", { length: 128 }),
      // for de-dup + lookup
      /** Raw event JSON for forensic-ability — stringified, may include click URL etc. */
      rawData: text("rawData"),
      receivedAt: timestamp("receivedAt").defaultNow().notNull()
    });
    rateLimitHits = mysqlTable("rate_limit_hits", {
      id: int("id").autoincrement().primaryKey(),
      bucketKey: varchar("bucketKey", { length: 192 }).notNull(),
      hitAt: timestamp("hitAt").defaultNow().notNull()
    });
    socialAccounts = mysqlTable("social_accounts", {
      id: int("id").autoincrement().primaryKey(),
      platform: mysqlEnum("platform", ["linkedin", "facebook", "instagram"]).notNull(),
      accountName: varchar("accountName", { length: 256 }),
      // display name, e.g. "G2A Marketing"
      accountId: varchar("accountId", { length: 256 }),
      // platform-side ID (page ID, etc.)
      accessToken: text("accessToken"),
      refreshToken: text("refreshToken"),
      expiresAt: timestamp("expiresAt"),
      /** Scope string saved as-is so we can warn if the granted scopes don't
       *  include the publishing permission. */
      scope: text("scope"),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    socialPosts = mysqlTable("social_posts", {
      id: int("id").autoincrement().primaryKey(),
      postId: int("postId").notNull(),
      // FK to posts.id (blog post)
      platform: mysqlEnum("platform", ["linkedin", "facebook", "instagram"]).notNull(),
      copy: text("copy").notNull(),
      status: mysqlEnum("status", ["draft", "published", "failed"]).default("draft").notNull(),
      /** Platform's own post identifier (used to link out, fetch stats). */
      externalPostId: varchar("externalPostId", { length: 256 }),
      /** Direct URL to the published post on the platform. */
      externalUrl: text("externalUrl"),
      error: text("error"),
      publishedAt: timestamp("publishedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    newsletterSubscribers = mysqlTable("newsletter_subscribers", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      name: varchar("name", { length: 256 }),
      isActive: boolean("isActive").default(true).notNull(),
      segment: varchar("segment", { length: 128 }),
      source: varchar("source", { length: 128 }),
      tags: text("tags"),
      // One-click unsubscribe token (64-char URL-safe). Generated on insert.
      unsubscribeToken: varchar("unsubscribeToken", { length: 64 }).unique(),
      // Set when user clicks confirmation link (NULL = single-opt-in, never confirmed).
      confirmedAt: timestamp("confirmedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    caseStudies = mysqlTable("case_studies", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 512 }).notNull(),
      titleEn: varchar("titleEn", { length: 512 }),
      titleZh: varchar("titleZh", { length: 512 }),
      slug: varchar("slug", { length: 512 }).notNull().unique(),
      client: varchar("client", { length: 256 }),
      clientEn: varchar("clientEn", { length: 256 }),
      clientZh: varchar("clientZh", { length: 256 }),
      industry: varchar("industry", { length: 256 }),
      industryEn: varchar("industryEn", { length: 256 }),
      industryZh: varchar("industryZh", { length: 256 }),
      challenge: text("challenge"),
      challengeEn: text("challengeEn"),
      challengeZh: text("challengeZh"),
      solution: text("solution"),
      solutionEn: text("solutionEn"),
      solutionZh: text("solutionZh"),
      results: text("results"),
      resultsEn: text("resultsEn"),
      resultsZh: text("resultsZh"),
      featuredImage: text("featuredImage"),
      featuredImageAlt: varchar("featuredImageAlt", { length: 512 }),
      // Brand logo of the client — shown on the case study card + detail page
      logoImage: text("logoImage"),
      logoImageAlt: varchar("logoImageAlt", { length: 512 }),
      // JSON array of additional screenshots: [{ url, alt }, ...]
      gallery: text("gallery"),
      // JSON object of external links: { website, facebook, instagram, linkedin, ... }
      externalLinks: text("externalLinks"),
      // Year the project started — for context on the detail page
      projectYear: varchar("projectYear", { length: 16 }),
      tags: text("tags"),
      isActive: boolean("isActive").default(true).notNull(),
      sortOrder: int("sortOrder").default(0),
      metaTitle: varchar("metaTitle", { length: 512 }),
      metaTitleEn: varchar("metaTitleEn", { length: 512 }),
      metaTitleZh: varchar("metaTitleZh", { length: 512 }),
      metaDescription: text("metaDescription"),
      metaDescriptionEn: text("metaDescriptionEn"),
      metaDescriptionZh: text("metaDescriptionZh"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    aiJobs = mysqlTable("ai_jobs", {
      id: varchar("id", { length: 36 }).primaryKey(),
      // client-side UUID
      type: varchar("type", { length: 32 }).notNull(),
      // "multilang_blog_draft"
      status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending").notNull(),
      phase: varchar("phase", { length: 64 }),
      // "draft" | "editor" | null
      completedSteps: int("completedSteps").default(0).notNull(),
      totalSteps: int("totalSteps").default(6).notNull(),
      errorMessage: text("errorMessage"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    auditLeads = mysqlTable("audit_leads", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 64 }),
      company: varchar("company", { length: 256 }),
      website: text("website"),
      monthlyBudget: varchar("monthlyBudget", { length: 128 }),
      currentChallenges: text("currentChallenges"),
      goals: text("goals"),
      isContacted: boolean("isContacted").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      // Resend — transactional email (contact/audit lead notifications)
      resendApiKey: process.env.RESEND_API_KEY ?? "",
      resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      resendNotifyEmail: process.env.RESEND_NOTIFY_EMAIL ?? "",
      // Resend webhook signing secret (Svix). Set in Resend dashboard
      // under Settings → Webhooks → Signing Secret. Without it the webhook
      // 401s in production; in dev it's accepted unsigned for easy testing.
      resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
      // Cloudinary — image hosting + auto WebP/AVIF
      cloudinaryUrl: process.env.CLOUDINARY_URL ?? "",
      cloudinaryCloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
      // OpenAI — admin AI assist (blog draft, SEO meta, text improve)
      openaiApiKey: process.env.OPENAI_API_KEY ?? "",
      openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      // Admin password-based login — fallback while Manus OAuth isn't set up.
      // When both are populated, /api/auth/password-login accepts the
      // matching credentials and issues a session cookie compatible with the
      // existing OAuth-flow session schema. When empty, the endpoint refuses
      // and the public site/admin UI hides the password form.
      adminEmail: process.env.ADMIN_EMAIL ?? "",
      adminPassword: process.env.ADMIN_PASSWORD ?? "",
      // Surfaced to the client at build time as VITE_OAUTH_PORTAL_URL — used
      // by the admin login UI to decide whether to render the OAuth button or
      // the password fallback. Kept here for symmetry with other ENV reads.
      oauthPortalUrl: process.env.VITE_OAUTH_PORTAL_URL ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  checkNewsletterSubscriberExists: () => checkNewsletterSubscriberExists,
  createAiJob: () => createAiJob,
  createAuditLead: () => createAuditLead,
  createCategory: () => createCategory,
  createContactSubmission: () => createContactSubmission,
  createEmailCampaign: () => createEmailCampaign,
  createHeroSlide: () => createHeroSlide,
  createIndustry: () => createIndustry,
  createNewsletterSubscriber: () => createNewsletterSubscriber,
  createPartner: () => createPartner,
  createPost: () => createPost,
  createService: () => createService,
  createSocialPost: () => createSocialPost,
  createTechnology: () => createTechnology,
  createTestimonial: () => createTestimonial,
  createValue: () => createValue,
  deleteAuditLead: () => deleteAuditLead,
  deleteAuditLeadsBulk: () => deleteAuditLeadsBulk,
  deleteCaseStudiesBulk: () => deleteCaseStudiesBulk,
  deleteCaseStudy: () => deleteCaseStudy,
  deleteCategoriesBulk: () => deleteCategoriesBulk,
  deleteCategory: () => deleteCategory,
  deleteContactSubmission: () => deleteContactSubmission,
  deleteContactSubmissionsBulk: () => deleteContactSubmissionsBulk,
  deleteHeroSlide: () => deleteHeroSlide,
  deleteIndustriesBulk: () => deleteIndustriesBulk,
  deleteIndustry: () => deleteIndustry,
  deleteNewsletterSubscriber: () => deleteNewsletterSubscriber,
  deleteNewsletterSubscribersBulk: () => deleteNewsletterSubscribersBulk,
  deletePartner: () => deletePartner,
  deletePartnersBulk: () => deletePartnersBulk,
  deletePost: () => deletePost,
  deletePostsBulk: () => deletePostsBulk,
  deleteService: () => deleteService,
  deleteTechnologiesBulk: () => deleteTechnologiesBulk,
  deleteTechnology: () => deleteTechnology,
  deleteTestimonial: () => deleteTestimonial,
  deleteTestimonialsBulk: () => deleteTestimonialsBulk,
  deleteValue: () => deleteValue,
  getActiveCaseStudies: () => getActiveCaseStudies,
  getActiveSubscribersForCampaign: () => getActiveSubscribersForCampaign,
  getAiJob: () => getAiJob,
  getAllAuditLeads: () => getAllAuditLeads,
  getAllCaseStudies: () => getAllCaseStudies,
  getAllHeroSlides: () => getAllHeroSlides,
  getAllIndustries: () => getAllIndustries,
  getAllNewsletterSubscribers: () => getAllNewsletterSubscribers,
  getAllPages: () => getAllPages,
  getAllPartners: () => getAllPartners,
  getAllPostsAdmin: () => getAllPostsAdmin,
  getAllSiteSettings: () => getAllSiteSettings,
  getAllTechnologies: () => getAllTechnologies,
  getAllTestimonials: () => getAllTestimonials,
  getAllValues: () => getAllValues,
  getCampaignEventStats: () => getCampaignEventStats,
  getCaseStudyBySlug: () => getCaseStudyBySlug,
  getCategories: () => getCategories,
  getContactSubmissions: () => getContactSubmissions,
  getDb: () => getDb,
  getHeroSlides: () => getHeroSlides,
  getIndustries: () => getIndustries,
  getLatestSocialPostsForBlogPost: () => getLatestSocialPostsForBlogPost,
  getNewsletterSubscribers: () => getNewsletterSubscribers,
  getPageSeo: () => getPageSeo,
  getPartners: () => getPartners,
  getPostBySlug: () => getPostBySlug,
  getPosts: () => getPosts,
  getServiceBySlug: () => getServiceBySlug,
  getServices: () => getServices,
  getSiteSetting: () => getSiteSetting,
  getSocialAccountByPlatform: () => getSocialAccountByPlatform,
  getTechnologies: () => getTechnologies,
  getTestimonials: () => getTestimonials,
  getUserByOpenId: () => getUserByOpenId,
  getValues: () => getValues,
  listEmailCampaigns: () => listEmailCampaigns,
  listSocialAccounts: () => listSocialAccounts,
  markAuditLeadContacted: () => markAuditLeadContacted,
  markContactRead: () => markContactRead,
  recordEmailEvent: () => recordEmailEvent,
  unsubscribeByToken: () => unsubscribeByToken,
  updateAiJob: () => updateAiJob,
  updateCategory: () => updateCategory,
  updateEmailCampaign: () => updateEmailCampaign,
  updateHeroSlide: () => updateHeroSlide,
  updateIndustry: () => updateIndustry,
  updateNewsletterSubscriberSegment: () => updateNewsletterSubscriberSegment,
  updatePartner: () => updatePartner,
  updatePost: () => updatePost,
  updateService: () => updateService,
  updateSocialPost: () => updateSocialPost,
  updateTechnology: () => updateTechnology,
  updateTestimonial: () => updateTestimonial,
  updateValue: () => updateValue,
  upsertCaseStudy: () => upsertCaseStudy,
  upsertPageSeo: () => upsertPageSeo,
  upsertSiteSetting: () => upsertSiteSetting,
  upsertUser: () => upsertUser
});
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values_ = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values_[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values_.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values_.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values_.role = "admin";
      updateSet.role = "admin";
    }
    if (!values_.lastSignedIn) values_.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values_).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getSiteSetting(key) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0]?.value ?? null;
}
async function getAllSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}
async function upsertSiteSetting(key, value) {
  const db = await getDb();
  if (!db) return;
  await db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}
async function getPageSeo(slug) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0] ?? null;
}
async function getAllPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pages);
}
async function upsertPageSeo(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pages).values(data).onDuplicateKeyUpdate({ set: data });
}
async function getHeroSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(heroSlides.sortOrder);
}
async function getAllHeroSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
}
async function createHeroSlide(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(heroSlides).values(data);
  return result;
}
async function updateHeroSlide(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(heroSlides).set(data).where(eq(heroSlides.id, id));
}
async function deleteHeroSlide(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
}
async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.sortOrder);
}
async function getServiceBySlug(slug) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result[0] ?? null;
}
async function createService(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(services).values(data);
  return result;
}
async function updateService(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(services).set(data).where(eq(services.id, id));
}
async function deleteService(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(services).where(eq(services.id, id));
}
async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}
async function createCategory(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(categories).values(data);
  return result;
}
async function updateCategory(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(categories).set(data).where(eq(categories.id, id));
}
async function deleteCategory(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(categories).where(eq(categories.id, id));
}
async function getPosts(opts = {}) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0 };
  const { page = 1, limit = 10, categoryId, status = "published" } = opts;
  const offset = (page - 1) * limit;
  const conditions = [eq(posts.status, status)];
  if (categoryId) conditions.push(eq(posts.categoryId, categoryId));
  const [postList, countResult] = await Promise.all([
    db.select().from(posts).where(and(...conditions)).orderBy(desc(posts.publishedAt)).limit(limit).offset(offset),
    db.select({ count: sql`count(*)` }).from(posts).where(and(...conditions))
  ]);
  return { posts: postList, total: Number(countResult[0]?.count ?? 0) };
}
async function getPostBySlug(slug) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0] ?? null;
}
async function getAllPostsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}
async function createPost(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(posts).values(data);
  return result;
}
async function updatePost(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set(data).where(eq(posts.id, id));
}
async function deletePost(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(posts).where(eq(posts.id, id));
}
async function getTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(testimonials.sortOrder);
}
async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(testimonials.sortOrder);
}
async function createTestimonial(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(testimonials).values(data);
  return result;
}
async function updateTestimonial(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}
async function deleteTestimonial(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(testimonials).where(eq(testimonials.id, id));
}
async function getPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).where(eq(partners.isActive, true)).orderBy(partners.sortOrder);
}
async function getAllPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).orderBy(partners.sortOrder);
}
async function createPartner(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(partners).values(data);
  return result;
}
async function updatePartner(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(partners).set(data).where(eq(partners.id, id));
}
async function deletePartner(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(partners).where(eq(partners.id, id));
}
async function getIndustries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(industries).where(eq(industries.isActive, true)).orderBy(industries.sortOrder);
}
async function getAllIndustries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(industries).orderBy(industries.sortOrder);
}
async function createIndustry(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(industries).values(data);
  return result;
}
async function updateIndustry(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(industries).set(data).where(eq(industries.id, id));
}
async function deleteIndustry(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(industries).where(eq(industries.id, id));
}
async function getTechnologies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technologies).where(eq(technologies.isActive, true)).orderBy(technologies.sortOrder);
}
async function getAllTechnologies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technologies).orderBy(technologies.sortOrder);
}
async function createTechnology(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(technologies).values(data);
  return result;
}
async function updateTechnology(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(technologies).set(data).where(eq(technologies.id, id));
}
async function deleteTechnology(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(technologies).where(eq(technologies.id, id));
}
async function getValues() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(values).where(eq(values.isActive, true)).orderBy(values.sortOrder);
}
async function getAllValues() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(values).orderBy(values.sortOrder);
}
async function createValue(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(values).values(data);
  return result;
}
async function updateValue(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(values).set(data).where(eq(values.id, id));
}
async function deleteValue(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(values).where(eq(values.id, id));
}
async function createContactSubmission(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(contactSubmissions).values(data);
  return result;
}
async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}
async function markContactRead(id) {
  const db = await getDb();
  if (!db) return;
  await db.update(contactSubmissions).set({ isRead: true }).where(eq(contactSubmissions.id, id));
}
async function deleteContactSubmission(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
}
async function createNewsletterSubscriber(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(newsletterSubscribers).values(data);
  return result;
}
async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)).orderBy(desc(newsletterSubscribers.createdAt));
}
async function getAllNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}
async function checkNewsletterSubscriberExists(email) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email)).limit(1);
  return result.length > 0;
}
async function deleteNewsletterSubscriber(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
}
async function updateNewsletterSubscriberSegment(data) {
  const db = await getDb();
  if (!db) return;
  const { id, ...rest } = data;
  await db.update(newsletterSubscribers).set(rest).where(eq(newsletterSubscribers.id, id));
}
async function getActiveSubscribersForCampaign(segment) {
  const db = await getDb();
  if (!db) return [];
  const where = segment ? and(eq(newsletterSubscribers.isActive, true), eq(newsletterSubscribers.segment, segment)) : eq(newsletterSubscribers.isActive, true);
  return db.select({
    id: newsletterSubscribers.id,
    email: newsletterSubscribers.email,
    name: newsletterSubscribers.name,
    unsubscribeToken: newsletterSubscribers.unsubscribeToken
  }).from(newsletterSubscribers).where(where);
}
async function createEmailCampaign(data) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(emailCampaigns).values({
    subject: data.subject,
    html: data.html,
    text: data.text,
    segment: data.segment,
    sentByUserId: data.sentByUserId ?? null,
    status: "draft"
  });
  return result.insertId;
}
async function updateEmailCampaign(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(emailCampaigns).set(data).where(eq(emailCampaigns.id, id));
}
async function listEmailCampaigns() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
}
async function recordEmailEvent(data) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(emailEvents).values({
    campaignId: data.campaignId,
    recipient: data.recipient,
    eventType: data.eventType,
    resendMessageId: data.resendMessageId ?? null,
    rawData: data.rawData ?? null
  });
  return result.insertId ?? null;
}
async function getCampaignEventStats(campaignId) {
  const db = await getDb();
  if (!db) {
    return { delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0 };
  }
  const rows = await db.select({
    recipient: emailEvents.recipient,
    eventType: emailEvents.eventType
  }).from(emailEvents).where(eq(emailEvents.campaignId, campaignId));
  const seen = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (!seen.has(r.eventType)) seen.set(r.eventType, /* @__PURE__ */ new Set());
    seen.get(r.eventType).add(r.recipient);
  }
  return {
    delivered: seen.get("email.delivered")?.size ?? 0,
    opened: seen.get("email.opened")?.size ?? 0,
    clicked: seen.get("email.clicked")?.size ?? 0,
    bounced: seen.get("email.bounced")?.size ?? 0,
    complained: seen.get("email.complained")?.size ?? 0
  };
}
async function unsubscribeByToken(token) {
  const db = await getDb();
  if (!db) return null;
  const found = await db.select({ id: newsletterSubscribers.id, email: newsletterSubscribers.email }).from(newsletterSubscribers).where(eq(newsletterSubscribers.unsubscribeToken, token)).limit(1);
  if (found.length === 0) return null;
  await db.update(newsletterSubscribers).set({ isActive: false }).where(eq(newsletterSubscribers.id, found[0].id));
  return found[0].email;
}
async function getAllCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies).orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
}
async function getActiveCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies).where(eq(caseStudies.isActive, true)).orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
}
async function getCaseStudyBySlug(slug) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
  return result[0] ?? null;
}
async function upsertCaseStudy(data) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    const { id, ...rest } = data;
    await db.update(caseStudies).set(rest).where(eq(caseStudies.id, id));
  } else {
    await db.insert(caseStudies).values(data);
  }
}
async function deleteCaseStudy(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(caseStudies).where(eq(caseStudies.id, id));
}
async function createAuditLead(data) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(auditLeads).values(data);
  return result;
}
async function getAllAuditLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLeads).orderBy(desc(auditLeads.createdAt));
}
async function markAuditLeadContacted(id) {
  const db = await getDb();
  if (!db) return;
  await db.update(auditLeads).set({ isContacted: true }).where(eq(auditLeads.id, id));
}
async function deleteAuditLead(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(auditLeads).where(eq(auditLeads.id, id));
}
async function bulkDeleteByIds(table, idCol, ids) {
  if (ids.length === 0) return 0;
  const db = await getDb();
  if (!db) return 0;
  await db.delete(table).where(inArray(idCol, ids));
  return ids.length;
}
async function deletePostsBulk(ids) {
  return bulkDeleteByIds(posts, posts.id, ids);
}
async function deleteCaseStudiesBulk(ids) {
  return bulkDeleteByIds(caseStudies, caseStudies.id, ids);
}
async function deleteContactSubmissionsBulk(ids) {
  return bulkDeleteByIds(contactSubmissions, contactSubmissions.id, ids);
}
async function deleteNewsletterSubscribersBulk(ids) {
  return bulkDeleteByIds(newsletterSubscribers, newsletterSubscribers.id, ids);
}
async function deleteAuditLeadsBulk(ids) {
  return bulkDeleteByIds(auditLeads, auditLeads.id, ids);
}
async function deleteCategoriesBulk(ids) {
  return bulkDeleteByIds(categories, categories.id, ids);
}
async function deleteTestimonialsBulk(ids) {
  return bulkDeleteByIds(testimonials, testimonials.id, ids);
}
async function deletePartnersBulk(ids) {
  return bulkDeleteByIds(partners, partners.id, ids);
}
async function deleteIndustriesBulk(ids) {
  return bulkDeleteByIds(industries, industries.id, ids);
}
async function deleteTechnologiesBulk(ids) {
  return bulkDeleteByIds(technologies, technologies.id, ids);
}
async function listSocialAccounts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(socialAccounts).orderBy(socialAccounts.platform);
}
async function getSocialAccountByPlatform(platform) {
  const db = await getDb();
  if (!db) return void 0;
  const rows = await db.select().from(socialAccounts).where(eq(socialAccounts.platform, platform)).limit(1);
  return rows[0];
}
async function getLatestSocialPostsForBlogPost(postId) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(socialPosts).where(eq(socialPosts.postId, postId)).orderBy(desc(socialPosts.createdAt));
  const latestByPlatform = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (!latestByPlatform.has(r.platform)) {
      latestByPlatform.set(r.platform, r);
    }
  }
  return Array.from(latestByPlatform.values());
}
async function createSocialPost(data) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(socialPosts).values({
    postId: data.postId,
    platform: data.platform,
    copy: data.copy,
    status: data.status ?? "draft"
  });
  return result.insertId ?? null;
}
async function updateSocialPost(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(socialPosts).set(data).where(eq(socialPosts.id, id));
}
async function createAiJob(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(aiJobs).values({
    id: data.id,
    type: data.type,
    totalSteps: data.totalSteps ?? 6,
    status: "running",
    completedSteps: 0
  });
}
async function updateAiJob(id, patch) {
  const db = await getDb();
  if (!db) return;
  await db.update(aiJobs).set(patch).where(eq(aiJobs.id, id));
}
async function getAiJob(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(aiJobs).where(eq(aiJobs.id, id)).limit(1);
  return rows[0] ?? null;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/brandVoice.ts
var brandVoice_exports = {};
__export(brandVoice_exports, {
  EMPTY_BRAND_VOICE: () => EMPTY_BRAND_VOICE,
  loadBrandVoice: () => loadBrandVoice,
  renderBrandContext: () => renderBrandContext,
  saveBrandVoice: () => saveBrandVoice
});
async function loadBrandVoice() {
  const raw = await getSiteSetting(SETTING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      companyDescription: parsed.companyDescription ?? "",
      audience: parsed.audience ?? "",
      toneOfVoice: parsed.toneOfVoice ?? "",
      dos: Array.isArray(parsed.dos) ? parsed.dos : [],
      donts: Array.isArray(parsed.donts) ? parsed.donts : [],
      examples: {
        linkedin: parsed.examples?.linkedin ?? [],
        facebook: parsed.examples?.facebook ?? [],
        instagram: parsed.examples?.instagram ?? [],
        blog: parsed.examples?.blog ?? []
      }
    };
  } catch (err) {
    console.warn("[brandVoice] Failed to parse brand_voice setting:", err);
    return null;
  }
}
async function saveBrandVoice(voice) {
  await upsertSiteSetting(SETTING_KEY, JSON.stringify(voice));
}
function renderBrandContext(voice, platform) {
  if (!voice) return "";
  const sections = ["=== BRAND KONTEXTUS ==="];
  if (voice.companyDescription.trim()) {
    sections.push(`C\xC9GLE\xCDR\xC1S:
${voice.companyDescription.trim()}`);
  }
  if (voice.audience.trim()) {
    sections.push(`C\xC9LK\xD6Z\xD6NS\xC9G:
${voice.audience.trim()}`);
  }
  if (voice.toneOfVoice.trim()) {
    sections.push(`HANG / ST\xCDLUS:
${voice.toneOfVoice.trim()}`);
  }
  if (voice.dos.length > 0) {
    sections.push(`MINDIG csin\xE1ld:
${voice.dos.map((d) => `- ${d}`).join("\n")}`);
  }
  if (voice.donts.length > 0) {
    sections.push(`SOSE csin\xE1ld:
${voice.donts.map((d) => `- ${d}`).join("\n")}`);
  }
  if (platform) {
    const examples = voice.examples[platform] ?? [];
    if (examples.length > 0) {
      const exampleText = examples.map((e, i) => {
        const header = e.context ? `--- P\xE9lda ${i + 1} (${e.context}) ---` : `--- P\xE9lda ${i + 1} ---`;
        return `${header}
${e.text.trim()}`;
      }).join("\n\n");
      sections.push(
        `KOR\xC1BBI SIKERES ${platform.toUpperCase()} POSZTOK (ezeket vedd mintak\xE9nt a st\xEDlushoz, NE m\xE1sold sz\xF3 szerint):

${exampleText}`
      );
    }
  }
  sections.push("=== /BRAND KONTEXTUS ===\n");
  return sections.join("\n\n");
}
var EMPTY_BRAND_VOICE, SETTING_KEY;
var init_brandVoice = __esm({
  "server/_core/brandVoice.ts"() {
    "use strict";
    init_db();
    EMPTY_BRAND_VOICE = {
      companyDescription: "",
      audience: "",
      toneOfVoice: "",
      dos: [],
      donts: [],
      examples: { linkedin: [], facebook: [], instagram: [], blog: [] }
    };
    SETTING_KEY = "brand_voice";
  }
});

// server/_core/serverless.ts
import "dotenv/config";

// server/_core/app.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/_diag/me", async (req, res) => {
    let user;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      res.status(401).json({
        authenticated: false,
        hint: "Nincs akt\xEDv session. L\xE9pj be: nyisd meg /admin-t, jelentkezz be Manus-szal, majd h\xEDvd \xFAjra ezt az endpointot."
      });
      return;
    }
    res.json({
      authenticated: true,
      openId: user.openId,
      name: user.name,
      email: user.email,
      role: user.role,
      loginMethod: user.loginMethod,
      hint: user.role === "admin" ? `Ez a user m\xE1r admin. OWNER_OPEN_ID=${user.openId}` : `M\xE1sold ezt az openId-t az .env OWNER_OPEN_ID v\xE1ltoz\xF3ba, majd ind\xEDtsd \xFAjra a szervert \u2014 ez a user automatikusan admin lesz.`
    });
  });
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      let redirectTo = "/";
      try {
        const decoded = Buffer.from(state, "base64").toString("utf-8");
        if (decoded.startsWith("{")) {
          const parsed = JSON.parse(decoded);
          if (parsed.returnPath) {
            redirectTo = parsed.returnPath;
          } else if (parsed.redirectUri) {
            const url = new URL(parsed.redirectUri);
            redirectTo = url.pathname || "/";
          }
        } else {
          const url = new URL(decoded);
          redirectTo = url.pathname || "/";
        }
      } catch {
        redirectTo = "/";
      }
      res.redirect(302, redirectTo);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";

// server/_core/email.ts
init_env();
var RESEND_ENDPOINT = "https://api.resend.com/emails";
function isEmailConfigured() {
  return Boolean(ENV.resendApiKey && ENV.resendNotifyEmail);
}
async function sendEmail(payload) {
  const result = await sendEmailWithId(payload);
  return result.ok;
}
function resolveFromAddress() {
  const raw = (ENV.resendFromEmail || "").trim();
  if (!raw) return "onboarding@resend.dev";
  if (/<[^@\s]+@[^@\s]+>/.test(raw) || /^[^@\s]+@[^@\s]+$/.test(raw)) {
    return raw;
  }
  console.warn(
    `[Email] RESEND_FROM_EMAIL has no email address (got "${raw}") \u2014 wrapping with default <onboarding@resend.dev>. Fix the env var to "Name <user@your-verified-domain.tld>".`
  );
  return `${raw} <onboarding@resend.dev>`;
}
async function sendEmailWithId(payload) {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY not set \u2014 skipping email send");
    return { ok: false };
  }
  const to = payload.to ?? ENV.resendNotifyEmail;
  if (!to || Array.isArray(to) && to.length === 0) {
    console.warn("[Email] No recipient (set RESEND_NOTIFY_EMAIL or pass `to`) \u2014 skipping");
    return { ok: false };
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: resolveFromAddress(),
        to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
        tags: payload.tags
      })
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[Email] Resend ${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
      return { ok: false };
    }
    const data = await res.json().catch(() => null);
    return { ok: true, messageId: data?.id };
  } catch (err) {
    console.warn("[Email] Resend request failed:", err);
    return { ok: false };
  }
}
function renderNotificationHtml(content) {
  const escaped = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const paragraphs = withBold.split(/\n\s*\n/).map((p) => `<p style="margin:0 0 12px 0;line-height:1.55;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">${p.replace(/\n/g, "<br>")}</p>`).join("\n");
  return `<div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff">
  <div style="border-left:3px solid #14B8A6;padding-left:16px;margin-bottom:20px">
    <span style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:12px;color:#6b7280;letter-spacing:0.06em;text-transform:uppercase">G2A Marketing \u2014 automatikus \xE9rtes\xEDt\xE9s</span>
  </div>
  ${paragraphs}
  <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:11px;color:#9ca3af">Ezt az emailt a g2amarketing.hu admin rendszere k\xFCldte automatikusan.</p>
</div>`;
}

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content, replyTo: input.replyTo };
};
async function sendViaForge(title, content) {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) return false;
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Forge failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Forge error:", error);
    return false;
  }
}
async function sendViaResend(title, content, replyTo) {
  if (!isEmailConfigured()) return false;
  return sendEmail({
    subject: title,
    html: renderNotificationHtml(content),
    text: content,
    replyTo
  });
}
async function notifyOwner(payload) {
  const { title, content, replyTo } = validatePayload(payload);
  const hasForge = Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
  const hasResend = isEmailConfigured();
  if (!hasForge && !hasResend) {
    console.warn(
      "[Notification] No transport configured (set BUILT_IN_FORGE_API_KEY or RESEND_API_KEY+RESEND_NOTIFY_EMAIL). Lead saved to DB only."
    );
    return false;
  }
  if (hasForge) {
    const ok = await sendViaForge(title, content);
    if (ok) return true;
    if (hasResend) {
      console.warn("[Notification] Forge failed, retrying via Resend");
      return sendViaResend(title, content, replyTo);
    }
    return false;
  }
  return sendViaResend(title, content, replyTo);
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/storage.ts
init_env();
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
init_db();

// server/_core/translate.ts
var DEEPL_FREE_HOST = "https://api-free.deepl.com/v2/translate";
var DEEPL_PRO_HOST = "https://api.deepl.com/v2/translate";
function isTranslateConfigured() {
  return !!process.env.DEEPL_API_KEY;
}
async function translate(text2, target, sourceLang = "hu") {
  const key = process.env.DEEPL_API_KEY;
  if (!key) {
    throw new Error("DEEPL_API_KEY not set \u2014 auto-translate is disabled");
  }
  const trimmed = text2.trim();
  if (!trimmed) return "";
  const host = process.env.DEEPL_API_URL || (key.endsWith(":fx") ? DEEPL_FREE_HOST : DEEPL_PRO_HOST);
  const body = new URLSearchParams();
  body.set("text", trimmed);
  body.set("source_lang", sourceLang.toUpperCase());
  body.set("target_lang", target === "zh" ? "ZH" : "EN-US");
  if (/<[a-z][^>]*>/i.test(trimmed)) body.set("tag_handling", "html");
  const res = await fetch(host, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`DeepL ${res.status}: ${errorText.slice(0, 200) || res.statusText}`);
  }
  const data = await res.json();
  return data.translations[0]?.text ?? "";
}

// server/_core/cloudinary.ts
init_env();
import { createHash } from "node:crypto";
var cached = null;
function isCloudinaryConfigured() {
  return Boolean(ENV.cloudinaryUrl) || Boolean(parseConfig());
}
function parseConfig() {
  if (cached) return cached;
  const raw = ENV.cloudinaryUrl;
  if (!raw) return null;
  const m = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) {
    console.warn("[Cloudinary] Invalid CLOUDINARY_URL format \u2014 expected cloudinary://key:secret@cloud_name");
    return null;
  }
  cached = { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  return cached;
}
function getConfig() {
  const c = parseConfig();
  if (!c) throw new Error("Cloudinary not configured \u2014 set CLOUDINARY_URL in .env");
  return c;
}
function signParams(params, secret) {
  const sorted = Object.keys(params).sort();
  const toSign = sorted.map((k) => `${k}=${params[k]}`).join("&") + secret;
  return createHash("sha1").update(toSign).digest("hex");
}
async function cloudinaryUpload(data, contentType, fileName, folder = "g2a-uploads") {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp2 = Math.floor(Date.now() / 1e3);
  const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 100) || `upload_${timestamp2}`;
  const publicId = `${baseName}_${timestamp2}`;
  const signedParams = {
    folder,
    public_id: publicId,
    timestamp: timestamp2
  };
  const signature2 = signParams(signedParams, apiSecret);
  const form = new FormData();
  const blob = new Blob([data], { type: contentType });
  form.append("file", blob, fileName);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp2));
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature2);
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  const json2 = await res.json();
  return {
    publicId: json2.public_id,
    url: json2.url,
    secureUrl: json2.secure_url,
    width: json2.width,
    height: json2.height,
    format: json2.format,
    bytes: json2.bytes
  };
}

// server/_core/ai.ts
var ENDPOINT = "https://api.openai.com/v1/chat/completions";
function isAiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}
function getAiModel() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}
var DEFAULT_CHAT_TIMEOUT_MS = 5e4;
async function chat(messages, opts = {}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set \u2014 AI features are disabled");
  const body = {
    model: getAiModel(),
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 2e3
  };
  if (opts.jsonMode) body.response_format = { type: "json_object" };
  const timeoutMs = opts.timeoutMs ?? DEFAULT_CHAT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`OpenAI timeout after ${timeoutMs}ms \u2014 try a shorter prompt or smaller maxTokens`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }
  const json2 = await res.json();
  const text2 = json2.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text2) throw new Error("OpenAI returned empty response");
  return text2;
}
var LANG_NAMES = { hu: "magyar", en: "English", zh: "\u4E2D\u6587" };
function markdownToHtml(raw) {
  if (!raw) return raw;
  const looksHtml = /^\s*<(p|h2|h3|ul|ol|div)\b/i.test(raw);
  const hasMdMarkers = /(^|\n)\s{0,3}(#{2,3}\s|[-*]\s|\d+\.\s)/.test(raw) || /\*\*[^*]+\*\*/.test(raw);
  if (looksHtml && !hasMdMarkers) return raw;
  const blocks = raw.replace(/\r\n/g, "\n").split(/\n\s*\n+/);
  const out = [];
  for (const blockRaw of blocks) {
    const block = blockRaw.trim();
    if (!block) continue;
    const h3 = block.match(/^###\s+(.+)$/);
    if (h3) {
      out.push(`<h3>${inlineMd(h3[1])}</h3>`);
      continue;
    }
    const h2 = block.match(/^##\s+(.+)$/);
    if (h2) {
      out.push(`<h2>${inlineMd(h2[1])}</h2>`);
      continue;
    }
    const h1 = block.match(/^#\s+(.+)$/);
    if (h1) {
      out.push(`<h2>${inlineMd(h1[1])}</h2>`);
      continue;
    }
    const bulletLines = block.split("\n");
    if (bulletLines.every((l) => /^\s{0,3}[-*]\s+/.test(l))) {
      const items = bulletLines.map((l) => `<li>${inlineMd(l.replace(/^\s{0,3}[-*]\s+/, ""))}</li>`).join("");
      out.push(`<ul>${items}</ul>`);
      continue;
    }
    if (bulletLines.every((l) => /^\s{0,3}\d+\.\s+/.test(l))) {
      const items = bulletLines.map((l) => `<li>${inlineMd(l.replace(/^\s{0,3}\d+\.\s+/, ""))}</li>`).join("");
      out.push(`<ol>${items}</ol>`);
      continue;
    }
    if (/^<(p|h2|h3|ul|ol|div|blockquote)/i.test(block)) {
      out.push(block);
      continue;
    }
    out.push(`<p>${inlineMd(block.replace(/\n/g, " "))}</p>`);
  }
  return out.join("\n");
}
function inlineMd(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/`([^`]+)`/g, "$1");
}
function languageLock(lang) {
  switch (lang) {
    case "zh":
      return "\u26A0 \u5173\u952E\u8BED\u8A00\u8981\u6C42 \u26A0\n\u4F60\u5FC5\u987B\u7528\u7B80\u4F53\u4E2D\u6587\u64B0\u5199\u6240\u6709\u8F93\u51FA\u5185\u5BB9\u3002title\u3001excerpt\u3001content\u3001metaTitle\u3001metaDescription \u5B57\u6BB5\u4E2D\u7684\u6BCF\u4E00\u4E2A\u5B57\u90FD\u5FC5\u987B\u662F\u7B80\u4F53\u4E2D\u6587\u3002\u7EDD\u5BF9\u4E0D\u80FD\u4F7F\u7528\u5308\u7259\u5229\u8BED\u3001\u82F1\u8BED\u6216\u4EFB\u4F55\u5176\u4ED6\u8BED\u8A00\u3002\u5373\u4F7F\u4E0B\u9762\u7684\u6307\u4EE4\u662F\u5308\u7259\u5229\u8BED\u5199\u7684\uFF0C\u4F60\u7684\u56DE\u7B54\u4E5F\u5FC5\u987B\u5B8C\u5168\u662F\u7B80\u4F53\u4E2D\u6587\u3002\n";
    case "en":
      return "\u26A0 CRITICAL LANGUAGE REQUIREMENT \u26A0\nYou MUST write ALL output in English. Every field (title, excerpt, content, metaTitle, metaDescription) must be in English only. Do NOT use Hungarian or any other language. Even though the instructions below are in Hungarian, your entire response must be in English.\n";
    case "hu":
    default:
      return "";
  }
}
async function generateBlogDraft(input) {
  const lang = input.lang ?? "hu";
  const wordCount = input.wordCount ?? 1050;
  const tone = input.tone ?? "professional";
  const audience = input.audience || "magyar KKV-tulajdonosok, c\xE9gvezet\u0151k, marketingvezet\u0151k \xE9s d\xF6nt\xE9shoz\xF3k";
  const { loadBrandVoice: loadBrandVoice2, renderBrandContext: renderBrandContext2 } = await Promise.resolve().then(() => (init_brandVoice(), brandVoice_exports));
  const brandContext = renderBrandContext2(await loadBrandVoice2(), "blog");
  const baseSystem = `${languageLock(lang)}Te a G2A Marketing p\xE9csi B2B marketing \xFCgyn\xF6ks\xE9g senior tartalom-strat\xE9g\xE1ja \xE9s blog-szerz\u0151je vagy. A G2A magyar marketing tan\xE1csad\xE1s, SEO, k\xF6z\xF6ss\xE9gi m\xE9dia, weboldal-fejleszt\xE9s \xE9s AI-megold\xE1sok ter\xFClet\xE9n ad szolg\xE1ltat\xE1st. Mindig a l\xE1togat\xF3t sz\xF3l\xEDtjuk meg te-form\xE1ban (NEM \xF6n\xF6z\xFCnk).

\u26A0 KIMENETI NYELV
A teljes v\xE1lasz ${LANG_NAMES[lang]} nyelven. ${lang === "zh" ? "(\u5FC5\u987B\u662F\u7B80\u4F53\u4E2D\u6587 \u2014 Simplified Chinese.)" : lang === "en" ? "(English only \u2014 no Hungarian leakage.)" : ""}

K\xD6Z\xD6NS\xC9G
${audience}. Gyakorlati, \xFCzletileg hasznos tan\xE1csokat keresnek \u2014 NEM akad\xE9miai sz\xF6veget. A c\xE9l: seg\xEDteni tiszt\xE1bban l\xE1tni a probl\xE9m\xE1t \xE9s d\xF6nt\xE9st hozni.

ST\xCDLUS \u2014 HubSpot-szer\u0171, emberi B2B hangv\xE9tel:
- er\u0151s, probl\xE9maorient\xE1lt nyit\xE1s (NEM defin\xEDci\xF3)
- k\xF6zvetlen, de nem t\xFAl laza megsz\xF3lal\xE1s (te-form\xE1ban)
- gyakorlati p\xE9ld\xE1k, magyar KKV-kontextusb\xF3l
- j\xF3l tagolt, m\xE9gis \xD6SSZEF\xDCGG\u0150 gondolatmenet \u2014 egyik gondolat vezessen a m\xE1sikhoz
- minden alc\xEDm alatt VAL\xD3DI magyar\xE1zat legyen, ne csak felsorol\xE1s
- legyen benne szakmai v\xE9lem\xE9ny, NE csak semleges \xF6sszefoglal\xE1s
- v\xE1ltozatos mondathossz
- \xFCzleti realit\xE1s: k\xF6lts\xE9g, kapacit\xE1s, piacismeret, d\xF6nt\xE9shoz\xF3i bizonytalans\xE1g, verseny, marketingcsatorn\xE1k, m\xE1rkapozicion\xE1l\xE1s

\u{1F6AB} SZIGOR\xDAAN TILTOTT AI-SZAG\xDA FORDULATOK (NE haszn\xE1ld egyiket sem):
- "napjainkban egyre fontosabb"
- "kulcsfontoss\xE1g\xFA szerepet j\xE1tszik"
- "sz\xE1mos kih\xEDv\xE1s \xE1ll el\u0151tt\xFCk"
- "a megfelel\u0151 strat\xE9gia elengedhetetlen"
- "a digit\xE1lis kor"
- "a mai gyorsan v\xE1ltoz\xF3 vil\xE1gban"
- "felfedezz\xFCk", "felt\xE1rjuk", "elm\xE9lyed\xFCnk"
- "fontos megjegyezni, hogy", "\xE9rdemes kiemelni"
- "\xF6sszefoglalva", "konkl\xFAzi\xF3k\xE9nt"
- generikus tan\xE1csad\xF3i k\xF6zhelyek

\u2705 HELYETTE: konkr\xE9t, term\xE9szetes, emberi logik\xE1j\xFA megfogalmaz\xE1s. \xC9letszer\u0171 \xFCzleti helyzet, provokat\xEDv meg\xE1llap\xEDt\xE1s, gyakori vezet\u0151i t\xE9ved\xE9s.

SZERKEZET (k\xF6telez\u0151):

1. C\xCDM (SEO c\xEDm) \u2014 figyelemfelkelt\u0151, konkr\xE9t, \xFCzleti szempontb\xF3l relev\xE1ns; max 65 karakter; NE legyen \xE1ltal\xE1nos.
2. META LE\xCDR\xC1S \u2014 max 155 karakter; tartalmazza a f\u0151 probl\xE9m\xE1t \xE9s az olvas\xF3i hasznot.
3. KIVONAT (lead) \u2014 1-2 mondat (max 200 karakter), a teljes cikk l\xE9nyege.
4. BEVEZET\u0150 (a content elej\xE9n) \u2014 2-3 bekezd\xE9s. NE defin\xEDci\xF3val kezdj. Kezdj egy \xE9letszer\u0171 \xFCzleti helyzettel, provokat\xEDv meg\xE1llap\xEDt\xE1ssal vagy gyakori vezet\u0151i t\xE9ved\xE9ssel. Mutasd meg, mi\xE9rt fontos a t\xE9ma a c\xE9lk\xF6z\xF6ns\xE9gnek.
5. F\u0150 R\xC9SZ \u2014 5-7 nagyobb tartalmi blokk (<h2> alfejezet). Minden blokkban:
   - er\u0151s, konkr\xE9t alc\xEDm
   - magyar\xE1zd el a probl\xE9m\xE1t emberi, \xFCzleti nyelven
   - adj konkr\xE9t p\xE9ld\xE1t vagy tipikus magyar KKV-helyzetet
   - \xEDrd le, mit \xE9rdemes m\xE1sk\xE9pp csin\xE1lni
   - ker\xFCld a t\xFAl hossz\xFA felsorol\xE1sokat
   NE \xEDrj minden ponthoz k\xFCl\xF6n "tippek" list\xE1t. Csak akkor haszn\xE1lj <ul>/<ol> list\xE1t, ha t\xE9nyleg seg\xEDti az olvashat\xF3s\xE1got. A cikk alapvet\u0151en foly\xF3, \xF6sszef\xFCgg\u0151 sz\xF6veg legyen.
6. GYAKORLATI R\xC9SZ (utols\xF3 el\u0151tti blokk) \u2014 "Mit tegy\xE9l most?" alc\xEDm alatt egy r\xF6vid <ol> ellen\u0151rz\u0151lista 4-6 konkr\xE9t l\xE9p\xE9ssel.
7. Z\xC1R\xC1S (utols\xF3 <h2>) \u2014 NE \xE1ltal\xE1nos motiv\xE1ci\xF3s mondattal z\xE1rj. Foglald \xF6ssze er\u0151s szakmai \xE1ll\xEDt\xE1ssal, mi a t\xE9ma val\xF3di tanuls\xE1ga. A v\xE9g\xE9n legyen term\xE9szetes, NEM tolakod\xF3 CTA a G2A Marketing fel\xE9. CTA p\xE9lda: "Ha szeretn\xE9d l\xE1tni, hogy a te c\xE9ged eset\xE9ben hol akad el a n\xF6veked\xE9s, a G2A Marketing seg\xEDt felt\xE9rk\xE9pezni a piacot, az \xFCzeneteket \xE9s a digit\xE1lis jelenl\xE9t gyenge pontjait."

\u26A0 TERJEDELEM: ${wordCount} sz\xF3 (a 900-1200 s\xE1vban). Ne r\xF6vid\xEDts. Ne t\xFAlozz, ne \xEDg\xE9rj garant\xE1lt sikert.

\u26A0 HTML FORM\xC1TUM (content mez\u0151)
A "content" mez\u0151ben TISZTA HTML markup. SZIGOR\xDAAN TILOS markdown szintaxis ("##", "**...**", "- ", backtick). A BlogPostPage \`dangerouslySetInnerHTML\`-lel rendereli \u2014 a markdown sz\xF3r\xF3l sz\xF3ra megjelenne.

Engedett tagek: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">.
NE add hozz\xE1 a H1-et \u2014 azt a cikk \`title\` mez\u0151je adja.
Minden bekezd\xE9st <p>...</p> tag fogjon k\xF6zre.

KIMENETI JSON \u2014 CSAK ezt a s\xE9m\xE1t add vissza:
{
  "title": "...",                     // SEO c\xEDm, max 65 karakter
  "excerpt": "...",                   // Lead / kivonat, max 200 karakter
  "content": "<p>...</p>...",         // Teljes HTML blogbejegyz\xE9s, ~${wordCount} sz\xF3, a CTA-val a v\xE9g\xE9n
  "metaTitle": "...",                 // SEO meta c\xEDm, max 60 karakter
  "metaDescription": "...",           // Meta le\xEDr\xE1s, 140-155 karakter
  "cta": "...",                       // A javasolt CTA mondatban-k\xE9t mondatban (ugyanaz, ami a content v\xE9g\xE9n szerepel)
  "alternativeTitles": ["...", "...", "...", "...", "..."]  // 5 alternat\xEDv c\xEDm\xF6tlet
}
A "content" \xE9rt\xE9k HTML stringk\xE9nt szerepeljen (escape-elve a JSON-ban).`;
  const system = brandContext ? `${brandContext}

${baseSystem}` : baseSystem;
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `T\xE9ma: ${input.topic}` }
    ],
    { temperature: 0.7, maxTokens: 6e3, jsonMode: true }
  );
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI invalid JSON response");
  }
  const rawAlts = Array.isArray(parsed.alternativeTitles) ? parsed.alternativeTitles : [];
  return {
    title: parsed.title?.trim() ?? "",
    excerpt: parsed.excerpt?.trim() ?? "",
    content: markdownToHtml(parsed.content?.trim() ?? ""),
    metaTitle: parsed.metaTitle?.trim() ?? "",
    metaDescription: parsed.metaDescription?.trim() ?? "",
    cta: parsed.cta?.trim() ?? "",
    // Defensive: take up to 5 strings, trim each, drop empties.
    alternativeTitles: rawAlts.map((t2) => String(t2).trim()).filter(Boolean).slice(0, 5)
  };
}
async function editorialReview(draft, lang) {
  const system = `${languageLock(lang)}Te szenior szerkeszt\u0151 vagy a G2A Marketing p\xE9csi B2B marketing \xFCgyn\xF6ks\xE9gn\xE9l. Most egy AI \xE1ltal gener\xE1lt blogbejegyz\xE9st kapsz fel\xFClvizsg\xE1latra.

\u26A0 KIMENETI NYELV
A teljes v\xE1lasz ${LANG_NAMES[lang]} nyelven. ${lang === "zh" ? "(\u5FC5\u987B\u662F\u7B80\u4F53\u4E2D\u6587 \u2014 Simplified Chinese.)" : lang === "en" ? "(English only.)" : ""}

FELADATOD szerkeszt\u0151i szemmel jav\xEDtani a cikket:

1. T\xF6r\xF6lj vagy \xEDrj \xE1t minden AI-szag\xFA, \xE1ltal\xE1nos mondatot. Tipikusan:
   - "napjainkban egyre fontosabb"
   - "kulcsfontoss\xE1g\xFA szerepet j\xE1tszik"
   - "sz\xE1mos kih\xEDv\xE1s \xE1ll el\u0151tt\xFCk"
   - "a megfelel\u0151 strat\xE9gia elengedhetetlen"
   - "\xF6sszefoglalva", "konkl\xFAzi\xF3k\xE9nt"
   - "felfedezz\xFCk", "elm\xE9lyed\xFCnk", "felt\xE1rjuk"
2. Er\u0151s\xEDtsd meg a nyit\xE1st \u2014 ha defin\xEDci\xF3val kezd\u0151dik, \xEDrd \xE1t \xE9letszer\u0171 \xFCzleti helyzetre, provokat\xEDv \xE1ll\xEDt\xE1sra vagy gyakori vezet\u0151i t\xE9ved\xE9sre.
3. Jav\xEDtsd az \xE1tvezet\xE9seket a bekezd\xE9sek k\xF6z\xF6tt \u2014 egyik gondolat vezessen \xE1t a m\xE1sikba, ne legyenek f\xFCggetlen list\xE1k egym\xE1s ut\xE1n.
4. Ahol t\xFAl list\xE1s a sz\xF6veg, alak\xEDtsd foly\xF3, olvasm\xE1nyos bekezd\xE9ss\xE9. Csak ott hagyj list\xE1t, ahol t\xE9nyleg seg\xEDti az olvashat\xF3s\xE1got (pl. a "Mit tegy\xE9l most?" ellen\u0151rz\u0151lista).
5. Ahol t\xFAl \xE1ltal\xE1nos az \xE1ll\xEDt\xE1s, adj hozz\xE1 konkr\xE9t magyar KKV-kontextus\xFA p\xE9ld\xE1t vagy mini-esetet.
6. Ahol t\xFAl rekl\xE1mos a CTA, tedd term\xE9szetesebb\xE9. A CTA legyen seg\xEDt\u0151 hang\xFA, ne nyomul\xF3s.
7. Ellen\u0151rizd, hogy a cikk val\xF3ban hasznos-e egy magyar KKV-vezet\u0151 sz\xE1m\xE1ra. Ha nincs benne \xFCzleti realit\xE1s (k\xF6lts\xE9g, kapacit\xE1s, kock\xE1zat, d\xF6nt\xE9shoz\xF3i bizonytalans\xE1g), tegy\xE9l bele.
8. V\xE1ltoztasd meg a mondathosszokat \u2014 legyenek v\xE1ltozatosak. Felv\xE1ltva r\xF6vid (3-6 sz\xF3) \xE9s hosszabb mondatok.

NE r\xF6vid\xEDtsd t\xFAl a cikket \u2014 TARTSD a 900-1200 szavas terjedelmet. NE alak\xEDtsd \xE1t akad\xE9miai tanulm\xE1nny\xE1. A c\xE9l: szakmailag er\u0151s, emberi, \xFCzleti blogbejegyz\xE9s. NE tal\xE1lj ki konkr\xE9t statisztik\xE1kat vagy sz\xE1mokat, ha az eredeti cikk nem tartalmazta.

\u26A0 HTML FORM\xC1TUM
A "content" mez\u0151 maradjon TISZTA HTML (<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">). NE haszn\xE1lj markdown szintaxist. NE add hozz\xE1 H1-et.

KIMENETI JSON \u2014 ugyanaz a s\xE9ma, mint az eredeti, plusz egy "editorNotes" t\xF6mb:
{
  "title": "...",
  "excerpt": "...",
  "content": "<p>...</p>...",
  "metaTitle": "...",
  "metaDescription": "...",
  "cta": "...",
  "alternativeTitles": ["...", "...", "...", "...", "..."],
  "editorNotes": ["...", "...", "...", "...", "..."]  // 5 r\xF6vid megjegyz\xE9s arr\xF3l, MIT jav\xEDtott\xE1l (max 1 mondat/jegyzet)
}`;
  const userPayload = JSON.stringify({
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    cta: draft.cta,
    alternativeTitles: draft.alternativeTitles
  });
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `Vizsg\xE1ld fel\xFCl \xE9s jav\xEDtsd ezt a draft-ot:

${userPayload}` }
    ],
    { temperature: 0.6, maxTokens: 6e3, jsonMode: true }
  );
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return draft;
  }
  const rawAlts = Array.isArray(parsed.alternativeTitles) ? parsed.alternativeTitles : draft.alternativeTitles;
  const rawNotes = Array.isArray(parsed.editorNotes) ? parsed.editorNotes : [];
  return {
    title: parsed.title?.trim() || draft.title,
    excerpt: parsed.excerpt?.trim() || draft.excerpt,
    content: markdownToHtml((parsed.content?.trim() || draft.content) ?? ""),
    metaTitle: parsed.metaTitle?.trim() || draft.metaTitle,
    metaDescription: parsed.metaDescription?.trim() || draft.metaDescription,
    cta: parsed.cta?.trim() || draft.cta,
    alternativeTitles: rawAlts.map((t2) => String(t2).trim()).filter(Boolean).slice(0, 5),
    editorNotes: rawNotes.map((n) => String(n).trim()).filter(Boolean).slice(0, 5)
  };
}
async function generateMultilangBlogDraft(input, jobId) {
  const dbPromise = jobId ? Promise.resolve().then(() => (init_db(), db_exports)).catch(() => null) : null;
  let stepsDone = 0;
  const tick = async (phase) => {
    if (!jobId || !dbPromise) return;
    stepsDone++;
    try {
      const db = await dbPromise;
      if (db) await db.updateAiJob(jobId, { phase, completedSteps: stepsDone });
    } catch {
    }
  };
  const [huDraft, enDraft, zhDraft] = await Promise.all([
    generateBlogDraft({ ...input, lang: "hu" }).then(async (d) => {
      await tick("draft");
      return d;
    }),
    generateBlogDraft({ ...input, lang: "en" }).then(async (d) => {
      await tick("draft");
      return d;
    }),
    generateBlogDraft({ ...input, lang: "zh" }).then(async (d) => {
      await tick("draft");
      return d;
    })
  ]);
  const [hu, en, zh] = await Promise.all([
    editorialReview(huDraft, "hu").then(async (d) => {
      await tick("editor");
      return d;
    }),
    editorialReview(enDraft, "en").then(async (d) => {
      await tick("editor");
      return d;
    }),
    editorialReview(zhDraft, "zh").then(async (d) => {
      await tick("editor");
      return d;
    })
  ]);
  if (jobId && dbPromise) {
    try {
      const db = await dbPromise;
      if (db) await db.updateAiJob(jobId, { status: "completed", completedSteps: 6, phase: "editor" });
    } catch {
    }
  }
  return { hu, en, zh };
}
async function generateSeoMeta(input) {
  const lang = input.lang ?? "hu";
  const teFormRule = lang === "hu" ? "- Magyar nyelven K\xD6TELEZ\u0150EN te-form\xE1t haszn\xE1lj (NEM \xF6n\xF6z\xE9st). Pl. 'Tudd meg', 'K\xE9rj aj\xE1nlatot', 'Ind\xEDtsd el'." : "";
  const system = `Te SEO szak\xE9rt\u0151 vagy a G2A Marketing p\xE9csi B2B \xFCgyn\xF6ks\xE9gn\xE9l. ${LANG_NAMES[lang]} nyelven \xEDrj.

Szab\xE1lyok:
- "title" 50-60 karakter, f\u0151 kulcssz\xF3 az elej\xE9n, m\xE1rka a v\xE9g\xE9n opcion\xE1lisan.
- "description" 140-160 karakter, h\xEDv\xF3sz\xF3val / CTA-val, term\xE9szetesen tartalmazza a kulcssz\xF3t.
- Soha ne haszn\xE1lj hype szavakat ("legjobb!", "csod\xE1s!"), maradj profi.
${teFormRule}

Csak JSON: { "title": "...", "description": "..." }`;
  const userParts = [`T\xE9ma / oldal: ${input.topic}`];
  if (input.slug) userParts.push(`URL slug: ${input.slug}`);
  if (input.context) userParts.push(`Kontextus:
${input.context.slice(0, 2e3)}`);
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: userParts.join("\n\n") }
    ],
    { temperature: 0.5, maxTokens: 400, jsonMode: true }
  );
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI invalid JSON response");
  }
  return {
    title: parsed.title?.trim() ?? "",
    description: parsed.description?.trim() ?? ""
  };
}
var OPENAI_IMAGES_ENDPOINT = "https://api.openai.com/v1/images/generations";
var IMAGE_MODEL = "gpt-image-1";
var SIZE_MAP = {
  "1024x1024": "1024x1024",
  "1792x1024": "1536x1024",
  "1024x1792": "1024x1536"
};
var NO_TEXT_SUFFIX = " IMPORTANT: the image must contain NO text, NO letters, NO numbers, NO words, NO captions, NO labels, NO logos, NO typography, NO writing of any kind anywhere in the image. No signs, no posters, no UI text, no watermarks. Pure visual composition only.";
async function generateImage(input) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set \u2014 image generation disabled");
  const size = SIZE_MAP[input.size ?? "1792x1024"];
  const quality = input.quality === "hd" ? "high" : "medium";
  const finalPrompt = `${input.prompt}${NO_TEXT_SUFFIX}`;
  const res = await fetch(OPENAI_IMAGES_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: finalPrompt,
      n: 1,
      size,
      quality
      // gpt-image-1 always returns base64. The response_format param
      // was removed from this model — we don't send it.
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI Images ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }
  const json2 = await res.json();
  const item = json2.data?.[0];
  if (!item?.b64_json) throw new Error("OpenAI returned no image data");
  return {
    imageBuffer: Buffer.from(item.b64_json, "base64"),
    revisedPrompt: item.revised_prompt ?? input.prompt
  };
}
async function improveText(input) {
  const mode = input.mode ?? "rephrase";
  const lang = input.lang ?? "hu";
  const modeDesc = {
    tighten: "T\xF6m\xF6r\xEDtsd: v\xE1gd le a t\xF6ltel\xE9ket, r\xF6vid\xEDtsd 30-50%-kal, tartsd meg a tartalmat.",
    expand: "B\u0151v\xEDtsd: adj hozz\xE1 konkr\xE9t p\xE9ld\xE1kat, r\xE9szleteket. C\xE9l a dupl\xE1zott hossz.",
    rephrase: "Fogalmazd \xE1t: ugyanolyan hossz, ugyanaz a jelent\xE9s, friss megfogalmaz\xE1s."
  };
  const system = `Te marketing copywriter vagy. ${LANG_NAMES[lang]} nyelven \xEDrj.

Feladat: ${modeDesc[mode]}
${input.instruction ? `K\xFCl\xF6n instrukci\xF3: ${input.instruction}` : ""}

Szab\xE1lyok:
- Tartsd meg a markdown form\xE1z\xE1st (##, **, list\xE1k) ha van.
- Te-form\xE1t haszn\xE1lj (NEM \xF6n\xF6z\xE9s).
- Csak a v\xE9gleges sz\xF6veget add vissza, semmi magyar\xE1zat, semmi komment\xE1r.`;
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: input.text }
    ],
    { temperature: 0.6, maxTokens: Math.max(500, Math.ceil(input.text.length / 2)) }
  );
  return raw;
}

// server/_core/rateLimit.ts
var buckets = /* @__PURE__ */ new Map();
var lastSweep = Date.now();
var SWEEP_INTERVAL_MS = 5 * 60 * 1e3;
function sweep(now) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  buckets.forEach((bucket, key) => {
    bucket.hits = bucket.hits.filter((t2) => now - t2 < 60 * 60 * 1e3);
    if (bucket.hits.length === 0) buckets.delete(key);
  });
}
function checkRateLimit(key, opts) {
  const now = Date.now();
  sweep(now);
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  const cutoff = now - opts.windowMs;
  bucket.hits = bucket.hits.filter((t2) => t2 > cutoff);
  if (bucket.hits.length >= opts.max) {
    const oldestInWindow = bucket.hits[0];
    return {
      allowed: false,
      retryAt: oldestInWindow + opts.windowMs,
      remaining: 0
    };
  }
  bucket.hits.push(now);
  return { allowed: true, remaining: opts.max - bucket.hits.length };
}
function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

// server/_core/dbRateLimit.ts
init_schema();
init_db();
import { and as and2, eq as eq2, gte, lt, sql as sql2 } from "drizzle-orm";
async function checkRateLimitDb(bucketKey, opts) {
  const db = await getDb();
  if (!db) {
    return checkRateLimit(bucketKey, opts);
  }
  const now = Date.now();
  const windowStart = new Date(now - opts.windowMs);
  try {
    const rows = await db.select({ count: sql2`COUNT(*)` }).from(rateLimitHits).where(
      and2(
        eq2(rateLimitHits.bucketKey, bucketKey),
        gte(rateLimitHits.hitAt, windowStart)
      )
    );
    const hitCount = Number(rows[0]?.count ?? 0);
    if (hitCount >= opts.max) {
      const [oldest] = await db.select({ hitAt: rateLimitHits.hitAt }).from(rateLimitHits).where(
        and2(
          eq2(rateLimitHits.bucketKey, bucketKey),
          gte(rateLimitHits.hitAt, windowStart)
        )
      ).orderBy(rateLimitHits.hitAt).limit(1);
      const oldestMs = oldest ? new Date(oldest.hitAt).getTime() : now;
      return {
        allowed: false,
        retryAt: oldestMs + opts.windowMs,
        remaining: 0
      };
    }
    await db.insert(rateLimitHits).values({ bucketKey });
    if (Math.random() < 0.05) {
      const cutoff = new Date(now - 60 * 60 * 1e3);
      db.delete(rateLimitHits).where(lt(rateLimitHits.hitAt, cutoff)).catch(() => {
      });
    }
    return { allowed: true, remaining: opts.max - hitCount - 1 };
  } catch (err) {
    console.warn("[dbRateLimit] DB check failed, falling back to memory:", err);
    return checkRateLimit(bucketKey, opts);
  }
}

// server/_core/spam.ts
var HONEYPOT_FIELD = "website";
function isHoneypotTriggered(input) {
  return Boolean(input.website && input.website.trim().length > 0);
}

// server/_core/turnstile.ts
var VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}
async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true };
  if (!token || !token.trim()) {
    return { ok: false, reason: "missing-token" };
  }
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);
  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // 8s ceiling — Cloudflare normally answers in ≤500ms; this is
      // a safety net to ensure form submission isn't held hostage by a
      // network glitch on their end.
      signal: AbortSignal.timeout(8e3)
    });
    if (!res.ok) {
      return { ok: false, reason: `cloudflare-${res.status}` };
    }
    const json2 = await res.json();
    if (json2.success) return { ok: true };
    const code = (json2["error-codes"] || []).join(",") || "unknown";
    return { ok: false, reason: `cloudflare:${code}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `network:${msg}` };
  }
}

// server/_core/emailTemplates.ts
var BRAND_TEAL = "#14B8A6";
var BRAND_TEAL_DARK = "#0d9488";
var BRAND_DARK = "#0a0a0a";
var BRAND_DARK_PANEL = "#161616";
var TEXT_PRIMARY = "#0f172a";
var TEXT_SECONDARY = "#475569";
var TEXT_MUTED = "#94a3b8";
var BG_PAGE = "#eef2f6";
var BG_SUBTLE = "#f8fafc";
var BORDER = "#e2e8f0";
var FONT_SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
var FONT_MONO = "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', Courier, monospace";
function wrapper(inner, preheader) {
  const preheaderHtml = `
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">
      ${escapeHtml(preheader)}
    </div>`;
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:${BG_PAGE};font-family:${FONT_SANS};color:${TEXT_PRIMARY};-webkit-font-smoothing:antialiased">
  ${preheaderHtml}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_PAGE};padding:32px 12px">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(15,23,42,0.07)">
          <tr><td>${inner}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
var LOGO_URL = "https://res.cloudinary.com/dzh1unb6d/image/upload/f_auto,q_auto,w_360/g2a/og/default-logo.png";
function darkHeader(opts) {
  const tag = opts.tag ? `<div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.2em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:14px;font-weight:600">${escapeHtml(opts.tag)}</div>` : "";
  const secondary = opts.secondaryLine ? `<div style="font-size:12px;color:#94a3b8;margin-top:8px;font-family:${FONT_MONO};letter-spacing:0.04em">${escapeHtml(opts.secondaryLine)}</div>` : "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK};border-bottom:3px solid ${BRAND_TEAL}">
      <tr>
        <td style="padding:28px 36px;color:#ffffff">
          ${tag}
          <img src="${LOGO_URL}" alt="G2A Marketing" width="180" height="auto" style="display:block;border:0;outline:none;text-decoration:none;width:180px;height:auto;max-width:180px">
          ${secondary}
        </td>
      </tr>
    </table>`;
}
function signature(opts = {}) {
  const name = opts.name || "Attila";
  const role = opts.role || "G2A Marketing";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 36px 36px">
          <div style="font-size:14px;color:${TEXT_SECONDARY};line-height:1.6;margin-bottom:14px">\xDCdv,</div>
          <div style="display:inline-block;border-left:3px solid ${BRAND_TEAL};padding-left:14px">
            <div style="font-size:16px;font-weight:700;color:${TEXT_PRIMARY};letter-spacing:-0.01em">${escapeHtml(name)}</div>
            <div style="font-size:12px;color:${TEXT_MUTED};font-family:${FONT_MONO};letter-spacing:0.04em;margin-top:3px">${escapeHtml(role)}</div>
          </div>
        </td>
      </tr>
    </table>`;
}
function footer(unsubscribeUrl) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK};color:#94a3b8">
      <tr>
        <td style="padding:28px 36px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-family:${FONT_MONO};font-size:11px;line-height:1.7;letter-spacing:0.04em;color:#cbd5e1">
                <strong style="color:#ffffff;font-size:13px">G2A Marketing Bt.</strong><br>
                7621 P\xE9cs \xB7 info@g2amarketing.hu<br>
                <a href="https://g2amarketing.hu" style="color:#cbd5e1;text-decoration:none">g2amarketing.hu</a>
              </td>
              <td align="right" valign="top">
                <a href="https://www.linkedin.com/company/g2a-marketing/" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO};margin-right:14px">LinkedIn</a>
                <a href="https://www.instagram.com/g2amarketingagency/" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO};margin-right:14px">Instagram</a>
                <a href="https://www.facebook.com/g2amarketing" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO}">Facebook</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:22px;padding-top:16px;border-top:1px solid #1f2937;font-size:11px;color:#64748b;line-height:1.7">
            Ezt az emailt az\xE9rt kaptad, mert feliratkozt\xE1l a g2amarketing.hu h\xEDrlevel\xE9re.<br>
            <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">Leiratkoz\xE1s egy kattint\xE1ssal</a> \xB7 <a href="https://g2amarketing.hu/adatvedelmi-iranyelvek" style="color:#94a3b8;text-decoration:underline">Adatv\xE9delmi t\xE1j\xE9koztat\xF3</a>
          </div>
        </td>
      </tr>
    </table>`;
}
function escapeHtml(s) {
  return s.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[c]);
}
var TOPIC_CARDS = {
  strategy: {
    tag: "STRAT\xC9GIA",
    title: "B2B marketing strat\xE9gia",
    desc: "Poz\xEDcion\xE1l\xE1s, ICP, brand-\xE9p\xEDt\xE9s \xE9s go-to-market playbookok.",
    icon: "\u25C6"
  },
  ai: {
    tag: "AI",
    title: "AI & automatiz\xE1ci\xF3",
    desc: "AI workflow-k, prompt-receptek, kipr\xF3b\xE1lt eszk\xF6z\xF6k B2B kontextusban.",
    icon: "\u25B2"
  },
  paid: {
    tag: "TELJES\xCDTM\xC9NY",
    title: "SEO & teljes\xEDtm\xE9nyhirdet\xE9s",
    desc: "Google Ads, Meta hirdet\xE9sek, organikus SEO \u2014 m\xE9rhet\u0151 eredm\xE9nyekkel.",
    icon: "\u25CF"
  },
  case_studies: {
    tag: "ESETTANULM\xC1NY",
    title: "Esettanulm\xE1nyok & adatok",
    desc: "Anonim \xFCgyf\xE9lprojektek val\xF3s sz\xE1mokkal \u2014 mi m\u0171k\xF6d\xF6tt, mi nem.",
    icon: "\u25A0"
  }
};
function topicRow(keys) {
  const cell = (key) => {
    const c = TOPIC_CARDS[key];
    return `
      <td width="50%" valign="top" style="padding:8px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
          <tr>
            <td style="padding:18px 18px 16px">
              <div style="font-family:${FONT_MONO};font-size:14px;color:${BRAND_TEAL};line-height:1;margin-bottom:10px">${c.icon}</div>
              <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL_DARK};text-transform:uppercase;margin-bottom:6px;font-weight:600">${c.tag}</div>
              <div style="font-size:15px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:6px;line-height:1.35">${c.title}</div>
              <div style="font-size:13px;color:${TEXT_SECONDARY};line-height:1.55">${c.desc}</div>
            </td>
          </tr>
        </table>
      </td>`;
  };
  const second = keys[1] ? cell(keys[1]) : '<td width="50%"></td>';
  return `
    <tr>
      ${cell(keys[0])}
      ${second}
    </tr>`;
}
function renderWelcomeEmailHtml(input) {
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const activeTopics = input.topics && input.topics.length > 0 ? input.topics.filter((t2) => TOPIC_CARDS[t2]) : Object.keys(TOPIC_CARDS);
  const rows = [];
  for (let i = 0; i < activeTopics.length; i += 2) {
    rows.push(topicRow([activeTopics[i], activeTopics[i + 1]].filter(Boolean)));
  }
  const body = `
    ${darkHeader({ tag: "\xDCdv a fed\xE9lzeten", secondaryLine: "Adatvez\xE9relt marketing \xFCgyn\xF6ks\xE9g \xB7 P\xE9cs" })}

    <!-- Hero copy \u2014 first-person, personal -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 24px">
          <h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">
            Attila vagyok a G2A Marketingt\u0151l \u2014 k\xF6sz\xF6n\xF6m, hogy feliratkozt\xE1l a h\xEDrlevel\xFCnkre. Heti maximum 1 email, p\xE9ntek reggel \u2014 sose k\xE9retlen\xFCl.
          </p>
        </td>
      </tr>
    </table>

    <!-- 2\xD72 topic grid -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 28px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:6px;padding:0 8px">Amit kapni fogsz</div>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 28px">
      ${rows.join("")}
    </table>

    <!-- Dark CTA block -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:24px 28px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:10px;font-weight:600">K\xF6vetkez\u0151 l\xE9p\xE9s</div>
                <div style="font-size:17px;line-height:1.4;color:#ffffff;font-weight:700;margin-bottom:8px">N\xE9zz k\xF6r\xFCl a blogunkban</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1;margin-bottom:18px">Friss tartalom hetente \u2014 gyakorlati B2B \xE9s AI t\xE9m\xE1kban, magyar piaci p\xE9ld\xE1kkal.</div>
                <a href="https://g2amarketing.hu/hirek" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;padding:11px 22px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">OLVASS BE A BLOGUNKBA \u2192</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Personal note -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:18px 22px">
                <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">
                  <strong style="color:${TEXT_PRIMARY}">K\xE9rd\xE9sed van?</strong> V\xE1laszolj erre az emailre \u2014 \xE1tolvasom \xE9s v\xE1laszolok szem\xE9lyesen. Ha konkr\xE9t marketing kih\xEDv\xE1son dolgozol, jelezd \u2014 gyakran egy 15 perces besz\xE9lget\xE9s is sokat tiszt\xE1z.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${signature()}

    ${footer(input.unsubscribeUrl)}
  `;
  return wrapper(body, "\xDCdv a G2A Marketing fed\xE9lzet\xE9n \u2014 mit v\xE1rhatsz a h\xEDrlevel\xFCnkt\u0151l.");
}
function digestArticleBlock(a, index) {
  const card = TOPIC_CARDS[a.topic];
  const tag = card?.tag || a.topic.toUpperCase();
  const icon = card?.icon || "\u25C6";
  const isAlt = index % 2 === 1;
  const bg = isAlt ? BG_SUBTLE : "#ffffff";
  const num = String(index + 1).padStart(2, "0");
  const readChip = a.readMin ? `<span style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};margin-left:14px">\xB7 ${a.readMin} perc olvas\xE1s</span>` : "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg}">
      <tr>
        <td style="padding:32px 36px">

          <!-- Tag row: topic chip + article number -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td>
                <span style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};color:${BRAND_TEAL_DARK};font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;padding:5px 10px;border-radius:4px">
                  <span style="color:${BRAND_TEAL}">${icon}</span> &nbsp;${tag}
                </span>
              </td>
              <td align="right" style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.1em">
                ${num} / 04
              </td>
            </tr>
          </table>

          <!-- Headline -->
          <h2 style="margin:16px 0 12px;font-size:22px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">
            <a href="${a.url}" style="color:${TEXT_PRIMARY};text-decoration:none">${escapeHtml(a.title)}</a>
          </h2>

          <!-- Excerpt -->
          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(a.excerpt)}</p>

          <!-- CTA row -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <a href="${a.url}" style="display:inline-block;background:${TEXT_PRIMARY};color:#ffffff;padding:9px 18px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">OLVASD EL \u2192</a>
              </td>
              <td valign="middle" style="padding-left:8px">${readChip}</td>
            </tr>
          </table>

        </td>
      </tr>
    </table>`;
}
function renderDigestEmailHtml(input) {
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const intro = input.intro || "Itt a heti gyakorlati B2B \xE9s AI marketing v\xE1logat\xE1s \u2014 egy cikk minden t\xE9mak\xF6rb\u0151l, 5-10 perces olvasm\xE1nyok.";
  const articleBlocks = input.articles.map((a, i) => digestArticleBlock(a, i)).join('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:' + BORDER + '"></td></tr></table>');
  const body = `
    ${darkHeader({ tag: input.weekLabel, secondaryLine: "Heti v\xE1logat\xE1s" })}

    <!-- Greeting -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:36px 36px 8px">
          <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(intro)}</p>
        </td>
      </tr>
    </table>

    <!-- Top divider with brand colour -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:0 36px"><div style="height:3px;background:${BRAND_TEAL};border-radius:2px"></div></td></tr>
    </table>

    <!-- Articles with alternating row backgrounds -->
    ${articleBlocks}

    <!-- Reply callout -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px;font-weight:600">Mit gondolsz?</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1">
                  Hasznos volt? V\xE1laszolj erre az emailre egyetlen mondattal \u2014 \xE1tolvasom \xE9s v\xE1laszolok. Konkr\xE9t marketing k\xE9rd\xE9sed van? <a href="https://g2amarketing.hu/kapcsolat" style="color:${BRAND_TEAL};text-decoration:none;font-weight:600">Vedd fel vel\xFCnk a kapcsolatot \u2192</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${signature()}

    ${footer(input.unsubscribeUrl)}
  `;
  return wrapper(body, intro);
}
var CONFIRMATION_LABELS = {
  audit: {
    tag: "AUDIT K\xC9R\xC9S",
    subject: "K\xF6sz\xF6nj\xFCk az audit k\xE9r\xE9sedet \u2014 hamarosan jelentkez\xFCnk",
    heading: "Megkaptam a k\xE9r\xE9sedet",
    intro: "K\xF6sz\xF6n\xF6m, hogy id\u0151t sz\xE1nt\xE1l a kapcsolatfelv\xE9telre. Az al\xE1bbiakban \xF6sszefoglaltam, mit k\xFCldt\xE9l el \u2014 ha b\xE1rmelyik adat pontatlan, v\xE1laszolj erre az emailre.",
    nextSteps: [
      "<strong>24 \xF3r\xE1n bel\xFCl</strong> megn\xE9zem a megadott weboldalt \xE9s a hivatkozott digit\xE1lis jelenl\xE9tet.",
      "<strong>2-3 munkanapon bel\xFCl</strong> k\xFCld\xF6k egy els\u0151 \xE9rt\xE9kel\xE9st a f\u0151 \xE9szrev\xE9telekkel.",
      "<strong>5-7 munkanapon bel\xFCl</strong> kapsz egy r\xE9szletes auditot (15-25 oldal) prioritiz\xE1lt akci\xF3pontokkal.",
      "A teljes folyamat <strong>ingyenes</strong>, k\xF6telezetts\xE9gmentes \u2014 nincs \xFCzlettelefon\xE1l\xE1s, csak a riport."
    ],
    closing: "Ha k\xF6zben b\xE1rmi k\xE9rd\xE9sed van \u2014 p\xE9ld\xE1ul egy konkr\xE9t marketing kih\xEDv\xE1son dolgozol \u2014 v\xE1laszolj nyugodtan erre az emailre. Olvasok r\xE1."
  },
  contact: {
    tag: "KAPCSOLATFELV\xC9TEL",
    subject: "K\xF6sz\xF6nj\xFCk az \xFCzeneted \u2014 hamarosan jelentkez\xFCnk",
    heading: "Megkaptam az \xFCzeneted",
    intro: "K\xF6sz\xF6n\xF6m, hogy felvetted vel\xFCnk a kapcsolatot. Az al\xE1bbiakban \xF6sszefoglaltam, mit k\xFCldt\xE9l el \u2014 ha b\xE1rmi pontatlan, v\xE1laszolj erre az emailre.",
    nextSteps: [
      "<strong>1 munkanapon bel\xFCl</strong> szem\xE9lyesen v\xE1laszolok az \xFCzeneted tartalm\xE1ra.",
      "Ha bonyolultabb t\xE9ma, jelzem mikor tudunk <strong>15-30 perces besz\xE9lget\xE9st</strong> egyeztetni.",
      "S\xFCrg\u0151s? H\xEDvj nyugodtan: <strong>+36 30 190 2575</strong> (munkanapokon 8-17h k\xF6z\xF6tt)."
    ],
    closing: "Mindezek mellett ha k\xF6zben b\xE1rmi kieg\xE9sz\xEDt\xE9s jut eszedbe, v\xE1laszolj erre az emailre \u2014 olvasom."
  },
  career: {
    tag: "KARRIER JELENTKEZ\xC9S",
    subject: "K\xF6sz\xF6nj\xFCk a jelentkez\xE9sedet \u2014 hamarosan jelentkez\xFCnk",
    heading: "Megkaptam a jelentkez\xE9sedet",
    intro: "K\xF6sz\xF6n\xF6m, hogy jelentkezt\xE9l hozz\xE1nk. Az al\xE1bbiakban \xF6sszefoglaltam, amit elk\xFCldt\xE9l \u2014 ha b\xE1rmi pontatlan, v\xE1laszolj erre az emailre.",
    nextSteps: [
      "<strong>3-5 munkanapon bel\xFCl</strong> \xE1tn\xE9zem a jelentkez\xE9st \xE9s a CV-d.",
      "Ha tov\xE1bbl\xE9p\xFCnk, <strong>egy r\xF6vid online besz\xE9lget\xE9sre</strong> h\xEDvlak (kb. 30 perc).",
      "M\xE1sodik k\xF6r: gyakorlati feladat a saj\xE1t szakter\xFCleteden \u2014 kontextusban."
    ],
    closing: "Ha k\xF6zben jut eszedbe b\xE1rmilyen k\xE9rd\xE9s \u2014 a poz\xEDci\xF3r\xF3l, csapatr\xF3l, kult\xFAr\xE1r\xF3l \u2014 v\xE1laszolj erre az emailre. Olvasok r\xE1."
  }
};
function renderConfirmationEmailHtml(input) {
  const cfg = CONFIRMATION_LABELS[input.formType];
  const greeting = `Szia ${escapeHtml(input.name)}!`;
  const submissionRows = input.submission && input.submission.length > 0 ? input.submission.filter((s) => s.value && s.value.trim() !== "" && s.value.trim() !== "\u2013").map(
    (s) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.06em;text-transform:uppercase;width:120px;vertical-align:top">
                ${escapeHtml(s.label)}
              </td>
              <td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT_PRIMARY};line-height:1.5;vertical-align:top">
                ${escapeHtml(s.value)}
              </td>
            </tr>`
  ).join("") : "";
  const steps = cfg.nextSteps.map(
    (s, i) => `
        <tr>
          <td valign="top" style="padding:8px 12px 8px 0;width:32px">
            <div style="background:${BRAND_TEAL};color:#ffffff;font-family:${FONT_MONO};font-size:11px;font-weight:700;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px">${i + 1}</div>
          </td>
          <td style="padding:8px 0;font-size:14px;color:${TEXT_SECONDARY};line-height:1.6">${s}</td>
        </tr>`
  ).join("");
  const body = `
    ${darkHeader({ tag: cfg.tag, secondaryLine: "Visszaigazol\xE1s \xB7 G2A Marketing" })}

    <!-- Greeting -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">${cfg.intro}</p>
        </td>
      </tr>
    </table>

    ${submissionRows ? `
    <!-- Submission echo -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:10px">Amit elk\xFCldt\xE9l</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:6px 18px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${submissionRows}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>` : ""}

    <!-- Next steps -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:32px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:14px">Mi k\xF6vetkezik</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${steps}
          </table>
        </td>
      </tr>
    </table>

    <!-- Closing note -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 8px">
          <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">${cfg.closing}</div>
        </td>
      </tr>
    </table>

    ${signature()}

    ${footer("https://g2amarketing.hu/kapcsolat")}
  `;
  return wrapper(body, cfg.intro);
}
var CONFIRMATION_SUBJECTS = {
  audit: CONFIRMATION_LABELS.audit.subject,
  contact: CONFIRMATION_LABELS.contact.subject,
  career: CONFIRMATION_LABELS.career.subject
};

// server/_core/socialCopy.ts
init_brandVoice();
var OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
var PLATFORM_PROMPTS = {
  linkedin: (lang) => `Te a G2A Marketing LinkedIn copy-\xEDr\xF3ja vagy \u2014 magyar B2B marketing \xFCgyn\xF6ks\xE9g P\xE9csen. ${lang === "hu" ? "Magyarul \xEDrj." : lang === "en" ? "Write in English." : "\u7528\u4E2D\u6587\u5199\u4F5C\u3002"}

C\xE9l: egy LinkedIn poszt, amely egy \xFAj blog cikkre h\xEDvja fel a figyelmet, de nem clickbait \u2014 \xE9rdemi inz\xE1jt-ot is hordoz a cikkb\u0151l.

STRUKT\xDARA (pontosan k\xF6vesd):
1. ELS\u0150 MONDAT: er\u0151s hook \u2014 egy meglep\u0151 statisztika, k\xE9rd\xE9s, vagy provokat\xEDv megfigyel\xE9s a t\xE9m\xE1r\xF3l. Maximum 12 sz\xF3. Ez fog megjelenni a feed-en a "...see more" el\u0151tt.
2. \xDCRES SOR
3. 3-5 mondatos \xE9rdemi sz\xF6veg: r\xF6viden \xF6sszefoglalja a cikk f\u0151 gondolat\xE1t + 1-2 konkr\xE9t takeaway-t. Te-form\xE1t haszn\xE1lj. Konkr\xE9t sz\xE1mok, p\xE9ld\xE1k ha vannak.
4. \xDCRES SOR
5. CTA: "R\xE9szletek a cikkben:" + a teljes URL
6. \xDCRES SOR
7. 4-6 relev\xE1ns hashtag \u2014 kis bet\u0171k, magyar B2B-relev\xE1nsak (#b2bmarketing, #marketing, #aimarketing, stb.). Speci\xE1lis t\xE9m\xE1khoz ipar\xE1gi hashtag.

SZAB\xC1LYOK:
- Hossz: 800-1300 karakter (k\xF6zepes-hossz\xFA LinkedIn poszt m\xE9ly-engagement-hez)
- NE haszn\xE1lj emoji-t (B2B context, professzion\xE1lis hang)
- NE haszn\xE1lj clickbait-et ("This will SHOCK you!" stb.)
- NE emlegesd magunkat ("a G2A...", "csapatunk...") \u2014 a c\xE9ges page-en posztolunk, ez nyilv\xE1nval\xF3
- NE rakj ## vagy ** form\xE1z\xE1st
- KIZ\xC1R\xD3LAG a k\xE9sz poszt-sz\xF6veget add vissza, semmi magyar\xE1zat`,
  facebook: (lang) => `Te a G2A Marketing Facebook copy-\xEDr\xF3ja vagy. ${lang === "hu" ? "Magyarul \xEDrj." : lang === "en" ? "Write in English." : "\u7528\u4E2D\u6587\u5199\u4F5C\u3002"}

C\xE9l: egy Facebook poszt egy \xFAj blog cikkr\u0151l. Facebook-on a copy r\xF6vid, besz\xE9lget\u0151s, \xE9rzelmesebb mint LinkedIn-en.

STRUKT\xDARA:
1. ELS\u0150 MONDAT/K\xC9RD\xC9S: egy konkr\xE9t k\xE9rd\xE9s vagy \xE1ll\xEDt\xE1s ami az olvas\xF3t a saj\xE1t helyzet\xE9be helyezi (max 15 sz\xF3).
2. \xDCRES SOR
3. 2-3 mondat: r\xF6viden \xF6sszefoglalja a cikk f\u0151 \xFCzenet\xE9t, mi\xE9rt \xE9rdemes elolvasni.
4. \xDCRES SOR
5. CTA: "\u{1F449} Olvasd el a cikket:" + a teljes URL
6. \xDCRES SOR
7. 2-3 relev\xE1ns hashtag (Facebook-on a hashtag-ek visszafogottabbak mint Instagram-on)

SZAB\xC1LYOK:
- Hossz: 300-500 karakter (Facebook algoritmusa a r\xF6videbb posztokat prefer\xE1lja)
- 1-2 emoji OK, de ne l\xE9gy t\xFAlzott
- Besz\xE9lget\u0151s, k\xF6zvetlen hangnem (te-forma)
- NE emlegesd magunkat ("a G2A...", "csapatunk...")
- KIZ\xC1R\xD3LAG a k\xE9sz poszt-sz\xF6veget add vissza, semmi magyar\xE1zat`,
  instagram: (lang) => `Te a G2A Marketing Instagram copy-\xEDr\xF3ja vagy. ${lang === "hu" ? "Magyarul \xEDrj." : lang === "en" ? "Write in English." : "\u7528\u4E2D\u6587\u5199\u4F5C\u3002"}

C\xE9l: egy Instagram caption egy \xFAj blog cikkr\u0151l. Instagram-on a tipogr\xE1fia + emoji + hashtag domin\xE1l.

STRUKT\xDARA:
1. ELS\u0150 SOR (the "hook"): emoji + figyelemfelkelt\u0151 mondat (max 10 sz\xF3). Az Instagram a "...more" el\u0151tt csak ezt mutatja.
2. \xDCRES SOR
3. 2-4 r\xF6vid bekezd\xE9s, mindegyik 1-2 mondat. Soronk\xE9nt 1-1 emoji a sorok elej\xE9n (\u2728 \u{1F4A1} \u{1F525} \u{1F4CA} stb.). Magyar\xE1zza a cikk \xE9rt\xE9k\xE9t, f\u0151 insight-jait.
4. \xDCRES SOR
5. CTA: "\u{1F517} A linket a bio-ban tal\xE1lod / R\xE9szletek: [URL]" (Instagram nem klikkelheti a linkeket a captionben, de tegy\xFCk be a teljes URL-t).
6. \xDCRES SOR
7. 8-15 relev\xE1ns hashtag \u2014 keverve sz\xE9lesebb (#marketing #b2b) \xE9s niche (#aimarketing #kkvmarketing #p\xE9cs) hashtag-eket.

SZAB\xC1LYOK:
- Hossz: 800-1500 karakter
- Emoji-k b\u0151ven (sort\xF6r\xE9s, hangs\xFAly)
- Te-forma, bar\xE1ti hangnem
- NE emlegesd magunkat n\xE9vvel
- KIZ\xC1R\xD3LAG a k\xE9sz caption-t add vissza`
};
function summarizeContent(html, maxChars = 500) {
  if (!html) return "";
  const text2 = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text2.length <= maxChars) return text2;
  const cut = text2.slice(0, maxChars);
  const period = cut.lastIndexOf(".");
  return period > maxChars - 100 ? cut.slice(0, period + 1) : cut.trimEnd() + "\u2026";
}
async function generateSocialCopy(input) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const lang = input.lang ?? "hu";
  const brandVoice = await loadBrandVoice();
  const brandContext = renderBrandContext(brandVoice, input.platform);
  const platformPrompt = PLATFORM_PROMPTS[input.platform](lang);
  const system = brandContext ? `${brandContext}

${platformPrompt}` : platformPrompt;
  const userParts = [
    `BLOG CIKK C\xCDME: ${input.title}`,
    input.excerpt ? `LEAD/EXCERPT: ${input.excerpt}` : "",
    input.content ? `CIKK TARTALM\xC1NAK \xD6SSZEFOGLAL\xD3JA (els\u0151 ~500 karakter):
${summarizeContent(input.content)}` : "",
    `URL: ${input.url}`
  ].filter(Boolean).join("\n\n");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userParts }
      ],
      // Slightly higher temp for social copy — these benefit from variety
      temperature: 0.75,
      max_tokens: 1e3
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }
  const data = await res.json();
  const text2 = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text2) throw new Error("OpenAI returned empty copy");
  return text2.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").replace(/^["']([\s\S]*)["']$/, "$1").trim();
}

// server/routers.ts
init_brandVoice();
import { randomBytes } from "node:crypto";
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
async function guardPublicFormOrSilent(ctx, input, formKey, silentSuccess) {
  if (isHoneypotTriggered(input)) {
    console.warn(`[spam] Honeypot triggered for ${formKey} from ${getClientIp(ctx.req)}`);
    return silentSuccess;
  }
  const ip = getClientIp(ctx.req);
  if (isTurnstileConfigured()) {
    const verdict = await verifyTurnstile(input.turnstileToken, ip);
    if (!verdict.ok) {
      console.warn(`[turnstile] Verification failed for ${formKey}: ${verdict.reason}`);
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Bot-ellen\u0151rz\xE9s sikertelen. Friss\xEDtsd az oldalt \xE9s pr\xF3b\xE1ld \xFAjra."
      });
    }
  }
  const limit = await checkRateLimitDb(`${formKey}:${ip}`, { max: 5, windowMs: 15 * 60 * 1e3 });
  if (!limit.allowed) {
    const minutes = Math.ceil(((limit.retryAt ?? Date.now()) - Date.now()) / 6e4);
    throw new TRPCError3({
      code: "TOO_MANY_REQUESTS",
      message: `T\xFAl sok k\xFCld\xE9s err\u0151l az IP-r\u0151l. Pr\xF3b\xE1ld \xFAjra ${minutes} perc m\xFAlva.`
    });
  }
  return null;
}
var uploadRouter = router({
  getUploadUrl: adminProcedure2.input(z2.object({ filename: z2.string(), contentType: z2.string() })).mutation(async ({ input }) => {
    const ext = input.filename.split(".").pop() || "bin";
    const key = `g2a-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    return { key, uploadReady: true };
  }),
  uploadFile: adminProcedure2.input(z2.object({ filename: z2.string(), contentType: z2.string(), base64Data: z2.string() })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.base64Data, "base64");
    if (isCloudinaryConfigured() && input.contentType.startsWith("image/")) {
      const result = await cloudinaryUpload(buffer, input.contentType, input.filename);
      return { url: result.secureUrl, key: result.publicId, provider: "cloudinary" };
    }
    const ext = input.filename.split(".").pop() || "bin";
    const key = `g2a-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { url } = await storagePut(key, buffer, input.contentType);
    return { url, key, provider: "forge" };
  })
});
var contentRouter = router({
  heroSlides: publicProcedure.query(() => getHeroSlides()),
  services: publicProcedure.query(() => getServices()),
  serviceBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(({ input }) => getServiceBySlug(input.slug)),
  testimonials: publicProcedure.query(() => getTestimonials()),
  partners: publicProcedure.query(() => getPartners()),
  industries: publicProcedure.query(() => getIndustries()),
  technologies: publicProcedure.query(() => getTechnologies()),
  values: publicProcedure.query(() => getValues()),
  categories: publicProcedure.query(() => getCategories()),
  siteSettings: publicProcedure.query(() => getAllSiteSettings()),
  pageSeo: publicProcedure.input(z2.object({ slug: z2.string() })).query(({ input }) => getPageSeo(input.slug)),
  caseStudies: publicProcedure.query(() => getActiveCaseStudies()),
  caseStudyBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(({ input }) => getCaseStudyBySlug(input.slug)),
  posts: publicProcedure.input(z2.object({ page: z2.number().default(1), limit: z2.number().default(10), categoryId: z2.number().optional() })).query(({ input }) => getPosts({ page: input.page, limit: input.limit, categoryId: input.categoryId, status: "published" })),
  postBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(({ input }) => getPostBySlug(input.slug)),
  /**
   * Site-wide search across published blog posts + active case studies.
   * Substring match on title, excerpt/challenge, content/solution in HU/EN/ZH.
   * Returns combined results with type marker so the UI can render them differently.
   */
  search: publicProcedure.input(z2.object({ q: z2.string().min(2).max(80), limit: z2.number().int().min(1).max(20).default(10) })).query(async ({ input }) => {
    const q = input.q.trim().toLowerCase();
    if (q.length < 2) return { posts: [], caseStudies: [], total: 0 };
    const [posts2, caseStudies2] = await Promise.all([
      getPosts({ page: 1, limit: 100, status: "published" }),
      getActiveCaseStudies()
    ]);
    const matches = (haystack) => haystack.some((s) => typeof s === "string" && s.toLowerCase().includes(q));
    const matchedPosts = (posts2.posts || []).filter(
      (p) => matches([p.title, p.titleEn, p.titleZh, p.excerpt, p.excerptEn, p.excerptZh, p.content, p.contentEn, p.contentZh])
    ).slice(0, input.limit);
    const matchedCaseStudies = (caseStudies2 || []).filter(
      (c) => matches([c.title, c.titleEn, c.titleZh, c.client, c.clientEn, c.clientZh, c.industry, c.challenge, c.challengeEn, c.challengeZh, c.solution, c.solutionEn, c.solutionZh])
    ).slice(0, input.limit);
    return {
      posts: matchedPosts.map((p) => ({
        type: "post",
        id: p.id,
        slug: p.slug,
        title: p.title,
        titleEn: p.titleEn,
        titleZh: p.titleZh,
        excerpt: p.excerpt,
        excerptEn: p.excerptEn,
        excerptZh: p.excerptZh,
        publishedAt: p.publishedAt,
        featuredImage: p.featuredImage
      })),
      caseStudies: matchedCaseStudies.map((c) => ({
        type: "caseStudy",
        id: c.id,
        slug: c.slug,
        title: c.title,
        titleEn: c.titleEn,
        titleZh: c.titleZh,
        client: c.client,
        clientEn: c.clientEn,
        clientZh: c.clientZh,
        industry: c.industry,
        featuredImage: c.featuredImage
      })),
      total: matchedPosts.length + matchedCaseStudies.length
    };
  })
});
var contactRouter = router({
  submit: publicProcedure.input(z2.object({
    name: z2.string().min(2, "K\xE9rj\xFCk adja meg a nev\xE9t"),
    email: z2.string().email("\xC9rv\xE9nyes email c\xEDm sz\xFCks\xE9ges"),
    phone: z2.string().optional(),
    subject: z2.string().optional(),
    message: z2.string().min(10, "Az \xFCzenet legal\xE1bb 10 karakter legyen"),
    serviceInterest: z2.string().optional(),
    // Honeypot — must remain empty for the submission to be persisted
    [HONEYPOT_FIELD]: z2.string().optional(),
    // Cloudflare Turnstile widget token — verified server-side
    // against the secret key. Optional in the schema so legacy
    // clients still work; the guard enforces presence when the
    // feature flag is on.
    turnstileToken: z2.string().optional(),
    // Optional form-origin marker. Lets shared endpoints (e.g. /karrier
    // posts to contact.submit) keep separate rate-limit buckets so a job
    // applicant doesn't burn through the contact form's quota.
    formContext: z2.enum(["contact", "careers"]).optional()
  })).mutation(async ({ input, ctx }) => {
    const bucket = input.formContext === "careers" ? "careers" : "contact";
    const guard = await guardPublicFormOrSilent(ctx, input, bucket, { success: true });
    if (guard) return guard;
    const { [HONEYPOT_FIELD]: _hp, formContext: _fc, turnstileToken: _tt, ...submission } = input;
    void _hp;
    void _fc;
    void _tt;
    await createContactSubmission(submission);
    await notifyOwner({
      title: `\xDAj kapcsolatfelv\xE9tel: ${input.name}`,
      content: `**Felad\xF3:** ${input.name}
**Email:** ${input.email}
**Telefon:** ${input.phone || "\u2013"}
**T\xE1rgy:** ${input.subject || "\u2013"}
**Szolg\xE1ltat\xE1s:** ${input.serviceInterest || "\u2013"}

**\xDCzenet:**
${input.message}`,
      replyTo: input.email
    });
    if (isEmailConfigured()) {
      try {
        const formType = input.formContext === "careers" ? "career" : "contact";
        const submissionFields = formType === "career" ? [
          { label: "Email", value: input.email },
          { label: "Telefon", value: input.phone || "" },
          { label: "Poz\xEDci\xF3", value: input.subject?.replace(/^Karrier jelentkezés:\s*/, "") || "" },
          { label: "\xDCzenet", value: input.message }
        ] : [
          { label: "Email", value: input.email },
          { label: "Telefon", value: input.phone || "" },
          { label: "T\xE1rgy", value: input.subject || "" },
          { label: "Szolg\xE1ltat\xE1s", value: input.serviceInterest || "" },
          { label: "\xDCzenet", value: input.message }
        ];
        await sendEmail({
          to: input.email,
          subject: CONFIRMATION_SUBJECTS[formType],
          html: renderConfirmationEmailHtml({
            name: input.name,
            formType,
            submission: submissionFields
          }),
          replyTo: "info@g2amarketing.hu"
        });
      } catch (err) {
        console.warn("[contact.submit] confirmation send failed:", err);
      }
    }
    return { success: true };
  })
});
var AUDIT_HONEYPOT = "botField";
function normalizeUrl(input) {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  if (/^(mailto|tel):/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
var auditRouter = router({
  submit: publicProcedure.input(z2.object({
    name: z2.string().min(2, "K\xE9rj\xFCk adja meg a nev\xE9t"),
    email: z2.string().email("\xC9rv\xE9nyes email c\xEDm sz\xFCks\xE9ges"),
    phone: z2.string().optional(),
    company: z2.string().optional(),
    website: z2.string().optional(),
    monthlyBudget: z2.string().optional(),
    currentChallenges: z2.string().optional(),
    goals: z2.string().optional(),
    [AUDIT_HONEYPOT]: z2.string().optional(),
    turnstileToken: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(
      ctx,
      {
        website: input[AUDIT_HONEYPOT],
        turnstileToken: input.turnstileToken
      },
      "audit",
      { success: true }
    );
    if (guard) return guard;
    const { turnstileToken: _tt, ...inputForDb } = input;
    void _tt;
    const normalizedInput = { ...inputForDb, website: normalizeUrl(inputForDb.website) };
    await createAuditLead(normalizedInput);
    await notifyOwner({
      title: `\xDAj ingyenes audit k\xE9r\xE9s: ${normalizedInput.name}`,
      content: `**N\xE9v:** ${normalizedInput.name}
**Email:** ${normalizedInput.email}
**Telefon:** ${normalizedInput.phone || "\u2013"}
**C\xE9g:** ${normalizedInput.company || "\u2013"}
**Weboldal:** ${normalizedInput.website || "\u2013"}
**Havi b\xFCdzs\xE9:** ${normalizedInput.monthlyBudget || "\u2013"}

**Kih\xEDv\xE1sok:**
${normalizedInput.currentChallenges || "\u2013"}

**C\xE9lok:**
${normalizedInput.goals || "\u2013"}`,
      replyTo: normalizedInput.email
    });
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
              { label: "C\xE9g", value: normalizedInput.company || "" },
              { label: "Weboldal", value: normalizedInput.website || "" },
              { label: "Havi b\xFCdzs\xE9", value: normalizedInput.monthlyBudget || "" },
              { label: "Kih\xEDv\xE1sok", value: normalizedInput.currentChallenges || "" },
              { label: "C\xE9lok", value: normalizedInput.goals || "" }
            ]
          }),
          replyTo: "info@g2amarketing.hu"
        });
      } catch (err) {
        console.warn("[audit.submit] confirmation send failed:", err);
      }
    }
    return { success: true };
  })
});
function renderWelcomeEmailHtml2(name, unsubscribeUrl, topics) {
  return renderWelcomeEmailHtml({ name, unsubscribeUrl, topics });
}
var newsletterRouter = router({
  subscribe: publicProcedure.input(z2.object({
    email: z2.string().email("\xC9rv\xE9nyes email c\xEDm sz\xFCks\xE9ges"),
    // Name is now required (the signup forms enforce it client-side too).
    // Compact one-line forms — like the footer band — bypass with a placeholder
    // name "(footer)" since they only collect the email; admin can fix later.
    name: z2.string().min(1, "Keresztn\xE9v megad\xE1sa k\xF6telez\u0151").max(256),
    source: z2.string().optional(),
    // Topics the subscriber chose. Stored as comma-separated `tags` so the
    // existing admin segment/filter UI keeps working without a migration.
    // Allowed values are validated client-side; server accepts any string
    // (the admin can also add tags manually).
    topics: z2.array(z2.string().max(64)).max(10).optional(),
    [HONEYPOT_FIELD]: z2.string().optional(),
    // Cloudflare Turnstile widget token — verified server-side
    // against the secret key. Optional in the schema so legacy
    // clients still work; the guard enforces presence when the
    // feature flag is on.
    turnstileToken: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(ctx, input, "newsletter", { success: true, alreadySubscribed: false });
    if (guard) return guard;
    const exists = await checkNewsletterSubscriberExists(input.email);
    if (exists) return { success: true, alreadySubscribed: true };
    const unsubscribeToken = randomBytes(16).toString("hex");
    await createNewsletterSubscriber({
      email: input.email,
      name: input.name,
      source: input.source ?? "website",
      tags: input.topics && input.topics.length > 0 ? input.topics.join(",") : null,
      unsubscribeToken
    });
    await notifyOwner({
      title: `\xDAj h\xEDrlev\xE9l feliratkoz\xF3`,
      content: `**Email:** ${input.email}
**N\xE9v:** ${input.name}
**T\xE9m\xE1k:** ${input.topics?.join(", ") || "\u2013"}
**Forr\xE1s:** ${input.source || "website"}`,
      replyTo: input.email
    });
    if (isEmailConfigured()) {
      const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get("host")}`;
      const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
      await sendEmail({
        to: input.email,
        subject: "\xDCdv a G2A Marketing h\xEDrlevel\xE9ben!",
        html: renderWelcomeEmailHtml2(input.name, unsubscribeUrl, input.topics),
        text: `${input.name ? `Szia ${input.name}!` : "Szia!"}

K\xF6sz\xF6nj\xFCk, hogy feliratkozt\xE1l a G2A Marketing h\xEDrlevel\xE9re. Heti max 1 emailt k\xFCld\xFCnk, sose k\xE9retlen\xFCl.

Leiratkoz\xE1s: ${unsubscribeUrl}

G2A Marketing Bt. \xB7 P\xE9cs \xB7 info@g2amarketing.hu`
      });
    }
    return { success: true, alreadySubscribed: false };
  }),
  /** Public — confirm unsubscribe by token. Used by the GET /api/newsletter/unsubscribe page. */
  unsubscribe: publicProcedure.input(z2.object({ token: z2.string().min(8) })).mutation(async ({ input }) => {
    const email = await unsubscribeByToken(input.token);
    return { success: Boolean(email), email };
  })
});
var adminRouter = router({
  // Hero Slides
  heroSlides: router({
    list: adminProcedure2.query(() => getAllHeroSlides()),
    create: adminProcedure2.input(z2.object({
      title: z2.string(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      subtitle: z2.string().optional(),
      subtitleEn: z2.string().optional(),
      subtitleZh: z2.string().optional(),
      backgroundImage: z2.string().optional(),
      backgroundImageAlt: z2.string().optional(),
      ctaPrimaryText: z2.string().optional(),
      ctaPrimaryTextEn: z2.string().optional(),
      ctaPrimaryTextZh: z2.string().optional(),
      ctaPrimaryUrl: z2.string().optional(),
      ctaSecondaryText: z2.string().optional(),
      ctaSecondaryTextEn: z2.string().optional(),
      ctaSecondaryTextZh: z2.string().optional(),
      ctaSecondaryUrl: z2.string().optional(),
      sortOrder: z2.number().default(0),
      isActive: z2.boolean().default(true)
    })).mutation(({ input }) => createHeroSlide(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      title: z2.string().optional(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      subtitle: z2.string().optional(),
      subtitleEn: z2.string().optional(),
      subtitleZh: z2.string().optional(),
      backgroundImage: z2.string().optional(),
      backgroundImageAlt: z2.string().optional(),
      ctaPrimaryText: z2.string().optional(),
      ctaPrimaryTextEn: z2.string().optional(),
      ctaPrimaryTextZh: z2.string().optional(),
      ctaPrimaryUrl: z2.string().optional(),
      ctaSecondaryText: z2.string().optional(),
      ctaSecondaryTextEn: z2.string().optional(),
      ctaSecondaryTextZh: z2.string().optional(),
      ctaSecondaryUrl: z2.string().optional(),
      sortOrder: z2.number().optional(),
      isActive: z2.boolean().optional()
    }) })).mutation(({ input }) => updateHeroSlide(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteHeroSlide(input.id))
  }),
  // Services
  services: router({
    list: adminProcedure2.query(() => getServices()),
    create: adminProcedure2.input(z2.object({
      slug: z2.string(),
      number: z2.string().optional(),
      title: z2.string(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      shortDescription: z2.string().optional(),
      shortDescriptionEn: z2.string().optional(),
      shortDescriptionZh: z2.string().optional(),
      heroTitle: z2.string().optional(),
      heroTitleEn: z2.string().optional(),
      heroTitleZh: z2.string().optional(),
      heroSubtitle: z2.string().optional(),
      heroSubtitleEn: z2.string().optional(),
      heroSubtitleZh: z2.string().optional(),
      heroImage: z2.string().optional(),
      heroImageAlt: z2.string().optional(),
      content: z2.string().optional(),
      contentEn: z2.string().optional(),
      contentZh: z2.string().optional(),
      icon: z2.string().optional(),
      metaTitle: z2.string().optional(),
      metaTitleEn: z2.string().optional(),
      metaTitleZh: z2.string().optional(),
      metaDescription: z2.string().optional(),
      metaDescriptionEn: z2.string().optional(),
      metaDescriptionZh: z2.string().optional(),
      sortOrder: z2.number().default(0)
    })).mutation(({ input }) => createService(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      slug: z2.string().optional(),
      number: z2.string().optional(),
      title: z2.string().optional(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      shortDescription: z2.string().optional(),
      shortDescriptionEn: z2.string().optional(),
      shortDescriptionZh: z2.string().optional(),
      heroTitle: z2.string().optional(),
      heroTitleEn: z2.string().optional(),
      heroTitleZh: z2.string().optional(),
      heroSubtitle: z2.string().optional(),
      heroSubtitleEn: z2.string().optional(),
      heroSubtitleZh: z2.string().optional(),
      heroImage: z2.string().optional(),
      heroImageAlt: z2.string().optional(),
      content: z2.string().optional(),
      contentEn: z2.string().optional(),
      contentZh: z2.string().optional(),
      icon: z2.string().optional(),
      metaTitle: z2.string().optional(),
      metaTitleEn: z2.string().optional(),
      metaTitleZh: z2.string().optional(),
      metaDescription: z2.string().optional(),
      metaDescriptionEn: z2.string().optional(),
      metaDescriptionZh: z2.string().optional(),
      sortOrder: z2.number().optional()
    }) })).mutation(({ input }) => updateService(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteService(input.id))
  }),
  // Categories
  categories: router({
    list: adminProcedure2.query(() => getCategories()),
    create: adminProcedure2.input(z2.object({
      name: z2.string(),
      nameEn: z2.string().optional(),
      nameZh: z2.string().optional(),
      slug: z2.string(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional()
    })).mutation(({ input }) => createCategory(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      name: z2.string().optional(),
      nameEn: z2.string().optional(),
      nameZh: z2.string().optional(),
      slug: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional()
    }) })).mutation(({ input }) => updateCategory(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteCategory(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteCategoriesBulk(input.ids))
  }),
  // Posts
  posts: router({
    list: adminProcedure2.query(() => getAllPostsAdmin()),
    create: adminProcedure2.input(z2.object({
      title: z2.string(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      slug: z2.string(),
      excerpt: z2.string().optional(),
      excerptEn: z2.string().optional(),
      excerptZh: z2.string().optional(),
      content: z2.string(),
      contentEn: z2.string().optional(),
      contentZh: z2.string().optional(),
      featuredImage: z2.string().optional(),
      featuredImageAlt: z2.string().optional(),
      categoryId: z2.number().optional(),
      authorName: z2.string().optional(),
      status: z2.enum(["draft", "published"]).default("draft"),
      metaTitle: z2.string().optional(),
      metaTitleEn: z2.string().optional(),
      metaTitleZh: z2.string().optional(),
      metaDescription: z2.string().optional(),
      metaDescriptionEn: z2.string().optional(),
      metaDescriptionZh: z2.string().optional(),
      ogImage: z2.string().optional(),
      publishedAt: z2.date().optional()
    })).mutation(({ input }) => createPost(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      title: z2.string().optional(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      slug: z2.string().optional(),
      excerpt: z2.string().optional(),
      excerptEn: z2.string().optional(),
      excerptZh: z2.string().optional(),
      content: z2.string().optional(),
      contentEn: z2.string().optional(),
      contentZh: z2.string().optional(),
      featuredImage: z2.string().optional(),
      featuredImageAlt: z2.string().optional(),
      categoryId: z2.number().optional(),
      authorName: z2.string().optional(),
      status: z2.enum(["draft", "published"]).optional(),
      metaTitle: z2.string().optional(),
      metaTitleEn: z2.string().optional(),
      metaTitleZh: z2.string().optional(),
      metaDescription: z2.string().optional(),
      metaDescriptionEn: z2.string().optional(),
      metaDescriptionZh: z2.string().optional(),
      ogImage: z2.string().optional(),
      publishedAt: z2.date().optional()
    }) })).mutation(({ input }) => updatePost(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deletePost(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(200) })).mutation(({ input }) => deletePostsBulk(input.ids))
  }),
  // Testimonials
  testimonials: router({
    list: adminProcedure2.query(() => getAllTestimonials()),
    create: adminProcedure2.input(z2.object({
      quote: z2.string(),
      quoteEn: z2.string().optional(),
      quoteZh: z2.string().optional(),
      authorName: z2.string(),
      authorTitle: z2.string().optional(),
      authorTitleEn: z2.string().optional(),
      authorTitleZh: z2.string().optional(),
      authorCompany: z2.string().optional(),
      authorImage: z2.string().optional(),
      authorImageAlt: z2.string().optional(),
      isActive: z2.boolean().default(true),
      sortOrder: z2.number().default(0)
    })).mutation(({ input }) => createTestimonial(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      quote: z2.string().optional(),
      quoteEn: z2.string().optional(),
      quoteZh: z2.string().optional(),
      authorName: z2.string().optional(),
      authorTitle: z2.string().optional(),
      authorTitleEn: z2.string().optional(),
      authorTitleZh: z2.string().optional(),
      authorCompany: z2.string().optional(),
      authorImage: z2.string().optional(),
      authorImageAlt: z2.string().optional(),
      isActive: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    }) })).mutation(({ input }) => updateTestimonial(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteTestimonial(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteTestimonialsBulk(input.ids))
  }),
  // Partners
  partners: router({
    list: adminProcedure2.query(() => getAllPartners()),
    create: adminProcedure2.input(z2.object({
      name: z2.string(),
      slug: z2.string().optional(),
      logo: z2.string().optional(),
      logoAlt: z2.string().optional(),
      website: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      category: z2.string().optional(),
      isActive: z2.boolean().default(true),
      sortOrder: z2.number().default(0)
    })).mutation(({ input }) => createPartner(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      name: z2.string().optional(),
      slug: z2.string().optional(),
      logo: z2.string().optional(),
      logoAlt: z2.string().optional(),
      website: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      category: z2.string().optional(),
      isActive: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    }) })).mutation(({ input }) => updatePartner(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deletePartner(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deletePartnersBulk(input.ids))
  }),
  // Industries
  industries: router({
    list: adminProcedure2.query(() => getAllIndustries()),
    create: adminProcedure2.input(z2.object({
      name: z2.string(),
      nameEn: z2.string().optional(),
      nameZh: z2.string().optional(),
      slug: z2.string(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      icon: z2.string().optional(),
      image: z2.string().optional(),
      imageAlt: z2.string().optional(),
      sortOrder: z2.number().default(0),
      isActive: z2.boolean().default(true)
    })).mutation(({ input }) => createIndustry(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      name: z2.string().optional(),
      nameEn: z2.string().optional(),
      nameZh: z2.string().optional(),
      slug: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      icon: z2.string().optional(),
      image: z2.string().optional(),
      imageAlt: z2.string().optional(),
      sortOrder: z2.number().optional(),
      isActive: z2.boolean().optional()
    }) })).mutation(({ input }) => updateIndustry(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteIndustry(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteIndustriesBulk(input.ids))
  }),
  // Technologies
  technologies: router({
    list: adminProcedure2.query(() => getAllTechnologies()),
    create: adminProcedure2.input(z2.object({
      name: z2.string(),
      logo: z2.string().optional(),
      logoAlt: z2.string().optional(),
      category: z2.enum(["marketing", "ai", "analytics", "other"]).default("marketing"),
      website: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      sortOrder: z2.number().default(0),
      isActive: z2.boolean().default(true)
    })).mutation(({ input }) => createTechnology(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      name: z2.string().optional(),
      logo: z2.string().optional(),
      logoAlt: z2.string().optional(),
      category: z2.enum(["marketing", "ai", "analytics", "other"]).optional(),
      website: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      sortOrder: z2.number().optional(),
      isActive: z2.boolean().optional()
    }) })).mutation(({ input }) => updateTechnology(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteTechnology(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteTechnologiesBulk(input.ids))
  }),
  // Values
  values: router({
    list: adminProcedure2.query(() => getAllValues()),
    create: adminProcedure2.input(z2.object({
      title: z2.string(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      icon: z2.string().optional(),
      sortOrder: z2.number().default(0),
      isActive: z2.boolean().default(true)
    })).mutation(({ input }) => createValue(input)),
    update: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({
      title: z2.string().optional(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional(),
      icon: z2.string().optional(),
      sortOrder: z2.number().optional(),
      isActive: z2.boolean().optional()
    }) })).mutation(({ input }) => updateValue(input.id, input.data)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteValue(input.id))
  }),
  // Contact Submissions
  contacts: router({
    list: adminProcedure2.query(() => getContactSubmissions()),
    markRead: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => markContactRead(input.id)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteContactSubmission(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(200) })).mutation(({ input }) => deleteContactSubmissionsBulk(input.ids))
  }),
  // Newsletter
  newsletter: router({
    list: adminProcedure2.query(() => getAllNewsletterSubscribers()),
    updateSegment: adminProcedure2.input(z2.object({
      id: z2.number(),
      segment: z2.string().optional(),
      source: z2.string().optional(),
      tags: z2.string().optional()
    })).mutation(({ input }) => updateNewsletterSubscriberSegment(input)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteNewsletterSubscriber(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(500) })).mutation(({ input }) => deleteNewsletterSubscribersBulk(input.ids)),
    // ─── Campaigns ────────────────────────────────────────────────────────────
    /** Count recipients for a given segment (preview before send). */
    estimateRecipients: adminProcedure2.input(z2.object({ segment: z2.string().nullable().optional() })).query(async ({ input }) => {
      const subs = await getActiveSubscribersForCampaign(input.segment ?? null);
      return { count: subs.length };
    }),
    /** List past + draft campaigns. */
    campaignList: adminProcedure2.query(() => listEmailCampaigns()),
    /**
     * Per-campaign event stats (delivered / opened / clicked / bounced /
     * complained — unique recipients). Powers the campaign-history table
     * in /admin/newsletter/campaigns. Returns zeros when the webhook
     * isn't yet configured (no events collected).
     */
    campaignStats: adminProcedure2.input(z2.object({ campaignId: z2.number() })).query(({ input }) => getCampaignEventStats(input.campaignId)),
    /** Send a test email to a single address (admin's own email is the typical target). */
    sendTest: adminProcedure2.input(z2.object({
      to: z2.string().email(),
      subject: z2.string().min(1),
      html: z2.string().min(20)
    })).mutation(async ({ input }) => {
      if (!isEmailConfigured()) {
        throw new TRPCError3({ code: "PRECONDITION_FAILED", message: "Resend nincs konfigur\xE1lva (.env: RESEND_API_KEY + RESEND_NOTIFY_EMAIL)" });
      }
      const html = input.html.replace(/\{\{unsubscribeUrl\}\}/g, "https://g2amarketing.hu/api/newsletter/unsubscribe?token=TEST_TOKEN");
      const ok = await sendEmail({
        to: input.to,
        subject: `[TEST] ${input.subject}`,
        html: `<div style="background:#fef3c7;padding:8px 12px;font-family:monospace;font-size:12px;color:#92400e;border-radius:4px;margin-bottom:16px">\u26A0 Ez egy TESZT email \u2014 nem ment ki a teljes list\xE1nak.</div>${html}`
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
    sendCampaign: adminProcedure2.input(z2.object({
      subject: z2.string().min(1),
      html: z2.string().min(20),
      text: z2.string().optional(),
      segment: z2.string().nullable().optional()
    })).mutation(async ({ input, ctx }) => {
      if (!isEmailConfigured()) {
        throw new TRPCError3({ code: "PRECONDITION_FAILED", message: "Resend nincs konfigur\xE1lva." });
      }
      const subs = await getActiveSubscribersForCampaign(input.segment ?? null);
      if (subs.length === 0) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Nincs c\xEDmzett a kiv\xE1lasztott szegmensben." });
      }
      const campaignId = await createEmailCampaign({
        subject: input.subject,
        html: input.html,
        text: input.text,
        segment: input.segment ?? null,
        sentByUserId: ctx.user.id
      });
      if (!campaignId) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "DB write failed" });
      }
      await updateEmailCampaign(campaignId, { status: "sending", recipientCount: subs.length });
      const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get("host")}`;
      let sent = 0, failed = 0;
      for (const sub of subs) {
        const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
        const personalizedHtml = input.html.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
        const personalizedText = input.text?.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
        try {
          const ok = await sendEmail({
            to: sub.email,
            subject: input.subject,
            html: personalizedHtml,
            text: personalizedText,
            tags: [{ name: "campaign_id", value: String(campaignId) }]
          });
          if (ok) sent++;
          else failed++;
        } catch (err) {
          console.error(`[campaign] send failed for ${sub.email}:`, err);
          failed++;
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      await updateEmailCampaign(campaignId, {
        status: failed === subs.length ? "failed" : "sent",
        sentCount: sent,
        failedCount: failed,
        sentAt: /* @__PURE__ */ new Date()
      });
      return { campaignId, recipientCount: subs.length, sent, failed };
    })
  }),
  // Pages SEO
  pages: router({
    list: adminProcedure2.query(() => getAllPages()),
    upsert: adminProcedure2.input(z2.object({
      slug: z2.string(),
      title: z2.string().optional(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      metaTitle: z2.string().optional(),
      metaTitleEn: z2.string().optional(),
      metaTitleZh: z2.string().optional(),
      metaDescription: z2.string().optional(),
      metaDescriptionEn: z2.string().optional(),
      metaDescriptionZh: z2.string().optional(),
      ogTitle: z2.string().optional(),
      ogTitleEn: z2.string().optional(),
      ogTitleZh: z2.string().optional(),
      ogDescription: z2.string().optional(),
      ogDescriptionEn: z2.string().optional(),
      ogDescriptionZh: z2.string().optional(),
      ogImage: z2.string().optional(),
      canonicalUrl: z2.string().optional(),
      schemaJson: z2.string().optional(),
      keywords: z2.string().optional(),
      keywordsEn: z2.string().optional(),
      keywordsZh: z2.string().optional()
    })).mutation(({ input }) => upsertPageSeo(input))
  }),
  // Case Studies
  caseStudies: router({
    list: adminProcedure2.query(() => getAllCaseStudies()),
    upsert: adminProcedure2.input(z2.object({
      id: z2.number().optional(),
      title: z2.string(),
      titleEn: z2.string().optional(),
      titleZh: z2.string().optional(),
      slug: z2.string(),
      client: z2.string().optional(),
      clientEn: z2.string().optional(),
      clientZh: z2.string().optional(),
      industry: z2.string().optional(),
      industryEn: z2.string().optional(),
      industryZh: z2.string().optional(),
      challenge: z2.string().optional(),
      challengeEn: z2.string().optional(),
      challengeZh: z2.string().optional(),
      solution: z2.string().optional(),
      solutionEn: z2.string().optional(),
      solutionZh: z2.string().optional(),
      results: z2.string().optional(),
      resultsEn: z2.string().optional(),
      resultsZh: z2.string().optional(),
      featuredImage: z2.string().optional(),
      featuredImageAlt: z2.string().optional(),
      tags: z2.string().optional(),
      isActive: z2.boolean().optional(),
      sortOrder: z2.number().optional(),
      metaTitle: z2.string().optional(),
      metaTitleEn: z2.string().optional(),
      metaTitleZh: z2.string().optional(),
      metaDescription: z2.string().optional(),
      metaDescriptionEn: z2.string().optional(),
      metaDescriptionZh: z2.string().optional()
    })).mutation(({ input }) => upsertCaseStudy(input)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteCaseStudy(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteCaseStudiesBulk(input.ids))
  }),
  // Translate (DeepL bridge)
  translate: router({
    status: adminProcedure2.query(() => ({ configured: isTranslateConfigured() })),
    run: adminProcedure2.input(z2.object({ text: z2.string().min(1), target: z2.enum(["en", "zh"]) })).mutation(async ({ input }) => {
      const text2 = await translate(input.text, input.target);
      return { text: text2 };
    }),
    // Translate multiple fields at once (used by "Fill all from HU" bulk button)
    runBatch: adminProcedure2.input(z2.object({
      items: z2.array(z2.object({ key: z2.string(), text: z2.string().min(1) })),
      target: z2.enum(["en", "zh"])
    })).mutation(async ({ input }) => {
      const results = {};
      for (const item of input.items) {
        try {
          results[item.key] = await translate(item.text, input.target);
        } catch (err) {
          results[item.key] = "";
          console.error(`[translate] Failed for key ${item.key}:`, err);
        }
      }
      return { results };
    })
  }),
  // AI (OpenAI bridge) — admin-only blog draft + SEO meta + text improve
  ai: router({
    status: adminProcedure2.query(() => ({
      configured: isAiConfigured(),
      model: isAiConfigured() ? getAiModel() : null
    })),
    generateBlogDraft: adminProcedure2.input(z2.object({
      topic: z2.string().min(3),
      audience: z2.string().optional(),
      wordCount: z2.number().int().min(200).max(3e3).optional(),
      lang: z2.enum(["hu", "en", "zh"]).optional(),
      tone: z2.enum(["professional", "conversational", "technical"]).optional()
    })).mutation(({ input }) => generateBlogDraft(input)),
    /**
     * Run the draft generator in parallel for HU + EN + ZH. The admin UI
     * gets one return value to fill all three language tabs in one go.
     */
    generateMultilangBlogDraft: adminProcedure2.input(z2.object({
      topic: z2.string().min(3),
      audience: z2.string().optional(),
      wordCount: z2.number().int().min(200).max(3e3).optional(),
      tone: z2.enum(["professional", "conversational", "technical"]).optional(),
      // Optional client-generated UUID for progress tracking. The
      // mutation creates the ai_jobs row, the worker increments
      // completedSteps after each OpenAI call, and a parallel
      // polling query (getAiJobStatus below) lets the UI render
      // real progress instead of a static spinner.
      jobId: z2.string().uuid().optional()
    })).mutation(async ({ input }) => {
      const { jobId, ...gen } = input;
      if (jobId) {
        await createAiJob({ id: jobId, type: "multilang_blog_draft", totalSteps: 6 });
      }
      try {
        const result = await generateMultilangBlogDraft(gen, jobId);
        return result;
      } catch (err) {
        if (jobId) {
          await updateAiJob(jobId, {
            status: "failed",
            errorMessage: err instanceof Error ? err.message : String(err)
          }).catch(() => {
          });
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
    getAiJobStatus: adminProcedure2.input(z2.object({ jobId: z2.string().uuid() })).query(({ input }) => getAiJob(input.jobId)),
    generateSeoMeta: adminProcedure2.input(z2.object({
      topic: z2.string().min(3),
      slug: z2.string().optional(),
      context: z2.string().optional(),
      lang: z2.enum(["hu", "en", "zh"]).optional()
    })).mutation(({ input }) => generateSeoMeta(input)),
    improveText: adminProcedure2.input(z2.object({
      text: z2.string().min(10),
      mode: z2.enum(["tighten", "expand", "rephrase"]).optional(),
      lang: z2.enum(["hu", "en", "zh"]).optional(),
      instruction: z2.string().optional()
    })).mutation(async ({ input }) => ({ text: await improveText(input) })),
    /**
     * Generate an image via OpenAI DALL·E 3, then re-host on Cloudinary so the
     * URL is permanent (DALL·E URLs expire after ~1 hour). Returns the
     * Cloudinary CDN URL ready to drop into a hero/featured image field.
     *
     * Cost: ~$0.04 (square standard) to $0.12 (wide HD). The UI should warn.
     */
    generateImage: adminProcedure2.input(z2.object({
      prompt: z2.string().min(8).max(1e3),
      size: z2.enum(["1024x1024", "1792x1024", "1024x1792"]).optional(),
      quality: z2.enum(["standard", "hd"]).optional(),
      // `style` ("vivid" / "natural") is accepted but ignored — the
      // legacy DALL·E 3 parameter is gone. We keep the field in the
      // schema so older clients don't get a validation error.
      style: z2.enum(["vivid", "natural"]).optional(),
      /** Cloudinary folder for the uploaded asset. Default "g2a/ai-generated". */
      folder: z2.string().optional(),
      /** Filename hint — used as the public_id base. Slugified. */
      filenameHint: z2.string().optional()
    })).mutation(async ({ input }) => {
      const result = await generateImage({
        prompt: input.prompt,
        size: input.size,
        quality: input.quality
      });
      const buffer = result.imageBuffer;
      if (!isCloudinaryConfigured()) {
        const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
        return {
          url: dataUrl,
          revisedPrompt: result.revisedPrompt,
          ephemeral: true,
          warning: "Cloudinary nincs konfigur\xE1lva \u2014 a k\xE9p inline (data URL) form\xE1ban \xE9rkezik. Cloudinary be\xE1ll\xEDt\xE1s\xE1val CDN-re ker\xFCl."
        };
      }
      const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "ai-image";
      const filename = `${slugify(input.filenameHint || "ai-image")}.png`;
      const upload = await cloudinaryUpload(
        buffer,
        "image/png",
        filename,
        input.folder || "g2a/ai-generated"
      );
      return {
        url: upload.secureUrl,
        publicId: upload.publicId,
        revisedPrompt: result.revisedPrompt,
        ephemeral: false
      };
    })
  }),
  // Audit Leads
  auditLeads: router({
    list: adminProcedure2.query(() => getAllAuditLeads()),
    markContacted: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => markAuditLeadContacted(input.id)),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteAuditLead(input.id)),
    deleteMany: adminProcedure2.input(z2.object({ ids: z2.array(z2.number()).min(1).max(200) })).mutation(({ input }) => deleteAuditLeadsBulk(input.ids))
  }),
  // Site Settings
  settings: router({
    list: adminProcedure2.query(() => getAllSiteSettings()),
    upsert: adminProcedure2.input(z2.object({ key: z2.string(), value: z2.string() })).mutation(({ input }) => upsertSiteSetting(input.key, input.value))
  }),
  // Brand voice — used by every AI generator (social copy, blog drafts,
  // SEO meta) to write in the G2A house style instead of generic agency tone.
  brandVoice: router({
    get: adminProcedure2.query(async () => {
      const voice = await loadBrandVoice();
      return voice ?? EMPTY_BRAND_VOICE;
    }),
    update: adminProcedure2.input(
      z2.object({
        companyDescription: z2.string().max(4e3),
        audience: z2.string().max(2e3),
        toneOfVoice: z2.string().max(2e3),
        dos: z2.array(z2.string().max(300)).max(30),
        donts: z2.array(z2.string().max(300)).max(30),
        examples: z2.object({
          linkedin: z2.array(z2.object({ context: z2.string().max(200).optional(), text: z2.string().max(5e3) })).max(10),
          facebook: z2.array(z2.object({ context: z2.string().max(200).optional(), text: z2.string().max(5e3) })).max(10),
          instagram: z2.array(z2.object({ context: z2.string().max(200).optional(), text: z2.string().max(5e3) })).max(10),
          blog: z2.array(z2.object({ context: z2.string().max(200).optional(), text: z2.string().max(5e3) })).max(10).optional()
        })
      })
    ).mutation(async ({ input }) => {
      const voice = {
        ...input,
        examples: {
          ...input.examples,
          blog: input.examples.blog ?? []
        }
      };
      await saveBrandVoice(voice);
      return { success: true };
    })
  }),
  // Stats
  stats: adminProcedure2.query(async () => {
    const [contactsData, subscribersData, postsData, partnersData, auditLeadsData] = await Promise.all([
      getContactSubmissions(),
      getAllNewsletterSubscribers(),
      getAllPostsAdmin(),
      getAllPartners(),
      getAllAuditLeads()
    ]);
    return {
      totalContacts: contactsData.length,
      unreadContacts: contactsData.filter((c) => !c.isRead).length,
      totalSubscribers: subscribersData.length,
      totalPosts: postsData.length,
      publishedPosts: postsData.filter((p) => p.status === "published").length,
      totalPartners: partnersData.length,
      totalAuditLeads: auditLeadsData.length,
      openAuditLeads: auditLeadsData.filter((l) => !l.isContacted).length
    };
  }),
  /**
   * Daily time-series for the dashboard chart — last N days.
   * Buckets contact submissions, audit leads, and newsletter signups by day.
   * All counted client-side from the full lists; for tables under 50K rows this
   * is fast enough and avoids per-day SQL roundtrips.
   */
  statsTimeSeries: adminProcedure2.input(z2.object({ days: z2.number().int().min(7).max(365).default(30) })).query(async ({ input }) => {
    const [contactsData, subscribersData, auditLeadsData] = await Promise.all([
      getContactSubmissions(),
      getAllNewsletterSubscribers(),
      getAllAuditLeads()
    ]);
    const now = /* @__PURE__ */ new Date();
    const startMs = now.getTime() - input.days * 24 * 60 * 60 * 1e3;
    const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const buckets2 = {};
    for (let i = input.days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1e3);
      const key = dayKey(d);
      buckets2[key] = { date: key, contacts: 0, auditLeads: 0, subscribers: 0 };
    }
    const tally = (createdAt, field) => {
      if (!createdAt) return;
      const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
      if (isNaN(d.getTime()) || d.getTime() < startMs) return;
      const key = dayKey(d);
      if (buckets2[key]) buckets2[key][field]++;
    };
    contactsData.forEach((c) => tally(c.createdAt, "contacts"));
    auditLeadsData.forEach((l) => tally(l.createdAt, "auditLeads"));
    subscribersData.forEach((s) => tally(s.createdAt, "subscribers"));
    const series = Object.values(buckets2).sort((a, b) => a.date.localeCompare(b.date));
    const totals = series.reduce(
      (acc, b) => ({ contacts: acc.contacts + b.contacts, auditLeads: acc.auditLeads + b.auditLeads, subscribers: acc.subscribers + b.subscribers }),
      { contacts: 0, auditLeads: 0, subscribers: 0 }
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
  recentActivity: adminProcedure2.input(z2.object({ limit: z2.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
    const [contactsData, subscribersData, auditLeadsData] = await Promise.all([
      getContactSubmissions(),
      getAllNewsletterSubscribers(),
      getAllAuditLeads()
    ]);
    const events = [
      ...contactsData.map((c) => ({
        type: "contact",
        id: c.id,
        title: c.name || c.email,
        subtitle: c.subject || c.email,
        at: typeof c.createdAt === "string" ? c.createdAt : c.createdAt?.toISOString() ?? (/* @__PURE__ */ new Date(0)).toISOString(),
        href: `/admin/contacts`,
        unread: !c.isRead
      })),
      ...auditLeadsData.map((l) => ({
        type: "audit",
        id: l.id,
        title: l.name || l.email,
        subtitle: l.company || l.website || l.email,
        at: typeof l.createdAt === "string" ? l.createdAt : l.createdAt?.toISOString() ?? (/* @__PURE__ */ new Date(0)).toISOString(),
        href: `/admin/audit-leads`,
        unread: !l.isContacted
      })),
      ...subscribersData.map((s) => ({
        type: "newsletter",
        id: s.id,
        title: s.name || s.email,
        subtitle: s.email,
        at: typeof s.createdAt === "string" ? s.createdAt : s.createdAt?.toISOString() ?? (/* @__PURE__ */ new Date(0)).toISOString(),
        href: `/admin/newsletter`,
        // Newsletter signups are informational only — never marked unread.
        unread: false
      }))
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
  systemHealth: adminProcedure2.query(async () => {
    return {
      openai: {
        configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
        model: process.env.OPENAI_MODEL || "gpt-4o-mini"
      },
      resend: {
        configured: Boolean(process.env.RESEND_API_KEY?.trim()),
        notifyAddress: process.env.RESEND_NOTIFY_EMAIL || null
      },
      cloudinary: {
        configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME?.trim() && process.env.CLOUDINARY_API_KEY?.trim()),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || null
      },
      turnstile: {
        // VITE_ vars aren't readable from Node at runtime in production
        // Vercel — they're inlined at build time. We use the server-side
        // secret as the proxy for "feature on", since both are set together.
        configured: Boolean(process.env.TURNSTILE_SECRET_KEY?.trim())
      },
      deepl: {
        configured: Boolean(process.env.DEEPL_API_KEY?.trim())
      },
      database: {
        configured: Boolean(process.env.DATABASE_URL?.trim() || process.env.TIDB_HOST?.trim())
      },
      calendly: {
        configured: Boolean(process.env.VITE_CALENDLY_URL || process.env.CALENDLY_URL)
      }
    };
  }),
  /**
   * Content + AI usage snapshot — what's been published recently,
   * what AI features are in play. Cheap roll-up over the posts table
   * — we don't track per-call AI cost yet, so this gives the admin
   * "content velocity" instead of a token meter.
   */
  contentSummary: adminProcedure2.query(async () => {
    const posts2 = await getAllPostsAdmin();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1e3;
    const lastNDays = (n) => posts2.filter((p) => {
      const created = p.createdAt instanceof Date ? p.createdAt.getTime() : new Date(p.createdAt).getTime();
      return !Number.isNaN(created) && now - created < n * oneDay;
    }).length;
    const recentPublished = posts2.filter((p) => p.status === "published").sort((a, b) => {
      const aT = new Date(a.publishedAt ?? a.createdAt ?? 0).getTime();
      const bT = new Date(b.publishedAt ?? b.createdAt ?? 0).getTime();
      return bT - aT;
    }).slice(0, 5).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      publishedAt: p.publishedAt ?? null
    }));
    return {
      postsLast7Days: lastNDays(7),
      postsLast30Days: lastNDays(30),
      draftCount: posts2.filter((p) => p.status === "draft").length,
      publishedCount: posts2.filter((p) => p.status === "published").length,
      recentPublished
    };
  })
});
var SOCIAL_PLATFORM = z2.enum(["linkedin", "facebook", "instagram"]);
var socialRouter = router({
  /** List all connected social accounts (admin sees status per platform). */
  listAccounts: adminProcedure2.query(() => listSocialAccounts()),
  /** All drafts/published posts attached to a given blog post — latest per
   *  platform. The admin UI uses this to render the per-platform share rows. */
  listForPost: adminProcedure2.input(z2.object({ postId: z2.number().int().positive() })).query(({ input }) => getLatestSocialPostsForBlogPost(input.postId)),
  /** Generate AI copy for a (blog post, platform) combination. Doesn't
   *  persist on its own — the UI lets the admin tweak the result before
   *  saving via `saveDraft`. */
  generateCopy: adminProcedure2.input(
    z2.object({
      postId: z2.number().int().positive(),
      platform: SOCIAL_PLATFORM
    })
  ).mutation(async ({ input }) => {
    if (!isAiConfigured()) {
      throw new TRPCError3({
        code: "PRECONDITION_FAILED",
        message: "OPENAI_API_KEY nincs konfigur\xE1lva."
      });
    }
    const post = await getAllPostsAdmin().then(
      (rows) => rows.find((p) => p.id === input.postId)
    );
    if (!post) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Blog cikk nem tal\xE1lhat\xF3" });
    }
    const url = `https://g2amarketing.hu/hirek/${post.slug}`;
    const copy = await generateSocialCopy({
      platform: input.platform,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      url,
      lang: "hu"
    });
    return { copy };
  }),
  /** Persist a draft (or overwrite the latest one for this platform). */
  saveDraft: adminProcedure2.input(
    z2.object({
      postId: z2.number().int().positive(),
      platform: SOCIAL_PLATFORM,
      copy: z2.string().min(1).max(1e4)
    })
  ).mutation(async ({ input }) => {
    const id = await createSocialPost({
      postId: input.postId,
      platform: input.platform,
      copy: input.copy,
      status: "draft"
    });
    return { id, success: true };
  })
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  content: contentRouter,
  contact: contactRouter,
  audit: auditRouter,
  newsletter: newsletterRouter,
  admin: adminRouter,
  upload: uploadRouter,
  social: socialRouter
});

// server/_core/context.ts
var DEV_BYPASS_ACTIVE = process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true";
var DEV_ADMIN_USER = {
  id: 0,
  openId: "dev-bypass-admin",
  name: "Dev Admin (Bypass)",
  email: "dev@local",
  loginMethod: "dev-bypass",
  role: "admin",
  createdAt: /* @__PURE__ */ new Date(),
  updatedAt: /* @__PURE__ */ new Date(),
  lastSignedIn: /* @__PURE__ */ new Date()
};
if (DEV_BYPASS_ACTIVE) {
  console.warn("[DEV] Admin auth BYPASS is active \u2014 admin API requires no login. Never enable in production.");
}
async function createContext(opts) {
  if (DEV_BYPASS_ACTIVE) {
    return { req: opts.req, res: opts.res, user: DEV_ADMIN_USER };
  }
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/newsletterRoutes.ts
init_db();
function renderHtml(opts) {
  const title = opts.ok ? "Sikeres leiratkoz\xE1s" : "Hib\xE1s link";
  const body = opts.ok ? `<p>${escapeHtml2(opts.email || "")} <strong>leiratkozott</strong> a G2A Marketing h\xEDrlevel\xE9r\u0151l.</p>
       <p style="color:#64748b;font-size:14px">T\xF6bb emailt nem k\xFCld\xFCnk neked. Ha m\xE9gis maradn\xE1l, \xEDrj nek\xFCnk: <a href="mailto:info@g2amarketing.hu">info@g2amarketing.hu</a>.</p>` : `<p>Ez a leiratkoz\xE1si link \xE9rv\xE9nytelen vagy lej\xE1rt.</p>
       <p style="color:#64748b;font-size:14px">Ha tov\xE1bbra is kapsz emailt t\u0151l\xFCnk, \xEDrj az <a href="mailto:info@g2amarketing.hu">info@g2amarketing.hu</a> c\xEDmre \xE9s k\xE9zzel t\xF6r\xF6l\xFCnk a list\xE1b\xF3l.</p>`;
  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title} \u2013 G2A Marketing</title>
<style>
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; color: #0f172a; }
  .card { max-width: 520px; margin: 80px auto; padding: 40px 32px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(15,23,42,0.1); border-top: 4px solid #14B8A6; }
  h1 { margin: 0 0 16px; font-size: 22px; }
  p { line-height: 1.6; font-size: 15px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #94a3b8; text-align: center; }
  a { color: #0d9488; }
</style>
</head>
<body>
<div class="card">
  <h1>${title}</h1>
  ${body}
  <div class="footer">G2A Marketing Bt. \xB7 P\xE9cs \xB7 <a href="https://g2amarketing.hu">g2amarketing.hu</a></div>
</div>
</body>
</html>`;
}
function escapeHtml2(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function registerNewsletterRoutes(app2) {
  const handler = async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token || token.length < 8) {
      res.status(400).type("html").send(renderHtml({ ok: false }));
      return;
    }
    try {
      const email = await unsubscribeByToken(token);
      res.status(200).type("html").send(renderHtml({ ok: Boolean(email), email }));
    } catch (err) {
      console.error("[newsletter] unsubscribe error:", err);
      res.status(500).type("html").send(renderHtml({ ok: false }));
    }
  };
  app2.get("/api/newsletter/unsubscribe", handler);
  app2.post("/api/newsletter/unsubscribe", handler);
}

// server/_core/resendWebhookRoute.ts
init_env();
init_db();
import { createHmac, timingSafeEqual } from "crypto";
var TOLERANCE_SECONDS = 5 * 60;
function verifySvixSignature(rawBody, headers, secret) {
  const id = headers["svix-id"];
  const timestamp2 = headers["svix-timestamp"];
  const signatureHeader = headers["svix-signature"];
  if (!id || !timestamp2 || !signatureHeader) return false;
  const ts = Number(timestamp2);
  if (!Number.isFinite(ts)) return false;
  const drift = Math.abs(Date.now() / 1e3 - ts);
  if (drift > TOLERANCE_SECONDS) return false;
  const secretBytes = secret.startsWith("whsec_") ? Buffer.from(secret.slice(6), "base64") : Buffer.from(secret, "utf8");
  const signedPayload = `${id}.${timestamp2}.${rawBody}`;
  const expected = createHmac("sha256", secretBytes).update(signedPayload).digest("base64");
  const candidates = signatureHeader.split(" ");
  for (const candidate of candidates) {
    const parts = candidate.split(",");
    if (parts.length !== 2 || parts[0] !== "v1") continue;
    const provided = parts[1];
    if (provided.length !== expected.length) continue;
    if (timingSafeEqual(
      Buffer.from(provided, "utf8"),
      Buffer.from(expected, "utf8")
    )) {
      return true;
    }
  }
  return false;
}
function extractTags(eventData) {
  if (!eventData || typeof eventData !== "object") return {};
  const tags = eventData.tags;
  if (!tags) return {};
  if (Array.isArray(tags)) {
    const map = {};
    for (const t2 of tags) {
      if (t2 && typeof t2 === "object" && typeof t2.name === "string" && typeof t2.value === "string") {
        map[t2.name] = t2.value;
      }
    }
    return map;
  }
  if (typeof tags === "object") {
    return Object.fromEntries(
      Object.entries(tags).filter(
        ([, v]) => typeof v === "string"
      )
    );
  }
  return {};
}
function registerResendWebhookRoute(app2) {
  app2.post(
    "/api/webhooks/resend",
    (req, res, next) => {
      let body = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1e6) {
          res.status(413).json({ error: "Payload too large" });
          req.destroy();
        }
      });
      req.on("end", () => {
        req.rawBody = body;
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch {
          res.status(400).json({ error: "Invalid JSON" });
          return;
        }
        next();
      });
    },
    async (req, res) => {
      const rawBody = req.rawBody ?? "";
      if (ENV.resendWebhookSecret) {
        if (!verifySvixSignature(rawBody, req.headers, ENV.resendWebhookSecret)) {
          res.status(401).json({ error: "Invalid signature" });
          return;
        }
      } else if (ENV.isProduction) {
        console.warn(
          "[resend-webhook] RESEND_WEBHOOK_SECRET not set in production \u2014 accepting unsigned events"
        );
      }
      const event = req.body;
      if (!event || typeof event !== "object" || !event.type) {
        res.status(400).json({ error: "Missing event type" });
        return;
      }
      const data = event.data ?? {};
      const recipient = Array.isArray(data.to) ? data.to[0] ?? "unknown" : data.to ?? "unknown";
      const messageId = data.email_id;
      const tags = extractTags(data);
      const campaignIdRaw = tags.campaign_id ?? tags.campaignId;
      const campaignId = campaignIdRaw && /^\d+$/.test(campaignIdRaw) ? Number(campaignIdRaw) : null;
      try {
        await recordEmailEvent({
          campaignId,
          recipient,
          eventType: event.type,
          resendMessageId: messageId,
          rawData: JSON.stringify(event)
        });
      } catch (err) {
        console.error("[resend-webhook] DB write failed:", err);
        res.status(500).json({ error: "Storage failed" });
        return;
      }
      res.status(200).json({ ok: true });
    }
  );
}

// server/_core/sitemapRoute.ts
init_db();
init_schema();
import { desc as desc2, eq as eq3 } from "drizzle-orm";
var ORIGIN = "https://g2amarketing.hu";
var LANGS = [
  { code: "hu", prefix: "", hreflang: "hu" },
  { code: "en", prefix: "/en", hreflang: "en" },
  { code: "zh", prefix: "/zh", hreflang: "zh-CN" }
];
var STATIC_PATHS = [
  // Home + top-level
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/rolunk", priority: "0.8", changefreq: "monthly" },
  { path: "/ingyenes-audit", priority: "0.9", changefreq: "monthly" },
  { path: "/ingyenes-seo-audit", priority: "0.9", changefreq: "monthly" },
  { path: "/referenciak", priority: "0.8", changefreq: "monthly" },
  { path: "/kapcsolat", priority: "0.8", changefreq: "monthly" },
  { path: "/szakertelem", priority: "0.7", changefreq: "monthly" },
  { path: "/technologia", priority: "0.7", changefreq: "monthly" },
  { path: "/partnereink", priority: "0.7", changefreq: "monthly" },
  { path: "/hirek", priority: "0.8", changefreq: "weekly" },
  { path: "/adatvedelmi-iranyelvek", priority: "0.3", changefreq: "yearly" },
  { path: "/aszf", priority: "0.3", changefreq: "yearly" },
  { path: "/hirlevel", priority: "0.7", changefreq: "monthly" },
  { path: "/marketing-audit", priority: "0.9", changefreq: "monthly" },
  { path: "/karrier", priority: "0.6", changefreq: "monthly" },
  // Services
  { path: "/szolgaltatasok", priority: "0.9", changefreq: "monthly" },
  ...[
    "lokalizacio",
    "arculattervezes",
    "hirdeteskezeles",
    "kozossegi-media",
    "strategiai-marketing",
    "keresooptimalizalas",
    "webfejlesztes",
    "ai-marketing",
    "ppc-google-ads",
    "meta-hirdetes",
    "tartalommarketing",
    "marketing-automatizacio",
    "esg-kommunikacio",
    "employer-branding",
    "nemzetkozi-marketing"
  ].map((slug) => ({
    path: `/szolgaltatasok/${slug}`,
    priority: "0.8",
    changefreq: "monthly"
  })),
  // Industry landing pages
  ...[
    "marketing-egeszsegugyi-cegeknek",
    "marketing-szepsegipari-cegeknek",
    "marketing-mernoki-irodaknak",
    "marketing-autoipari-cegeknek",
    "marketing-ugyvedi-irodaknak",
    "marketing-technologiai-cegeknek",
    "marketing-onkormanyzati-projekteknek",
    "marketing-b2b-cegeknek",
    "marketing-kreativ-cegeknek",
    "marketing-vendeglatas-cegeknek",
    "marketing-webshopoknak",
    "marketing-szolgaltato-cegeknek",
    "marketing-kozlekedesi-cegeknek"
  ].map((slug) => ({
    path: `/iparagi/${slug}`,
    priority: "0.8",
    changefreq: "monthly"
  }))
];
function buildUrl(path, langPrefix) {
  if (path === "/") return `${ORIGIN}${langPrefix || "/"}`;
  return `${ORIGIN}${langPrefix}${path}`;
}
function escapeXml(s) {
  return s.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&apos;",
    '"': "&quot;"
  })[c]);
}
function renderUrlEntry(entry) {
  const lastmod = entry.lastmod ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const blocks = [];
  for (const lang of LANGS) {
    const loc = buildUrl(entry.path, lang.prefix);
    const altLinks = LANGS.map(
      (alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(buildUrl(entry.path, alt.prefix))}" />`
    ).join("\n");
    blocks.push(
      `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
${altLinks}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(buildUrl(entry.path, ""))}" />
  </url>`
    );
  }
  return blocks.join("\n");
}
async function fetchDynamicPaths() {
  const db = await getDb();
  if (!db) return [];
  const out = [];
  try {
    const blogRows = await db.select({
      slug: posts.slug,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt
    }).from(posts).where(eq3(posts.status, "published")).orderBy(desc2(posts.publishedAt));
    for (const r of blogRows) {
      const mod = r.updatedAt ?? r.publishedAt;
      out.push({
        path: `/hirek/${r.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: mod ? new Date(mod).toISOString().slice(0, 10) : void 0
      });
    }
    const csRows = await db.select({
      slug: caseStudies.slug,
      updatedAt: caseStudies.updatedAt
    }).from(caseStudies).where(eq3(caseStudies.isActive, true)).orderBy(desc2(caseStudies.updatedAt));
    for (const r of csRows) {
      out.push({
        path: `/referenciak/${r.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0, 10) : void 0
      });
    }
  } catch (err) {
    console.warn("[sitemap] DB query failed, serving static skeleton only:", err);
  }
  return out;
}
function registerSitemapRoute(app2) {
  const handler = async (_req, res) => {
    const dynamic = await fetchDynamicPaths();
    const all = [...STATIC_PATHS, ...dynamic];
    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      "",
      `  <!-- Generated dynamically \u2014 ${all.length} paths \xD7 ${LANGS.length} languages = ${all.length * LANGS.length} URL entries -->`,
      "",
      ...all.map(renderUrlEntry),
      "",
      "</urlset>",
      ""
    ].join("\n");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    res.send(body);
  };
  app2.get("/sitemap.xml", handler);
  app2.get("/api/sitemap.xml", handler);
}

// server/_core/rssRoute.ts
init_db();
init_schema();
import { desc as desc3, eq as eq4 } from "drizzle-orm";
var ORIGIN2 = "https://g2amarketing.hu";
var FEED_TITLE = "G2A Marketing \u2014 Blog";
var FEED_DESC = "Marketing tippek, trendek \xE9s ipar\xE1gi h\xEDrek a G2A Marketing csapat\xE1t\xF3l. P\xE9cs, Magyarorsz\xE1g.";
var FEED_LANGUAGE = "hu-HU";
var ITEM_LIMIT = 20;
function escapeXml2(s) {
  return s.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&apos;",
    '"': "&quot;"
  })[c]);
}
function htmlToText(html, maxChars = 500) {
  const text2 = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text2.length > maxChars ? text2.slice(0, maxChars).trimEnd() + "\u2026" : text2;
}
function rfc822(d) {
  return d.toUTCString();
}
function registerRssRoute(app2) {
  const handler = async (_req, res) => {
    const db = await getDb();
    const now = /* @__PURE__ */ new Date();
    let items = [];
    if (db) {
      try {
        const rows = await db.select({
          slug: posts.slug,
          title: posts.title,
          excerpt: posts.excerpt,
          content: posts.content,
          authorName: posts.authorName,
          publishedAt: posts.publishedAt,
          updatedAt: posts.updatedAt
        }).from(posts).where(eq4(posts.status, "published")).orderBy(desc3(posts.publishedAt)).limit(ITEM_LIMIT);
        items = rows.map((r) => {
          const link = `${ORIGIN2}/hirek/${r.slug}`;
          const pubDate = r.publishedAt ? rfc822(new Date(r.publishedAt)) : rfc822(now);
          const description = htmlToText(r.excerpt || r.content || "");
          const author = r.authorName || "G2A Marketing";
          return [
            "    <item>",
            `      <title>${escapeXml2(r.title)}</title>`,
            `      <link>${escapeXml2(link)}</link>`,
            `      <guid isPermaLink="true">${escapeXml2(link)}</guid>`,
            `      <pubDate>${pubDate}</pubDate>`,
            `      <author>info@g2amarketing.hu (${escapeXml2(author)})</author>`,
            `      <description><![CDATA[${description}]]></description>`,
            "    </item>"
          ].join("\n");
        });
      } catch (err) {
        console.warn("[rss] DB query failed, serving empty channel:", err);
      }
    }
    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      "  <channel>",
      `    <title>${escapeXml2(FEED_TITLE)}</title>`,
      `    <link>${ORIGIN2}/hirek</link>`,
      `    <description>${escapeXml2(FEED_DESC)}</description>`,
      `    <language>${FEED_LANGUAGE}</language>`,
      `    <lastBuildDate>${rfc822(now)}</lastBuildDate>`,
      `    <atom:link href="${ORIGIN2}/rss.xml" rel="self" type="application/rss+xml" />`,
      ...items,
      "  </channel>",
      "</rss>",
      ""
    ].join("\n");
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");
    res.send(body);
  };
  app2.get("/rss.xml", handler);
  app2.get("/api/rss.xml", handler);
}

// server/_core/passwordAuthRoute.ts
init_db();
import { SignJWT as SignJWT2 } from "jose";
import { timingSafeEqual as timingSafeEqual2 } from "node:crypto";
init_env();
var PASSWORD_ADMIN_OPEN_ID = "password-admin";
var FALLBACK_APP_ID_TAG = "g2a-password-admin";
function safeEquals(a, b) {
  if (a.length !== b.length) return false;
  return timingSafeEqual2(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}
function registerPasswordAuthRoute(app2) {
  app2.get("/api/_diag/send-test", async (req, res) => {
    const provided = req.query.key || "";
    if (!ENV.cookieSecret || provided !== ENV.cookieSecret) {
      return res.status(401).json({ error: "Wrong or missing ?key=" });
    }
    const to = req.query.to || ENV.resendNotifyEmail;
    if (!to) {
      return res.status(400).json({ error: "No `to` (and RESEND_NOTIFY_EMAIL is empty)" });
    }
    if (!ENV.resendApiKey) {
      return res.status(503).json({ error: "RESEND_API_KEY not set" });
    }
    const from = ENV.resendFromEmail || "onboarding@resend.dev";
    const payload = {
      from,
      to,
      subject: "[DIAG] G2A test send \u2014 Vercel function",
      html: `<p>This is a diagnostic email from the Vercel function.</p><p>From: <code>${from}</code></p><p>To: <code>${to}</code></p><p>If you receive this, the Resend creds + env vars are wired correctly.</p>`,
      text: `Diagnostic email from Vercel.
From: ${from}
To: ${to}`
    };
    let status = 0;
    let responseText = "";
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      status = r.status;
      responseText = await r.text();
    } catch (err) {
      return res.status(500).json({ error: "Fetch failed", detail: String(err) });
    }
    res.json({
      sent_to: to,
      from_used: from,
      resend_status: status,
      resend_response: (() => {
        try {
          return JSON.parse(responseText);
        } catch {
          return responseText.slice(0, 500);
        }
      })()
    });
  });
  app2.get("/api/_diag/admin-env", (_req, res) => {
    res.json({
      // Admin login
      ADMIN_EMAIL_set: Boolean(ENV.adminEmail),
      ADMIN_EMAIL_shape: ENV.adminEmail ? `${ENV.adminEmail.slice(0, 2)}***@***${ENV.adminEmail.slice(-3)}` : null,
      ADMIN_PASSWORD_set: Boolean(ENV.adminPassword),
      ADMIN_PASSWORD_length: ENV.adminPassword.length,
      JWT_SECRET_set: Boolean(ENV.cookieSecret),
      JWT_SECRET_length: ENV.cookieSecret.length,
      VITE_APP_ID_set: Boolean(ENV.appId),
      VITE_OAUTH_PORTAL_URL_set: Boolean(ENV.oauthPortalUrl),
      // Resend / email
      RESEND_API_KEY_set: Boolean(ENV.resendApiKey),
      RESEND_FROM_EMAIL_raw: ENV.resendFromEmail || null,
      RESEND_FROM_EMAIL_valid: /<[^@\s]+@[^@\s]+>|^[^@\s]+@[^@\s]+$/.test(
        (ENV.resendFromEmail || "").trim()
      ),
      RESEND_NOTIFY_EMAIL: ENV.resendNotifyEmail || null,
      RESEND_NOTIFY_EMAIL_valid: /^[^@\s]+@[^@\s]+$/.test(
        (ENV.resendNotifyEmail || "").trim()
      ),
      RESEND_WEBHOOK_SECRET_set: Boolean(ENV.resendWebhookSecret),
      // Cron
      CRON_SECRET_set: Boolean(process.env.CRON_SECRET),
      // Runtime
      NODE_ENV: process.env.NODE_ENV || "unknown"
    });
  });
  app2.post("/api/auth/password-login", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }
    if (!ENV.adminEmail || !ENV.adminPassword || !ENV.cookieSecret) {
      res.status(503).json({
        error: "Password login not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET in Vercel environment."
      });
      return;
    }
    const ip = getClientIp(req);
    const limit = await checkRateLimitDb(`admin-login:${ip}`, {
      max: 5,
      windowMs: 15 * 60 * 1e3
    });
    if (!limit.allowed) {
      const minutes = Math.ceil(((limit.retryAt ?? Date.now()) - Date.now()) / 6e4);
      res.status(429).json({
        error: `T\xFAl sok bejelentkez\xE9si k\xEDs\xE9rlet. Pr\xF3b\xE1ld \xFAjra ${minutes} perc m\xFAlva.`
      });
      return;
    }
    const emailOk = safeEquals(email, ENV.adminEmail);
    const pwdOk = safeEquals(password, ENV.adminPassword);
    if (!(emailOk && pwdOk)) {
      res.status(401).json({ error: "Hib\xE1s email vagy jelsz\xF3." });
      return;
    }
    try {
      await upsertUser({
        openId: PASSWORD_ADMIN_OPEN_ID,
        name: "Admin",
        email,
        role: "admin",
        loginMethod: "password",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const secretKey = new TextEncoder().encode(ENV.cookieSecret);
      const expirationSeconds = Math.floor((Date.now() + ONE_YEAR_MS) / 1e3);
      const sessionToken = await new SignJWT2({
        openId: PASSWORD_ADMIN_OPEN_ID,
        appId: ENV.appId || FALLBACK_APP_ID_TAG,
        name: "Admin"
      }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true });
    } catch (err) {
      console.error("[password-login] Session creation failed:", err);
      res.status(500).json({ error: "Bels\u0151 hiba a bejelentkez\xE9s sor\xE1n." });
    }
  });
}

// server/_core/digestCronRoute.ts
init_db();
init_db();
init_schema();
import { desc as desc4, eq as eq5 } from "drizzle-orm";
var ORIGIN3 = "https://g2amarketing.hu";
var ITEM_COUNT = 4;
var TOPIC_FALLBACK = "strategy";
var CATEGORY_TO_TOPIC = {
  strategy: "strategy",
  marketing: "strategy",
  ai: "ai",
  "ai-automation": "ai",
  seo: "paid",
  ppc: "paid",
  paid: "paid",
  "case-study": "case_studies",
  esettanulmany: "case_studies"
};
function shortenExcerpt(html, maxLen = 160) {
  if (!html) return "";
  const text2 = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text2.length <= maxLen) return text2;
  const cut = text2.slice(0, maxLen);
  const period = cut.lastIndexOf(".");
  return period > maxLen - 50 ? cut.slice(0, period + 1) : cut.trimEnd() + "\u2026";
}
function estimateReadingMin(html) {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
async function fetchFeaturedPosts() {
  const dbi = await getDb();
  if (!dbi) return [];
  const overrideSlugs = (process.env.DIGEST_NEXT_SLUGS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (overrideSlugs.length > 0) {
    const rows = await dbi.select({
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      categoryId: posts.categoryId
    }).from(posts);
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    return overrideSlugs.map((s) => bySlug.get(s)).filter((r) => Boolean(r));
  }
  return dbi.select({
    slug: posts.slug,
    title: posts.title,
    excerpt: posts.excerpt,
    content: posts.content,
    categoryId: posts.categoryId
  }).from(posts).where(eq5(posts.status, "published")).orderBy(desc4(posts.publishedAt)).limit(ITEM_COUNT);
}
async function inferTopic(categoryId) {
  if (!categoryId) return TOPIC_FALLBACK;
  const categories2 = await getCategories();
  const cat = categories2.find((c) => c.id === categoryId);
  if (!cat || !cat.slug) return TOPIC_FALLBACK;
  return CATEGORY_TO_TOPIC[cat.slug] || TOPIC_FALLBACK;
}
function getWeekLabel() {
  const d = /* @__PURE__ */ new Date();
  const year = d.getFullYear();
  const monthName = d.toLocaleDateString("hu-HU", { month: "long", day: "numeric" });
  return `${year} \u2014 ${monthName}`;
}
function registerDigestCronRoute(app2) {
  const handler = async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.authorization || "";
      if (auth !== `Bearer ${secret}`) {
        return res.status(401).json({ error: "Unauthorized: missing or wrong Bearer token" });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(503).json({
        error: "CRON_SECRET not set in production. Refusing to send."
      });
    }
    if (!isEmailConfigured()) {
      return res.status(503).json({ error: "RESEND_API_KEY not configured" });
    }
    const dbi = await getDb();
    if (!dbi) return res.status(503).json({ error: "Database unavailable" });
    const featured = await fetchFeaturedPosts();
    if (featured.length === 0) {
      return res.status(412).json({ error: "No published posts to feature" });
    }
    const articles = await Promise.all(
      featured.map(async (p) => ({
        topic: await inferTopic(p.categoryId),
        title: p.title,
        excerpt: shortenExcerpt(p.excerpt || p.content),
        url: `${ORIGIN3}/hirek/${p.slug}`,
        readMin: estimateReadingMin(p.content)
      }))
    );
    const UNSUB_PLACEHOLDER = "{{unsubscribeUrl}}";
    const subject = `G2A Heti v\xE1logat\xE1s \u2014 ${getWeekLabel()}`;
    const html = renderDigestEmailHtml({
      name: void 0,
      weekLabel: getWeekLabel(),
      articles,
      unsubscribeUrl: UNSUB_PLACEHOLDER
    });
    const text2 = articles.map((a) => `[${a.topic.toUpperCase()}] ${a.title}
${a.url}
${a.excerpt}
`).join("\n");
    const subscribers = await getActiveSubscribersForCampaign(null);
    if (subscribers.length === 0) {
      return res.json({ campaignId: null, recipientCount: 0, sent: 0, failed: 0, note: "no subscribers" });
    }
    const campaignId = await createEmailCampaign({
      subject,
      html,
      text: text2,
      segment: null,
      sentByUserId: null
      // cron — no human user
    });
    if (!campaignId) return res.status(500).json({ error: "Failed to create campaign row" });
    await updateEmailCampaign(campaignId, {
      status: "sending",
      recipientCount: subscribers.length
    });
    let sent = 0, failed = 0;
    for (const sub of subscribers) {
      const unsubUrl = `${ORIGIN3}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
      const personalHtml = html.replace(new RegExp(UNSUB_PLACEHOLDER, "g"), unsubUrl);
      const personalText = text2.replace(new RegExp(UNSUB_PLACEHOLDER, "g"), unsubUrl);
      try {
        const ok = await sendEmail({
          to: sub.email,
          subject,
          html: personalHtml,
          text: personalText,
          tags: [{ name: "campaign_id", value: String(campaignId) }]
        });
        if (ok) sent++;
        else failed++;
      } catch (err) {
        console.error(`[cron-digest] send failed for ${sub.email}:`, err);
        failed++;
      }
      await new Promise((r) => setTimeout(r, 600));
    }
    await updateEmailCampaign(campaignId, {
      status: failed === subscribers.length ? "failed" : "sent",
      sentCount: sent,
      failedCount: failed,
      sentAt: /* @__PURE__ */ new Date()
    });
    return res.json({ campaignId, recipientCount: subscribers.length, sent, failed });
  };
  app2.get("/api/cron/weekly-digest", handler);
  app2.post("/api/cron/weekly-digest", handler);
}

// server/_core/app.ts
function createApp() {
  const app2 = express();
  registerResendWebhookRoute(app2);
  app2.use(express.json({ limit: "50mb" }));
  app2.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app2);
  registerPasswordAuthRoute(app2);
  registerNewsletterRoutes(app2);
  registerSitemapRoute(app2);
  registerRssRoute(app2);
  registerDigestCronRoute(app2);
  app2.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  return app2;
}

// server/_core/serverless.ts
var app = createApp();
var serverless_default = app;
export {
  serverless_default as default
};
