/**
 * Build-time prerender — generates per-route HTML files in `dist/public/` so
 * social-media crawlers (LinkedIn, Facebook, X, Slack, Discord) that don't
 * execute JavaScript still see route-specific `<title>`, `<meta description>`,
 * and Open Graph tags. The React SeoHead component updates these tags at
 * runtime, but pure HTML scrapers miss that update.
 *
 * Approach: take the Vite-built `dist/public/index.html`, do regex string
 * replacement on the meta tags, and write a copy to
 * `dist/public/<route>/index.html`. Vercel's static file resolver serves
 * `<route>/index.html` for a `/<route>` request automatically — no rewrite
 * or cleanUrls config needed, and unprerendered SPA routes (`/admin`, blog
 * detail pages, etc.) cleanly fall through to the catch-all rewrite that
 * sends them to the root `index.html`.
 *
 * Coverage: ~25 static routes (home + service/industry/audit/about/legal
 * pages). Blog posts and case studies are NOT prerendered — those carry their
 * own `featuredImage` field anyway and are shared less often than service or
 * landing pages.
 *
 * EN/ZH routes (`/en/...`, `/zh/...`) are also skipped — they fall through to
 * the SPA's index.html. If LinkedIn share volume justifies it later, the
 * script can be expanded.
 *
 * Run: `node scripts/prerender-meta.mjs` (called from `build:vercel`)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ROUTES, SERVICES, INDUSTRIES, allRoutes } from "./prerender-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "dist", "public");
const INDEX_HTML = join(PUBLIC_DIR, "index.html");
const TRANSLATIONS_PATH = join(__dirname, "prerender-translations.json");
const ORIGIN = "https://g2amarketing.hu";
const CLOUD_NAME = "dzh1unb6d";

/** Loaded once at startup. Empty object if missing (English/Chinese pages
 *  fall back to the Hungarian source — better than failing the build). */
const TRANSLATIONS = existsSync(TRANSLATIONS_PATH)
  ? JSON.parse(readFileSync(TRANSLATIONS_PATH, "utf8"))
  : {};

/** Locale config — drives the prefix in URLs + the lang attribute on <html>. */
const LOCALES = [
  { code: "hu", prefix: "", lang: "hu", ogLocale: "hu_HU" },
  { code: "en", prefix: "/en", lang: "en", ogLocale: "en_US" },
  { code: "zh", prefix: "/zh", lang: "zh-CN", ogLocale: "zh_CN" },
];

/**
 * Resolve the metadata for a given route + locale, falling back to the HU
 * source if no translation is available for that route.
 */
function localize(route, locale) {
  if (locale === "hu") return route;
  const t = TRANSLATIONS[route.path]?.[locale];
  if (!t || !t.title) return route; // graceful fallback
  return {
    ...route,
    title: t.title,
    description: t.description || route.description,
    ogTitle: t.ogTitle || route.ogTitle,
  };
}

/**
 * Preview deploys (Vercel preview / staging) should not be indexed by Google
 * — otherwise the staging URL ends up competing with the production URL for
 * the same content. Production deploys keep their normal index,follow.
 *
 * Decided via the `VERCEL_ENV` env var Vercel injects at build time:
 *   "production" → indexable
 *   "preview" / "development" / unset → noindex,nofollow
 */
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";
const ROBOTS_VALUE = IS_PRODUCTION ? "index, follow" : "noindex, nofollow";

/** URL-encode for Cloudinary text overlay (matches client/src/lib/cloudinary.ts) */
const encOg = (s) =>
  encodeURIComponent(s).replace(/,/g, "%2C").replace(/\//g, "%2F").replace(/'/g, "%27");

/**
 * Render an OG image URL using the same Cloudinary transforms as `ogImageUrl`
 * in `client/src/lib/cloudinary.ts` — kept in lockstep so prerendered cards
 * match the in-app ones.
 */
function ogImage(title, subtitle = "G2A Marketing") {
  const layers = [
    `l_text:Arial_56_bold:${encOg(title)},co_rgb:ffffff,w_1000,c_fit,g_south,y_120`,
    `l_text:Arial_28_normal:${encOg(subtitle)},co_rgb:14B8A6,w_1000,c_fit,g_south,y_70`,
  ];
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_630,c_pad,b_rgb:0a0a0a,q_auto,f_auto/${layers.join("/")}/g2a/og/default-logo.png`;
}

/**
 * Route → meta mapping. Keep titles + descriptions roughly in sync with what
 * each page passes to its `<SeoHead>` — drift is OK (crawler sees prerender,
 * user sees SPA-updated tags), but big mismatches confuse share previews.
 *
 * Title format: short subject + brand. The OG image generator strips the brand
 * suffix before baking it into the card so the headline stays clean.
 */

/**
 * Apply a meta-tag replacement to a string. Handles both `name="x"` and
 * `property="x"` attributes; case-insensitive match on the attribute value.
 */
function setMetaTag(html, attr, key, value) {
  const escapedValue = value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const re = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`,
    "i",
  );
  if (re.test(html)) {
    return html.replace(re, `<meta ${attr}="${key}" content="${escapedValue}" />`);
  }
  // Tag not present — inject it just before </head>
  return html.replace(
    "</head>",
    `    <meta ${attr}="${key}" content="${escapedValue}" />\n  </head>`,
  );
}

function setTitle(html, title) {
  const escaped = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escaped}</title>`);
}

/**
 * HTML-escape a string for safe embedding in text content.
 */
function escHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Build the static-shell hero markup injected into <div id="root">.
 *
 * Why: Vite SPAs ship `<div id="root"></div>` and rely on the JS bundle
 * (~600 KB) to render anything visible. Lighthouse mobile audit times out
 * on the JS parse + execute before React mounts, recording FCP from the
 * empty CSS background but no LCP candidate at all → NO_LCP error.
 *
 * This shell is a single H1 + lead paragraph using the existing
 * `g2a-headline-xl` class (already loaded by index.css before the JS).
 * The static text becomes the LCP candidate, scores well, then React
 * mounts and replaces the entire #root subtree with the real app.
 * Users see the static shell for ~100-300ms before the React app takes
 * over — barely perceptible, no layout shift since both use the same
 * containing styles.
 *
 * The shell uses route-specific heading text (the title's pre-suffix
 * part) and the meta description as the lead, so each prerendered route
 * gets a relevant LCP element matching its content.
 */
function renderStaticShell(route) {
  // Strip " — G2A Marketing" / "– G2A Marketing" from the headline so it
  // reads naturally as a standalone H1.
  const headline = escHtml(
    (route.ogTitle || route.title).replace(/\s*[–—-]\s*G2A.*$/i, "").trim() || route.title,
  );
  const lead = escHtml(route.description);
  return `
    <div data-prerender-shell="1">
      <header style="position:fixed;top:0;left:0;right:0;height:80px;background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.06);z-index:50"></header>
      <main style="padding-top:120px;padding-bottom:4rem;min-height:100vh;display:flex;align-items:center;background:#0a0a0a">
        <div style="max-width:1280px;margin:0 auto;padding:0 1.5rem;width:100%">
          <section style="max-width:820px">
            <h1 class="g2a-headline-xl" style="margin-bottom:1.5rem;color:#fff">${headline}</h1>
            <p style="font-size:1.1rem;color:rgba(255,255,255,0.7);line-height:1.7;max-width:640px;font-family:Geist,sans-serif">${lead}</p>
          </section>
        </div>
      </main>
    </div>`;
}

/**
 * Replace or inject a <link> tag matching a given (rel, attribute-match).
 * For canonical we match on rel="canonical"; for hreflang we match on
 * rel="alternate" + hreflang="x" so we can have multiple of them.
 */
function replaceOrAppendLink(html, matcher, replacement) {
  const re = new RegExp(matcher, "i");
  if (re.test(html)) {
    return html.replace(re, replacement);
  }
  // Inject just before </head>
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

/**
 * Build the per-route, per-locale <link> tags: canonical + hreflang cluster.
 *
 * Canonical points to the **current locale's** URL (audit §2.1) so EN/ZH
 * pages don't get auto-deduped to the HU version. hreflang covers all 3
 * languages plus x-default → HU (audit §2.2).
 */
function localizedUrl(route, locale) {
  // Home + locale prefix: "/", "/en", "/zh" — no trailing slash on prefix-only
  if (route.path === "/") return `${ORIGIN}${locale.prefix || "/"}`;
  return `${ORIGIN}${locale.prefix}${route.path}`;
}

function renderLinkTags(route, locale) {
  const selfUrl = localizedUrl(route, locale);
  const huUrl = localizedUrl(route, LOCALES[0]);
  const enUrl = localizedUrl(route, LOCALES[1]);
  const zhUrl = localizedUrl(route, LOCALES[2]);
  return [
    `<link rel="canonical" href="${selfUrl}" />`,
    `<link rel="alternate" hreflang="hu" href="${huUrl}" />`,
    `<link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${huUrl}" />`,
  ];
}

function renderRouteHtml(baseHtml, route, locale) {
  const localized = localize(route, locale.code);
  const ogTitle = localized.ogTitle || localized.title;
  const ogImageUrl = ogImage(ogTitle, route.ogSubtitle || "G2A Marketing");
  const url = localizedUrl(route, locale);

  let html = baseHtml;
  html = setTitle(html, localized.title);
  html = setMetaTag(html, "name", "description", localized.description);
  html = setMetaTag(html, "name", "robots", ROBOTS_VALUE);
  html = setMetaTag(html, "property", "og:title", localized.title);
  html = setMetaTag(html, "property", "og:description", localized.description);
  html = setMetaTag(html, "property", "og:url", url);
  html = setMetaTag(html, "property", "og:image", ogImageUrl);
  html = setMetaTag(html, "property", "og:locale", locale.ogLocale);
  html = setMetaTag(html, "name", "twitter:title", localized.title);
  html = setMetaTag(html, "name", "twitter:description", localized.description);
  html = setMetaTag(html, "name", "twitter:image", ogImageUrl);

  // <html lang="..."> — audit §2.6 wants this per locale
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${locale.lang}"`);

  // Per-route canonical
  html = replaceOrAppendLink(
    html,
    '<link\\s+rel="canonical"[^>]*/?>',
    `<link rel="canonical" href="${url}" />`,
  );

  // Per-route hreflang cluster — strip ALL existing hreflang links first
  // (the base index.html might have stale ones), then inject the fresh set.
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*\/?>\s*/gi,
    "",
  );
  const hreflangLinks = renderLinkTags(route, locale).slice(1); // skip canonical (already done)
  html = html.replace(
    "</head>",
    `    ${hreflangLinks.join("\n    ")}\n  </head>`,
  );

  // Inject static hero shell into the empty root div so Lighthouse has
  // an LCP candidate before the JS bundle finishes executing. React
  // hydration replaces the whole subtree once mounted.
  const shell = renderStaticShell(localized);
  html = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${shell}</div>`,
  );

  return html;
}

/**
 * Write a prerendered file at `dist/public/<route>/index.html`. Vercel's
 * static-file resolver serves this for a `/<route>` request automatically.
 * Using the directory form (instead of `<route>.html`) means SPA fallbacks
 * for unprerendered routes still work: when no file exists at that path,
 * Vercel falls through to the rewrite catch-all that sends every other
 * request to the root index.html.
 *
 * For nested routes (e.g. `/szolgaltatasok/ai-marketing`) the file is
 * `dist/public/szolgaltatasok/ai-marketing/index.html`. mkdirSync ensures
 * the parent directory exists.
 */
/**
 * Write a prerendered HTML for (route, locale). The output path depends on
 * both: HU lives under `/{path}/index.html` (root), EN under `/en/{path}/`,
 * ZH under `/zh/{path}/`. The Home route is special — HU goes to the root
 * index.html so the SPA fallback rewrite serves the correct shell.
 */
function writeRouteFile(route, locale, html) {
  // HU + Home → root index.html (overwrites the Vite output)
  if (locale.code === "hu" && route.path === "/") {
    writeFileSync(INDEX_HTML, html, "utf8");
    return;
  }
  const localePath = locale.prefix; // "", "/en", "/zh"
  const routePath = route.path === "/" ? "" : route.path;
  const trimmed = `${localePath}${routePath}`.replace(/^\/+/, "");
  const outPath = join(PUBLIC_DIR, trimmed, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
}

// ─── Main ────────────────────────────────────────────────────────────────────
const baseHtml = readFileSync(INDEX_HTML, "utf8");
const routes = allRoutes();

let written = 0;
for (const route of routes) {
  for (const locale of LOCALES) {
    const html = renderRouteHtml(baseHtml, route, locale);
    writeRouteFile(route, locale, html);
    written++;
  }
}

console.log(`✔ Prerendered ${written} HTML files (${routes.length} routes × ${LOCALES.length} locales)`);
console.log(`  Static (${ROUTES.length}) + services (${SERVICES.length}) + industries (${INDUSTRIES.length})`);
console.log(`  Locales: ${LOCALES.map((l) => l.code).join(", ")}`);
