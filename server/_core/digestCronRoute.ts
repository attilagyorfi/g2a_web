/**
 * Weekly digest cron — fires every Friday at 07:00 UTC (09:00 CEST / 08:00 CET).
 *
 * Picks the four most recently published blog posts (or a fixed slug list if
 * `DIGEST_NEXT_SLUGS` env is populated) and sends a templated digest email to
 * every active newsletter subscriber. The send loop mirrors `sendCampaign` in
 * the admin tRPC router — same throttling, same campaign row for stats — so
 * open/click events flow into the existing `/admin/newsletter/campaigns`
 * dashboard via the Resend webhook.
 *
 * Auth: Vercel Cron requests carry a `Authorization: Bearer <CRON_SECRET>`
 * header — we verify it before doing anything. Without the secret the route
 * returns 401, so curl probes from the open internet can't trigger a send.
 *
 * Idempotency: each invocation creates a fresh campaign row. We don't dedupe
 * sends across runs — if Vercel retries the cron, subscribers may get two
 * emails. In practice cron runs once per schedule and we accept the rare
 * duplicate over the complexity of cross-run state.
 *
 * Manual trigger (for testing):
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
 *     https://g2a-web.vercel.app/api/cron/weekly-digest
 */
import type { Express, Request, Response } from "express";
import { desc, eq, isNotNull } from "drizzle-orm";
import { getDb } from "../db";
import * as db from "../db";
import {
  posts as postsTable,
  newsletterSubscribers as subsTable,
} from "../../drizzle/schema";
import { sendEmail, isEmailConfigured } from "./email";
import { ENV } from "./env";
import { renderDigestEmailHtml } from "./emailTemplates";

const ORIGIN = "https://g2amarketing.hu";
const ITEM_COUNT = 4;
const TOPIC_FALLBACK = "strategy"; // when we can't infer a topic from category, default

/** Topic mapping by category slug — adjust if the categories table evolves. */
const CATEGORY_TO_TOPIC: Record<string, "strategy" | "ai" | "paid" | "case_studies"> = {
  strategy: "strategy",
  marketing: "strategy",
  ai: "ai",
  "ai-automation": "ai",
  seo: "paid",
  ppc: "paid",
  paid: "paid",
  "case-study": "case_studies",
  esettanulmany: "case_studies",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]!);
}

function shortenExcerpt(html: string | null, maxLen = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const period = cut.lastIndexOf(".");
  return period > maxLen - 50 ? cut.slice(0, period + 1) : cut.trimEnd() + "…";
}

function estimateReadingMin(html: string | null): number {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Fetch the four posts we want to feature. Priority:
 *   1. `DIGEST_NEXT_SLUGS=slug1,slug2,...` env (operator override)
 *   2. Last four published posts ordered by publishedAt desc
 */
async function fetchFeaturedPosts(): Promise<Array<{
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  categoryId: number | null;
}>> {
  const dbi = await getDb();
  if (!dbi) return [];

  const overrideSlugs = (process.env.DIGEST_NEXT_SLUGS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (overrideSlugs.length > 0) {
    const rows = await dbi
      .select({
        slug: postsTable.slug,
        title: postsTable.title,
        excerpt: postsTable.excerpt,
        content: postsTable.content,
        categoryId: postsTable.categoryId,
      })
      .from(postsTable);
    // Preserve the env-order, not DB-order
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    return overrideSlugs.map((s) => bySlug.get(s)).filter((r): r is NonNullable<typeof r> => Boolean(r));
  }

  return dbi
    .select({
      slug: postsTable.slug,
      title: postsTable.title,
      excerpt: postsTable.excerpt,
      content: postsTable.content,
      categoryId: postsTable.categoryId,
    })
    .from(postsTable)
    .where(eq(postsTable.status, "published"))
    .orderBy(desc(postsTable.publishedAt))
    .limit(ITEM_COUNT);
}

async function inferTopic(categoryId: number | null): Promise<"strategy" | "ai" | "paid" | "case_studies"> {
  if (!categoryId) return TOPIC_FALLBACK as "strategy";
  // Lazy lookup — categories table is tiny, just pull all once
  const categories = await db.getCategories();
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat || !cat.slug) return TOPIC_FALLBACK as "strategy";
  return (CATEGORY_TO_TOPIC[cat.slug] || TOPIC_FALLBACK) as "strategy";
}

function getWeekLabel(): string {
  const d = new Date();
  const year = d.getFullYear();
  const monthName = d.toLocaleDateString("hu-HU", { month: "long", day: "numeric" });
  return `${year} — ${monthName}`;
}

export function registerDigestCronRoute(app: Express): void {
  /**
   * Both GET (Vercel Cron default verb) and POST (manual trigger via curl)
   * route to the same handler.
   */
  const handler = async (req: Request, res: Response) => {
    // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. We mirror the
    // same check pattern Vercel docs recommend, so manual curl tests work too.
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.authorization || "";
      if (auth !== `Bearer ${secret}`) {
        return res.status(401).json({ error: "Unauthorized: missing or wrong Bearer token" });
      }
    } else if (process.env.NODE_ENV !== "development") {
      // Refuse to run in prod without a secret — otherwise an attacker who
      // discovered the URL could trigger a mass mail blast.
      return res.status(503).json({
        error: "CRON_SECRET not set in production. Refusing to send.",
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

    // Build the article cards
    const articles = await Promise.all(
      featured.map(async (p) => ({
        topic: await inferTopic(p.categoryId),
        title: p.title,
        excerpt: shortenExcerpt(p.excerpt || p.content),
        url: `${ORIGIN}/hirek/${p.slug}`,
        readMin: estimateReadingMin(p.content),
      })),
    );

    // Build the email HTML with a placeholder that gets replaced per-recipient
    const UNSUB_PLACEHOLDER = "{{unsubscribeUrl}}";
    const subject = `G2A Heti válogatás — ${getWeekLabel()}`;
    const html = renderDigestEmailHtml({
      name: undefined,
      weekLabel: getWeekLabel(),
      articles,
      unsubscribeUrl: UNSUB_PLACEHOLDER,
    });
    const text = articles
      .map((a) => `[${a.topic.toUpperCase()}] ${a.title}\n${a.url}\n${a.excerpt}\n`)
      .join("\n");

    const subscribers = await db.getActiveSubscribersForCampaign(null);
    if (subscribers.length === 0) {
      return res.json({ campaignId: null, recipientCount: 0, sent: 0, failed: 0, note: "no subscribers" });
    }

    const campaignId = await db.createEmailCampaign({
      subject,
      html,
      text,
      segment: null,
      sentByUserId: null, // cron — no human user
    });
    if (!campaignId) return res.status(500).json({ error: "Failed to create campaign row" });

    await db.updateEmailCampaign(campaignId, {
      status: "sending",
      recipientCount: subscribers.length,
    });

    let sent = 0,
      failed = 0;

    for (const sub of subscribers) {
      const unsubUrl = `${ORIGIN}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
      const personalHtml = html.replace(new RegExp(UNSUB_PLACEHOLDER, "g"), unsubUrl);
      const personalText = text.replace(new RegExp(UNSUB_PLACEHOLDER, "g"), unsubUrl);

      try {
        const ok = await sendEmail({
          to: sub.email,
          subject,
          html: personalHtml,
          text: personalText,
          tags: [{ name: "campaign_id", value: String(campaignId) }],
        });
        if (ok) sent++;
        else failed++;
      } catch (err) {
        console.error(`[cron-digest] send failed for ${sub.email}:`, err);
        failed++;
      }
      // Throttle to ~1.6 emails/sec, safely below Resend free tier's 2/sec cap.
      await new Promise((r) => setTimeout(r, 600));
    }

    await db.updateEmailCampaign(campaignId, {
      status: failed === subscribers.length ? "failed" : "sent",
      sentCount: sent,
      failedCount: failed,
      sentAt: new Date(),
    });

    return res.json({ campaignId, recipientCount: subscribers.length, sent, failed });
  };

  app.get("/api/cron/weekly-digest", handler);
  app.post("/api/cron/weekly-digest", handler);
}
