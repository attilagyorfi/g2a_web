// Generates client/public/sitemap.xml with full HU/EN/ZH coverage + hreflang alternates.
// Run: `node scripts/generate-sitemap.mjs`
// When to run: after content structure changes (new service slug, new industry, new case study).
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "client", "public", "sitemap.xml");
const ORIGIN = "https://g2amarketing.hu";
const TODAY = new Date().toISOString().slice(0, 10);

/**
 * Paths keyed by priority & changefreq.
 * HU is the canonical path (no prefix). EN/ZH are automatically generated.
 */
const PATHS = [
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

  // Services
  { path: "/szolgaltatasok", priority: "0.9", changefreq: "monthly" },
  ...[
    "lokalizacio", "arculattervezes", "hirdeteskezeles", "kozossegi-media",
    "strategiai-marketing", "keresooptimalizalas", "webfejlesztes",
    "ai-marketing", "ppc-google-ads", "meta-hirdetes", "tartalommarketing",
    "marketing-automatizacio", "esg-kommunikacio", "employer-branding",
    "nemzetkozi-marketing",
  ].map(slug => ({ path: `/szolgaltatasok/${slug}`, priority: "0.8", changefreq: "monthly" })),

  // Industry landing pages
  ...[
    "marketing-egeszsegugyi-cegeknek",
    "marketing-szepsegipari-cegeknek",
    "marketing-mernoki-irodaknak",
    "marketing-autoipari-cegeknek",
    "marketing-ugyvedii-irodaknak",
    "marketing-technologiai-cegeknek",
    "marketing-onkormanyzati-projekteknek",
    "marketing-b2b-cegeknek",
  ].map(slug => ({ path: `/iparagi/${slug}`, priority: "0.8", changefreq: "monthly" })),
];

const LANGS = [
  { code: "hu", prefix: "", hreflang: "hu" },
  { code: "en", prefix: "/en", hreflang: "en" },
  { code: "zh", prefix: "/zh", hreflang: "zh-CN" },
];

function buildUrl(p, langPrefix) {
  // Special case: root path "/" + prefix = "/en" or "/zh" (not "/en/")
  if (p === "/") return `${ORIGIN}${langPrefix || "/"}`;
  return `${ORIGIN}${langPrefix}${p}`;
}

const lines = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');
lines.push("");
lines.push(`  <!-- Generated ${TODAY} — do not edit manually; re-run scripts/generate-sitemap.mjs -->`);
lines.push("");

for (const entry of PATHS) {
  for (const lang of LANGS) {
    const loc = buildUrl(entry.path, lang.prefix);
    lines.push("  <url>");
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <lastmod>${TODAY}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    // hreflang alternates — all 3 langs + x-default (HU)
    for (const alt of LANGS) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${buildUrl(entry.path, alt.prefix)}" />`);
    }
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${buildUrl(entry.path, "")}" />`);
    lines.push("  </url>");
  }
  lines.push("");
}

lines.push("</urlset>");
lines.push("");

const out = lines.join("\n");
writeFileSync(OUT_PATH, out, "utf8");

const urlCount = PATHS.length * LANGS.length;
console.log(`✔ Wrote ${OUT_PATH}`);
console.log(`  ${PATHS.length} paths × ${LANGS.length} languages = ${urlCount} URL entries`);
console.log(`  lastmod: ${TODAY}`);
