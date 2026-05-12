/**
 * RSS 2.0 feed for the blog — `/rss.xml`.
 *
 * Lists the most recent 20 published posts (HU titles/excerpts) so feed
 * readers, aggregators, and LLM crawlers can discover new content without
 * scraping. Mirrored in robots.txt for Googlebot.
 *
 * One feed only — Hungarian, since that's the primary content language.
 * EN/ZH alternate feeds are an option later if the blog gets dedicated
 * translations beyond the per-post hreflang alternates already in the
 * sitemap.
 */
import type { Express, Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { posts as postsTable } from "../../drizzle/schema";

const ORIGIN = "https://g2amarketing.hu";
const FEED_TITLE = "G2A Marketing — Blog";
const FEED_DESC = "Marketing tippek, trendek és iparági hírek a G2A Marketing csapatától. Pécs, Magyarország.";
const FEED_LANGUAGE = "hu-HU";
const ITEM_LIMIT = 20;

function escapeXml(s: string): string {
  return s.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&apos;",
    '"': "&quot;",
  })[c]!);
}

/** Strip HTML tags + collapse whitespace — RSS `<description>` should be
 *  plain text or CDATA. We use CDATA below so escaping is minimal. */
function htmlToText(html: string, maxChars = 500): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxChars ? text.slice(0, maxChars).trimEnd() + "…" : text;
}

/** RFC 822 date — RSS spec mandates this exact format. */
function rfc822(d: Date): string {
  // toUTCString() returns RFC 1123, which is the standard's preferred form.
  return d.toUTCString();
}

export function registerRssRoute(app: Express): void {
  const handler = async (_req: Request, res: Response) => {
    const db = await getDb();
    const now = new Date();

    let items: string[] = [];
    if (db) {
      try {
        const rows = await db
          .select({
            slug: postsTable.slug,
            title: postsTable.title,
            excerpt: postsTable.excerpt,
            content: postsTable.content,
            authorName: postsTable.authorName,
            publishedAt: postsTable.publishedAt,
            updatedAt: postsTable.updatedAt,
          })
          .from(postsTable)
          .where(eq(postsTable.status, "published"))
          .orderBy(desc(postsTable.publishedAt))
          .limit(ITEM_LIMIT);

        items = rows.map((r) => {
          const link = `${ORIGIN}/hirek/${r.slug}`;
          const pubDate = r.publishedAt ? rfc822(new Date(r.publishedAt)) : rfc822(now);
          const description = htmlToText(r.excerpt || r.content || "");
          const author = r.authorName || "G2A Marketing";
          return [
            "    <item>",
            `      <title>${escapeXml(r.title)}</title>`,
            `      <link>${escapeXml(link)}</link>`,
            `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
            `      <pubDate>${pubDate}</pubDate>`,
            `      <author>info@g2amarketing.hu (${escapeXml(author)})</author>`,
            `      <description><![CDATA[${description}]]></description>`,
            "    </item>",
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
      `    <title>${escapeXml(FEED_TITLE)}</title>`,
      `    <link>${ORIGIN}/hirek</link>`,
      `    <description>${escapeXml(FEED_DESC)}</description>`,
      `    <language>${FEED_LANGUAGE}</language>`,
      `    <lastBuildDate>${rfc822(now)}</lastBuildDate>`,
      `    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />`,
      ...items,
      "  </channel>",
      "</rss>",
      "",
    ].join("\n");

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");
    res.send(body);
  };

  app.get("/rss.xml", handler);
  app.get("/api/rss.xml", handler);
}
