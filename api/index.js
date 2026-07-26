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
var users, siteSettings, pages, categories, posts, services, heroSlides, testimonials, partners, industries, technologies, values, contactSubmissions, emailCampaigns, emailEvents, rateLimitHits, socialAccounts, socialPosts, newsletterSubscribers, caseStudies, aiJobs, auditLeads, jobPositions, jobApplications, emailAutomationEnrollments;
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
      // ─── Multi-user admin access (2026-07) ───────────────────────────────────
      // Staff accounts live in this table with their own scrypt password hash and
      // a granular permission list. The ADMIN_EMAIL/ADMIN_PASSWORD env pair still
      // works as the owner's recovery path; the owner row is upserted on login.
      /** scrypt hash in `scrypt$<saltHex>$<keyHex>` form. Null = invited, not set. */
      passwordHash: varchar("passwordHash", { length: 255 }),
      /** JSON array of permission keys (see shared/permissions.ts). */
      permissions: text("permissions"),
      /** Deactivated staff keep their history but can't sign in. */
      isActive: boolean("isActive").default(true).notNull(),
      /** True for the ADMIN_EMAIL owner — always full access, never removable. */
      isOwner: boolean("isOwner").default(false).notNull(),
      /** Single-use token for invite-set-password and forgot-password flows. */
      resetToken: varchar("resetToken", { length: 128 }),
      resetTokenExpiresAt: timestamp("resetTokenExpiresAt"),
      /**
       * Sessions issued before this instant are rejected. Set to now() whenever the
       * password is (re)set, so a password reset immediately invalidates every
       * existing session — the point of "reset my password" when an account may be
       * compromised. Null = no cutoff (all otherwise-valid sessions accepted).
       */
      sessionsValidFrom: timestamp("sessionsValidFrom"),
      invitedAt: timestamp("invitedAt"),
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
      // ─── NewServicePage structured layout (2026-06) ──────────────────────────
      // The new service-detail layout (benefits / process / faq) is now
      // DB-driven & admin-editable. Scalars follow the field/En/Zh pattern;
      // the repeatable sections are single JSON columns whose items carry the
      // localized subfields inline ({ hu, en, zh }) so rows can't drift apart.
      subtitle: text("subtitle"),
      subtitleEn: text("subtitleEn"),
      subtitleZh: text("subtitleZh"),
      intro: text("intro"),
      introEn: text("introEn"),
      introZh: text("introZh"),
      cta: varchar("cta", { length: 512 }),
      ctaEn: varchar("ctaEn", { length: 512 }),
      ctaZh: varchar("ctaZh", { length: 512 }),
      color: varchar("color", { length: 32 }),
      benefits: text("benefits"),
      // JSON: [{ title:{hu,en,zh}, desc:{hu,en,zh} }]
      process: text("process"),
      // JSON: [{ step, title:{hu,en,zh}, desc:{hu,en,zh} }]
      faq: text("faq"),
      // JSON: [{ q:{hu,en,zh}, a:{hu,en,zh} }]
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
      // ─── Lead-magnet funnel segmentation (2026-07) ─────────────────────────
      // Captured from the interactive checklist (/marketing-teszt). Forward-
      // compatible with the planned scoring/automation layer: `score` also holds
      // behavioural points later, `band` drives which nurture branch a subscriber
      // is enrolled into.
      score: int("score"),
      band: varchar("band", { length: 64 }),
      weakestAreas: text("weakestAreas"),
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
    jobPositions = mysqlTable("job_positions", {
      id: int("id").autoincrement().primaryKey(),
      titleHu: varchar("titleHu", { length: 256 }).notNull(),
      titleEn: varchar("titleEn", { length: 256 }),
      titleZh: varchar("titleZh", { length: 256 }),
      descHu: text("descHu"),
      descEn: text("descEn"),
      descZh: text("descZh"),
      location: varchar("location", { length: 128 }),
      employmentType: varchar("employmentType", { length: 128 }),
      isActive: boolean("isActive").default(true).notNull(),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    jobApplications = mysqlTable("job_applications", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 256 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 64 }),
      positionId: int("positionId"),
      positionTitle: varchar("positionTitle", { length: 256 }),
      /** Comma-separated activity-area keys (see shared/careerAreas.ts). */
      areas: text("areas"),
      message: text("message"),
      cvFilename: varchar("cvFilename", { length: 256 }),
      status: varchar("status", { length: 32 }).default("new").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    emailAutomationEnrollments = mysqlTable("email_automation_enrollments", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull(),
      automationKey: varchar("automationKey", { length: 64 }).notNull(),
      currentStep: int("currentStep").default(0).notNull(),
      nextRunAt: timestamp("nextRunAt"),
      status: varchar("status", { length: 32 }).default("active").notNull(),
      band: varchar("band", { length: 64 }),
      name: varchar("name", { length: 256 }),
      enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
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
  cancelEnrollmentsForEmail: () => cancelEnrollmentsForEmail,
  checkNewsletterSubscriberExists: () => checkNewsletterSubscriberExists,
  createAiJob: () => createAiJob,
  createAuditLead: () => createAuditLead,
  createCategory: () => createCategory,
  createContactSubmission: () => createContactSubmission,
  createEmailCampaign: () => createEmailCampaign,
  createEnrollment: () => createEnrollment,
  createHeroSlide: () => createHeroSlide,
  createIndustry: () => createIndustry,
  createJobApplication: () => createJobApplication,
  createJobPosition: () => createJobPosition,
  createNewsletterSubscriber: () => createNewsletterSubscriber,
  createPartner: () => createPartner,
  createPost: () => createPost,
  createService: () => createService,
  createSocialPost: () => createSocialPost,
  createStaffUser: () => createStaffUser,
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
  deleteJobApplication: () => deleteJobApplication,
  deleteJobPosition: () => deleteJobPosition,
  deleteNewsletterSubscriber: () => deleteNewsletterSubscriber,
  deleteNewsletterSubscribersBulk: () => deleteNewsletterSubscribersBulk,
  deletePartner: () => deletePartner,
  deletePartnersBulk: () => deletePartnersBulk,
  deletePost: () => deletePost,
  deletePostsBulk: () => deletePostsBulk,
  deleteService: () => deleteService,
  deleteStaffUser: () => deleteStaffUser,
  deleteTechnologiesBulk: () => deleteTechnologiesBulk,
  deleteTechnology: () => deleteTechnology,
  deleteTestimonial: () => deleteTestimonial,
  deleteTestimonialsBulk: () => deleteTestimonialsBulk,
  deleteValue: () => deleteValue,
  ensureOwnerUser: () => ensureOwnerUser,
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
  getDueEnrollments: () => getDueEnrollments,
  getEnrollmentStats: () => getEnrollmentStats,
  getHeroSlides: () => getHeroSlides,
  getIndustries: () => getIndustries,
  getJobPosition: () => getJobPosition,
  getLatestSocialPostsForBlogPost: () => getLatestSocialPostsForBlogPost,
  getNewsletterSubscriberByEmail: () => getNewsletterSubscriberByEmail,
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
  getUserByEmail: () => getUserByEmail,
  getUserById: () => getUserById,
  getUserByOpenId: () => getUserByOpenId,
  getUserByResetToken: () => getUserByResetToken,
  getValues: () => getValues,
  hasActiveEnrollment: () => hasActiveEnrollment,
  listActiveJobPositions: () => listActiveJobPositions,
  listAllJobPositions: () => listAllJobPositions,
  listEmailCampaigns: () => listEmailCampaigns,
  listJobApplications: () => listJobApplications,
  listSocialAccounts: () => listSocialAccounts,
  listStaffUsers: () => listStaffUsers,
  markAuditLeadContacted: () => markAuditLeadContacted,
  markContactRead: () => markContactRead,
  recordEmailEvent: () => recordEmailEvent,
  unsubscribeByToken: () => unsubscribeByToken,
  updateAiJob: () => updateAiJob,
  updateCategory: () => updateCategory,
  updateEmailCampaign: () => updateEmailCampaign,
  updateEnrollment: () => updateEnrollment,
  updateHeroSlide: () => updateHeroSlide,
  updateIndustry: () => updateIndustry,
  updateJobApplicationStatus: () => updateJobApplicationStatus,
  updateJobPosition: () => updateJobPosition,
  updateNewsletterSubscriberSegment: () => updateNewsletterSubscriberSegment,
  updateNewsletterSubscriberSegmentation: () => updateNewsletterSubscriberSegmentation,
  updatePartner: () => updatePartner,
  updatePost: () => updatePost,
  updateService: () => updateService,
  updateSocialPost: () => updateSocialPost,
  updateStaffUser: () => updateStaffUser,
  updateTechnology: () => updateTechnology,
  updateTestimonial: () => updateTestimonial,
  updateValue: () => updateValue,
  upsertCaseStudy: () => upsertCaseStudy,
  upsertPageSeo: () => upsertPageSeo,
  upsertSiteSetting: () => upsertSiteSetting,
  upsertUser: () => upsertUser
});
import { and, asc, desc, eq, inArray, lte, sql } from "drizzle-orm";
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
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function listStaffUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "admin")).orderBy(asc(users.id));
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createStaffUser(data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(users).values({
    openId: data.openId,
    name: data.name,
    email: data.email,
    role: "admin",
    loginMethod: "password",
    permissions: data.permissions,
    isActive: true,
    isOwner: false,
    resetToken: data.resetToken,
    resetTokenExpiresAt: data.resetTokenExpiresAt,
    invitedAt: /* @__PURE__ */ new Date()
  });
  return getUserByEmail(data.email);
}
async function updateStaffUser(id, patch) {
  const db = await getDb();
  if (!db) return;
  if (Object.values(patch).every((v) => v === void 0)) return;
  await db.update(users).set(patch).where(eq(users.id, id));
}
async function deleteStaffUser(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(users).where(and(eq(users.id, id), eq(users.isOwner, false)));
}
async function getUserByResetToken(token) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
  const user = result[0];
  if (!user) return void 0;
  const exp = user.resetTokenExpiresAt ? new Date(user.resetTokenExpiresAt).getTime() : 0;
  if (!exp || exp < Date.now()) return void 0;
  return user;
}
async function ensureOwnerUser(openId, email) {
  const db = await getDb();
  if (!db) return void 0;
  const existing = await getUserByEmail(email);
  if (existing) {
    if (!existing.isOwner || existing.role !== "admin" || !existing.isActive) {
      await db.update(users).set({ isOwner: true, role: "admin", isActive: true }).where(eq(users.id, existing.id));
    }
    return getUserByEmail(email);
  }
  await db.insert(users).values({
    openId,
    name: "Admin",
    email,
    role: "admin",
    loginMethod: "password",
    isOwner: true,
    isActive: true
  });
  return getUserByEmail(email);
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
async function updateNewsletterSubscriberSegmentation(email, data) {
  const db = await getDb();
  if (!db) return;
  if (Object.values(data).every((v) => v === void 0)) return;
  await db.update(newsletterSubscribers).set(data).where(eq(newsletterSubscribers.email, email));
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
async function getNewsletterSubscriberByEmail(email) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email)).limit(1);
  return result[0] ?? null;
}
async function deleteNewsletterSubscriber(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
}
async function hasActiveEnrollment(email, automationKey) {
  const db = await getDb();
  if (!db) return false;
  const r = await db.select().from(emailAutomationEnrollments).where(and(eq(emailAutomationEnrollments.email, email), eq(emailAutomationEnrollments.automationKey, automationKey), eq(emailAutomationEnrollments.status, "active"))).limit(1);
  return r.length > 0;
}
async function createEnrollment(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(emailAutomationEnrollments).values({
    email: data.email,
    automationKey: data.automationKey,
    band: data.band ?? null,
    name: data.name ?? null,
    currentStep: 0,
    nextRunAt: data.nextRunAt,
    status: "active"
  });
}
async function getDueEnrollments(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailAutomationEnrollments).where(and(eq(emailAutomationEnrollments.status, "active"), lte(emailAutomationEnrollments.nextRunAt, /* @__PURE__ */ new Date()))).orderBy(asc(emailAutomationEnrollments.nextRunAt)).limit(limit);
}
async function updateEnrollment(id, data) {
  const db = await getDb();
  if (!db) return;
  if (Object.values(data).every((v) => v === void 0)) return;
  await db.update(emailAutomationEnrollments).set(data).where(eq(emailAutomationEnrollments.id, id));
}
async function cancelEnrollmentsForEmail(email) {
  const db = await getDb();
  if (!db) return;
  await db.update(emailAutomationEnrollments).set({ status: "cancelled" }).where(and(eq(emailAutomationEnrollments.email, email), eq(emailAutomationEnrollments.status, "active")));
}
async function getEnrollmentStats() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    automationKey: emailAutomationEnrollments.automationKey,
    status: emailAutomationEnrollments.status,
    count: sql`count(*)`
  }).from(emailAutomationEnrollments).groupBy(emailAutomationEnrollments.automationKey, emailAutomationEnrollments.status);
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
  await cancelEnrollmentsForEmail(found[0].email);
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
async function listActiveJobPositions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobPositions).where(eq(jobPositions.isActive, true)).orderBy(asc(jobPositions.sortOrder), desc(jobPositions.createdAt));
}
async function listAllJobPositions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobPositions).orderBy(asc(jobPositions.sortOrder), desc(jobPositions.createdAt));
}
async function getJobPosition(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(jobPositions).where(eq(jobPositions.id, id)).limit(1);
  return rows[0] ?? null;
}
async function createJobPosition(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(jobPositions).values(data);
}
async function updateJobPosition(id, patch) {
  const db = await getDb();
  if (!db) return;
  if (Object.values(patch).every((v) => v === void 0)) return;
  await db.update(jobPositions).set(patch).where(eq(jobPositions.id, id));
}
async function deleteJobPosition(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(jobPositions).where(eq(jobPositions.id, id));
}
async function createJobApplication(data) {
  const db = await getDb();
  if (!db) return;
  await db.insert(jobApplications).values(data);
}
async function listJobApplications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
}
async function updateJobApplicationStatus(id, status) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobApplications).set({ status }).where(eq(jobApplications.id, id));
}
async function deleteJobApplication(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(jobApplications).where(eq(jobApplications.id, id));
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
var SESSION_TTL_MS = 1e3 * 60 * 60 * 24 * 14;
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
    // "lax" (not "none") is the right default for a same-origin admin panel:
    // the cookie rides top-level navigations but is withheld from cross-site
    // sub-requests, which blunts CSRF. The login flow is same-origin, so lax
    // doesn't break it. "none" would additionally require secure=true and would
    // send the session on every third-party request.
    sameSite: "lax",
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
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setIssuedAt(Math.floor(issuedAt / 1e3)).setExpirationTime(expirationSeconds).sign(secretKey);
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
        name,
        // iat is in seconds; expose as ms so the caller can compare it against
        // the user's sessionsValidFrom cutoff. Null for legacy tokens without iat.
        issuedAtMs: typeof payload.iat === "number" ? payload.iat * 1e3 : null
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
    if (user.sessionsValidFrom && session.issuedAtMs !== null) {
      if (session.issuedAtMs < user.sessionsValidFrom.getTime() - 5e3) {
        throw ForbiddenError("Session invalidated");
      }
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
    return { ok: false, error: "RESEND_API_KEY nincs be\xE1ll\xEDtva." };
  }
  const to = payload.to ?? ENV.resendNotifyEmail;
  if (!to || Array.isArray(to) && to.length === 0) {
    console.warn("[Email] No recipient (set RESEND_NOTIFY_EMAIL or pass `to`) \u2014 skipping");
    return { ok: false, error: "Nincs c\xEDmzett (RESEND_NOTIFY_EMAIL vagy `to`)." };
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
        tags: payload.tags,
        attachments: payload.attachments
      })
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[Email] Resend ${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
      let reason = `${res.status} ${res.statusText}`;
      try {
        const j = JSON.parse(detail);
        if (j.message) reason = j.message;
      } catch {
        if (detail) reason = detail.slice(0, 300);
      }
      return { ok: false, error: `Resend: ${reason}` };
    }
    const data = await res.json().catch(() => null);
    return { ok: true, messageId: data?.id };
  } catch (err) {
    console.warn("[Email] Resend request failed:", err);
    return { ok: false, error: String(err instanceof Error ? err.message : err) };
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

// shared/permissions.ts
var PERMISSION_KEYS = [
  // Tartalom
  "posts",
  "categories",
  "case_studies",
  "services",
  "industries",
  // Weboldal elemek
  "hero_slides",
  "partners",
  "testimonials",
  "technologies",
  "values",
  // Megkeresések
  "contacts",
  "audit_leads",
  "careers",
  // Marketing
  "newsletter",
  "seo",
  "brand_voice",
  // Rendszer
  "settings",
  "users"
];
var VALID = new Set(PERMISSION_KEYS);
function parsePermissions(raw) {
  if (Array.isArray(raw)) return raw.filter((k) => typeof k === "string" && VALID.has(k));
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((k) => typeof k === "string" && VALID.has(k));
  } catch {
    return [];
  }
}
function hasPermission(user, permission) {
  if (!user) return false;
  if (user.isOwner) return true;
  return parsePermissions(user.permissions).includes(permission);
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
var requireAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }
  if (ctx.user.isActive === false) {
    throw new TRPCError2({ code: "FORBIDDEN", message: "Ez a hozz\xE1f\xE9r\xE9s fel van f\xFCggesztve." });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var adminProcedure = t.procedure.use(requireAdmin);

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
function getBlogModel() {
  return process.env.OPENAI_BLOG_MODEL || "gpt-4o";
}
var DEFAULT_CHAT_TIMEOUT_MS = 5e4;
async function chat(messages, opts = {}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set \u2014 AI features are disabled");
  const body = {
    model: opts.model ?? getAiModel(),
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
    if (/^<(p|h2|h3|ul|ol|div|blockquote|table)/i.test(block)) {
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
  const wordCount = input.wordCount ?? 1700;
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

SZERKEZET (k\xF6telez\u0151, EBBEN a sorrendben \u2014 SEO + GEO / AI-keres\u0151 optimaliz\xE1lt):

1. C\xCDM (SEO c\xEDm) \u2014 figyelemfelkelt\u0151, konkr\xE9t, kulcssz\xF3-gazdag; max 65 karakter; NE legyen \xE1ltal\xE1nos.
2. META LE\xCDR\xC1S \u2014 max 155 karakter; tartalmazza a f\u0151 probl\xE9m\xE1t \xE9s az olvas\xF3i hasznot.
3. KIVONAT (lead) \u2014 1-2 mondat (max 200 karakter), a teljes cikk l\xE9nyege.
4. BEVEZET\u0150 (a content elej\xE9n) \u2014 2 bekezd\xE9s. NE defin\xEDci\xF3val kezdj. Kezdj \xE9letszer\u0171 \xFCzleti helyzettel, provokat\xEDv meg\xE1llap\xEDt\xE1ssal vagy gyakori vezet\u0151i t\xE9ved\xE9ssel. FRONT-LOADING: m\xE1r az els\u0151 2-3 mondatban der\xFClj\xF6n ki a cikk f\u0151 \xE1ll\xEDt\xE1sa / k\xF6zvetlen v\xE1lasza a t\xE9m\xE1ra \u2014 az AI-keres\u0151k (ChatGPT, Perplexity, Google AI Overviews) az el\xF6l \xE1ll\xF3, t\xF6m\xF6r v\xE1laszt id\xE9zik.
5. KULCS TANULS\xC1GOK \u2014 k\xF6zvetlen\xFCl a bevezet\u0151 ut\xE1n egy <h2>Kulcs tanuls\xE1gok</h2> blokk, alatta egy <ul> 3-5 ponttal. MINDEN pont \xF6nmag\xE1ban is \xE9rthet\u0151, teljes \xE1ll\xEDt\xE1s legyen (az AI-keres\u0151k pontosan az ilyen \xF6n\xE1ll\xF3, id\xE9zhet\u0151 \xE1ll\xEDt\xE1sokat emelik ki). NE \xE1ltal\xE1noss\xE1g \u2014 konkr\xE9t, a cikkb\u0151l fakad\xF3 tanuls\xE1g.
6. F\u0150 R\xC9SZ \u2014 6-8 nagyobb tartalmi blokk (<h2>). Ahol term\xE9szetes, a H2 legyen K\xC9RD\xC9S form\xE1j\xFA (illeszkedik az AI-keres\u0151k lek\xE9rdez\xE9seihez, pl. "Mi\xE9rt nem hoz eredm\xE9nyt a hirdet\xE9sed?"). MINDEN blokk 180-280 sz\xF3, \xE9s tartalmazzon:
   - er\u0151s, konkr\xE9t alc\xEDm
   - a probl\xE9ma emberi, \xFCzleti magyar\xE1zata
   - konkr\xE9t magyar KKV-p\xE9lda vagy tipikus helyzet
   - mit \xE9rdemes m\xE1sk\xE9pp csin\xE1lni
   Legal\xE1bb EGY blokkban legyen egy j\xF3l struktur\xE1lt <ul>/<ol> lista VAGY egy egyszer\u0171 \xF6sszehasonl\xEDt\xF3 <table> (pl. \u201Egyakori hiba" vs. \u201Ejobb megk\xF6zel\xEDt\xE9s" \u2014 <thead>/<tbody>/<tr>/<th>/<td>). Az AI-keres\u0151k a struktur\xE1lt adatot (lista, t\xE1bl\xE1zat) prefer\xE1lj\xE1k kiemel\xE9shez. De NE legyen minden blokk list\xE1s \u2014 a cikk gerince foly\xF3, \xF6sszef\xFCgg\u0151 sz\xF6veg.
7. MIT TEGY\xC9L MOST? \u2014 az utols\xF3 tartalmi blokk el\u0151tt egy <h2>Mit tegy\xE9l most?</h2>, alatta <ol> 4-6 konkr\xE9t, v\xE9grehajthat\xF3 l\xE9p\xE9ssel.
8. Z\xC1R\xC1S \u2014 utols\xF3 tartalmi <h2>. NE motiv\xE1ci\xF3s k\xF6zhely. Er\u0151s szakmai \xE1ll\xEDt\xE1ssal foglald \xF6ssze a t\xE9ma val\xF3di tanuls\xE1g\xE1t. A v\xE9g\xE9n term\xE9szetes, seg\xEDt\u0151 hang\xFA (NEM tolakod\xF3) CTA a G2A Marketing fel\xE9. P\xE9lda: "Ha szeretn\xE9d l\xE1tni, hol akad el a te c\xE9gedn\xE9l a n\xF6veked\xE9s, a G2A Marketing seg\xEDt felt\xE9rk\xE9pezni a piacot, az \xFCzeneteket \xE9s a digit\xE1lis jelenl\xE9t gyenge pontjait."
9. GYAKORI K\xC9RD\xC9SEK \u2014 a cikk LEGV\xC9G\xC9N egy <h2 id="faq">Gyakori k\xE9rd\xE9sek</h2> szekci\xF3 (az id="faq" K\xD6TELEZ\u0150 \xE9s pontosan \xEDgy). Alatta 4-6 val\xF3di, a t\xE9m\xE1ban t\xE9nylegesen keresett k\xE9rd\xE9s, mindegyik: <h3>A k\xE9rd\xE9s?</h3> majd <p>2-4 mondatos, \xF6nmag\xE1ban is teljes, konkr\xE9t v\xE1lasz</p>. Ebb\u0151l \xE9p\xFCl a FAQPage structured data, amit az AI-keres\u0151k \xE9s a Google kiemelt tal\xE1latai a leggyakrabban id\xE9znek \u2014 ez\xE9rt legyen tartalmilag er\u0151s, ne t\xF6ltel\xE9k.

\u26A0 TERJEDELEM: 1500-2000 sz\xF3 a c\xE9l (~${wordCount}), hogy m\xE9ly, 7-9 perces, versenyk\xE9pes pill\xE9r-cikk legyen. Ez a MINIMUM elv\xE1r\xE1s \u2014 az 1 perces, felsz\xEDnes cikk NEM elfogadhat\xF3. Minden <h2> blokk legyen legal\xE1bb 180 sz\xF3, t\xE9nylegesen kifejtve. A hosszt m\xE9lys\xE9ggel, p\xE9ld\xE1val \xE9s konkr\xE9ts\xE1ggal t\xF6ltsd meg, NE \xFCres fr\xE1zisokkal vagy ism\xE9tl\xE9ssel. Ne t\xFAlozz, ne \xEDg\xE9rj garant\xE1lt sikert, ne tal\xE1lj ki statisztik\xE1t.

\u26A0 HTML FORM\xC1TUM (content mez\u0151)
A "content" mez\u0151ben TISZTA HTML markup. SZIGOR\xDAAN TILOS markdown szintaxis ("##", "**...**", "- ", backtick). A BlogPostPage \`dangerouslySetInnerHTML\`-lel rendereli \u2014 a markdown sz\xF3r\xF3l sz\xF3ra megjelenne.

Engedett tagek: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">, valamint t\xE1bl\xE1zathoz <table>, <thead>, <tbody>, <tr>, <th>, <td>.
NE add hozz\xE1 a H1-et \u2014 azt a cikk \`title\` mez\u0151je adja.
Minden bekezd\xE9st <p>...</p> tag fogjon k\xF6zre. A "Gyakori k\xE9rd\xE9sek" szekci\xF3 H2-je K\xD6TELEZ\u0150EN <h2 id="faq">.

A CIKK TARTALMI SZAB\xC1LYAI:
- A t\xF6rzs TISZTA HTML (a fent engedett tagekkel). A H1 f\u0151c\xEDmet NE tedd bele \u2014 az k\xFCl\xF6n mez\u0151ben lesz.
- A \u201EGyakori k\xE9rd\xE9sek" szekci\xF3 H2-je K\xD6TELEZ\u0150EN <h2 id="faq">.
- HOSSZ: a teljes k\xE9sz cikk 1500-2000 sz\xF3 legyen, t\xE9nylegesen kifejtve. A r\xF6vid, felsz\xEDnes cikk hib\xE1s.`;
  const system = brandContext ? `${brandContext}

${baseSystem}` : baseSystem;
  const JSON_ENVELOPE = `

A v\xE1laszt EGY JSON objektumk\xE9nt add vissza: { "content": "\u2026a fenti szab\xE1lyok szerinti HTML string\u2026" }. Csak a "content" mez\u0151 legyen benne, a content \xE9rt\xE9ke JSON-escape-elt HTML.`;
  const half1 = await chat(
    [
      { role: "system", content: `${system}

\u26A0 MOST CSAK A CIKK ELS\u0150 FEL\xC9T \xCDRD MEG: a bevezet\u0151t (front-loadolt v\xE1lasszal), a <h2>Kulcs tanuls\xE1gok</h2> list\xE1t, majd az els\u0151 4 nagyobb <h2> tartalmi blokkot (mindegyik 200-300 sz\xF3, val\xF3di kifejt\xE9ssel, p\xE9ld\xE1val). NE \xEDrd meg a \u201EMit tegy\xE9l most?"-ot, a z\xE1r\xF3 CTA-t \xE9s a Gyakori k\xE9rd\xE9seket \u2014 azok a m\xE1sodik f\xE9lbe j\xF6nnek. Az els\u0151 f\xE9l HTML t\xF6rzse ~1000 sz\xF3 legyen.${JSON_ENVELOPE}` },
      { role: "user", content: `T\xE9ma: ${input.topic}` }
    ],
    { temperature: 0.75, maxTokens: 6e3, timeoutMs: 85e3, model: getBlogModel(), jsonMode: true }
  );
  const part1 = extractContentField(half1);
  const half2 = await chat(
    [
      { role: "system", content: `${system}

\u26A0 MOST A CIKK M\xC1SODIK FEL\xC9T (BEFEJEZ\xC9S\xC9T) \xCDRD MEG. Megkapod a m\xE1r meg\xEDrt els\u0151 felet \u2014 folytasd Z\xD6KKEN\u0150MENTESEN, NE ism\xE9teld meg. \xCDrj m\xE9g 3-4 nagyobb <h2> tartalmi blokkot (200-300 sz\xF3), majd a <h2>Mit tegy\xE9l most?</h2> l\xE9p\xE9slist\xE1t (<ol>), egy z\xE1r\xF3 <h2>-t term\xE9szetes, seg\xEDt\u0151 CTA-val, v\xE9g\xFCl a <h2 id="faq">Gyakori k\xE9rd\xE9sek</h2> szekci\xF3t (4-6 val\xF3di k\xE9rd\xE9s, <h3> k\xE9rd\xE9s + <p> v\xE1lasz). Valamelyik blokkban legyen egy lista vagy \xF6sszehasonl\xEDt\xF3 t\xE1bl\xE1zat. A folytat\xE1s ~1000 sz\xF3 legyen, az els\u0151 felet NE ism\xE9teld.${JSON_ENVELOPE}` },
      { role: "user", content: `T\xE9ma: ${input.topic}

A cikk eddig meg\xEDrt els\u0151 fele (folytasd, ne ism\xE9teld):
${part1}` }
    ],
    { temperature: 0.75, maxTokens: 6e3, timeoutMs: 85e3, model: getBlogModel(), jsonMode: true }
  );
  const part2 = extractContentField(half2);
  const content = markdownToHtml(`${part1}
${part2}`.trim());
  const meta = await generateBlogMeta(content, input.topic, lang);
  return {
    title: meta.title,
    excerpt: meta.excerpt,
    content,
    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription,
    cta: meta.cta,
    alternativeTitles: meta.alternativeTitles
  };
}
function stripCodeFences(s) {
  return s.replace(/^\s*```(?:html|json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim();
}
function extractContentField(raw) {
  try {
    const p = JSON.parse(raw);
    const v = p.content ?? p.html;
    if (typeof v === "string" && v.trim()) return v.trim();
  } catch {
  }
  return stripCodeFences(raw).trim();
}
async function generateBlogMeta(content, topic, lang) {
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2500);
  const system = `${languageLock(lang)}Te SEO-szerkeszt\u0151 vagy. Egy k\xE9sz blogcikk alapj\xE1n k\xE9sz\xEDts metaadatokat ${LANG_NAMES[lang]} nyelven. CSAK JSON-t adj vissza:
{
  "title": "...",                 // SEO cikk-c\xEDm, max 65 karakter, figyelemfelkelt\u0151, kulcssz\xF3-gazdag
  "excerpt": "...",               // lead/kivonat, max 200 karakter
  "metaTitle": "...",             // SEO meta c\xEDm, max 60 karakter
  "metaDescription": "...",       // meta le\xEDr\xE1s, 140-155 karakter, olvas\xF3i haszonnal
  "cta": "...",                   // 1-2 mondatos, seg\xEDt\u0151 hang\xFA CTA a G2A Marketing fel\xE9
  "alternativeTitles": ["...","...","...","...","..."]  // 5 alternat\xEDv c\xEDm
}`;
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `T\xE9ma: ${topic}

A cikk sz\xF6vege:
${plain}` }
    ],
    { temperature: 0.6, maxTokens: 900, jsonMode: true }
  );
  try {
    const p = JSON.parse(raw);
    const alts = Array.isArray(p.alternativeTitles) ? p.alternativeTitles : [];
    return {
      title: p.title?.trim() || topic,
      excerpt: p.excerpt?.trim() || "",
      metaTitle: p.metaTitle?.trim() || p.title?.trim() || topic,
      metaDescription: p.metaDescription?.trim() || "",
      cta: p.cta?.trim() || "",
      alternativeTitles: alts.map((t2) => String(t2).trim()).filter(Boolean).slice(0, 5)
    };
  } catch {
    return { title: topic, excerpt: "", metaTitle: topic, metaDescription: "", cta: "", alternativeTitles: [] };
  }
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
  const [hu, en, zh] = await Promise.all([
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
  if (jobId && dbPromise) {
    try {
      const db = await dbPromise;
      if (db) await db.updateAiJob(jobId, { status: "completed", completedSteps: 3, phase: "draft" });
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
function siteKey() {
  return process.env.VITE_TURNSTILE_SITE_KEY?.trim() || process.env.TURNSTILE_SITE_KEY?.trim() || "";
}
function isTurnstileConfigured() {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const site = siteKey();
  if (secret && !site) {
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY is set but no site key is configured \u2014 the browser can't produce a token, so verification is disabled. Set VITE_TURNSTILE_SITE_KEY (and redeploy) to enable, or remove the secret to silence this warning."
    );
  }
  return Boolean(secret && site);
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

// shared/careerAreas.ts
var CAREER_AREAS = [
  { key: "content_seo", label: { hu: "Tartalomgy\xE1rt\xE1s & SEO", en: "Content & SEO", zh: "\u5185\u5BB9\u521B\u4F5C\u4E0E SEO" } },
  { key: "ppc", label: { hu: "Hirdet\xE9skezel\xE9s (PPC)", en: "Paid ads (PPC)", zh: "\u4ED8\u8D39\u5E7F\u544A\uFF08PPC\uFF09" } },
  { key: "social", label: { hu: "K\xF6z\xF6ss\xE9gi m\xE9dia", en: "Social media", zh: "\u793E\u4EA4\u5A92\u4F53" } },
  { key: "ai_marketing", label: { hu: "AI-marketing & automatiz\xE1ci\xF3", en: "AI marketing & automation", zh: "AI \u8425\u9500\u4E0E\u81EA\u52A8\u5316" } },
  { key: "account", label: { hu: "B2B account management", en: "B2B account management", zh: "B2B \u5BA2\u6237\u7BA1\u7406" } },
  { key: "strategy", label: { hu: "Marketingstrat\xE9gia", en: "Marketing strategy", zh: "\u8425\u9500\u6218\u7565" } },
  { key: "webdev", label: { hu: "Webfejleszt\xE9s", en: "Web development", zh: "\u7F51\u7AD9\u5F00\u53D1" } },
  { key: "design", label: { hu: "Grafika & arculat", en: "Graphic design & branding", zh: "\u5E73\u9762\u8BBE\u8BA1\u4E0E\u54C1\u724C" } },
  { key: "video", label: { hu: "Vide\xF3 & kreat\xEDv", en: "Video & creative", zh: "\u89C6\u9891\u4E0E\u521B\u610F" } },
  { key: "other", label: { hu: "Egy\xE9b", en: "Other", zh: "\u5176\u4ED6" } }
];
var AREA_MAP = new Map(CAREER_AREAS.map((a) => [a.key, a]));
function areValidAreaKeys(keys) {
  return keys.every((k) => AREA_MAP.has(k));
}
function areaLabels(keys, lang = "hu") {
  return keys.map((k) => AREA_MAP.get(k)?.label[lang] ?? k);
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
function toLang(value) {
  return value === "en" || value === "zh" ? value : "hu";
}
var UI = {
  hu: {
    partnerLine: "Strat\xE9gia. Technol\xF3gia. M\xE9rhet\u0151 eredm\xE9nyek.",
    signOff: "\xDCdv\xF6zlettel,",
    signName: "Gy\u0151rfi Attila",
    tagline: "Strat\xE9gia. Technol\xF3gia. M\xE9rhet\u0151 eredm\xE9nyek.",
    submittedLabel: "Amit elk\xFCldt\xE9l",
    nextLabel: "Mi k\xF6vetkezik",
    autoNote: "Ez az \xFCzenet automatikusan k\xE9sz\xFClt, k\xE9rj\xFCk, ne v\xE1laszolj r\xE1.",
    footerReason: "Ezt az emailt az\xE9rt kaptad, mert feliratkozt\xE1l a g2amarketing.hu h\xEDrlevel\xE9re.",
    unsubscribe: "Leiratkoz\xE1s egy kattint\xE1ssal",
    privacy: "Adatv\xE9delmi t\xE1j\xE9koztat\xF3"
  },
  en: {
    partnerLine: "Strategy. Technology. Measurable results.",
    signOff: "Best regards,",
    signName: "Attila Gy\u0151rfi",
    tagline: "Strategy. Technology. Measurable results.",
    submittedLabel: "What you sent",
    nextLabel: "What happens next",
    autoNote: "This message was generated automatically \u2014 please don't reply to it.",
    footerReason: "You're getting this because you signed up for the g2amarketing.hu newsletter.",
    unsubscribe: "Unsubscribe in one click",
    privacy: "Privacy notice"
  },
  zh: {
    partnerLine: "\u6218\u7565\u3002\u6280\u672F\u3002\u53EF\u8861\u91CF\u7684\u6210\u679C\u3002",
    signOff: "\u987A\u9882\u5546\u797A\uFF0C",
    signName: "Gy\u0151rfi Attila\uFF08\u4E45\u5C14\u83F2\xB7\u963F\u8482\u62C9\uFF09",
    tagline: "\u6218\u7565\u3002\u6280\u672F\u3002\u53EF\u8861\u91CF\u7684\u6210\u679C\u3002",
    submittedLabel: "\u60A8\u63D0\u4EA4\u7684\u5185\u5BB9",
    nextLabel: "\u63A5\u4E0B\u6765\u4F1A\u53D1\u751F\u4EC0\u4E48",
    autoNote: "\u672C\u90AE\u4EF6\u4E3A\u7CFB\u7EDF\u81EA\u52A8\u53D1\u9001\uFF0C\u8BF7\u52FF\u76F4\u63A5\u56DE\u590D\u3002",
    footerReason: "\u60A8\u6536\u5230\u8FD9\u5C01\u90AE\u4EF6\uFF0C\u662F\u56E0\u4E3A\u60A8\u8BA2\u9605\u4E86 g2amarketing.hu \u7684\u901A\u8BAF\u3002",
    unsubscribe: "\u4E00\u952E\u9000\u8BA2",
    privacy: "\u9690\u79C1\u8BF4\u660E"
  }
};
var PRIVACY_PATH = "/adatvedelmi-iranyelvek";
var SITE_HREF = {
  hu: "https://g2amarketing.hu",
  en: "https://g2amarketing.hu/en",
  zh: "https://g2amarketing.hu/zh"
};
function wrapper(inner, preheader, lang) {
  const preheaderHtml = `
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">
      ${escapeHtml(preheader)}
    </div>`;
  return `<!DOCTYPE html>
<html lang="${lang}">
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
function signature(lang) {
  const t2 = UI[lang];
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 36px 36px">
          <div style="font-size:14px;color:${TEXT_SECONDARY};line-height:1.6;margin-bottom:14px">${escapeHtml(t2.signOff)}</div>
          <div style="display:inline-block;border-left:3px solid ${BRAND_TEAL};padding-left:14px">
            <div style="font-size:16px;font-weight:700;color:${TEXT_PRIMARY};letter-spacing:-0.01em">${escapeHtml(t2.signName)}</div>
            <div style="font-size:12px;color:${TEXT_MUTED};font-family:${FONT_MONO};letter-spacing:0.04em;margin-top:3px">G2A Marketing</div>
            <div style="font-size:11px;color:${BRAND_TEAL_DARK};font-family:${FONT_MONO};letter-spacing:0.04em;margin-top:6px">${escapeHtml(t2.tagline)}</div>
          </div>
        </td>
      </tr>
    </table>`;
}
function autoNoteBlock(lang) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 36px 24px">
          <div style="font-size:12px;color:${TEXT_MUTED};line-height:1.6;font-style:italic">${escapeHtml(UI[lang].autoNote)}</div>
        </td>
      </tr>
    </table>`;
}
function footer(unsubscribeUrl, lang) {
  const t2 = UI[lang];
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
            ${escapeHtml(t2.footerReason)}<br>
            <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">${escapeHtml(t2.unsubscribe)}</a> \xB7 <a href="https://g2amarketing.hu${PRIVACY_PATH}" style="color:#94a3b8;text-decoration:underline">${escapeHtml(t2.privacy)}</a>
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
var WELCOME_COPY = {
  hu: {
    headerTag: "\xDCdv\xF6zl\xFCnk a fed\xE9lzeten",
    greeting: (name) => name ? `Kedves ${name}!` : "Kedves Feliratkoz\xF3!",
    lead: "K\xF6sz\xF6nj\xFCk, hogy feliratkozt\xE1l a G2A Marketing h\xEDrlevel\xE9re. Mostant\xF3l rendszeresen k\xFCld\xFCnk sz\xE1modra olyan marketingh\xEDreket, gyakorlati megold\xE1sokat \xE9s szakmai elemz\xE9seket, amelyek seg\xEDtenek tudatosabban fejleszteni v\xE1llalkoz\xE1sod online jelenl\xE9t\xE9t.",
    expectLabel: "Mire sz\xE1m\xEDthatsz t\u0151l\xFCnk?",
    expectItems: [
      "Aktu\xE1lis marketing- \xE9s technol\xF3giai trendek",
      "Azonnal alkalmazhat\xF3 gyakorlati tippek",
      "Kamp\xE1ny-, weboldal- \xE9s tartalommarketing-megold\xE1sok",
      "Mesters\xE9ges intelligenci\xE1val t\xE1mogatott marketingm\xF3dszerek",
      "Val\xF3di \xFCzleti tapasztalatok \xE9s tanuls\xE1gok"
    ],
    statement: "Nem hisz\xFCnk a felesleges k\xF6r\xF6kben \xE9s az \xF6nc\xE9l\xFA marketingben. Olyan inform\xE1ci\xF3kat k\xFCld\xFCnk, amelyeknek \xFCzleti \xE9rt\xE9k\xFCk van, \xE9s amelyekb\u0151l val\xF3di d\xF6nt\xE9sek sz\xFClethetnek.",
    comingSoon: "Hamarosan \xE9rkezik az els\u0151 level\xFCnk.",
    ctaButton: "WEBOLDAL MEGTEKINT\xC9SE \u2192",
    preheader: "K\xF6sz\xF6nj\xFCk a feliratkoz\xE1st \u2014 r\xF6viden arr\xF3l, mire sz\xE1m\xEDthatsz t\u0151l\xFCnk."
  },
  en: {
    headerTag: "Welcome aboard",
    greeting: (name) => name ? `Hello ${name}!` : "Hello!",
    lead: "Thank you for subscribing to the G2A Marketing newsletter. From now on we'll regularly send you marketing news, practical solutions and professional analysis that help you grow your business's online presence more deliberately.",
    expectLabel: "What to expect from us",
    expectItems: [
      "Current marketing and technology trends",
      "Practical tips you can apply right away",
      "Campaign, website and content-marketing solutions",
      "AI-supported marketing methods",
      "Real business experience and lessons learned"
    ],
    statement: "We don't believe in wasted effort or marketing for its own sake. We send information that carries business value \u2014 the kind you can base real decisions on.",
    comingSoon: "Your first proper issue is on its way.",
    ctaButton: "VISIT THE WEBSITE \u2192",
    preheader: "Thanks for subscribing \u2014 a quick note on what to expect from us."
  },
  zh: {
    headerTag: "\u6B22\u8FCE\u52A0\u5165",
    greeting: (name) => name ? `${name}\uFF0C\u60A8\u597D\uFF01` : "\u60A8\u597D\uFF01",
    lead: "\u611F\u8C22\u60A8\u8BA2\u9605 G2A Marketing \u901A\u8BAF\u3002\u4ECE\u73B0\u5728\u8D77\uFF0C\u6211\u4EEC\u4F1A\u5B9A\u671F\u4E3A\u60A8\u53D1\u9001\u8425\u9500\u8D44\u8BAF\u3001\u5B9E\u7528\u65B9\u6848\u548C\u4E13\u4E1A\u5206\u6790\uFF0C\u5E2E\u52A9\u60A8\u66F4\u6709\u610F\u8BC6\u5730\u63D0\u5347\u4F01\u4E1A\u7684\u7EBF\u4E0A\u8868\u73B0\u3002",
    expectLabel: "\u60A8\u53EF\u4EE5\u671F\u5F85",
    expectItems: [
      "\u6700\u65B0\u7684\u8425\u9500\u4E0E\u6280\u672F\u8D8B\u52BF",
      "\u53EF\u7ACB\u5373\u4E0A\u624B\u7684\u5B9E\u7528\u6280\u5DE7",
      "\u63A8\u5E7F\u3001\u7F51\u7AD9\u4E0E\u5185\u5BB9\u8425\u9500\u65B9\u6848",
      "\u7531\u4EBA\u5DE5\u667A\u80FD\u652F\u6301\u7684\u8425\u9500\u65B9\u6CD5",
      "\u771F\u5B9E\u7684\u5546\u4E1A\u7ECF\u9A8C\u4E0E\u542F\u793A"
    ],
    statement: "\u6211\u4EEC\u4E0D\u505A\u65E0\u8C13\u7684\u82B1\u6837\uFF0C\u4E5F\u4E0D\u505A\u4E3A\u8425\u9500\u800C\u8425\u9500\u7684\u4E8B\u3002\u6211\u4EEC\u53D1\u9001\u7684\uFF0C\u662F\u6709\u5546\u4E1A\u4EF7\u503C\u3001\u80FD\u652F\u6491\u771F\u5B9E\u51B3\u7B56\u7684\u4FE1\u606F\u3002",
    comingSoon: "\u7B2C\u4E00\u5C01\u6B63\u5F0F\u90AE\u4EF6\u5F88\u5FEB\u5C31\u4F1A\u9001\u8FBE\u3002",
    ctaButton: "\u6D4F\u89C8\u7F51\u7AD9 \u2192",
    preheader: "\u611F\u8C22\u8BA2\u9605\u2014\u2014\u7B80\u5355\u8BF4\u8BF4\u60A8\u53EF\u4EE5\u671F\u5F85\u4EC0\u4E48\u3002"
  }
};
function expectRow(text2, last) {
  return `
    <tr>
      <td valign="top" style="width:26px;padding:7px 10px 7px 0;color:${BRAND_TEAL};font-size:15px;line-height:1.5">\u2713</td>
      <td style="padding:7px 0;font-size:14.5px;color:${TEXT_PRIMARY};line-height:1.5;border-bottom:${last ? "none" : `1px solid ${BORDER}`}">${escapeHtml(text2)}</td>
    </tr>`;
}
function renderWelcomeEmailHtml(input) {
  const lang = input.lang ?? "hu";
  const copy = WELCOME_COPY[lang];
  const greeting = copy.greeting(input.name ? escapeHtml(input.name) : void 0);
  const items = copy.expectItems.map((it, i) => expectRow(it, i === copy.expectItems.length - 1)).join("");
  const body = `
    ${darkHeader({ tag: copy.headerTag, secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(copy.lead)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:28px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:12px">${escapeHtml(copy.expectLabel)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:8px 20px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${items}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-size:14.5px;line-height:1.65;color:#e2e8f0">${escapeHtml(copy.statement)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 4px">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY}">${escapeHtml(copy.comingSoon)}</p>
          <a href="${SITE_HREF[lang]}" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">${escapeHtml(copy.ctaButton)}</a>
        </td>
      </tr>
    </table>

    ${signature(lang)}

    ${footer(input.unsubscribeUrl, lang)}
  `;
  return wrapper(body, copy.preheader, lang);
}
var LEAD_MAGNET_BASE = "https://g2amarketing.hu/letoltesek";
var LEAD_MAGNETS = [
  { title: "AI eszk\xF6zriport 2026", desc: "A legjobb AI-marketingeszk\xF6z\xF6k hat kateg\xF3ri\xE1ban, val\xF3s \xE1rakkal \xE9s tippekkel.", file: "G2A_AI_eszkozok_a_marketingben_2026.pdf" },
  { title: "Marketinges prompt-gy\u0171jtem\xE9ny", desc: "50 k\xE9sz, magyar nyelv\u0171 AI-prompt poszthoz, h\xEDrlev\xE9lhez, hirdet\xE9shez, cikkhez.", file: "G2A_Prompt_gyujtemeny_2026.pdf" },
  { title: "Marketing \xF6nellen\u0151rz\u0151 checklista", desc: "34 pont \u2014 15 perc alatt \xE1tvil\xE1g\xEDtod a marketinged, \xE9s l\xE1tod, mit er\u0151s\xEDts.", file: "G2A_Marketing_checklista_2026.pdf" },
  { title: "Tartalom sablon-csomag", desc: "Tartalompill\xE9rek, kit\xF6lthet\u0151 napt\xE1r, 12 posztsablon, hook- \xE9s CTA-formul\xE1k.", file: "G2A_Tartalom_sablon_csomag_2026.pdf" }
];
function renderLeadMagnetWelcomeHtml(input) {
  const lang = "hu";
  const greeting = input.name ? `Kedves ${escapeHtml(input.name)}!` : "Kedves Feliratkoz\xF3!";
  const cards = LEAD_MAGNETS.map((m, i) => `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px;margin-bottom:12px">
      <tr>
        <td style="padding:16px 18px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td valign="top">
                <div style="font-family:${FONT_MONO};font-size:11px;color:${BRAND_TEAL_DARK};letter-spacing:0.1em;margin-bottom:4px">0${i + 1}</div>
                <div style="font-size:15px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:4px">${escapeHtml(m.title)}</div>
                <div style="font-size:13px;color:${TEXT_SECONDARY};line-height:1.5">${escapeHtml(m.desc)}</div>
              </td>
              <td valign="middle" align="right" style="padding-left:14px;white-space:nowrap">
                <a href="${LEAD_MAGNET_BASE}/${m.file}" style="display:inline-block;background:${TEXT_PRIMARY};color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:9px 16px;border-radius:6px;font-family:${FONT_MONO};letter-spacing:0.04em">Let\xF6lt\xE9s \u2192</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`).join("");
  const body = `
    ${darkHeader({ tag: "AI Marketing Csomag", secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">
            K\xF6sz\xF6nj\xFCk, hogy let\xF6lt\xF6tted az AI Marketing Csomagot! Itt a n\xE9gy anyag \u2014 kattints a let\xF6lt\xE9sekre, \xE9s b\xE1rmikor megnyithatod telefonon vagy g\xE9pen.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:24px 36px 4px">${cards}</td></tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 36px 4px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px;font-weight:600">Egy j\xF3 tan\xE1cs</div>
                <div style="font-size:14px;line-height:1.6;color:#e2e8f0">
                  Ne akard egyszerre az eg\xE9szet. T\xF6ltsd ki el\u0151bb a checklist\xE1t: 15 perc alatt l\xE1tod, hol sziv\xE1rog el a p\xE9nz a marketingedb\u0151l \u2014 \xE9s a k\xF6vetkez\u0151 h\xF3napban csak a 3 leggyeng\xE9bb pontodra f\xF3kusz\xE1lj.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${signature(lang)}

    ${footer(input.unsubscribeUrl, lang)}
  `;
  return wrapper(body, "Itt a n\xE9gy anyag az AI Marketing Csomagb\xF3l \u2014 let\xF6lt\xE9s egy kattint\xE1ssal.", lang);
}
function renderSimpleEmailHtml(input) {
  const lang = "hu";
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const paras = input.paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("");
  const ctaBlock = input.cta ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:6px 0 4px">
        <a href="${input.cta.href}" style="display:inline-block;background:${BRAND_TEAL};color:#06201d;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:800;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.04em">${escapeHtml(input.cta.label)}</a>
      </td></tr></table>` : "";
  const body = `
    ${darkHeader({ tag: input.tag, secondaryLine: UI[lang].partnerLine })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">${greeting}</h1>
          ${paras}
          ${ctaBlock}
        </td>
      </tr>
    </table>
    ${signature(lang)}
    ${footer(input.unsubscribeUrl, lang)}
  `;
  return wrapper(body, input.preheader, lang);
}
var CHECKLIST_BANDS = {
  "Er\u0151s alapok": "A g\xE9pezet m\u0171k\xF6dik \u2014 innen a finomhangol\xE1s \xE9s a sk\xE1l\xE1z\xE1s j\xF6n. Nem az alapokon kell dolgoznod, hanem azon, hogy a megl\xE9v\u0151kb\u0151l t\xF6bbet hozz ki: m\xE9lyebb m\xE9r\xE9s, optimaliz\xE1l\xE1s, rendszerez\xE9s.",
  "J\xF3 \xFAton vagy": "Az alapok nagyr\xE9szt megvannak, de van p\xE1r r\xE9s, amit bet\xF6mve ar\xE1nytalanul sokat nyersz. A k\xF6vetkez\u0151 h\xF3napban csak az al\xE1bbi 3 leggyeng\xE9bb pontodra f\xF3kusz\xE1lj.",
  "Sok a lehet\u0151s\xE9g": "T\xF6bb ter\xFCleten van tennival\xF3 \u2014 ez nem kudarc, hanem t\xE9rk\xE9p. Ne akard egyszerre az eg\xE9szet: prioriz\xE1lj, \xE9s havonta 3 jav\xEDt\xE1s b\u0151ven el\xE9g a l\xE1that\xF3 el\u0151rel\xE9p\xE9shez.",
  "Nagy potenci\xE1l": "Itt a legnagyobb a n\xF6veked\xE9si pontod: minden jav\xEDt\xE1s azonnal \xE9rezhet\u0151 k\xFCl\xF6nbs\xE9get hoz. Kezdd egyetlen alappal, \xE9s onnan \xE9p\xEDtkezz."
};
var CHECKLIST_AREA_TIPS = {
  "Weboldal & \xE9lm\xE9ny": "Kezdd a mobil-\xE9lm\xE9nnyel \xE9s a bet\xF6lt\xE9si sebess\xE9ggel \u2014 \xE9s minden f\u0151 oldalon legyen egy vil\xE1gos, kiemelt k\xF6vetkez\u0151 l\xE9p\xE9s (CTA).",
  "SEO alapok": "Adj minden fontos oldalnak egyedi, kulcsszavas c\xEDmet \xE9s meta-le\xEDr\xE1st, majd k\xF6sd be a Google Search Console-t egy sitemap-pel.",
  "Tartalom": "K\xE9sz\xEDts egy egyszer\u0171 tartalomnapt\xE1rat, \xE9s minden tartalom az \xFCgyf\xE9l egy konkr\xE9t k\xE9rd\xE9s\xE9re v\xE1laszoljon \u2014 egy\xE9rtelm\u0171 k\xF6vetkez\u0151 l\xE9p\xE9ssel.",
  "K\xF6z\xF6ss\xE9gi m\xE9dia": "R\xF6gz\xEDts egy tarthat\xF3 posztol\xE1si ritmust \xE9s egys\xE9ges arculatot; a bi\xF3ban legyen vil\xE1gos aj\xE1nlat \xE9s m\u0171k\xF6d\u0151 link.",
  "E-mail marketing": "Tegy\xE9l ki j\xF3l l\xE1that\xF3 feliratkoz\xE1si lehet\u0151s\xE9get, \xE1ll\xEDts be automatikus \xFCdv\xF6zl\u0151 emailt, \xE9s k\xF6vesd a megnyit\xE1si/\xE1tkattint\xE1si ar\xE1nyt.",
  "Hirdet\xE9s & PPC": "Minden kamp\xE1nyhoz legyen c\xE9l + keret + dedik\xE1lt landing oldal, \xE9s konverzi\xF3t m\xE9rj, ne csak kattint\xE1st.",
  "Analitika & m\xE9r\xE9s": "K\xF6sd be a GA4-et \xE9s a konverzi\xF3k\xF6vet\xE9st, v\xE1lassz 3-5 kulcsmutat\xF3t, \xE9s havonta n\xE9zd \xE1t \u0151ket.",
  "Konverzi\xF3 & bizalom": "Tedd ki a v\xE9lem\xE9nyeket \xE9s referenci\xE1kat, az els\u0151 k\xE9perny\u0151n legyen vil\xE1gos az \xE9rt\xE9kaj\xE1nlat, \xE9s el\u0151re kezeld a gyakori kifog\xE1sokat."
};
function renderChecklistResultHtml(input) {
  const lang = "hu";
  const greeting = input.name ? `Kedves ${escapeHtml(input.name)}!` : "Kedves Kit\xF6lt\u0151!";
  const bandDesc = CHECKLIST_BANDS[input.band] ?? "";
  const areas = input.weakestAreas.split(",").map((a) => a.trim()).filter(Boolean).slice(0, 3);
  const weakRows = areas.map((name, i) => `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:10px">
      <tr>
        <td valign="top" style="width:26px;padding:2px 10px 0 0;color:${BRAND_TEAL};font-family:${FONT_MONO};font-size:13px;font-weight:700">${i + 1}</td>
        <td>
          <div style="font-size:14px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:2px">${escapeHtml(name)}</div>
          <div style="font-size:13px;color:${TEXT_SECONDARY};line-height:1.55">${escapeHtml(CHECKLIST_AREA_TIPS[name] ?? "")}</div>
        </td>
      </tr>
    </table>`).join("");
  const downloadRows = LEAD_MAGNETS.map((m) => `
    <tr>
      <td style="padding:6px 0;font-size:13.5px;color:${TEXT_PRIMARY}">${escapeHtml(m.title)}</td>
      <td align="right" style="padding:6px 0"><a href="${LEAD_MAGNET_BASE}/${m.file}" style="color:${BRAND_TEAL_DARK};font-size:12.5px;font-weight:700;text-decoration:none;font-family:${FONT_MONO}">Let\xF6lt\xE9s \u2192</a></td>
    </tr>`).join("");
  const body = `
    ${darkHeader({ tag: "A teszted eredm\xE9nye", secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">
            Kit\xF6lt\xF6tted a marketing \xF6nellen\u0151rz\u0151 tesztet \u2014 itt a ki\xE9rt\xE9kelt eredm\xE9nyed, \xE9s pontosan az, hol nyered a legt\xF6bbet.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 4px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:24px 28px">
                <div style="font-family:${FONT_MONO};font-size:40px;font-weight:700;color:#ffffff;line-height:1;letter-spacing:-1px">${input.score}<span style="font-size:20px;color:#94a3b8"> / 34 pont</span></div>
                <div style="font-size:18px;font-weight:800;color:${BRAND_TEAL};margin:12px 0 6px">${escapeHtml(input.band)}</div>
                <div style="font-size:14px;line-height:1.6;color:#e2e8f0">${escapeHtml(bandDesc)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${areas.length ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:26px 36px 4px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:14px">Itt nyered a legt\xF6bbet</div>
          ${weakRows}
        </td>
      </tr>
    </table>` : ""}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 4px">
          <div style="font-size:14px;color:${TEXT_SECONDARY};line-height:1.6;margin-bottom:10px">\xC9s itt a 4 anyag az AI Marketing Csomagb\xF3l, amivel neki is tudsz v\xE1gni:</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr><td style="padding:8px 18px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${downloadRows}</table></td></tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 4px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:6px">\xC1tn\xE9zz\xFCk egy\xFCtt?</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1;margin-bottom:16px">Ha szeretn\xE9d, egy 30 perces ingyenes konzult\xE1ci\xF3n konkr\xE9tan v\xE9gigvessz\xFCk a 3 leggyeng\xE9bb pontod \u2014 \xE9s azt, mivel \xE9rdemes kezdened.</div>
                <a href="https://g2amarketing.hu/ingyenes-audit" style="display:inline-block;background:${BRAND_TEAL};color:#06201d;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:800;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.04em">Ingyenes konzult\xE1ci\xF3 \u2192</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${signature(lang)}

    ${footer(input.unsubscribeUrl, lang)}
  `;
  return wrapper(body, `A marketing \xF6nellen\u0151rz\u0151 teszted eredm\xE9nye: ${input.score}/34 pont \u2014 ${input.band}.`, lang);
}
var DIGEST_COPY = {
  hu: {
    greeting: (n) => n ? `Kedves ${n}!` : "Kedves Olvas\xF3!",
    intro: "A digit\xE1lis marketing folyamatosan v\xE1ltozik, de nem minden \xFAjdons\xE1g \xE9rdemel azonnali figyelmet. Ebben a heti \xF6sszefoglal\xF3ban azokat a h\xEDreket \xE9s gyakorlati megold\xE1sokat v\xE1logattuk \xF6ssze, amelyek val\xF3ban hat\xE1ssal lehetnek a v\xE1llalkoz\xE1sod marketingj\xE9re.",
    reactTag: "G2A Marketing-szemsz\xF6g",
    reactBody: "A marketingben nem az nyer, aki minden \xFAj trendet azonnal k\xF6vet, hanem aki meg tudja k\xFCl\xF6nb\xF6ztetni a val\xF3di \xFCzleti lehet\u0151s\xE9get az \xE1tmeneti zajt\xF3l. Szeretn\xE9d \xE1tn\xE9zni, hol lehetne hat\xE9konyabb a v\xE1llalkoz\xE1sod online marketingje?",
    reactCta: "Marketingkonzult\xE1ci\xF3 k\xE9r\xE9se \u2192",
    reactHref: "https://g2amarketing.hu/kapcsolat",
    readSuffix: (m) => `\xB7 ${m} perc olvas\xE1s`,
    readCta: "OLVASD EL \u2192"
  },
  en: {
    greeting: (n) => n ? `Hello ${n}!` : "Hello!",
    intro: "Digital marketing changes constantly, but not every new thing deserves immediate attention. This week's roundup collects the news and practical solutions that can genuinely affect your business's marketing.",
    reactTag: "The G2A Marketing view",
    reactBody: "In marketing, the winner isn't whoever chases every new trend \u2014 it's whoever can tell a real business opportunity from passing noise. Want to review where your online marketing could work harder?",
    reactCta: "Request a consultation \u2192",
    reactHref: "https://g2amarketing.hu/en/kapcsolat",
    readSuffix: (m) => `\xB7 ${m} min read`,
    readCta: "READ \u2192"
  },
  zh: {
    greeting: (n) => n ? `${n}\uFF0C\u60A8\u597D\uFF01` : "\u60A8\u597D\uFF01",
    intro: "\u6570\u5B57\u8425\u9500\u5728\u4E0D\u65AD\u53D8\u5316\uFF0C\u4F46\u5E76\u975E\u6BCF\u4E2A\u65B0\u4E8B\u7269\u90FD\u503C\u5F97\u7ACB\u523B\u5173\u6CE8\u3002\u672C\u5468\u7CBE\u9009\uFF0C\u6211\u4EEC\u6311\u51FA\u4E86\u90A3\u4E9B\u771F\u6B63\u53EF\u80FD\u5F71\u54CD\u60A8\u4F01\u4E1A\u8425\u9500\u7684\u8D44\u8BAF\u4E0E\u5B9E\u7528\u65B9\u6848\u3002",
    reactTag: "G2A Marketing \u89C2\u70B9",
    reactBody: "\u5728\u8425\u9500\u4E2D\uFF0C\u8D62\u5BB6\u4E0D\u662F\u8FFD\u9010\u6BCF\u4E00\u4E2A\u65B0\u8D8B\u52BF\u7684\u4EBA\uFF0C\u800C\u662F\u80FD\u628A\u771F\u6B63\u7684\u5546\u4E1A\u673A\u4F1A\u4E0E\u4E00\u65F6\u7684\u566A\u97F3\u533A\u5206\u5F00\u6765\u7684\u4EBA\u3002\u60F3\u770B\u770B\u60A8\u7684\u7EBF\u4E0A\u8425\u9500\u8FD8\u80FD\u5728\u54EA\u91CC\u505A\u5F97\u66F4\u597D\u5417\uFF1F",
    reactCta: "\u9884\u7EA6\u8425\u9500\u54A8\u8BE2 \u2192",
    reactHref: "https://g2amarketing.hu/zh/kapcsolat",
    readSuffix: (m) => `\xB7 ${m} \u5206\u949F\u9605\u8BFB`,
    readCta: "\u9605\u8BFB\u5168\u6587 \u2192"
  }
};
function digestArticleBlock(a, index, lang) {
  const isAlt = index % 2 === 1;
  const bg = isAlt ? BG_SUBTLE : "#ffffff";
  const num = String(index + 1).padStart(2, "0");
  const total = String(0);
  const readChip = a.readMin ? `<span style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};margin-left:14px">${escapeHtml(DIGEST_COPY[lang].readSuffix(a.readMin))}</span>` : "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg}">
      <tr>
        <td style="padding:32px 36px">

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td>
                <span style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};color:${BRAND_TEAL_DARK};font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;padding:5px 10px;border-radius:4px">
                  <span style="color:${BRAND_TEAL}">\u25C6</span> &nbsp;${escapeHtml(a.topic)}
                </span>
              </td>
              <td align="right" style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.1em">
                ${num}${total ? "" : ""}
              </td>
            </tr>
          </table>

          <h2 style="margin:16px 0 12px;font-size:22px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">
            <a href="${a.url}" style="color:${TEXT_PRIMARY};text-decoration:none">${escapeHtml(a.title)}</a>
          </h2>

          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(a.excerpt)}</p>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <a href="${a.url}" style="display:inline-block;background:${TEXT_PRIMARY};color:#ffffff;padding:9px 18px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">${escapeHtml(DIGEST_COPY[lang].readCta)}</a>
              </td>
              <td valign="middle" style="padding-left:8px">${readChip}</td>
            </tr>
          </table>

        </td>
      </tr>
    </table>`;
}
function renderDigestEmailHtml(input) {
  const lang = input.lang ?? "hu";
  const dc = DIGEST_COPY[lang];
  const greeting = input.name ? dc.greeting(escapeHtml(input.name)) : dc.greeting();
  const intro = input.intro || dc.intro;
  const articleBlocks = input.articles.map((a, i) => digestArticleBlock(a, i, lang)).join('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:' + BORDER + '"></td></tr></table>');
  const body = `
    ${darkHeader({ tag: input.weekLabel, secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:36px 36px 8px">
          <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(intro)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:0 36px"><div style="height:3px;background:${BRAND_TEAL};border-radius:2px"></div></td></tr>
    </table>

    ${articleBlocks}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px;font-weight:600">${escapeHtml(dc.reactTag)}</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1">
                  ${escapeHtml(dc.reactBody)} <a href="${dc.reactHref}" style="color:${BRAND_TEAL};text-decoration:none;font-weight:600">${escapeHtml(dc.reactCta)}</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${signature(lang)}

    ${footer(input.unsubscribeUrl, lang)}
  `;
  return wrapper(body, intro, lang);
}
var CONFIRMATION_COPY = {
  hu: {
    audit: {
      tag: "AUDIT K\xC9R\xC9S",
      subject: "K\xF6sz\xF6nj\xFCk az audit k\xE9r\xE9sed \u2014 hamarosan jelentkez\xFCnk",
      intro: "K\xF6sz\xF6nj\xFCk, hogy megkerest\xE9l minket. K\xE9r\xE9sed meg\xE9rkezett \u2014 az al\xE1bbiakban ellen\u0151rizheted, amit elk\xFCldt\xE9l. Ha valamelyik adat pontos\xEDt\xE1sra szorul, el\xE9g v\xE1laszolnod erre a lev\xE9lre.",
      nextSteps: [
        "<strong>24 \xF3r\xE1n bel\xFCl</strong> \xE1ttekintj\xFCk a weboldalad \xE9s a megadott online jelenl\xE9ted.",
        "<strong>2-3 munkanapon bel\xFCl</strong> k\xFCld\xFCnk egy els\u0151 \xE9rt\xE9kel\xE9st a legfontosabb \xE9szrev\xE9telekkel.",
        "<strong>5-7 munkanapon bel\xFCl</strong> elk\xE9sz\xFCl a r\xE9szletes audit (15-25 oldal), prioriz\xE1lt teend\u0151kkel.",
        "A teljes folyamat <strong>ingyenes</strong> \xE9s k\xF6telezetts\xE9gmentes \u2014 nincs ut\xE1na \xE9rt\xE9kes\xEDt\xE9si h\xEDv\xE1s, csak a riport, amit haszn\xE1lni tudsz."
      ],
      closing: "Ha id\u0151k\xF6zben k\xE9rd\xE9sed mer\xFClne fel, v\xE1laszolj nyugodtan erre a lev\xE9lre \u2014 minden \xFCzenetet elolvasunk.",
      secondaryLine: "Visszaigazol\xE1s \xB7 G2A Marketing"
    },
    contact: {
      tag: "KAPCSOLATFELV\xC9TEL",
      subject: "K\xF6sz\xF6nj\xFCk az \xFCzeneted \u2014 hamarosan v\xE1laszolunk",
      intro: "K\xF6sz\xF6nj\xFCk, hogy felvetted vel\xFCnk a kapcsolatot. \xDCzeneted meg\xE9rkezett hozz\xE1nk \u2014 az al\xE1bbiakban visszaolvashatod, amit elk\xFCldt\xE9l. Ha b\xE1rmelyik adat pontatlan, el\xE9g v\xE1laszolnod erre a lev\xE9lre.",
      nextSteps: [
        "<strong>Egy munkanapon bel\xFCl</strong> szem\xE9lyre szabott v\xE1laszt k\xFCld\xFCnk az \xFCzenetedre \u2014 nem sablonlevelet.",
        "Ha a t\xE9ma \xF6sszetettebb, egyeztet\xFCnk egy <strong>15-30 perces besz\xE9lget\xE9st</strong>.",
        "Ha s\xFCrg\u0151s, h\xEDvj minket: <strong>+36 30 190 2575</strong> (h\xE9tk\xF6znap 8-17 \xF3ra k\xF6z\xF6tt)."
      ],
      closing: "Ha id\u0151k\xF6zben b\xE1rmi kieg\xE9sz\xEDtenival\xF3d lenne, csak v\xE1laszolj erre a lev\xE9lre \u2014 minden \xFCzenetet elolvasunk.",
      secondaryLine: "Visszaigazol\xE1s \xB7 G2A Marketing"
    },
    career: {
      tag: "JELENTKEZ\xC9S",
      subject: "K\xF6sz\xF6nj\xFCk a jelentkez\xE9sed \u2014 megkaptuk",
      intro: "K\xF6sz\xF6nj\xFCk, hogy jelentkezt\xE9l a G2A Marketing csapat\xE1ba. Jelentkez\xE9sed sikeresen meg\xE9rkezett hozz\xE1nk. A bek\xFCld\xF6tt \xF6n\xE9letrajzot \xE9s a megadott anyagokat a kiv\xE1laszt\xE1si folyamat sor\xE1n r\xE9szletesen \xE1ttekintj\xFCk.",
      bodyParagraphs: [
        "Sz\xE1munkra nemcsak a szakmai tapasztalat fontos, hanem az \xF6n\xE1ll\xF3s\xE1g, a precizit\xE1s, a probl\xE9mamegold\xF3 gondolkod\xE1s, \xE9s az is, mennyire tudsz felel\u0151ss\xE9get v\xE1llalni a saj\xE1t munk\xE1d\xE9rt.",
        "Ha a h\xE1tter \xE9s a tapasztalataid illeszkednek egy aktu\xE1lis lehet\u0151s\xE9ghez, felvessz\xFCk veled a kapcsolatot a kiv\xE1laszt\xE1si folyamat k\xF6vetkez\u0151 l\xE9p\xE9seivel kapcsolatban.",
        "A jelentkez\xE9sek sz\xE1m\xE1t\xF3l f\xFCgg\u0151en az elb\xEDr\xE1l\xE1s t\xF6bb munkanapot is ig\xE9nybe vehet \u2014 k\xE9rj\xFCk, addig ne k\xFCldd el ism\xE9t a jelentkez\xE9sed."
      ],
      closing: "K\xF6sz\xF6nj\xFCk a G2A Marketing ir\xE1nti \xE9rdekl\u0151d\xE9sed \xE9s a jelentkez\xE9sre ford\xEDtott id\u0151d.",
      noReply: true,
      secondaryLine: "Visszaigazol\xE1s \xB7 G2A Marketing"
    }
  },
  en: {
    audit: {
      tag: "AUDIT REQUEST",
      subject: "Thanks for your audit request \u2014 we'll be in touch soon",
      intro: "Thank you for reaching out. Your request has arrived \u2014 you can check below what you sent. If any detail needs correcting, simply reply to this email.",
      nextSteps: [
        "<strong>Within 24 hours</strong> we'll review your website and the online presence you gave us.",
        "<strong>Within 2-3 working days</strong> we'll send a first assessment with the most important findings.",
        "<strong>Within 5-7 working days</strong> you'll get the full audit (15-25 pages) with prioritised actions.",
        "The whole process is <strong>free</strong> and no-strings \u2014 no sales call afterwards, just a report you can actually use."
      ],
      closing: "If a question comes up in the meantime, just reply to this email \u2014 we read every message.",
      secondaryLine: "Confirmation \xB7 G2A Marketing"
    },
    contact: {
      tag: "MESSAGE RECEIVED",
      subject: "Thanks for your message \u2014 we'll reply soon",
      intro: "Thank you for getting in touch. Your message has reached us \u2014 you can read back below what you sent. If any detail is off, simply reply to this email.",
      nextSteps: [
        "<strong>Within one working day</strong> we'll send a tailored reply to your message \u2014 not a template.",
        "If the topic is more involved, we'll arrange a <strong>15-30 minute call</strong>.",
        "If it's urgent, call us: <strong>+36 30 190 2575</strong> (weekdays, 8am-5pm CET)."
      ],
      closing: "If anything else comes to mind in the meantime, just reply to this email \u2014 we read every message.",
      secondaryLine: "Confirmation \xB7 G2A Marketing"
    },
    career: {
      tag: "APPLICATION",
      subject: "Thanks for your application \u2014 we've received it",
      intro: "Thank you for applying to join the G2A Marketing team. Your application has reached us successfully. We'll review the CV and materials you submitted in detail during the selection process.",
      bodyParagraphs: [
        "What matters to us isn't only professional experience, but also independence, precision, problem-solving, and how far you can take ownership of your own work.",
        "If your background and experience match a current opportunity, we'll get in touch about the next steps in the selection process.",
        "Depending on the number of applications, the review can take several working days \u2014 please don't resend your application in the meantime."
      ],
      closing: "Thank you for your interest in G2A Marketing and for the time you spent applying.",
      noReply: true,
      secondaryLine: "Confirmation \xB7 G2A Marketing"
    }
  },
  zh: {
    audit: {
      tag: "\u5BA1\u8BA1\u7533\u8BF7",
      subject: "\u611F\u8C22\u60A8\u7684\u8425\u9500\u5BA1\u8BA1\u7533\u8BF7\u2014\u2014\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u4E0E\u60A8\u8054\u7CFB",
      intro: "\u611F\u8C22\u60A8\u7684\u8054\u7CFB\u3002\u60A8\u7684\u7533\u8BF7\u5DF2\u6536\u5230\u2014\u2014\u60A8\u53EF\u4EE5\u5728\u4E0B\u65B9\u6838\u5BF9\u63D0\u4EA4\u7684\u5185\u5BB9\u3002\u5982\u9700\u66F4\u6B63\u4EFB\u4F55\u4FE1\u606F\uFF0C\u56DE\u590D\u8FD9\u5C01\u90AE\u4EF6\u5373\u53EF\u3002",
      nextSteps: [
        "<strong>24 \u5C0F\u65F6\u5185</strong>\uFF0C\u6211\u4EEC\u4F1A\u67E5\u770B\u60A8\u7684\u7F51\u7AD9\u4EE5\u53CA\u60A8\u63D0\u4F9B\u7684\u7EBF\u4E0A\u5448\u73B0\u3002",
        "<strong>2-3 \u4E2A\u5DE5\u4F5C\u65E5\u5185</strong>\uFF0C\u6211\u4EEC\u4F1A\u5148\u53D1\u4E00\u4EFD\u521D\u6B65\u8BC4\u4F30\uFF0C\u5217\u51FA\u6700\u91CD\u8981\u7684\u53D1\u73B0\u3002",
        "<strong>5-7 \u4E2A\u5DE5\u4F5C\u65E5\u5185</strong>\uFF0C\u60A8\u4F1A\u6536\u5230\u5B8C\u6574\u5BA1\u8BA1\u62A5\u544A\uFF0815-25 \u9875\uFF09\uFF0C\u5E76\u9644\u4E0A\u6309\u4F18\u5148\u7EA7\u6392\u5E8F\u7684\u884C\u52A8\u5EFA\u8BAE\u3002",
        "\u6574\u4E2A\u8FC7\u7A0B<strong>\u514D\u8D39</strong>\u3001\u65E0\u4EFB\u4F55\u9644\u52A0\u6761\u4EF6\u2014\u2014\u4E4B\u540E\u4E0D\u4F1A\u6709\u63A8\u9500\u7535\u8BDD\uFF0C\u53EA\u6709\u4E00\u4EFD\u60A8\u771F\u6B63\u7528\u5F97\u4E0A\u7684\u62A5\u544A\u3002"
      ],
      closing: "\u5982\u679C\u8FD9\u671F\u95F4\u60A8\u6709\u4EFB\u4F55\u95EE\u9898\uFF0C\u6B22\u8FCE\u76F4\u63A5\u56DE\u590D\u8FD9\u5C01\u90AE\u4EF6\u2014\u2014\u6BCF\u4E00\u5C01\u6211\u4EEC\u90FD\u4F1A\u770B\u3002",
      secondaryLine: "\u786E\u8BA4\u51FD \xB7 G2A Marketing"
    },
    contact: {
      tag: "\u5DF2\u6536\u5230\u7559\u8A00",
      subject: "\u611F\u8C22\u60A8\u7684\u7559\u8A00\u2014\u2014\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u56DE\u590D",
      intro: "\u611F\u8C22\u60A8\u7684\u8054\u7CFB\u3002\u60A8\u7684\u7559\u8A00\u5DF2\u9001\u8FBE\u2014\u2014\u60A8\u53EF\u4EE5\u5728\u4E0B\u65B9\u56DE\u770B\u63D0\u4EA4\u7684\u5185\u5BB9\u3002\u5982\u6709\u4EFB\u4F55\u4FE1\u606F\u4E0D\u51C6\u786E\uFF0C\u56DE\u590D\u8FD9\u5C01\u90AE\u4EF6\u5373\u53EF\u3002",
      nextSteps: [
        "<strong>\u4E00\u4E2A\u5DE5\u4F5C\u65E5\u5185</strong>\uFF0C\u6211\u4EEC\u4F1A\u9488\u5BF9\u60A8\u7684\u7559\u8A00\u53D1\u9001\u4E00\u4EFD\u4E13\u95E8\u7684\u56DE\u590D\uFF0C\u800C\u4E0D\u662F\u6A21\u677F\u3002",
        "\u5982\u679C\u8BDD\u9898\u8F83\u4E3A\u590D\u6742\uFF0C\u6211\u4EEC\u4F1A\u5B89\u6392\u4E00\u6B21 <strong>15-30 \u5206\u949F\u7684\u4EA4\u6D41</strong>\u3002",
        "\u5982\u6709\u6025\u4E8B\uFF0C\u8BF7\u81F4\u7535\uFF1A<strong>+36 30 190 2575</strong>\uFF08\u5DE5\u4F5C\u65E5 8:00-17:00\uFF0C\u4E2D\u6B27\u65F6\u95F4\uFF09\u3002"
      ],
      closing: "\u8FD9\u671F\u95F4\u5982\u679C\u8FD8\u6709\u60F3\u8865\u5145\u7684\u5185\u5BB9\uFF0C\u56DE\u590D\u8FD9\u5C01\u90AE\u4EF6\u5373\u53EF\u2014\u2014\u6BCF\u4E00\u5C01\u6211\u4EEC\u90FD\u4F1A\u770B\u3002",
      secondaryLine: "\u786E\u8BA4\u51FD \xB7 G2A Marketing"
    },
    career: {
      tag: "\u6C42\u804C\u7533\u8BF7",
      subject: "\u611F\u8C22\u60A8\u7684\u5E94\u8058\u2014\u2014\u6211\u4EEC\u5DF2\u6536\u5230",
      intro: "\u611F\u8C22\u60A8\u5E94\u8058\u52A0\u5165 G2A Marketing \u56E2\u961F\u3002\u60A8\u7684\u7533\u8BF7\u5DF2\u6210\u529F\u9001\u8FBE\u3002\u5728\u7504\u9009\u8FC7\u7A0B\u4E2D\uFF0C\u6211\u4EEC\u4F1A\u4ED4\u7EC6\u67E5\u9605\u60A8\u63D0\u4EA4\u7684\u7B80\u5386\u548C\u76F8\u5173\u6750\u6599\u3002",
      bodyParagraphs: [
        "\u5BF9\u6211\u4EEC\u800C\u8A00\uFF0C\u91CD\u8981\u7684\u4E0D\u53EA\u662F\u4E13\u4E1A\u7ECF\u9A8C\uFF0C\u8FD8\u6709\u72EC\u7ACB\u6027\u3001\u4E25\u8C28\u3001\u89E3\u51B3\u95EE\u9898\u7684\u601D\u7EF4\uFF0C\u4EE5\u53CA\u60A8\u80FD\u5728\u591A\u5927\u7A0B\u5EA6\u4E0A\u4E3A\u81EA\u5DF1\u7684\u5DE5\u4F5C\u8D1F\u8D23\u3002",
        "\u5982\u679C\u60A8\u7684\u80CC\u666F\u4E0E\u7ECF\u9A8C\u4E0E\u5F53\u524D\u7684\u673A\u4F1A\u76F8\u5339\u914D\uFF0C\u6211\u4EEC\u4F1A\u5C31\u7504\u9009\u6D41\u7A0B\u7684\u540E\u7EED\u6B65\u9AA4\u4E0E\u60A8\u8054\u7CFB\u3002",
        "\u89C6\u7533\u8BF7\u6570\u91CF\u800C\u5B9A\uFF0C\u8BC4\u4F30\u53EF\u80FD\u9700\u8981\u51E0\u4E2A\u5DE5\u4F5C\u65E5\u2014\u2014\u5728\u6B64\u4E4B\u524D\uFF0C\u8BF7\u52FF\u91CD\u590D\u63D0\u4EA4\u7533\u8BF7\u3002"
      ],
      closing: "\u611F\u8C22\u60A8\u5BF9 G2A Marketing \u7684\u5173\u6CE8\uFF0C\u4EE5\u53CA\u60A8\u4E3A\u8FD9\u6B21\u7533\u8BF7\u4ED8\u51FA\u7684\u65F6\u95F4\u3002",
      noReply: true,
      secondaryLine: "\u786E\u8BA4\u51FD \xB7 G2A Marketing"
    }
  }
};
function renderConfirmationEmailHtml(input) {
  const lang = input.lang ?? "hu";
  const cfg = CONFIRMATION_COPY[lang][input.formType];
  const ui = UI[lang];
  const greeting = lang === "zh" ? `${escapeHtml(input.name)}\uFF0C\u60A8\u597D\uFF01` : lang === "en" ? `Hello ${escapeHtml(input.name)}!` : `Kedves ${escapeHtml(input.name)}!`;
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
  const stepsBlock = cfg.nextSteps ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:32px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:14px">${escapeHtml(ui.nextLabel)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${cfg.nextSteps.map(
    (s, i) => `
        <tr>
          <td valign="top" style="padding:8px 12px 8px 0;width:32px">
            <div style="background:${BRAND_TEAL};color:#ffffff;font-family:${FONT_MONO};font-size:11px;font-weight:700;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px">${i + 1}</div>
          </td>
          <td style="padding:8px 0;font-size:14px;color:${TEXT_SECONDARY};line-height:1.6">${s}</td>
        </tr>`
  ).join("")}
          </table>
        </td>
      </tr>
    </table>` : "";
  const proseBlock = cfg.bodyParagraphs ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 0">
          ${cfg.bodyParagraphs.map((p) => `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(p)}</p>`).join("")}
        </td>
      </tr>
    </table>` : "";
  const body = `
    ${darkHeader({ tag: cfg.tag, secondaryLine: cfg.secondaryLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(cfg.intro)}</p>
        </td>
      </tr>
    </table>

    ${submissionRows ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:10px">${escapeHtml(ui.submittedLabel)}</div>
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

    ${stepsBlock}
    ${proseBlock}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 8px">
          <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(cfg.closing)}</div>
        </td>
      </tr>
    </table>

    ${signature(lang)}
    ${cfg.noReply ? autoNoteBlock(lang) : ""}

    ${footer("https://g2amarketing.hu/kapcsolat", lang)}
  `;
  return wrapper(body, cfg.intro, lang);
}
function confirmationSubject(formType, lang) {
  return CONFIRMATION_COPY[lang][formType].subject;
}
var FIELD_LABELS = {
  hu: {
    email: "Email",
    phone: "Telefon",
    subject: "T\xE1rgy",
    service: "Szolg\xE1ltat\xE1s",
    message: "\xDCzenet",
    position: "Poz\xEDci\xF3",
    company: "C\xE9g",
    website: "Weboldal",
    budget: "Havi b\xFCdzs\xE9",
    challenges: "Kih\xEDv\xE1sok",
    goals: "C\xE9lok",
    areas: "Ter\xFCletek"
  },
  en: {
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    service: "Service",
    message: "Message",
    position: "Position",
    company: "Company",
    website: "Website",
    budget: "Monthly budget",
    challenges: "Challenges",
    goals: "Goals",
    areas: "Areas"
  },
  zh: {
    email: "\u90AE\u7BB1",
    phone: "\u7535\u8BDD",
    subject: "\u4E3B\u9898",
    service: "\u670D\u52A1",
    message: "\u7559\u8A00",
    position: "\u5E94\u8058\u804C\u4F4D",
    company: "\u516C\u53F8",
    website: "\u7F51\u7AD9",
    budget: "\u6BCF\u6708\u9884\u7B97",
    challenges: "\u9762\u4E34\u7684\u6311\u6218",
    goals: "\u76EE\u6807",
    areas: "\u610F\u5411\u9886\u57DF"
  }
};

// server/_core/automations.ts
var SITE = "https://g2amarketing.hu";
var CHECKLIST = `${SITE}/marketing-teszt`;
var PROMPTS = `${SITE}/letoltesek/G2A_Prompt_gyujtemeny_2026.pdf`;
var CONSULT = `${SITE}/ingyenes-audit`;
function offerStep(ctx) {
  const band = ctx.band ?? "J\xF3 \xFAton vagy";
  if (band === "Er\u0151s alapok") {
    return {
      subject: "Er\u0151s alapok \u2014 most j\xF6n a neheze",
      paragraphs: [
        "Az elm\xFAlt k\xE9t h\xE9tben v\xE9gigvett\xFCk az eszk\xF6z\xF6ket, a promptokat \xE9s a m\xE9r\xE9st. A teszted alapj\xE1n n\xE1lad az alapok rendben vannak \u2014 ez t\xF6bb, mint amit a legt\xF6bb c\xE9gn\xE9l l\xE1tunk.",
        "Innen megv\xE1ltozik a j\xE1t\xE9k: nem \xFAjabb csatorn\xE1kat kell nyitni, hanem a megl\xE9v\u0151kb\u0151l t\xF6bbet kihozni. M\xE9rj m\xE9lyebben (melyik csatorna hozza a legjobb \xFCgyfeleket), optimaliz\xE1lj a b\u0151v\xEDt\xE9s helyett, \xE9s tedd folyamatt\xE1, ami eddig ad hoc ment.",
        "Ezen a szinten a r\xE9szletek d\xF6ntenek. Ha szeretn\xE9d, egy 30 perces ingyenes konzult\xE1ci\xF3n megn\xE9zz\xFCk, hol van n\xE1lad a legnagyobb kiakn\xE1zatlan tartal\xE9k."
      ]
    };
  }
  if (band === "Sok a lehet\u0151s\xE9g" || band === "Nagy potenci\xE1l") {
    return {
      subject: "Ha elakadt\xE1l, itt vagyunk",
      paragraphs: [
        "Az elm\xFAlt k\xE9t h\xE9tben sok inputot kapt\xE1l \u2014 eszk\xF6z\xF6k, promptok, m\xE9r\xE9s. Ha most azt \xE9rzed, hogy sok, \xE9s nem tudod, mivel kezdd, az teljesen term\xE9szetes.",
        "A legjobb h\xEDr: neked hoznak a legt\xF6bbet az els\u0151 l\xE9p\xE9sek, mert minden jav\xEDt\xE1s azonnal \xE9rezhet\u0151. Nem kell egyszerre az eg\xE9sz \u2014 el\xE9g egyetlen alap: m\u0171k\xF6d\u0151 weboldal, a m\xE9r\xE9s bek\xF6t\xE9se, vagy egy k\xF6vetkezetesen vitt csatorna.",
        "Ha szeretn\xE9d, egy 30 perces ingyenes konzult\xE1ci\xF3n kijel\xF6lj\xFCk egy\xFCtt az els\u0151 1-2 l\xE9p\xE9st \u2014 k\xF6tetlen\xFCl, konkr\xE9t javaslatokkal."
      ]
    };
  }
  return {
    subject: "Megn\xE9zz\xFCk egy\xFCtt a marketinged?",
    paragraphs: [
      "Az elm\xFAlt k\xE9t h\xE9tben v\xE9gigvett\xFCk az eszk\xF6z\xF6ket, a promptokat \xE9s a m\xE9r\xE9st. Rem\xE9lem, volt k\xF6zt\xFCk olyan, amit m\xE1r haszn\xE1lsz is.",
      "A teszted alapj\xE1n j\xF3 \xFAton vagy: az alapok nagyr\xE9szt megvannak, csak p\xE1r r\xE9s van, ahol elsziv\xE1rog az eredm\xE9ny. A legt\xF6bb c\xE9gn\xE9l 3-4 j\xF3l megv\xE1lasztott jav\xEDt\xE1s hozza az eredm\xE9ny nagy r\xE9sz\xE9t \u2014 nem a mennyis\xE9g sz\xE1m\xEDt, hanem a sorrend.",
      "Ha elakadn\xE1l abban, mit tegy\xE9l el\u0151re, egy 30 perces ingyenes konzult\xE1ci\xF3n sz\xEDvesen seg\xEDt\xFCnk prioriz\xE1lni \u2014 k\xF6tetlen\xFCl, konkr\xE9t javaslatokkal."
    ]
  };
}
var AUTOMATIONS = {
  "leadmagnet-nurture": {
    key: "leadmagnet-nurture",
    name: "AI Marketing Csomag \u2014 nurture",
    steps: [
      {
        dayOffset: 2,
        build: (ctx) => ({
          subject: "Hol kezdd a csomagot?",
          html: renderSimpleEmailHtml({
            name: ctx.name,
            tag: "AI Marketing Csomag",
            unsubscribeUrl: ctx.unsubscribeUrl,
            preheader: "Ne az eg\xE9szet edd meg egyszerre \u2014 kezdd itt, 15 perc az eg\xE9sz.",
            paragraphs: [
              "Rem\xE9lem, siker\xFClt let\xF6ltened a csomagot. N\xE9gy anyag els\u0151re soknak t\u0171nhet, ez\xE9rt egy tan\xE1cs: ne akard egyszerre az eg\xE9szet.",
              "Ha csak egy dologra van ma 15 perced, ezt v\xE1laszd: a 34 pontos \xF6nellen\u0151rz\u0151 checklist\xE1t. Menj v\xE9gig rajta \u0151szint\xE9n, \xE9s a v\xE9g\xE9n pontsz\xE1mot kapsz \u2014 \xE9s fekete-feh\xE9ren l\xE1tod, hol a legnagyobb a r\xE9s.",
              "A legt\xF6bb marketing nem egy nagy dolgon bukik el, hanem sok apr\xF3 r\xE9sen sziv\xE1rog el az eredm\xE9ny. A checklista pont ezeket teszi l\xE1that\xF3v\xE1 \u2014 a k\xF6vetkez\u0151 levelekben pedig \xE9pp az ilyenekhez adok konkr\xE9t seg\xEDts\xE9get."
            ],
            cta: { label: "Ugr\xE1s a checklist\xE1hoz \u2192", href: CHECKLIST }
          })
        })
      },
      {
        dayOffset: 5,
        build: (ctx) => ({
          subject: "A leggyakoribb AI-hiba a marketingben",
          html: renderSimpleEmailHtml({
            name: ctx.name,
            tag: "AI j\xF3zanul",
            unsubscribeUrl: ctx.unsubscribeUrl,
            preheader: "Az AI nem att\xF3l j\xF3, hogy megnyitod. Hanem ahogy k\xE9red.",
            paragraphs: [
              "Egy dolog, amit a legt\xF6bb AI-tipp elhallgat: az AI \xF6nmag\xE1ban \xE1ltal\xE1nosat \xEDr. Semlegeset, sablonosat \u2014 pont azt, amit mindenki m\xE1s is kap.",
              "A k\xFCl\xF6nbs\xE9g nem a szuper eszk\xF6zben van, hanem a kontextusban, amit adsz neki. H\xE1rom dolog, amit\u0151l azonnal jobb lesz az eredm\xE9ny:\n1. Szerep \u2014 mondd meg, ki legyen az AI.\n2. C\xE9lk\xF6z\xF6ns\xE9g \u2014 kinek sz\xF3l a sz\xF6veg, milyen hangnemben.\n3. P\xE9lda \u2014 illessz be egy kor\xE1bbi, j\xF3l siker\xFClt saj\xE1t sz\xF6veget.",
              "A csomagban l\xE9v\u0151 50 prompt pont \xEDgy \xE9p\xFCl fel. \xC9s egy \u0151szinte megjegyz\xE9s: az AI gyors, de nem t\xE9vedhetetlen \u2014 a t\xE9nyeket, sz\xE1mokat, neveket mindig ellen\u0151rizd. Az AI eszk\xF6z, nem var\xE1zslat."
            ],
            cta: { label: "N\xE9zd meg a promptokat \u2192", href: PROMPTS }
          })
        })
      },
      {
        dayOffset: 9,
        build: (ctx) => ({
          subject: "3 sz\xE1m, amit havonta n\xE9zz (a t\xF6bbit hagyd)",
          html: renderSimpleEmailHtml({
            name: ctx.name,
            tag: "Strat\xE9gia-els\u0151",
            unsubscribeUrl: ctx.unsubscribeUrl,
            preheader: "Kevesebb t\xE1bl\xE1zat, jobb d\xF6nt\xE9sek.",
            paragraphs: [
              "Sok eszk\xF6zr\u0151l \xE9s promptr\xF3l volt sz\xF3 az elm\xFAlt hetekben. De legy\xFCnk \u0151szint\xE9k: az eszk\xF6z \xF6nmag\xE1ban nem csin\xE1l marketinget. A strat\xE9gia \xE9s a k\xF6vetkezetes m\xE9r\xE9s teszi.",
              "N\xE1lunk van egy mond\xE1s: \u201EHa nincs strat\xE9gia, nincs G2A.\u201D A gyakorlatban ez azt jelenti, hogy nem eszk\xF6zlist\xE1val kezd\xFCnk, hanem a c\xE9llal \u2014 \xE9s ut\xE1na n\xE9zz\xFCk, mi m\xE9ri vissza.",
              "Ha egyetlen dolgot viszel el ebb\u0151l a lev\xE9lb\u0151l: v\xE1lassz 3 kulcsmutat\xF3t, \xE9s havonta csak azokat n\xE9zd. P\xE9ld\xE1ul h\xE1ny \xFAj \xE9rdekl\u0151d\u0151 j\xF6tt, mennyi volt a megnyit\xE1si/\xE1tkattint\xE1si ar\xE1ny, \xE9s ebb\u0151l h\xE1ny lett t\xE9nyleges \xFCgyf\xE9l. A t\xF6bbi sz\xE1m \xE9rdekes, de ez a h\xE1rom visz d\xF6nt\xE9sre."
            ],
            cta: { label: "Vissza a checklist\xE1hoz \u2192", href: CHECKLIST }
          })
        })
      },
      {
        dayOffset: 14,
        build: (ctx) => {
          const o = offerStep(ctx);
          return {
            subject: o.subject,
            html: renderSimpleEmailHtml({
              name: ctx.name,
              tag: "Ingyenes konzult\xE1ci\xF3",
              unsubscribeUrl: ctx.unsubscribeUrl,
              preheader: "Nincs k\xF6telezetts\xE9g, nincs s\xFCket duma \u2014 csak konkr\xE9t javaslatok.",
              paragraphs: o.paragraphs,
              cta: { label: "Ingyenes konzult\xE1ci\xF3 \u2192", href: CONSULT }
            })
          };
        }
      }
    ]
  }
};
function getAutomation(key) {
  return AUTOMATIONS[key];
}

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
import { randomBytes as randomBytes2 } from "node:crypto";

// server/_core/password.ts
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// shared/passwordPolicy.ts
var MIN_PASSWORD_LENGTH = 10;
function passwordPolicyError(plain) {
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return `A jelsz\xF3 legal\xE1bb ${MIN_PASSWORD_LENGTH} karakter legyen.`;
  }
  if (!/[a-zA-Z]/.test(plain) || !/[0-9]/.test(plain)) {
    return "A jelsz\xF3 tartalmazzon bet\u0171t \xE9s sz\xE1mot is.";
  }
  return null;
}

// server/_core/password.ts
var scrypt = promisify(scryptCb);
var KEY_LEN = 64;
async function hashPassword(plain) {
  const salt = randomBytes(16);
  const key = await scrypt(plain, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}
async function verifyPassword(plain, stored) {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  try {
    const salt = Buffer.from(parts[1], "hex");
    const expected = Buffer.from(parts[2], "hex");
    if (expected.length !== KEY_LEN) return false;
    const actual = await scrypt(plain, salt, KEY_LEN);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
function generateResetToken() {
  return randomBytes(32).toString("hex");
}

// server/routers.ts
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
  }
  if (ctx.user.isActive === false) {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Ez a hozz\xE1f\xE9r\xE9s fel van f\xFCggesztve." });
  }
  return next({ ctx });
});
function permissionProcedure(permission) {
  return adminProcedure2.use(({ ctx, next }) => {
    if (!hasPermission(ctx.user, permission)) {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Ehhez a r\xE9szhez nincs jogosults\xE1god. K\xE9rj hozz\xE1f\xE9r\xE9st az adminisztr\xE1tort\xF3l."
      });
    }
    return next({ ctx });
  });
}
function originFromRequest(req) {
  const origin = req.headers?.origin;
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get?.("host") ?? "g2amarketing.hu";
  return `${req.protocol ?? "https"}://${host}`;
}
function resolveFormLang(req, explicit) {
  if (explicit === "hu" || explicit === "en" || explicit === "zh") return explicit;
  const referer = req.headers?.referer;
  if (referer) {
    try {
      const path = new URL(referer).pathname;
      if (/^\/en(\/|$)/.test(path)) return "en";
      if (/^\/zh(\/|$)/.test(path)) return "zh";
    } catch {
    }
  }
  return toLang(void 0);
}
function renderInviteEmail(name, link) {
  const greeting = name ? `Szia ${name}!` : "Szia!";
  return `<div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1f2937">
  <h1 style="font-size:20px;color:#0f172a;border-left:4px solid #14B8A6;padding-left:14px;margin:0 0 20px">Megh\xEDv\xF3 a G2A admin fel\xFCletre</h1>
  <p style="line-height:1.6;font-size:15px">${greeting}</p>
  <p style="line-height:1.6;font-size:15px">Hozz\xE1f\xE9r\xE9st kapt\xE1l a G2A Marketing admin fel\xFClet\xE9hez. Az al\xE1bbi gombbal tudod be\xE1ll\xEDtani a jelszavad \u2014 a link <strong>1 \xF3r\xE1ig</strong> \xE9rv\xE9nyes.</p>
  <p style="margin:26px 0"><a href="${link}" style="display:inline-block;background:#14B8A6;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600">Jelsz\xF3 be\xE1ll\xEDt\xE1sa</a></p>
  <p style="line-height:1.6;font-size:13px;color:#6b7280">Ha a gomb nem m\u0171k\xF6dik, m\xE1sold be ezt a linket a b\xF6ng\xE9sz\u0151dbe:<br><span style="word-break:break-all;color:#0d9488">${link}</span></p>
  <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:12px;color:#9ca3af;line-height:1.5">G2A Marketing \xB7 g2amarketing.hu</p>
</div>`;
}
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
    formContext: z2.enum(["contact", "careers"]).optional(),
    // Visitor's language, so the confirmation email matches the site they
    // submitted from. Falls back to the Referer path, then hu.
    lang: z2.enum(["hu", "en", "zh"]).optional()
  })).mutation(async ({ input, ctx }) => {
    const bucket = input.formContext === "careers" ? "careers" : "contact";
    const guard = await guardPublicFormOrSilent(ctx, input, bucket, { success: true });
    if (guard) return guard;
    const { [HONEYPOT_FIELD]: _hp, formContext: _fc, turnstileToken: _tt, lang: _lang, ...submission } = input;
    void _hp;
    void _fc;
    void _tt;
    void _lang;
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
        const lang = resolveFormLang(ctx.req, input.lang);
        const L = FIELD_LABELS[lang];
        const submissionFields = formType === "career" ? [
          { label: L.email, value: input.email },
          { label: L.phone, value: input.phone || "" },
          { label: L.position, value: input.subject?.replace(/^Karrier jelentkezés:\s*/, "") || "" },
          { label: L.message, value: input.message }
        ] : [
          { label: L.email, value: input.email },
          { label: L.phone, value: input.phone || "" },
          { label: L.subject, value: input.subject || "" },
          { label: L.service, value: input.serviceInterest || "" },
          { label: L.message, value: input.message }
        ];
        await sendEmail({
          to: input.email,
          subject: confirmationSubject(formType, lang),
          html: renderConfirmationEmailHtml({
            name: input.name,
            formType,
            submission: submissionFields,
            lang
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
    turnstileToken: z2.string().optional(),
    // Visitor's language for the confirmation email. Not persisted.
    lang: z2.enum(["hu", "en", "zh"]).optional()
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
    const { turnstileToken: _tt, lang: _lang, ...inputForDb } = input;
    void _tt;
    void _lang;
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
              { label: L.goals, value: normalizedInput.goals || "" }
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
function renderWelcomeEmailHtml2(name, unsubscribeUrl, topics, lang = "hu") {
  return renderWelcomeEmailHtml({ name, unsubscribeUrl, topics, lang });
}
var WELCOME_MISC = {
  hu: {
    subject: "\xDCdv a G2A Marketing h\xEDrlevel\xE9ben!",
    text: (name, url) => `${name ? `Szia ${name}!` : "Szia!"}

Attila vagyok a G2A Marketingt\u0151l \u2014 \xF6r\xFCl\xF6k, hogy itt vagy. P\xE9ntek reggelente \xEDrok egyszer, sose k\xE9retlen\xFCl.

Leiratkoz\xE1s: ${url}

G2A Marketing Bt. \xB7 P\xE9cs \xB7 info@g2amarketing.hu`
  },
  en: {
    subject: "Welcome to the G2A Marketing newsletter",
    text: (name, url) => `${name ? `Hi ${name}!` : "Hi there!"}

I'm Attila from G2A Marketing \u2014 glad you're here. I write once, on Friday mornings, never unsolicited.

Unsubscribe: ${url}

G2A Marketing Bt. \xB7 P\xE9cs, Hungary \xB7 info@g2amarketing.hu`
  },
  zh: {
    subject: "\u6B22\u8FCE\u8BA2\u9605 G2A Marketing \u901A\u8BAF",
    text: (name, url) => `${name ? `${name}\uFF0C\u60A8\u597D\uFF01` : "\u60A8\u597D\uFF01"}

\u6211\u662F G2A Marketing \u7684 Attila\u2014\u2014\u5F88\u9AD8\u5174\u60A8\u6765\u5230\u8FD9\u91CC\u3002\u6211\u6BCF\u5468\u53EA\u5728\u5468\u4E94\u65E9\u4E0A\u5199\u4E00\u5C01\uFF0C\u7EDD\u4E0D\u6253\u6270\u3002

\u9000\u8BA2\uFF1A${url}

G2A Marketing Bt. \xB7 \u5308\u7259\u5229\u4F69\u5947 \xB7 info@g2amarketing.hu`
  }
};
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
    turnstileToken: z2.string().optional(),
    // Visitor's language, so the welcome email matches the site they
    // signed up from. Falls back to the Referer path, then hu.
    lang: z2.enum(["hu", "en", "zh"]).optional()
  })).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(ctx, input, "newsletter", { success: true, alreadySubscribed: false });
    if (guard) return guard;
    const exists = await checkNewsletterSubscriberExists(input.email);
    if (exists) return { success: true, alreadySubscribed: true };
    const unsubscribeToken = randomBytes2(16).toString("hex");
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
      const lang = resolveFormLang(ctx.req, input.lang);
      await sendEmail({
        to: input.email,
        subject: WELCOME_MISC[lang].subject,
        html: renderWelcomeEmailHtml2(input.name, unsubscribeUrl, input.topics, lang),
        text: WELCOME_MISC[lang].text(input.name ?? "", unsubscribeUrl)
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
    list: permissionProcedure("hero_slides").query(() => getAllHeroSlides()),
    create: permissionProcedure("hero_slides").input(z2.object({
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
    update: permissionProcedure("hero_slides").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("hero_slides").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteHeroSlide(input.id))
  }),
  // Services
  services: router({
    list: permissionProcedure("services").query(() => getServices()),
    create: permissionProcedure("services").input(z2.object({
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
      subtitle: z2.string().optional(),
      subtitleEn: z2.string().optional(),
      subtitleZh: z2.string().optional(),
      intro: z2.string().optional(),
      introEn: z2.string().optional(),
      introZh: z2.string().optional(),
      cta: z2.string().optional(),
      ctaEn: z2.string().optional(),
      ctaZh: z2.string().optional(),
      color: z2.string().optional(),
      benefits: z2.string().optional(),
      process: z2.string().optional(),
      faq: z2.string().optional(),
      sortOrder: z2.number().default(0)
    })).mutation(({ input }) => createService(input)),
    update: permissionProcedure("services").input(z2.object({ id: z2.number(), data: z2.object({
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
      subtitle: z2.string().optional(),
      subtitleEn: z2.string().optional(),
      subtitleZh: z2.string().optional(),
      intro: z2.string().optional(),
      introEn: z2.string().optional(),
      introZh: z2.string().optional(),
      cta: z2.string().optional(),
      ctaEn: z2.string().optional(),
      ctaZh: z2.string().optional(),
      color: z2.string().optional(),
      benefits: z2.string().optional(),
      process: z2.string().optional(),
      faq: z2.string().optional(),
      sortOrder: z2.number().optional()
    }) })).mutation(({ input }) => updateService(input.id, input.data)),
    delete: permissionProcedure("services").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteService(input.id))
  }),
  // Categories
  categories: router({
    list: permissionProcedure("categories").query(() => getCategories()),
    create: permissionProcedure("categories").input(z2.object({
      name: z2.string(),
      nameEn: z2.string().optional(),
      nameZh: z2.string().optional(),
      slug: z2.string(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional()
    })).mutation(({ input }) => createCategory(input)),
    update: permissionProcedure("categories").input(z2.object({ id: z2.number(), data: z2.object({
      name: z2.string().optional(),
      nameEn: z2.string().optional(),
      nameZh: z2.string().optional(),
      slug: z2.string().optional(),
      description: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionZh: z2.string().optional()
    }) })).mutation(({ input }) => updateCategory(input.id, input.data)),
    delete: permissionProcedure("categories").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteCategory(input.id)),
    deleteMany: permissionProcedure("categories").input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteCategoriesBulk(input.ids))
  }),
  // Posts
  posts: router({
    list: permissionProcedure("posts").query(() => getAllPostsAdmin()),
    create: permissionProcedure("posts").input(z2.object({
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
    update: permissionProcedure("posts").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("posts").input(z2.object({ id: z2.number() })).mutation(({ input }) => deletePost(input.id)),
    deleteMany: permissionProcedure("posts").input(z2.object({ ids: z2.array(z2.number()).min(1).max(200) })).mutation(({ input }) => deletePostsBulk(input.ids))
  }),
  // Testimonials
  testimonials: router({
    list: permissionProcedure("testimonials").query(() => getAllTestimonials()),
    create: permissionProcedure("testimonials").input(z2.object({
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
    update: permissionProcedure("testimonials").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("testimonials").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteTestimonial(input.id)),
    deleteMany: permissionProcedure("testimonials").input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteTestimonialsBulk(input.ids))
  }),
  // Partners
  partners: router({
    list: permissionProcedure("partners").query(() => getAllPartners()),
    create: permissionProcedure("partners").input(z2.object({
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
    update: permissionProcedure("partners").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("partners").input(z2.object({ id: z2.number() })).mutation(({ input }) => deletePartner(input.id)),
    deleteMany: permissionProcedure("partners").input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deletePartnersBulk(input.ids))
  }),
  // Industries
  industries: router({
    list: permissionProcedure("industries").query(() => getAllIndustries()),
    create: permissionProcedure("industries").input(z2.object({
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
    update: permissionProcedure("industries").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("industries").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteIndustry(input.id)),
    deleteMany: permissionProcedure("industries").input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteIndustriesBulk(input.ids))
  }),
  // Technologies
  technologies: router({
    list: permissionProcedure("technologies").query(() => getAllTechnologies()),
    create: permissionProcedure("technologies").input(z2.object({
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
    update: permissionProcedure("technologies").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("technologies").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteTechnology(input.id)),
    deleteMany: permissionProcedure("technologies").input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteTechnologiesBulk(input.ids))
  }),
  // Values
  values: router({
    list: permissionProcedure("values").query(() => getAllValues()),
    create: permissionProcedure("values").input(z2.object({
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
    update: permissionProcedure("values").input(z2.object({ id: z2.number(), data: z2.object({
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
    delete: permissionProcedure("values").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteValue(input.id))
  }),
  // Contact Submissions
  contacts: router({
    list: permissionProcedure("contacts").query(() => getContactSubmissions()),
    markRead: permissionProcedure("contacts").input(z2.object({ id: z2.number() })).mutation(({ input }) => markContactRead(input.id)),
    delete: permissionProcedure("contacts").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteContactSubmission(input.id)),
    deleteMany: permissionProcedure("contacts").input(z2.object({ ids: z2.array(z2.number()).min(1).max(200) })).mutation(({ input }) => deleteContactSubmissionsBulk(input.ids))
  }),
  // Newsletter
  newsletter: router({
    list: permissionProcedure("newsletter").query(() => getAllNewsletterSubscribers()),
    updateSegment: permissionProcedure("newsletter").input(z2.object({
      id: z2.number(),
      segment: z2.string().optional(),
      source: z2.string().optional(),
      tags: z2.string().optional()
    })).mutation(({ input }) => updateNewsletterSubscriberSegment(input)),
    delete: permissionProcedure("newsletter").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteNewsletterSubscriber(input.id)),
    deleteMany: permissionProcedure("newsletter").input(z2.object({ ids: z2.array(z2.number()).min(1).max(500) })).mutation(({ input }) => deleteNewsletterSubscribersBulk(input.ids)),
    // ─── Campaigns ────────────────────────────────────────────────────────────
    /** Count recipients for a given segment (preview before send). */
    estimateRecipients: permissionProcedure("newsletter").input(z2.object({ segment: z2.string().nullable().optional() })).query(async ({ input }) => {
      const subs = await getActiveSubscribersForCampaign(input.segment ?? null);
      return { count: subs.length };
    }),
    /** List past + draft campaigns. */
    campaignList: permissionProcedure("newsletter").query(() => listEmailCampaigns()),
    /**
     * Per-campaign event stats (delivered / opened / clicked / bounced /
     * complained — unique recipients). Powers the campaign-history table
     * in /admin/newsletter/campaigns. Returns zeros when the webhook
     * isn't yet configured (no events collected).
     */
    campaignStats: permissionProcedure("newsletter").input(z2.object({ campaignId: z2.number() })).query(({ input }) => getCampaignEventStats(input.campaignId)),
    /** Send a test email to a single address (admin's own email is the typical target). */
    sendTest: permissionProcedure("newsletter").input(z2.object({
      to: z2.string().email(),
      subject: z2.string().min(1),
      html: z2.string().min(20)
    })).mutation(async ({ input }) => {
      if (!isEmailConfigured()) {
        throw new TRPCError3({ code: "PRECONDITION_FAILED", message: "Resend nincs konfigur\xE1lva (.env: RESEND_API_KEY + RESEND_NOTIFY_EMAIL)" });
      }
      const html = input.html.replace(/\{\{unsubscribeUrl\}\}/g, "https://g2amarketing.hu/api/newsletter/unsubscribe?token=TEST_TOKEN");
      const result = await sendEmailWithId({
        to: input.to,
        subject: `[TEST] ${input.subject}`,
        html: `<div style="background:#fef3c7;padding:8px 12px;font-family:monospace;font-size:12px;color:#92400e;border-radius:4px;margin-bottom:16px">\u26A0 Ez egy TESZT email \u2014 nem ment ki a teljes list\xE1nak.</div>${html}`
      });
      if (!result.ok) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: result.error || "A k\xFCld\xE9s sikertelen \u2014 ellen\u0151rizd a Resend be\xE1ll\xEDt\xE1sokat." });
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
    sendCampaign: permissionProcedure("newsletter").input(z2.object({
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
      let sent = 0, failed = 0, lastError;
      for (const sub of subs) {
        const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
        const personalizedHtml = input.html.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
        const personalizedText = input.text?.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
        try {
          const r = await sendEmailWithId({
            to: sub.email,
            subject: input.subject,
            html: personalizedHtml,
            text: personalizedText,
            tags: [{ name: "campaign_id", value: String(campaignId) }]
          });
          if (r.ok) sent++;
          else {
            failed++;
            lastError = r.error;
          }
        } catch (err) {
          console.error(`[campaign] send failed for ${sub.email}:`, err);
          failed++;
          lastError = String(err instanceof Error ? err.message : err);
        }
        if (sent === 0 && failed >= 3) break;
        await new Promise((r) => setTimeout(r, 600));
      }
      await updateEmailCampaign(campaignId, {
        status: sent === 0 ? "failed" : "sent",
        sentCount: sent,
        failedCount: failed,
        sentAt: /* @__PURE__ */ new Date()
      });
      if (sent === 0) {
        throw new TRPCError3({
          code: "BAD_REQUEST",
          message: lastError ? `Egyetlen email sem ment ki. ${lastError}` : "Egyetlen email sem ment ki \u2014 ellen\u0151rizd a Resend be\xE1ll\xEDt\xE1sokat (hiteles\xEDtett domain)."
        });
      }
      return { campaignId, recipientCount: subs.length, sent, failed };
    })
  }),
  // Pages SEO
  pages: router({
    list: permissionProcedure("seo").query(() => getAllPages()),
    upsert: permissionProcedure("seo").input(z2.object({
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
    list: permissionProcedure("case_studies").query(() => getAllCaseStudies()),
    upsert: permissionProcedure("case_studies").input(z2.object({
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
    delete: permissionProcedure("case_studies").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteCaseStudy(input.id)),
    deleteMany: permissionProcedure("case_studies").input(z2.object({ ids: z2.array(z2.number()).min(1).max(100) })).mutation(({ input }) => deleteCaseStudiesBulk(input.ids))
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
        await createAiJob({ id: jobId, type: "multilang_blog_draft", totalSteps: 3 });
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
    list: permissionProcedure("audit_leads").query(() => getAllAuditLeads()),
    markContacted: permissionProcedure("audit_leads").input(z2.object({ id: z2.number() })).mutation(({ input }) => markAuditLeadContacted(input.id)),
    delete: permissionProcedure("audit_leads").input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteAuditLead(input.id)),
    deleteMany: permissionProcedure("audit_leads").input(z2.object({ ids: z2.array(z2.number()).min(1).max(200) })).mutation(({ input }) => deleteAuditLeadsBulk(input.ids))
  }),
  // Site Settings
  settings: router({
    list: permissionProcedure("settings").query(() => getAllSiteSettings()),
    upsert: permissionProcedure("settings").input(z2.object({ key: z2.string(), value: z2.string() })).mutation(({ input }) => upsertSiteSetting(input.key, input.value))
  }),
  // Brand voice — used by every AI generator (social copy, blog drafts,
  // SEO meta) to write in the G2A house style instead of generic agency tone.
  brandVoice: router({
    get: permissionProcedure("brand_voice").query(async () => {
      const voice = await loadBrandVoice();
      return voice ?? EMPTY_BRAND_VOICE;
    }),
    update: permissionProcedure("brand_voice").input(
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
  stats: permissionProcedure("brand_voice").query(async () => {
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
  statsTimeSeries: permissionProcedure("brand_voice").input(z2.object({ days: z2.number().int().min(7).max(365).default(30) })).query(async ({ input }) => {
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
  recentActivity: permissionProcedure("brand_voice").input(z2.object({ limit: z2.number().int().min(1).max(50).default(10) })).query(async ({ input }) => {
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
  systemHealth: permissionProcedure("brand_voice").query(async () => {
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
  contentSummary: permissionProcedure("brand_voice").query(async () => {
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
  }),
  users: router({
    list: permissionProcedure("users").query(async () => {
      const rows = await listStaffUsers();
      return rows.map((u) => ({
        id: u.id,
        name: u.name ?? "",
        email: u.email ?? "",
        permissions: parsePermissions(u.permissions),
        isActive: Boolean(u.isActive),
        isOwner: Boolean(u.isOwner),
        hasPassword: Boolean(u.passwordHash),
        invitedAt: u.invitedAt,
        lastSignedIn: u.lastSignedIn
      }));
    }),
    /**
     * Invite a colleague. Creates the row with no password and a one-hour
     * set-password token, emails the link, and ALSO returns it so the owner
     * can pass it on by hand — deliverability shouldn't block onboarding.
     */
    invite: permissionProcedure("users").input(z2.object({
      name: z2.string().min(2).max(120),
      email: z2.string().email(),
      permissions: z2.array(z2.enum(PERMISSION_KEYS)).max(PERMISSION_KEYS.length)
    })).mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const existing = await getUserByEmail(email);
      if (existing) {
        throw new TRPCError3({ code: "CONFLICT", message: "Ezzel az email c\xEDmmel m\xE1r l\xE9tezik felhaszn\xE1l\xF3." });
      }
      const token = generateResetToken();
      const created = await createStaffUser({
        openId: `staff-${randomBytes2(12).toString("hex")}`,
        name: input.name.trim(),
        email,
        permissions: JSON.stringify(input.permissions),
        resetToken: token,
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1e3)
      });
      const link = `${originFromRequest(ctx.req)}/admin/reset-password?token=${token}`;
      let emailSent = false;
      let emailError;
      const result = await sendEmailWithId({
        to: email,
        subject: "Megh\xEDv\xF3 a G2A admin fel\xFCletre",
        html: renderInviteEmail(input.name.trim(), link),
        text: `Megh\xEDvtak a G2A admin fel\xFCletre. \xC1ll\xEDtsd be a jelszavad: ${link} (a link 1 \xF3r\xE1ig \xE9rv\xE9nyes)`
      });
      emailSent = result.ok;
      if (!result.ok) emailError = result.error;
      return { id: created?.id ?? 0, link, emailSent, emailError };
    }),
    update: permissionProcedure("users").input(z2.object({
      id: z2.number(),
      name: z2.string().min(2).max(120).optional(),
      permissions: z2.array(z2.enum(PERMISSION_KEYS)).optional(),
      isActive: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const target = await getUserById(input.id);
      if (!target) throw new TRPCError3({ code: "NOT_FOUND", message: "Nincs ilyen felhaszn\xE1l\xF3." });
      if (target.isOwner) {
        throw new TRPCError3({ code: "FORBIDDEN", message: "A tulajdonos hozz\xE1f\xE9r\xE9se nem m\xF3dos\xEDthat\xF3 \u2014 mindig teljes jogosults\xE1ga van." });
      }
      await updateStaffUser(input.id, {
        ...input.name !== void 0 ? { name: input.name.trim() } : {},
        ...input.permissions !== void 0 ? { permissions: JSON.stringify(input.permissions) } : {},
        ...input.isActive !== void 0 ? { isActive: input.isActive } : {}
      });
      return { success: true };
    }),
    /** New set-password link for someone who never used (or lost) the first. */
    resendInvite: permissionProcedure("users").input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      const target = await getUserById(input.id);
      if (!target || !target.email) throw new TRPCError3({ code: "NOT_FOUND", message: "Nincs ilyen felhaszn\xE1l\xF3." });
      const token = generateResetToken();
      await updateStaffUser(target.id, {
        resetToken: token,
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1e3)
      });
      const link = `${originFromRequest(ctx.req)}/admin/reset-password?token=${token}`;
      const result = await sendEmailWithId({
        to: target.email,
        subject: "G2A Admin \u2014 jelsz\xF3 be\xE1ll\xEDt\xE1sa",
        html: renderInviteEmail(target.name ?? "", link),
        text: `Jelsz\xF3 be\xE1ll\xEDt\xE1sa: ${link} (a link 1 \xF3r\xE1ig \xE9rv\xE9nyes)`
      });
      return { link, emailSent: result.ok, emailError: result.error };
    }),
    remove: permissionProcedure("users").input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      const target = await getUserById(input.id);
      if (!target) throw new TRPCError3({ code: "NOT_FOUND", message: "Nincs ilyen felhaszn\xE1l\xF3." });
      if (target.isOwner) {
        throw new TRPCError3({ code: "FORBIDDEN", message: "A tulajdonos nem t\xF6r\xF6lhet\u0151." });
      }
      if (target.id === ctx.user.id) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Saj\xE1t magadat nem t\xF6r\xF6lheted." });
      }
      await deleteStaffUser(input.id);
      return { success: true };
    })
  }),
  careers: router({
    listPositions: permissionProcedure("careers").query(() => listAllJobPositions()),
    createPosition: permissionProcedure("careers").input(z2.object({
      titleHu: z2.string().min(1).max(256),
      titleEn: z2.string().max(256).optional(),
      titleZh: z2.string().max(256).optional(),
      descHu: z2.string().optional(),
      descEn: z2.string().optional(),
      descZh: z2.string().optional(),
      location: z2.string().max(128).optional(),
      employmentType: z2.string().max(128).optional(),
      isActive: z2.boolean().optional(),
      sortOrder: z2.number().int().optional()
    })).mutation(async ({ input }) => {
      await createJobPosition(input);
      return { success: true };
    }),
    updatePosition: permissionProcedure("careers").input(z2.object({ id: z2.number(), data: z2.object({
      titleHu: z2.string().min(1).max(256).optional(),
      titleEn: z2.string().max(256).optional(),
      titleZh: z2.string().max(256).optional(),
      descHu: z2.string().optional(),
      descEn: z2.string().optional(),
      descZh: z2.string().optional(),
      location: z2.string().max(128).optional(),
      employmentType: z2.string().max(128).optional(),
      isActive: z2.boolean().optional(),
      sortOrder: z2.number().int().optional()
    }) })).mutation(async ({ input }) => {
      await updateJobPosition(input.id, input.data);
      return { success: true };
    }),
    deletePosition: permissionProcedure("careers").input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteJobPosition(input.id);
      return { success: true };
    }),
    listApplications: permissionProcedure("careers").query(() => listJobApplications()),
    updateApplicationStatus: permissionProcedure("careers").input(z2.object({ id: z2.number(), status: z2.enum(["new", "reviewed", "archived"]) })).mutation(async ({ input }) => {
      await updateJobApplicationStatus(input.id, input.status);
      return { success: true };
    }),
    deleteApplication: permissionProcedure("careers").input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteJobApplication(input.id);
      return { success: true };
    })
  })
});
var SOCIAL_PLATFORM = z2.enum(["linkedin", "facebook", "instagram"]);
var socialRouter = router({
  /** List all connected social accounts (admin sees status per platform). */
  listAccounts: permissionProcedure("brand_voice").query(() => listSocialAccounts()),
  /** All drafts/published posts attached to a given blog post — latest per
   *  platform. The admin UI uses this to render the per-platform share rows. */
  listForPost: permissionProcedure("brand_voice").input(z2.object({ postId: z2.number().int().positive() })).query(({ input }) => getLatestSocialPostsForBlogPost(input.postId)),
  /** Generate AI copy for a (blog post, platform) combination. Doesn't
   *  persist on its own — the UI lets the admin tweak the result before
   *  saving via `saveDraft`. */
  generateCopy: permissionProcedure("brand_voice").input(
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
  saveDraft: permissionProcedure("brand_voice").input(
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
var leadMagnetRouter = router({
  /** Public — AI Marketing Csomag opt-in (HU-only funnel). Stores into the
   *  newsletter list with source + segmentation, and emails the 4 downloads. */
  subscribe: publicProcedure.input(
    z2.object({
      email: z2.string().email("\xC9rv\xE9nyes email c\xEDm sz\xFCks\xE9ges"),
      name: z2.string().max(256).optional(),
      source: z2.enum(["ai-csomag", "marketing-teszt"]).default("ai-csomag"),
      // From the interactive checklist (/marketing-teszt); absent on the plain landing.
      score: z2.number().int().min(0).max(100).optional(),
      band: z2.string().max(64).optional(),
      weakestAreas: z2.string().max(512).optional(),
      [HONEYPOT_FIELD]: z2.string().optional(),
      turnstileToken: z2.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(ctx, input, "newsletter", { success: true });
    if (guard) return guard;
    const seg = {
      score: input.score ?? null,
      band: input.band ?? null,
      weakestAreas: input.weakestAreas ?? null
    };
    const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get("host")}`;
    const existing = await getNewsletterSubscriberByEmail(input.email);
    let unsubscribeToken = existing?.unsubscribeToken ?? null;
    if (existing) {
      await updateNewsletterSubscriberSegmentation(input.email, {
        source: input.source,
        ...input.score !== void 0 ? seg : {}
      });
    } else {
      unsubscribeToken = randomBytes2(16).toString("hex");
      await createNewsletterSubscriber({
        email: input.email,
        name: input.name ?? null,
        source: input.source,
        tags: input.source,
        unsubscribeToken,
        ...seg
      });
      await notifyOwner({
        title: "\xDAj lead-magnet feliratkoz\xF3",
        content: `**Email:** ${input.email}
**N\xE9v:** ${input.name || "\u2013"}
**Forr\xE1s:** ${input.source}
**Pontsz\xE1m:** ${input.score ?? "\u2013"}
**S\xE1v:** ${input.band || "\u2013"}
**Leggyeng\xE9bb:** ${input.weakestAreas || "\u2013"}`,
        replyTo: input.email
      });
    }
    const NURTURE = "leadmagnet-nurture";
    if (!await hasActiveEnrollment(input.email, NURTURE)) {
      const first = getAutomation(NURTURE)?.steps[0];
      if (first) {
        await createEnrollment({
          email: input.email,
          automationKey: NURTURE,
          band: input.band ?? null,
          name: input.name ?? null,
          nextRunAt: new Date(Date.now() + first.dayOffset * 24 * 60 * 60 * 1e3)
        });
      }
    }
    if (isEmailConfigured() && unsubscribeToken) {
      const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
      if (input.source === "marketing-teszt" && input.score !== void 0 && input.band) {
        await sendEmail({
          to: input.email,
          subject: `A teszted eredm\xE9nye: ${input.score}/34 pont \u2014 ${input.band}`,
          html: renderChecklistResultHtml({
            name: input.name,
            score: input.score,
            band: input.band,
            weakestAreas: input.weakestAreas ?? "",
            unsubscribeUrl
          })
        });
      } else {
        await sendEmail({
          to: input.email,
          subject: "Itt a 4 anyag \u2014 G2A AI Marketing Csomag",
          html: renderLeadMagnetWelcomeHtml({ name: input.name, unsubscribeUrl })
        });
      }
    }
    return { success: true };
  })
});
var careersRouter = router({
  /** Public — active positions for the career page. Empty is the normal state. */
  positions: publicProcedure.query(() => listActiveJobPositions()),
  /** Public — submit a job application. The CV (if any) is emailed to the owner
   *  as an attachment; only metadata is stored (PII stays out of the DB/CDN).
   *  Named `submit` not `apply` — tRPC reserves `apply` (a Function method). */
  submit: publicProcedure.input(
    z2.object({
      name: z2.string().min(1, "A n\xE9v megad\xE1sa k\xF6telez\u0151").max(256),
      email: z2.string().email("\xC9rv\xE9nyes email c\xEDm sz\xFCks\xE9ges"),
      phone: z2.string().max(64).optional(),
      positionId: z2.number().int().positive().optional(),
      areas: z2.array(z2.string().max(64)).max(20).optional(),
      message: z2.string().max(4e3).optional(),
      cv: z2.object({
        filename: z2.string().min(1).max(256),
        // base64 without the `data:` prefix; ~4.5MB cap keeps us under the
        // Vercel serverless request-body limit (a ~3MB file).
        contentBase64: z2.string().min(1).max(45e5),
        contentType: z2.string().max(128).optional()
      }).optional(),
      lang: z2.enum(["hu", "en", "zh"]).optional(),
      [HONEYPOT_FIELD]: z2.string().optional(),
      turnstileToken: z2.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(ctx, input, "careers", { success: true });
    if (guard) return guard;
    const areas = (input.areas ?? []).filter((a) => areValidAreaKeys([a]));
    let positionTitle;
    if (input.positionId) {
      const pos = await getJobPosition(input.positionId);
      positionTitle = pos?.titleHu ?? void 0;
    }
    await createJobApplication({
      name: input.name,
      email: input.email,
      phone: input.phone,
      positionId: input.positionId,
      positionTitle,
      areas: areas.length ? areas.join(",") : null,
      message: input.message,
      cvFilename: input.cv?.filename ?? null
    });
    const lang = toLang(input.lang);
    if (isEmailConfigured()) {
      const content = `**N\xE9v:** ${input.name}
**Email:** ${input.email}
**Telefon:** ${input.phone || "\u2013"}
**Poz\xEDci\xF3:** ${positionTitle || "Spont\xE1n jelentkez\xE9s"}
**Ter\xFCletek:** ${areaLabels(areas, "hu").join(", ") || "\u2013"}
**CV:** ${input.cv ? input.cv.filename : "nincs csatolva"}

**\xDCzenet:**
${input.message || "\u2013"}`;
      await sendEmail({
        subject: `\xDAj karrier-jelentkez\xE9s: ${input.name}`,
        html: renderNotificationHtml(content),
        replyTo: input.email,
        attachments: input.cv ? [{ filename: input.cv.filename, content: input.cv.contentBase64 }] : void 0
      });
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
            { label: L.areas, value: areaLabels(areas, lang).join(", ") }
          ]
        }),
        replyTo: "info@g2amarketing.hu"
      });
    }
    return { success: true };
  })
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => {
      const u = opts.ctx.user;
      if (!u) return null;
      return {
        id: u.id,
        openId: u.openId,
        name: u.name,
        email: u.email,
        role: u.role,
        isOwner: Boolean(u.isOwner),
        isActive: u.isActive !== false,
        permissions: parsePermissions(u.permissions)
      };
    }),
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
  careers: careersRouter,
  leadmagnet: leadMagnetRouter,
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
  // Full access in dev so every admin screen stays reachable behind the bypass.
  passwordHash: null,
  permissions: null,
  isActive: true,
  isOwner: true,
  resetToken: null,
  resetTokenExpiresAt: null,
  sessionsValidFrom: null,
  invitedAt: null,
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
import { createHmac, timingSafeEqual as timingSafeEqual2 } from "crypto";
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
    if (timingSafeEqual2(
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
import { timingSafeEqual as timingSafeEqual3 } from "node:crypto";
init_env();
var PASSWORD_ADMIN_OPEN_ID = "password-admin";
var FALLBACK_APP_ID_TAG = "g2a-password-admin";
function safeEquals(a, b) {
  if (a.length !== b.length) return false;
  return timingSafeEqual3(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
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
  app2.get("/api/_diag/admin-env", (req, res) => {
    const provided = req.query.key || "";
    if (!ENV.cookieSecret || provided !== ENV.cookieSecret) {
      return res.status(401).json({ error: "Wrong or missing ?key=" });
    }
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
    if (!ENV.cookieSecret) {
      res.status(503).json({
        error: "Password login not configured. Set JWT_SECRET in the Vercel environment."
      });
      return;
    }
    const ip = getClientIp(req);
    const acct = email.trim().toLowerCase();
    const tooMany = (retryAt) => {
      const minutes = Math.ceil(((retryAt ?? Date.now()) - Date.now()) / 6e4);
      res.status(429).json({
        error: `T\xFAl sok bejelentkez\xE9si k\xEDs\xE9rlet. Pr\xF3b\xE1ld \xFAjra ${minutes} perc m\xFAlva.`
      });
    };
    const ipLimit = await checkRateLimitDb(`admin-login:${ip}`, { max: 5, windowMs: 15 * 60 * 1e3 });
    if (!ipLimit.allowed) {
      tooMany(ipLimit.retryAt);
      return;
    }
    const acctLimit = await checkRateLimitDb(`admin-login-acct:${acct}`, { max: 10, windowMs: 15 * 60 * 1e3 });
    if (!acctLimit.allowed) {
      tooMany(acctLimit.retryAt);
      return;
    }
    try {
      const ownerEmailMatches = Boolean(ENV.adminEmail) && safeEquals(email, ENV.adminEmail);
      const staff = await getUserByEmail(email);
      if (staff && staff.passwordHash && !staff.isOwner && !ownerEmailMatches) {
        const ok = await verifyPassword(password, staff.passwordHash);
        if (!ok) {
          res.status(401).json({ error: "Hib\xE1s email vagy jelsz\xF3." });
          return;
        }
        if (!staff.isActive) {
          res.status(403).json({ error: "Ez a hozz\xE1f\xE9r\xE9s fel van f\xFCggesztve. K\xE9rj hozz\xE1f\xE9r\xE9st az adminisztr\xE1tort\xF3l." });
          return;
        }
        if (staff.resetToken) {
          await updateStaffUser(staff.id, { resetToken: null, resetTokenExpiresAt: null });
        }
        await issueSession(req, res, staff.openId, staff.name || "Munkat\xE1rs");
        return;
      }
      const ownerHashOk = (staff?.isOwner || ownerEmailMatches) && staff?.passwordHash ? await verifyPassword(password, staff.passwordHash) : false;
      const ownerEnvOk = ownerEmailMatches && Boolean(ENV.adminPassword) && safeEquals(password, ENV.adminPassword);
      if (!ownerHashOk && !ownerEnvOk) {
        res.status(401).json({ error: "Hib\xE1s email vagy jelsz\xF3." });
        return;
      }
      const owner = await ensureOwnerUser(PASSWORD_ADMIN_OPEN_ID, email);
      await upsertUser({
        openId: owner?.openId ?? PASSWORD_ADMIN_OPEN_ID,
        name: owner?.name || "Admin",
        email,
        role: "admin",
        loginMethod: "password",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      await issueSession(req, res, owner?.openId ?? PASSWORD_ADMIN_OPEN_ID, owner?.name || "Admin");
    } catch (err) {
      console.error("[password-login] Session creation failed:", err);
      res.status(500).json({ error: "Bels\u0151 hiba a bejelentkez\xE9s sor\xE1n." });
    }
  });
  app2.post("/api/auth/request-reset", async (req, res) => {
    const { email } = req.body ?? {};
    if (typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "\xC9rv\xE9nyes email c\xEDm sz\xFCks\xE9ges." });
      return;
    }
    const ip = getClientIp(req);
    const limit = await checkRateLimitDb(`pwd-reset:${ip}`, { max: 5, windowMs: 15 * 60 * 1e3 });
    if (!limit.allowed) {
      res.status(429).json({ error: "T\xFAl sok k\xE9r\xE9s. Pr\xF3b\xE1ld \xFAjra k\xE9s\u0151bb." });
      return;
    }
    try {
      let user = await getUserByEmail(email);
      if (ENV.adminEmail && safeEquals(email, ENV.adminEmail)) {
        user = await ensureOwnerUser(PASSWORD_ADMIN_OPEN_ID, email);
      }
      if (user && user.isActive) {
        const token = generateResetToken();
        await updateStaffUser(user.id, {
          resetToken: token,
          resetTokenExpiresAt: new Date(Date.now() + RESET_TTL_MS)
        });
        const link = `${resolveOrigin(req)}/admin/reset-password?token=${token}`;
        await sendEmail({
          to: email,
          subject: "G2A Admin \u2014 jelsz\xF3 be\xE1ll\xEDt\xE1sa",
          html: renderResetEmail(user.name || "", link),
          text: `Jelsz\xF3 be\xE1ll\xEDt\xE1sa: ${link}

A link 1 \xF3r\xE1ig \xE9rv\xE9nyes. Ha nem te k\xE9rted, hagyd figyelmen k\xEDv\xFCl ezt a levelet.`
        });
      }
    } catch (err) {
      console.error("[request-reset] failed:", err);
    }
    res.json({ success: true });
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    const { token, password } = req.body ?? {};
    if (typeof token !== "string" || typeof password !== "string" || !token || !password) {
      res.status(400).json({ error: "Hi\xE1nyz\xF3 token vagy jelsz\xF3." });
      return;
    }
    const policy = passwordPolicyError(password);
    if (policy) {
      res.status(400).json({ error: policy });
      return;
    }
    try {
      const user = await getUserByResetToken(token);
      if (!user) {
        res.status(400).json({ error: "A link \xE9rv\xE9nytelen vagy lej\xE1rt. K\xE9rj \xFAjat." });
        return;
      }
      await updateStaffUser(user.id, {
        passwordHash: await hashPassword(password),
        resetToken: null,
        resetTokenExpiresAt: null,
        isActive: true,
        // Cut off every session issued before now — a reset must lock out
        // anyone who was already signed in with the old credentials.
        sessionsValidFrom: /* @__PURE__ */ new Date()
      });
      res.json({ success: true, email: user.email });
    } catch (err) {
      console.error("[reset-password] failed:", err);
      res.status(500).json({ error: "Bels\u0151 hiba a jelsz\xF3 ment\xE9sekor." });
    }
  });
}
async function issueSession(req, res, openId, name) {
  const secretKey = new TextEncoder().encode(ENV.cookieSecret);
  const expirationSeconds = Math.floor((Date.now() + SESSION_TTL_MS) / 1e3);
  const sessionToken = await new SignJWT2({
    openId,
    appId: ENV.appId || FALLBACK_APP_ID_TAG,
    name
  }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setIssuedAt().setExpirationTime(expirationSeconds).sign(secretKey);
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: SESSION_TTL_MS });
  res.json({ success: true });
}
function resolveOrigin(req) {
  const origin = req.headers.origin;
  if (origin) return origin.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}
function renderResetEmail(name, link) {
  const greeting = name ? `Szia ${name}!` : "Szia!";
  return `<div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1f2937">
  <h1 style="font-size:20px;color:#0f172a;border-left:4px solid #14B8A6;padding-left:14px;margin:0 0 20px">G2A Admin \u2014 jelsz\xF3 be\xE1ll\xEDt\xE1sa</h1>
  <p style="line-height:1.6;font-size:15px">${greeting}</p>
  <p style="line-height:1.6;font-size:15px">Az al\xE1bbi gombbal tudsz \xFAj jelsz\xF3t be\xE1ll\xEDtani az admin fel\xFClethez. A link <strong>1 \xF3r\xE1ig</strong> \xE9rv\xE9nyes.</p>
  <p style="margin:26px 0"><a href="${link}" style="display:inline-block;background:#14B8A6;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600">Jelsz\xF3 be\xE1ll\xEDt\xE1sa</a></p>
  <p style="line-height:1.6;font-size:13px;color:#6b7280">Ha a gomb nem m\u0171k\xF6dik, m\xE1sold be ezt a linket a b\xF6ng\xE9sz\u0151dbe:<br><span style="word-break:break-all;color:#0d9488">${link}</span></p>
  <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:12px;color:#9ca3af;line-height:1.5">Ha nem te k\xE9rted, hagyd figyelmen k\xEDv\xFCl ezt a levelet \u2014 a jelszavad v\xE1ltozatlan marad.<br>G2A Marketing \xB7 g2amarketing.hu</p>
</div>`;
}
var RESET_TTL_MS = 60 * 60 * 1e3;

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

// server/_core/automationCronRoute.ts
init_db();
var ORIGIN4 = "https://g2amarketing.hu";
var BATCH = 200;
var DAY_MS = 24 * 60 * 60 * 1e3;
function registerAutomationCronRoute(app2) {
  const handler = async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.authorization || "";
      if (auth !== `Bearer ${secret}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(503).json({ error: "CRON_SECRET not set in production." });
    }
    if (!isEmailConfigured()) {
      return res.status(200).json({ ok: true, note: "email not configured \u2014 nothing sent", sent: 0 });
    }
    const due = await getDueEnrollments(BATCH);
    let sent = 0, completed = 0, cancelled = 0, failed = 0;
    for (const e of due) {
      const automation = getAutomation(e.automationKey);
      if (!automation) {
        await updateEnrollment(e.id, { status: "cancelled" });
        cancelled++;
        continue;
      }
      const sub = await getNewsletterSubscriberByEmail(e.email);
      if (!sub || sub.isActive === false) {
        await updateEnrollment(e.id, { status: "cancelled" });
        cancelled++;
        continue;
      }
      const step = automation.steps[e.currentStep];
      if (!step) {
        await updateEnrollment(e.id, { status: "completed", nextRunAt: null });
        completed++;
        continue;
      }
      const unsubscribeUrl = `${ORIGIN4}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
      const { subject, html } = step.build({ name: e.name ?? sub.name, band: e.band, unsubscribeUrl });
      const ok = await sendEmail({ to: e.email, subject, html });
      if (!ok) {
        failed++;
        continue;
      }
      sent++;
      const nextStep = e.currentStep + 1;
      const next = automation.steps[nextStep];
      if (next) {
        const nextRunAt = new Date(new Date(e.enrolledAt).getTime() + next.dayOffset * DAY_MS);
        await updateEnrollment(e.id, { currentStep: nextStep, nextRunAt });
      } else {
        await updateEnrollment(e.id, { currentStep: nextStep, status: "completed", nextRunAt: null });
        completed++;
      }
    }
    return res.status(200).json({ ok: true, processed: due.length, sent, completed, cancelled, failed });
  };
  app2.get("/api/cron/automations", handler);
  app2.post("/api/cron/automations", handler);
}

// server/_core/app.ts
init_env();
var secretsChecked = false;
function warnOnWeakSecrets() {
  if (secretsChecked) return;
  secretsChecked = true;
  const jwt = (ENV.cookieSecret || "").trim();
  if (!jwt) {
    console.warn("[Security] JWT_SECRET is empty \u2014 password login is disabled and any session would be forgeable. Set a 32+ char random value.");
  } else if (jwt.length < 32) {
    console.warn(`[Security] JWT_SECRET is only ${jwt.length} chars \u2014 HS256 tokens are easier to brute-force. Use a 32+ char random value.`);
  }
  const pw = (ENV.adminPassword || "").trim();
  if (pw && pw.length < 12) {
    console.warn(`[Security] ADMIN_PASSWORD is only ${pw.length} chars \u2014 the owner recovery login is guessable. Use a 16+ char passphrase, or rely on the DB password + forgot-password flow.`);
  }
}
function createApp() {
  warnOnWeakSecrets();
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
  registerAutomationCronRoute(app2);
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
