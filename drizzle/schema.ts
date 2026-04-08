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
  metaTitle: varchar("metaTitle", { length: 512 }),
  metaDescription: text("metaDescription"),
  ogTitle: varchar("ogTitle", { length: 512 }),
  ogDescription: text("ogDescription"),
  ogImage: text("ogImage"),
  canonicalUrl: text("canonicalUrl"),
  schemaJson: text("schemaJson"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  slug: varchar("slug", { length: 512 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  featuredImageAlt: varchar("featuredImageAlt", { length: 512 }),
  categoryId: int("categoryId"),
  authorName: varchar("authorName", { length: 256 }).default("G2A Marketing"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  metaTitle: varchar("metaTitle", { length: 512 }),
  metaDescription: text("metaDescription"),
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
  shortDescription: text("shortDescription"),
  heroTitle: varchar("heroTitle", { length: 512 }),
  heroSubtitle: text("heroSubtitle"),
  heroImage: text("heroImage"),
  heroImageAlt: varchar("heroImageAlt", { length: 512 }),
  content: text("content"),
  icon: varchar("icon", { length: 128 }),
  metaTitle: varchar("metaTitle", { length: 512 }),
  metaDescription: text("metaDescription"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const heroSlides = mysqlTable("hero_slides", {
  id: int("id").autoincrement().primaryKey(),
  subtitle: varchar("subtitle", { length: 512 }),
  title: varchar("title", { length: 512 }).notNull(),
  backgroundImage: text("backgroundImage"),
  backgroundImageAlt: varchar("backgroundImageAlt", { length: 512 }),
  ctaPrimaryText: varchar("ctaPrimaryText", { length: 256 }),
  ctaPrimaryUrl: varchar("ctaPrimaryUrl", { length: 512 }),
  ctaSecondaryText: varchar("ctaSecondaryText", { length: 256 }),
  ctaSecondaryUrl: varchar("ctaSecondaryUrl", { length: 512 }),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  quote: text("quote").notNull(),
  authorName: varchar("authorName", { length: 256 }).notNull(),
  authorTitle: varchar("authorTitle", { length: 256 }),
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
  category: varchar("category", { length: 128 }),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const industries = mysqlTable("industries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
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
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const values = mysqlTable("values", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
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

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const caseStudies = mysqlTable("case_studies", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  slug: varchar("slug", { length: 512 }).notNull().unique(),
  client: varchar("client", { length: 256 }),
  industry: varchar("industry", { length: 256 }),
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  featuredImage: text("featuredImage"),
  featuredImageAlt: varchar("featuredImageAlt", { length: 512 }),
  tags: text("tags"),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  metaTitle: varchar("metaTitle", { length: 512 }),
  metaDescription: text("metaDescription"),
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
export type Page = typeof pages.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type AuditLead = typeof auditLeads.$inferSelect;
