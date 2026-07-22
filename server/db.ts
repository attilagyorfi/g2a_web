import { and, asc, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  aiJobs,
  auditLeads,
  caseStudies,
  categories,
  contactSubmissions,
  heroSlides,
  industries,
  newsletterSubscribers,
  emailCampaigns,
  emailEvents,
  pages,
  socialAccounts,
  socialPosts,
  partners,
  posts,
  services,
  siteSettings,
  technologies,
  testimonials,
  users,
  values,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values_: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values_[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values_.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values_.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values_.role = "admin";
      updateSet.role = "admin";
    }
    if (!values_.lastSignedIn) values_.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values_).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Staff accounts (multi-user admin) ────────────────────────────────────────

/** Look up by email — the login form's identifier for staff accounts. */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Everyone who can reach the admin: the owner plus invited staff. */
export async function listStaffUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "admin")).orderBy(asc(users.id));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStaffUser(data: {
  openId: string;
  name: string;
  email: string;
  permissions: string;
  resetToken: string;
  resetTokenExpiresAt: Date;
}) {
  const db = await getDb();
  if (!db) return undefined;
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
    invitedAt: new Date(),
  });
  return getUserByEmail(data.email);
}

export async function updateStaffUser(
  id: number,
  patch: Partial<{
    name: string;
    permissions: string;
    isActive: boolean;
    passwordHash: string | null;
    resetToken: string | null;
    resetTokenExpiresAt: Date | null;
  }>,
) {
  const db = await getDb();
  if (!db) return;
  // Drizzle throws on an empty SET clause; an all-undefined patch is a no-op.
  if (Object.values(patch).every((v) => v === undefined)) return;
  await db.update(users).set(patch).where(eq(users.id, id));
}

export async function deleteStaffUser(id: number) {
  const db = await getDb();
  if (!db) return;
  // Guard in SQL as well as in the router: the owner row is never deletable.
  await db.delete(users).where(and(eq(users.id, id), eq(users.isOwner, false)));
}

/** Resolve a live (unexpired) invite / password-reset token. */
export async function getUserByResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
  const user = result[0];
  if (!user) return undefined;
  const exp = user.resetTokenExpiresAt ? new Date(user.resetTokenExpiresAt).getTime() : 0;
  if (!exp || exp < Date.now()) return undefined;
  return user;
}

/**
 * Ensure the ADMIN_EMAIL owner exists as a real row with `isOwner` set, so the
 * forgot-password flow has something to attach a token to (the env password
 * itself can't be rewritten from the app).
 */
export async function ensureOwnerUser(openId: string, email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getUserByEmail(email);
  if (existing) {
    if (!existing.isOwner || existing.role !== "admin" || !existing.isActive) {
      await db
        .update(users)
        .set({ isOwner: true, role: "admin", isActive: true })
        .where(eq(users.id, existing.id));
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
    isActive: true,
  });
  return getUserByEmail(email);
}

// ─── Site Settings ────────────────────────────────────────────────────────────
export async function getSiteSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0]?.value ?? null;
}

export async function getAllSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}

export async function upsertSiteSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

// ─── Pages (SEO) ──────────────────────────────────────────────────────────────
export async function getPageSeo(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function getAllPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pages);
}

export async function upsertPageSeo(data: {
  slug: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaJson?: string;
  keywords?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pages).values(data).onDuplicateKeyUpdate({ set: data });
}

// ─── Hero Slides ──────────────────────────────────────────────────────────────
export async function getHeroSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(heroSlides.sortOrder);
}

export async function getAllHeroSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
}

export async function createHeroSlide(data: Omit<typeof heroSlides.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(heroSlides).values(data);
  return result;
}

export async function updateHeroSlide(id: number, data: Partial<typeof heroSlides.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(heroSlides).set(data).where(eq(heroSlides.id, id));
}

export async function deleteHeroSlide(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
}

// ─── Services ─────────────────────────────────────────────────────────────────
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.sortOrder);
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function createService(data: Omit<typeof services.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(services).values(data);
  return result;
}

export async function updateService(id: number, data: Partial<typeof services.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(services).where(eq(services.id, id));
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function createCategory(data: Omit<typeof categories.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(categories).values(data);
  return result;
}

export async function updateCategory(id: number, data: Partial<typeof categories.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(categories).where(eq(categories.id, id));
}

// ─── Posts ────────────────────────────────────────────────────────────────────
export async function getPosts(opts: { page?: number; limit?: number; categoryId?: number; status?: "draft" | "published" } = {}) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0 };
  const { page = 1, limit = 10, categoryId, status = "published" } = opts;
  const offset = (page - 1) * limit;

  const conditions = [eq(posts.status, status)];
  if (categoryId) conditions.push(eq(posts.categoryId, categoryId));

  const [postList, countResult] = await Promise.all([
    db.select().from(posts).where(and(...conditions)).orderBy(desc(posts.publishedAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(posts).where(and(...conditions)),
  ]);

  return { posts: postList, total: Number(countResult[0]?.count ?? 0) };
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function getAllPostsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function createPost(data: Omit<typeof posts.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(posts).values(data);
  return result;
}

export async function updatePost(id: number, data: Partial<typeof posts.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(posts).where(eq(posts.id, id));
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export async function getTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(testimonials.sortOrder);
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(testimonials.sortOrder);
}

export async function createTestimonial(data: Omit<typeof testimonials.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(testimonials).values(data);
  return result;
}

export async function updateTestimonial(id: number, data: Partial<typeof testimonials.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ─── Partners ─────────────────────────────────────────────────────────────────
export async function getPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).where(eq(partners.isActive, true)).orderBy(partners.sortOrder);
}

export async function getAllPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).orderBy(partners.sortOrder);
}

export async function createPartner(data: Omit<typeof partners.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(partners).values(data);
  return result;
}

export async function updatePartner(id: number, data: Partial<typeof partners.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(partners).set(data).where(eq(partners.id, id));
}

export async function deletePartner(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(partners).where(eq(partners.id, id));
}

// ─── Industries ───────────────────────────────────────────────────────────────
export async function getIndustries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(industries).where(eq(industries.isActive, true)).orderBy(industries.sortOrder);
}

export async function getAllIndustries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(industries).orderBy(industries.sortOrder);
}

export async function createIndustry(data: Omit<typeof industries.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(industries).values(data);
  return result;
}

export async function updateIndustry(id: number, data: Partial<typeof industries.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(industries).set(data).where(eq(industries.id, id));
}

export async function deleteIndustry(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(industries).where(eq(industries.id, id));
}

// ─── Technologies ─────────────────────────────────────────────────────────────
export async function getTechnologies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technologies).where(eq(technologies.isActive, true)).orderBy(technologies.sortOrder);
}

export async function getAllTechnologies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technologies).orderBy(technologies.sortOrder);
}

export async function createTechnology(data: Omit<typeof technologies.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(technologies).values(data);
  return result;
}

export async function updateTechnology(id: number, data: Partial<typeof technologies.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(technologies).set(data).where(eq(technologies.id, id));
}

export async function deleteTechnology(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(technologies).where(eq(technologies.id, id));
}

// ─── Values ───────────────────────────────────────────────────────────────────
export async function getValues() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(values).where(eq(values.isActive, true)).orderBy(values.sortOrder);
}

export async function getAllValues() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(values).orderBy(values.sortOrder);
}

export async function createValue(data: Omit<typeof values.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(values).values(data);
  return result;
}

export async function updateValue(id: number, data: Partial<typeof values.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(values).set(data).where(eq(values.id, id));
}

export async function deleteValue(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(values).where(eq(values.id, id));
}

// ─── Contact Submissions ──────────────────────────────────────────────────────
export async function createContactSubmission(data: Omit<typeof contactSubmissions.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(contactSubmissions).values(data);
  return result;
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function markContactRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(contactSubmissions).set({ isRead: true }).where(eq(contactSubmissions.id, id));
}

export async function deleteContactSubmission(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
export async function createNewsletterSubscriber(data: Omit<typeof newsletterSubscribers.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(newsletterSubscribers).values(data);
  return result;
}

export async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function getAllNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function checkNewsletterSubscriberExists(email: string) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email)).limit(1);
  return result.length > 0;
}

export async function deleteNewsletterSubscriber(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
}
export async function updateNewsletterSubscriberSegment(data: { id: number; segment?: string; source?: string; tags?: string }) {
  const db = await getDb();
  if (!db) return;
  const { id, ...rest } = data;
  await db.update(newsletterSubscribers).set(rest).where(eq(newsletterSubscribers.id, id));
}

/** Active subscribers with optional segment filter — recipients for a campaign send. */
export async function getActiveSubscribersForCampaign(segment?: string | null) {
  const db = await getDb();
  if (!db) return [];
  const where = segment
    ? and(eq(newsletterSubscribers.isActive, true), eq(newsletterSubscribers.segment, segment))
    : eq(newsletterSubscribers.isActive, true);
  return db
    .select({
      id: newsletterSubscribers.id,
      email: newsletterSubscribers.email,
      name: newsletterSubscribers.name,
      unsubscribeToken: newsletterSubscribers.unsubscribeToken,
    })
    .from(newsletterSubscribers)
    .where(where);
}

/** Email campaigns CRUD */
export async function createEmailCampaign(data: {
  subject: string; html: string; text?: string; segment?: string | null; sentByUserId?: number | null;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(emailCampaigns).values({
    subject: data.subject,
    html: data.html,
    text: data.text,
    segment: data.segment,
    sentByUserId: data.sentByUserId ?? null,
    status: "draft",
  });
  return (result as { insertId: number }).insertId;
}
export async function updateEmailCampaign(id: number, data: Partial<typeof emailCampaigns.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(emailCampaigns).set(data).where(eq(emailCampaigns.id, id));
}
export async function listEmailCampaigns() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
}

/**
 * Persist a Resend webhook event row. Called from the webhook handler for
 * every delivered/opened/clicked/bounced/complained event we receive.
 */
export async function recordEmailEvent(data: {
  campaignId: number | null;
  recipient: string;
  eventType: string;
  resendMessageId?: string;
  rawData?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(emailEvents).values({
    campaignId: data.campaignId,
    recipient: data.recipient,
    eventType: data.eventType,
    resendMessageId: data.resendMessageId ?? null,
    rawData: data.rawData ?? null,
  });
  return (result as { insertId?: number }).insertId ?? null;
}

/**
 * Aggregate per-campaign stats: count of unique recipients per event type.
 * "Unique" so an open + 3 clicks from the same recipient count as 1 open + 1
 * click in the rates — which is the industry-standard metric.
 *
 * Returns:
 *   { delivered, opened, clicked, bounced, complained }
 *
 * Computes open/click rates client-side from these + recipientCount.
 */
export async function getCampaignEventStats(
  campaignId: number,
): Promise<{
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
}> {
  const db = await getDb();
  if (!db) {
    return { delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0 };
  }
  // Drizzle doesn't have GROUP BY + COUNT DISTINCT shortcuts that play nicely
  // across MySQL editions, so fetch the raw rows and reduce in JS — there
  // are at most a few thousand events per campaign, well within memory.
  const rows = await db
    .select({
      recipient: emailEvents.recipient,
      eventType: emailEvents.eventType,
    })
    .from(emailEvents)
    .where(eq(emailEvents.campaignId, campaignId));

  const seen = new Map<string, Set<string>>(); // eventType → Set<recipient>
  for (const r of rows) {
    if (!seen.has(r.eventType)) seen.set(r.eventType, new Set());
    seen.get(r.eventType)!.add(r.recipient);
  }
  return {
    delivered: seen.get("email.delivered")?.size ?? 0,
    opened: seen.get("email.opened")?.size ?? 0,
    clicked: seen.get("email.clicked")?.size ?? 0,
    bounced: seen.get("email.bounced")?.size ?? 0,
    complained: seen.get("email.complained")?.size ?? 0,
  };
}

/** One-click unsubscribe by token. Returns the deactivated subscriber's email
 *  (for the confirmation page), or null if the token doesn't match anyone. */
export async function unsubscribeByToken(token: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const found = await db
    .select({ id: newsletterSubscribers.id, email: newsletterSubscribers.email })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .limit(1);
  if (found.length === 0) return null;
  await db
    .update(newsletterSubscribers)
    .set({ isActive: false })
    .where(eq(newsletterSubscribers.id, found[0].id));
  return found[0].email;
}
// ─── Case Studies ─────────────────────────────────────────────────────────────
export async function getAllCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies).orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
}
export async function getActiveCaseStudies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies).where(eq(caseStudies.isActive, true)).orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
}
export async function getCaseStudyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
  return result[0] ?? null;
}
export async function upsertCaseStudy(data: Omit<typeof caseStudies.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return;
  if ((data as any).id) {
    const { id, ...rest } = data as any;
    await db.update(caseStudies).set(rest).where(eq(caseStudies.id, id));
  } else {
    await db.insert(caseStudies).values(data);
  }
}
export async function deleteCaseStudy(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(caseStudies).where(eq(caseStudies.id, id));
}

// ─── Audit Leads ─────────────────────────────────────────────────────────────
export async function createAuditLead(data: Omit<typeof auditLeads.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  const [result] = await db.insert(auditLeads).values(data);
  return result;
}
export async function getAllAuditLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLeads).orderBy(desc(auditLeads.createdAt));
}
export async function markAuditLeadContacted(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(auditLeads).set({ isContacted: true }).where(eq(auditLeads.id, id));
}
export async function deleteAuditLead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(auditLeads).where(eq(auditLeads.id, id));
}

// ─── Bulk delete helpers ──────────────────────────────────────────────────────
// Each accepts an array of ids; uses Drizzle `inArray` for a single SQL DELETE.
// All return the number of rows requested (DB doesn't reliably return affected
// rows for some MySQL configs — caller cares more about "did it succeed").

async function bulkDeleteByIds(table: import("drizzle-orm/mysql-core").MySqlTable, idCol: any, ids: number[]) {
  if (ids.length === 0) return 0;
  const db = await getDb();
  if (!db) return 0;
  await db.delete(table).where(inArray(idCol, ids));
  return ids.length;
}

export async function deletePostsBulk(ids: number[]) {
  return bulkDeleteByIds(posts, posts.id, ids);
}
export async function deleteCaseStudiesBulk(ids: number[]) {
  return bulkDeleteByIds(caseStudies, caseStudies.id, ids);
}
export async function deleteContactSubmissionsBulk(ids: number[]) {
  return bulkDeleteByIds(contactSubmissions, contactSubmissions.id, ids);
}
export async function deleteNewsletterSubscribersBulk(ids: number[]) {
  return bulkDeleteByIds(newsletterSubscribers, newsletterSubscribers.id, ids);
}
export async function deleteAuditLeadsBulk(ids: number[]) {
  return bulkDeleteByIds(auditLeads, auditLeads.id, ids);
}
export async function deleteCategoriesBulk(ids: number[]) {
  return bulkDeleteByIds(categories, categories.id, ids);
}
export async function deleteTestimonialsBulk(ids: number[]) {
  return bulkDeleteByIds(testimonials, testimonials.id, ids);
}
export async function deletePartnersBulk(ids: number[]) {
  return bulkDeleteByIds(partners, partners.id, ids);
}
export async function deleteIndustriesBulk(ids: number[]) {
  return bulkDeleteByIds(industries, industries.id, ids);
}
export async function deleteTechnologiesBulk(ids: number[]) {
  return bulkDeleteByIds(technologies, technologies.id, ids);
}

// ─── Social accounts + per-post drafts ──────────────────────────────────────

export async function listSocialAccounts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(socialAccounts).orderBy(socialAccounts.platform);
}

export async function getSocialAccountByPlatform(
  platform: "linkedin" | "facebook" | "instagram",
) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, platform))
    .limit(1);
  return rows[0];
}

/** Per-platform listing of the *latest* draft for a blog post. The UI shows
 *  one row per platform — earlier iterations stay in the DB for audit but
 *  don't surface anywhere. */
export async function getLatestSocialPostsForBlogPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  // Drizzle doesn't have a clean "max per group" helper, so fetch all and
  // dedupe in JS. Per-blog-post list is tiny (≤ 3 platforms × N iterations).
  const rows = await db
    .select()
    .from(socialPosts)
    .where(eq(socialPosts.postId, postId))
    .orderBy(desc(socialPosts.createdAt));
  const latestByPlatform = new Map<string, typeof rows[number]>();
  for (const r of rows) {
    if (!latestByPlatform.has(r.platform)) {
      latestByPlatform.set(r.platform, r);
    }
  }
  return Array.from(latestByPlatform.values());
}

export async function createSocialPost(data: {
  postId: number;
  platform: "linkedin" | "facebook" | "instagram";
  copy: string;
  status?: "draft" | "published" | "failed";
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(socialPosts).values({
    postId: data.postId,
    platform: data.platform,
    copy: data.copy,
    status: data.status ?? "draft",
  });
  return (result as { insertId?: number }).insertId ?? null;
}

export async function updateSocialPost(
  id: number,
  data: Partial<typeof socialPosts.$inferInsert>,
) {
  const db = await getDb();
  if (!db) return;
  await db.update(socialPosts).set(data).where(eq(socialPosts.id, id));
}

// ─── AI Jobs (background-job progress tracking) ──────────────────────────────
//
// Used by the multilang blog-draft pipeline to expose live progress to
// the admin while the 6-call OpenAI pipeline (3 drafts + 3 editor
// passes) runs. The mutation initiator creates a row with the
// client-generated UUID; the worker updates `completedSteps` after
// each OpenAI call; a separate polling endpoint reads the row.
//
// Best-effort only — every helper is a soft no-op when the DB isn't
// configured, so unit tests / local dev without a DB still work.

export async function createAiJob(data: {
  id: string;
  type: string;
  totalSteps?: number;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(aiJobs).values({
    id: data.id,
    type: data.type,
    totalSteps: data.totalSteps ?? 6,
    status: "running",
    completedSteps: 0,
  });
}

export async function updateAiJob(
  id: string,
  patch: Partial<typeof aiJobs.$inferInsert>,
) {
  const db = await getDb();
  if (!db) return;
  await db.update(aiJobs).set(patch).where(eq(aiJobs.id, id));
}

export async function getAiJob(id: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(aiJobs).where(eq(aiJobs.id, id)).limit(1);
  return rows[0] ?? null;
}
