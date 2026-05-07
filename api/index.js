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

// server/db.ts
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

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
var users = mysqlTable("users", {
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
var siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var pages = mysqlTable("pages", {
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
var categories = mysqlTable("categories", {
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
var posts = mysqlTable("posts", {
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
var services = mysqlTable("services", {
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
var heroSlides = mysqlTable("hero_slides", {
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
var testimonials = mysqlTable("testimonials", {
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
var partners = mysqlTable("partners", {
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
var industries = mysqlTable("industries", {
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
var technologies = mysqlTable("technologies", {
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
var values = mysqlTable("values", {
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
var contactSubmissions = mysqlTable("contact_submissions", {
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
var emailCampaigns = mysqlTable("email_campaigns", {
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
var emailEvents = mysqlTable("email_events", {
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
var newsletterSubscribers = mysqlTable("newsletter_subscribers", {
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
var caseStudies = mysqlTable("case_studies", {
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
var auditLeads = mysqlTable("audit_leads", {
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

// server/_core/env.ts
var ENV = {
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
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
};

// server/db.ts
var _db = null;
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
import { TRPCError } from "@trpc/server";

// server/_core/email.ts
var RESEND_ENDPOINT = "https://api.resend.com/emails";
function isEmailConfigured() {
  return Boolean(ENV.resendApiKey && ENV.resendNotifyEmail);
}
async function sendEmail(payload) {
  const result = await sendEmailWithId(payload);
  return result.ok;
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
        from: ENV.resendFromEmail,
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
  const signature = signParams(signedParams, apiSecret);
  const form = new FormData();
  const blob = new Blob([data], { type: contentType });
  form.append("file", blob, fileName);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp2));
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature);
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
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
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
async function generateBlogDraft(input) {
  const lang = input.lang ?? "hu";
  const wordCount = input.wordCount ?? 600;
  const tone = input.tone ?? "professional";
  const audience = input.audience || "kis- \xE9s k\xF6z\xE9pv\xE1llalati d\xF6nt\xE9shoz\xF3k";
  const system = `Te a G2A Marketing p\xE9csi B2B marketing \xFCgyn\xF6ks\xE9g blog-szerz\u0151je vagy. A G2A magyar marketing tan\xE1csad\xE1s, SEO, k\xF6z\xF6ss\xE9gi m\xE9dia, weboldal-fejleszt\xE9s \xE9s AI-megold\xE1sok ter\xFClet\xE9n ad szolg\xE1ltat\xE1st. Mindig a l\xE1togat\xF3t sz\xF3l\xEDtjuk meg te-form\xE1ban (NEM \xF6n\xF6z\xFCnk).

Szab\xE1lyok:
- A teljes v\xE1lasz ${LANG_NAMES[lang]} nyelven.
- Hangnem: ${tone}.
- C\xE9l olvas\xF3: ${audience}.
- A "content" mez\u0151ben struktur\xE1lt markdown (## fejezetek, bullet list\xE1k, kiemelt szakaszok) ~${wordCount} sz\xF3val.
- A "title" SEO-bar\xE1t, max 65 karakter, az olvas\xF3 haszn\xE1t \xEDg\xE9ri.
- "excerpt" 1-2 mondat (max 200 karakter), a teljes cikk l\xE9nyege.
- "metaTitle" max 60 char, kulcssz\xF3t tartalmaz.
- "metaDescription" 140-160 char k\xF6zt, h\xEDv\xF3sz\xF3val.
- NE tal\xE1lj ki konkr\xE9t statisztik\xE1kat vagy sz\xE1mokat, ha nem vagy biztos benn\xFCk.

Csak JSON-t adj vissza ezzel a s\xE9m\xE1val: { "title": "...", "excerpt": "...", "content": "...", "metaTitle": "...", "metaDescription": "..." }`;
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `T\xE9ma: ${input.topic}` }
    ],
    { temperature: 0.7, maxTokens: 2500, jsonMode: true }
  );
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI invalid JSON response");
  }
  return {
    title: parsed.title?.trim() ?? "",
    excerpt: parsed.excerpt?.trim() ?? "",
    content: parsed.content?.trim() ?? "",
    metaTitle: parsed.metaTitle?.trim() ?? "",
    metaDescription: parsed.metaDescription?.trim() ?? ""
  };
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
var DALL_E_ENDPOINT = "https://api.openai.com/v1/images/generations";
var DALL_E_MODEL = "dall-e-3";
async function generateImage(input) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set \u2014 image generation disabled");
  const res = await fetch(DALL_E_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DALL_E_MODEL,
      prompt: input.prompt,
      n: 1,
      size: input.size ?? "1792x1024",
      quality: input.quality ?? "standard",
      style: input.style ?? "natural"
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI Images ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }
  const json2 = await res.json();
  const item = json2.data?.[0];
  if (!item?.url) throw new Error("OpenAI returned no image URL");
  return {
    url: item.url,
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

// server/_core/spam.ts
var HONEYPOT_FIELD = "website";
function isHoneypotTriggered(input) {
  return Boolean(input.website && input.website.trim().length > 0);
}

// server/routers.ts
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
  const limit = checkRateLimit(`${formKey}:${ip}`, { max: 5, windowMs: 15 * 60 * 1e3 });
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
    [HONEYPOT_FIELD]: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(ctx, input, "contact", { success: true });
    if (guard) return guard;
    await createContactSubmission(input);
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
    return { success: true };
  })
});
var AUDIT_HONEYPOT = "botField";
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
    [AUDIT_HONEYPOT]: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    const guard = await guardPublicFormOrSilent(
      ctx,
      { website: input[AUDIT_HONEYPOT] },
      "audit",
      { success: true }
    );
    if (guard) return guard;
    await createAuditLead(input);
    await notifyOwner({
      title: `\xDAj ingyenes audit k\xE9r\xE9s: ${input.name}`,
      content: `**N\xE9v:** ${input.name}
**Email:** ${input.email}
**Telefon:** ${input.phone || "\u2013"}
**C\xE9g:** ${input.company || "\u2013"}
**Weboldal:** ${input.website || "\u2013"}
**Havi b\xFCdzs\xE9:** ${input.monthlyBudget || "\u2013"}

**Kih\xEDv\xE1sok:**
${input.currentChallenges || "\u2013"}

**C\xE9lok:**
${input.goals || "\u2013"}`,
      replyTo: input.email
    });
    return { success: true };
  })
});
function renderWelcomeEmailHtml(name, unsubscribeUrl) {
  const greeting = name ? `Szia ${name}!` : "Szia!";
  return `<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1f2937">
  <div style="border-left:4px solid #14B8A6;padding-left:16px;margin-bottom:24px">
    <h1 style="margin:0;font-size:22px;color:#0f172a">${greeting}</h1>
    <p style="margin:6px 0 0;color:#64748b;font-size:14px">K\xF6sz\xF6nj\xFCk, hogy feliratkozt\xE1l a G2A Marketing h\xEDrlevel\xE9re.</p>
  </div>
  <p style="line-height:1.6;font-size:15px">Id\u0151r\u0151l id\u0151re praktikus marketing tartalmat, esettanulm\xE1nyokat \xE9s AI-alap\xFA megold\xE1sokat k\xFCld\xFCnk a postal\xE1d\xE1dba \u2014 heti maximum 1 emailt, sose k\xE9retlen\xFCl.</p>
  <p style="line-height:1.6;font-size:15px">Ha valamiben tudunk seg\xEDteni, v\xE1laszolj erre az emailre, vagy keress minket a <a href="https://g2amarketing.hu/kapcsolat" style="color:#0d9488;text-decoration:underline">g2amarketing.hu/kapcsolat</a> oldalon.</p>
  <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:11px;color:#9ca3af;line-height:1.5">
    Ezt az emailt az\xE9rt kaptad, mert feliratkozt\xE1l a g2amarketing.hu h\xEDrlevel\xE9re.<br>
    Ha t\xF6bb\xE9 nem szeretn\xE9l emailt kapni, <a href="${unsubscribeUrl}" style="color:#9ca3af">kattints ide a leiratkoz\xE1shoz</a>.
  </p>
  <p style="font-size:11px;color:#cbd5e1;margin-top:8px">G2A Marketing Bt. \xB7 P\xE9cs \xB7 info@g2amarketing.hu</p>
</div>`;
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
    [HONEYPOT_FIELD]: z2.string().optional()
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
        html: renderWelcomeEmailHtml(input.name, unsubscribeUrl),
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
      wordCount: z2.number().int().min(200).max(2e3).optional(),
      lang: z2.enum(["hu", "en", "zh"]).optional(),
      tone: z2.enum(["professional", "conversational", "technical"]).optional()
    })).mutation(({ input }) => generateBlogDraft(input)),
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
      style: z2.enum(["vivid", "natural"]).optional(),
      /** Cloudinary folder for the uploaded asset. Default "g2a/ai-generated". */
      folder: z2.string().optional(),
      /** Filename hint — used as the public_id base. Slugified. */
      filenameHint: z2.string().optional()
    })).mutation(async ({ input }) => {
      const result = await generateImage({
        prompt: input.prompt,
        size: input.size,
        quality: input.quality,
        style: input.style
      });
      const dl = await fetch(result.url);
      if (!dl.ok) {
        throw new TRPCError3({ code: "BAD_GATEWAY", message: `Failed to download generated image: ${dl.status}` });
      }
      const arrayBuf = await dl.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      if (!isCloudinaryConfigured()) {
        return {
          url: result.url,
          revisedPrompt: result.revisedPrompt,
          ephemeral: true,
          warning: "Cloudinary nincs konfigur\xE1lva \u2014 a k\xE9p URL ~1 \xF3ra m\xFAlva lej\xE1r."
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
  upload: uploadRouter
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
function renderHtml(opts) {
  const title = opts.ok ? "Sikeres leiratkoz\xE1s" : "Hib\xE1s link";
  const body = opts.ok ? `<p>${escapeHtml(opts.email || "")} <strong>leiratkozott</strong> a G2A Marketing h\xEDrlevel\xE9r\u0151l.</p>
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
function escapeHtml(s) {
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

// server/_core/app.ts
function createApp() {
  const app2 = express();
  app2.use(express.json({ limit: "50mb" }));
  app2.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app2);
  registerNewsletterRoutes(app2);
  registerResendWebhookRoute(app2);
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
