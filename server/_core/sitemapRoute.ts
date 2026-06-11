/**
 * Dynamic sitemap.xml — generated from DB on each request so newly published
 * blog posts and case studies show up immediately without redeploying.
 *
 * Replaces the build-time static file at `client/public/sitemap.xml`. Caches
 * for 1 hour at the CDN edge (`Cache-Control: public, max-age=3600`) so we
 * don't hammer TiDB for every Googlebot fetch.
 *
 * Coverage:
 *   - Hand-curated static paths (home, /rolunk, /szolgaltatasok/*, /iparagi/*,
 *     legal pages, etc.) — these don't change without a deploy
 *   - All `posts` with status='published' (HU/EN/ZH alternates)
 *   - All `case_studies` with isActive=true (HU/EN/ZH alternates)
 *
 * On DB unavailable we still serve the static skeleton so the URL doesn't
 * 500 — Googlebot tolerates partial sitemaps but not server errors.
 */
import type { Express, Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { posts as postsTable, caseStudies as caseStudiesTable } from "../../drizzle/schema";

const ORIGIN = "https://g2amarketing.hu";

type LangSpec = { code: "hu" | "en" | "zh"; prefix: string; hreflang: string };
const LANGS: LangSpec[] = [
  { code: "hu", prefix: "", hreflang: "hu" },
  { code: "en", prefix: "/en", hreflang: "en" },
  { code: "zh", prefix: "/zh", hreflang: "zh-CN" },
];

type SitemapPath = {
  path: string;
  priority: string;
  changefreq: string;
  /** ISO-format date; falls back to today if not provided */
  lastmod?: string;
};

/** Static paths — keep in sync with App.tsx public routes. */
const STATIC_PATHS: SitemapPath[] = [
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
    "lokalizacio", "arculattervezes", "hirdeteskezeles", "kozossegi-media",
    "strategiai-marketing", "keresooptimalizalas", "webfejlesztes",
    "ai-marketing", "ppc-google-ads", "meta-hirdetes", "tartalommarketing",
    "marketing-automatizacio", "esg-kommunikacio", "employer-branding",
    "nemzetkozi-marketing",
  ].map((slug): SitemapPath => ({
    path: `/szolgaltatasok/${slug}`, priority: "0.8", changefreq: "monthly",
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
  ].map((slug): SitemapPath => ({
    path: `/iparagi/${slug}`, priority: "0.8", changefreq: "monthly",
  })),
];

function buildUrl(path: string, langPrefix: string): string {
  // Special case: root path "/" + prefix = "/en" or "/zh" (not "/en/")
  if (path === "/") return `${ORIGIN}${langPrefix || "/"}`;
  return `${ORIGIN}${langPrefix}${path}`;
}

function escapeXml(s: string): string {
  return s.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&apos;",
    '"': "&quot;",
  })[c]!);
}

function renderUrlEntry(entry: SitemapPath): string {
  const lastmod = entry.lastmod ?? new Date().toISOString().slice(0, 10);
  const blocks: string[] = [];
  for (const lang of LANGS) {
    const loc = buildUrl(entry.path, lang.prefix);
    const altLinks = LANGS.map(
      (alt) =>
        `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(buildUrl(entry.path, alt.prefix))}" />`,
    ).join("\n");
    blocks.push(
      `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n${altLinks}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(buildUrl(entry.path, ""))}" />\n  </url>`,
    );
  }
  return blocks.join("\n");
}

/** Fetch dynamic paths from DB. Returns empty arrays on failure or no DB. */
async function fetchDynamicPaths(): Promise<SitemapPath[]> {
  const db = await getDb();
  if (!db) return [];

  const out: SitemapPath[] = [];
  try {
    // Published blog posts
    const blogRows = await db
      .select({
        slug: postsTable.slug,
        updatedAt: postsTable.updatedAt,
        publishedAt: postsTable.publishedAt,
      })
      .from(postsTable)
      .where(eq(postsTable.status, "published"))
      .orderBy(desc(postsTable.publishedAt));
    for (const r of blogRows) {
      const mod = r.updatedAt ?? r.publishedAt;
      out.push({
        path: `/hirek/${r.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: mod ? new Date(mod).toISOString().slice(0, 10) : undefined,
      });
    }

    // Active case studies
    const csRows = await db
      .select({
        slug: caseStudiesTable.slug,
        updatedAt: caseStudiesTable.updatedAt,
      })
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.isActive, true))
      .orderBy(desc(caseStudiesTable.updatedAt));
    for (const r of csRows) {
      out.push({
        path: `/referenciak/${r.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0, 10) : undefined,
      });
    }
  } catch (err) {
    console.warn("[sitemap] DB query failed, serving static skeleton only:", err);
  }
  return out;
}

export function registerSitemapRoute(app: Express): void {
  const handler = async (_req: Request, res: Response) => {
    const dynamic = await fetchDynamicPaths();
    const all = [...STATIC_PATHS, ...dynamic];

    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      "",
      `  <!-- Generated dynamically — ${all.length} paths × ${LANGS.length} languages = ${all.length * LANGS.length} URL entries -->`,
      "",
      ...all.map(renderUrlEntry),
      "",
      "</urlset>",
      "",
    ].join("\n");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    // CDN-cache for 1 hour, browser for 5 min. New posts show up within an hour.
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    res.send(body);
  };

  // Canonical path — what Googlebot fetches via robots.txt
  app.get("/sitemap.xml", handler);
  // Vercel rewrites send `/sitemap.xml` to `/api`, where Express sees the
  // request with the original URL preserved. Belt-and-suspenders: also bind
  // the `/api/` variant in case the rewrite ever changes.
  app.get("/api/sitemap.xml", handler);
}
