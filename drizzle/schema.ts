import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const pages = mysqlTable("pages", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  nameEn: varchar("nameEn", { length: 256 }),
  nameZh: varchar("nameZh", { length: 256 }),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const posts = mysqlTable("posts", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const services = mysqlTable("services", {
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
  benefits: text("benefits"), // JSON: [{ title:{hu,en,zh}, desc:{hu,en,zh} }]
  process: text("process"),   // JSON: [{ step, title:{hu,en,zh}, desc:{hu,en,zh} }]
  faq: text("faq"),           // JSON: [{ q:{hu,en,zh}, a:{hu,en,zh} }]
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const heroSlides = mysqlTable("hero_slides", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const testimonials = mysqlTable("testimonials", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const partners = mysqlTable("partners", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const industries = mysqlTable("industries", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const technologies = mysqlTable("technologies", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const values = mysqlTable("values", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  subject: varchar("subject", { length: 512 }),
  message: text("message").notNull(),
  serviceInterest: varchar("serviceInterest", { length: 256 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const emailCampaigns = mysqlTable("email_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 512 }).notNull(),
  html: text("html").notNull(),
  text: text("text"),
  segment: varchar("segment", { length: 128 }),
  recipientCount: int("recipientCount").default(0).notNull(),
  sentCount: int("sentCount").default(0).notNull(),
  failedCount: int("failedCount").default(0).notNull(),
  status: varchar("status", { length: 32 }).default("draft").notNull(), // draft | sending | sent | failed
  sentAt: timestamp("sentAt"),
  sentByUserId: int("sentByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * One row per Resend webhook event we receive (email.delivered, email.opened,
 * email.clicked, email.bounced, email.complained, email.delivery_delayed).
 * `campaignId` is set when the originating send attached a `campaign_id` tag,
 * which is how we attribute opens/clicks to campaigns. NULL = transactional
 * (audit, contact, welcome) — we still log those for spam/deliverability
 * monitoring but no campaign-level dashboard rolls them up.
 */
export const emailEvents = mysqlTable("email_events", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId"), // FK to emailCampaigns.id (nullable for transactional)
  recipient: varchar("recipient", { length: 320 }).notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(), // e.g. email.opened
  resendMessageId: varchar("resendMessageId", { length: 128 }), // for de-dup + lookup
  /** Raw event JSON for forensic-ability — stringified, may include click URL etc. */
  rawData: text("rawData"),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
});

/**
 * Sliding-window rate-limit hits.
 *
 * One row per submission attempt to a public form. Keyed by `bucketKey` (e.g.
 * `contact:1.2.3.4`), counted within a time window via `hitAt`. We use a DB
 * table — not in-memory — because Vercel serverless containers have ephemeral
 * memory: each cold start resets in-process counters, and parallel regional
 * instances each keep their own state, defeating the limiter.
 *
 * Cleanup: a periodic best-effort delete inside the rate-limit check itself
 * removes rows older than 1 hour. No cron needed; the table stays small.
 */
export const rateLimitHits = mysqlTable("rate_limit_hits", {
  id: int("id").autoincrement().primaryKey(),
  bucketKey: varchar("bucketKey", { length: 192 }).notNull(),
  hitAt: timestamp("hitAt").defaultNow().notNull(),
});

/**
 * Connected social media accounts (LinkedIn, Facebook, Instagram).
 *
 * One row per platform — we currently support only a single account per
 * platform (the G2A company page on each). Tokens get refreshed before
 * expiry by the platform-specific helpers.
 *
 * Storing the raw access token in the DB is acceptable for a small admin
 * tool; for production at scale we'd encrypt-at-rest with KMS. The DB is
 * locked down (admin-only access, no public exposure of the column).
 */
export const socialAccounts = mysqlTable("social_accounts", {
  id: int("id").autoincrement().primaryKey(),
  platform: mysqlEnum("platform", ["linkedin", "facebook", "instagram"]).notNull(),
  accountName: varchar("accountName", { length: 256 }), // display name, e.g. "G2A Marketing"
  accountId: varchar("accountId", { length: 256 }), // platform-side ID (page ID, etc.)
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  /** Scope string saved as-is so we can warn if the granted scopes don't
   *  include the publishing permission. */
  scope: text("scope"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Generated/edited social post drafts attached to a blog post.
 *
 * Workflow:
 *   1. Admin opens a blog post in the editor
 *   2. Clicks "Generate copy" per platform → AI returns a draft, stored as
 *      `status='draft'` with empty `externalPostId`
 *   3. Admin tweaks the copy in the textarea → "Save draft" updates the row
 *   4. (Phase 2) Admin clicks "Publish" → server POSTs to the platform API,
 *      stores `externalPostId` + `externalUrl`, flips `status='published'`
 *   5. On failure, `error` is populated and `status='failed'` so the UI
 *      can show what went wrong and allow retry
 *
 * Multiple drafts per (postId, platform) are allowed — admin can iterate on
 * copy variants without losing earlier ones. UI surfaces only the latest.
 */
export const socialPosts = mysqlTable("social_posts", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(), // FK to posts.id (blog post)
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export const caseStudies = mysqlTable("case_studies", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * AI background-job progress tracking.
 *
 * The multilang blog draft pipeline fires six OpenAI calls (3 drafts
 * + 3 editor passes) over ~20-40s. The frontend used to stare at a
 * static spinner; now it polls this row every second to show real
 * progress ("Strukturált draft · 2/6"). The job is owned by a
 * client-generated UUID so the polling endpoint and the worker
 * mutation can both find it without a shared in-process Map (Vercel
 * serverless instances don't share memory).
 *
 * The row is best-effort progress only — losing it doesn't break the
 * generation, the mutation still returns the final draft synchronously.
 */
export const aiJobs = mysqlTable("ai_jobs", {
  id: varchar("id", { length: 36 }).primaryKey(), // client-side UUID
  type: varchar("type", { length: 32 }).notNull(), // "multilang_blog_draft"
  status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending").notNull(),
  phase: varchar("phase", { length: 64 }), // "draft" | "editor" | null
  completedSteps: int("completedSteps").default(0).notNull(),
  totalSteps: int("totalSteps").default(6).notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const auditLeads = mysqlTable("audit_leads", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type Service = typeof services.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type Technology = typeof technologies.$inferSelect;
export type Value = typeof values.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type AuditLead = typeof auditLeads.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type SocialPost = typeof socialPosts.$inferSelect;
