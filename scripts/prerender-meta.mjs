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
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "dist", "public");
const INDEX_HTML = join(PUBLIC_DIR, "index.html");
const ORIGIN = "https://g2amarketing.hu";
const CLOUD_NAME = "dzh1unb6d";

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
const ROUTES = [
  {
    path: "/",
    title: "G2A Marketing — Adatvezérelt Online Marketing Ügynökség Pécs",
    description: "Adatvezérelt marketing ügynökség Pécsről. SEO, Google Ads, Meta hirdetések, webfejlesztés, közösségi média és stratégiai marketing — KKV-knak és nagyvállalatoknak.",
    ogTitle: "G2A Marketing",
    ogSubtitle: "Adatvezérelt marketing ügynökség",
  },
  {
    path: "/rolunk",
    title: "Rólunk — G2A Marketing",
    description: "Ismerd meg a G2A Marketing csapatát. Küldetésünk, értékeink, történetünk — egy pécsi ügynökség, amelyik üzletet és nem csak forgalmat növel.",
    ogTitle: "Rólunk",
  },
  {
    path: "/karrier",
    title: "Karrier — G2A Marketing",
    description: "Csatlakozz a G2A Marketing csapatához. Aktuális nyitott pozíciók, kultúránk, és hogyan jelentkezz.",
    ogTitle: "Karrier",
  },
  {
    path: "/kapcsolat",
    title: "Kapcsolat — G2A Marketing Pécs",
    description: "Vedd fel velünk a kapcsolatot. Pécs, info@g2amarketing.hu, +36 30 190 2575. Ingyenes konzultáció KKV-knak.",
    ogTitle: "Kapcsolat",
  },
  {
    path: "/referenciak",
    title: "Referenciák & Esettanulmányok — G2A Marketing",
    description: "Valós marketing eredmények valós ügyfelektől. Esettanulmányok egészségügy, autóipar, B2B és más iparágakból.",
    ogTitle: "Referenciák",
  },
  {
    path: "/hirek",
    title: "Hírek & Blog — G2A Marketing",
    description: "Marketing tippek, trendek és iparági hírek a G2A Marketing csapatától. AI, ESG, KKV-marketing, B2B stratégia.",
    ogTitle: "Blog & Hírek",
  },
  {
    path: "/ingyenes-audit",
    title: "Ingyenes marketing audit — G2A Marketing",
    description: "Kérj ingyenes marketing auditot. 7-10 munkanap, részletes elemzés a teljes online jelenlétedről, akcióterv prioritás szerint.",
    ogTitle: "Ingyenes marketing audit",
  },
  {
    path: "/marketing-audit",
    title: "Marketing audit — G2A Marketing",
    description: "Részletes marketing audit szolgáltatás. Weboldal, hirdetéskezelés, SEO, közösségi média, analitika — egy átfogó értékelésben.",
    ogTitle: "Marketing audit",
  },
  {
    path: "/ingyenes-seo-audit",
    title: "Ingyenes SEO audit — G2A Marketing",
    description: "Ingyenes SEO audit weboldaladhoz. Technikai SEO, on-page, off-page, helyi keresőoptimalizálás — egy 20+ oldalas riport, hands-on akciókkal.",
    ogTitle: "Ingyenes SEO audit",
  },
  {
    path: "/hirlevel",
    title: "Hírlevél — G2A Marketing",
    description: "Iratkozz fel a G2A Marketing hírlevelére. Praktikus marketing tartalmat, esettanulmányokat és AI-megoldásokat küldünk — heti max 1 email, sose kéretlenül.",
    ogTitle: "Hírlevél",
  },
  {
    path: "/szakertelem",
    title: "Szakértelem — G2A Marketing",
    description: "Iparági szakértelmünk: egészségügy, autóipar, B2B, ESG, technológia, közigazgatás. Specializált csapat minden vertikálishoz.",
    ogTitle: "Szakértelem",
  },
  {
    path: "/technologia",
    title: "Technológia — G2A Marketing",
    description: "Technológiák, amiket használunk: AI, MarTech stack, analytics, automation. Hands-on tapasztalat 50+ eszközzel.",
    ogTitle: "Technológia",
  },
  {
    path: "/partnereink",
    title: "Partnereink — G2A Marketing",
    description: "Stratégiai partnereink: Google, Meta, Microsoft Advertising, és a magyar B2B ökoszisztéma kulcsszereplői.",
    ogTitle: "Partnereink",
  },
  {
    path: "/szolgaltatasok",
    title: "Szolgáltatások — G2A Marketing",
    description: "Teljes körű marketing szolgáltatások: SEO, Google Ads, Meta hirdetések, AI marketing, tartalommarketing, ESG kommunikáció, employer branding, nemzetközi marketing.",
    ogTitle: "Szolgáltatások",
  },
  {
    path: "/adatvedelmi-iranyelvek",
    title: "Adatvédelmi irányelvek — G2A Marketing",
    description: "Adatvédelmi tájékoztató és cookie-szabályzat a g2amarketing.hu oldalon. GDPR + Eker. tv. + ePrivacy konform.",
    ogTitle: "Adatvédelmi irányelvek",
  },
  {
    path: "/aszf",
    title: "ÁSZF — G2A Marketing",
    description: "Általános Szerződési Feltételek a G2A Marketing Bt. szolgáltatásaihoz.",
    ogTitle: "ÁSZF",
  },
];

/** Service subpages — same metadata shape, slug-driven. */
const SERVICES = [
  { slug: "ai-marketing", title: "AI Marketing — G2A Marketing", description: "AI-alapú marketing megoldások: tartalomgenerálás, perszonalizáció, prediktív analitika, agentic kampánykezelés. Praktikus eszközök KKV-knak.", ogTitle: "AI Marketing" },
  { slug: "ppc-google-ads", title: "PPC & Google Ads — G2A Marketing", description: "Google Ads és PPC kampánykezelés. Search, Display, YouTube, Performance Max. Mérhető ROAS, transzparens riport.", ogTitle: "PPC & Google Ads" },
  { slug: "meta-hirdetes", title: "Meta hirdetés — G2A Marketing", description: "Facebook + Instagram hirdetések. Kreatív, célzás, retargeting, advantage+ kampányok. iOS 14+ utáni signal-recovery.", ogTitle: "Meta hirdetés" },
  { slug: "tartalommarketing", title: "Tartalommarketing — G2A Marketing", description: "B2B és B2C tartalommarketing: blog, lead magnet, e-book, videó, podcast. SEO-driven content stratégia.", ogTitle: "Tartalommarketing" },
  { slug: "marketing-automatizacio", title: "Marketing automatizáció — G2A Marketing", description: "HubSpot, Mailchimp, Klaviyo, Brevo bevezetés. Email automation, lead nurturing, lifecycle marketing.", ogTitle: "Marketing automatizáció" },
  { slug: "esg-kommunikacio", title: "ESG kommunikáció — G2A Marketing", description: "ESG (Environmental, Social, Governance) kommunikációs tanácsadás. FIGYELEM: az SZTFH nem akkreditált ESG jelentéstevő szolgáltató vagyunk — csak kommunikációs oldalon segítünk.", ogTitle: "ESG kommunikáció" },
  { slug: "employer-branding", title: "Employer branding — G2A Marketing", description: "Munkáltatói márkaépítés. Karrier oldal, LinkedIn, EVP, recruitment marketing — kifejezetten technológiai és egészségügyi cégeknek.", ogTitle: "Employer branding" },
  { slug: "nemzetkozi-marketing", title: "Nemzetközi marketing — G2A Marketing", description: "Magyar cégek külpiaci marketingje: nyelvi lokalizáció, multi-market PPC, kínai (WeChat, Baidu) és európai piacok.", ogTitle: "Nemzetközi marketing" },
];

/** Industry landing pages — high-priority B2B SEO targets. */
const INDUSTRIES = [
  { slug: "marketing-egeszsegugyi-cegeknek", title: "Marketing egészségügyi cégeknek — G2A Marketing", description: "Marketing magánrendelőknek, klinikáknak, egészségügyi szolgáltatóknak. Etikai szabályozás-kompatibilis kommunikáció, betegszerzés.", ogTitle: "Marketing egészségügyi cégeknek" },
  { slug: "marketing-szepsegipari-cegeknek", title: "Marketing szépségipari cégeknek — G2A Marketing", description: "Szépségipari marketing: szépségszalonok, kozmetikai márkák, esztétikai klinikák. Instagram-vezérelt B2C növekedés.", ogTitle: "Marketing szépségipari cégeknek" },
  { slug: "marketing-mernoki-irodaknak", title: "Marketing mérnöki irodáknak — G2A Marketing", description: "B2B marketing mérnöki és tervezői irodáknak. Műszaki tartalommarketing, LinkedIn, hosszú értékesítési ciklus.", ogTitle: "Marketing mérnöki irodáknak" },
  { slug: "marketing-autoipari-cegeknek", title: "Marketing autóipari cégeknek — G2A Marketing", description: "Autóipari marketing: márkakereskedések, alkatrész-forgalmazók, szervizek. Local SEO + leadgenerálás.", ogTitle: "Marketing autóipari cégeknek" },
  { slug: "marketing-ugyvedii-irodaknak", title: "Marketing ügyvédi irodáknak — G2A Marketing", description: "Marketing ügyvédi és jogi irodáknak. Magyar Ügyvédi Kamara reklámkorlátozás-konform kommunikáció.", ogTitle: "Marketing ügyvédi irodáknak" },
  { slug: "marketing-technologiai-cegeknek", title: "Marketing technológiai cégeknek — G2A Marketing", description: "B2B SaaS és tech marketing: pozícionálás, product-led growth, content marketing, ABM, demógyűjtés.", ogTitle: "Marketing technológiai cégeknek" },
  { slug: "marketing-onkormanyzati-projekteknek", title: "Marketing önkormányzati projekteknek — G2A Marketing", description: "EU-támogatott önkormányzati projektek kommunikációja és lakossági kampányok. Közbeszerzés-kompatibilis ajánlatok.", ogTitle: "Marketing önkormányzati projekteknek" },
  { slug: "marketing-b2b-cegeknek", title: "Marketing B2B cégeknek — G2A Marketing", description: "B2B marketing stratégia gyártóknak, nagykereskedőknek, szolgáltatóknak. LinkedIn, ABM, hosszú deal-ciklus.", ogTitle: "Marketing B2B cégeknek" },
];

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
 * Build the per-route <link> tags: canonical + 3 hreflang alternates + x-default.
 *
 * Per-route canonical was the audit's #1 finding — currently every page
 * shipped `<link rel="canonical" href="https://g2amarketing.hu">` which tells
 * Google every subpage is a duplicate of the homepage. Now each prerendered
 * route gets its own canonical pointing to its own URL.
 *
 * hreflang in <head> was the audit's #2 finding — only the sitemap had them
 * before. We inject the full 3-language alternates plus x-default so search
 * engines see the language cluster on every page even without crawling the
 * sitemap first.
 */
function renderLinkTags(route) {
  const huUrl = `${ORIGIN}${route.path}`;
  const enUrl = `${ORIGIN}/en${route.path === "/" ? "" : route.path}`;
  const zhUrl = `${ORIGIN}/zh${route.path === "/" ? "" : route.path}`;
  return [
    `<link rel="canonical" href="${huUrl}" />`,
    `<link rel="alternate" hreflang="hu" href="${huUrl}" />`,
    `<link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${huUrl}" />`,
  ];
}

function renderRouteHtml(baseHtml, route) {
  const ogTitle = route.ogTitle || route.title;
  const ogImageUrl = ogImage(ogTitle, route.ogSubtitle || "G2A Marketing");
  const url = `${ORIGIN}${route.path}`;

  let html = baseHtml;
  html = setTitle(html, route.title);
  html = setMetaTag(html, "name", "description", route.description);
  html = setMetaTag(html, "name", "robots", ROBOTS_VALUE);
  html = setMetaTag(html, "property", "og:title", route.title);
  html = setMetaTag(html, "property", "og:description", route.description);
  html = setMetaTag(html, "property", "og:url", url);
  html = setMetaTag(html, "property", "og:image", ogImageUrl);
  html = setMetaTag(html, "name", "twitter:title", route.title);
  html = setMetaTag(html, "name", "twitter:description", route.description);
  html = setMetaTag(html, "name", "twitter:image", ogImageUrl);

  // Per-route canonical (was: hardcoded to https://g2amarketing.hu on every page)
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
  const hreflangLinks = renderLinkTags(route).slice(1); // skip canonical (already done)
  html = html.replace(
    "</head>",
    `    ${hreflangLinks.join("\n    ")}\n  </head>`,
  );

  // Inject static hero shell into the empty root div so Lighthouse has
  // an LCP candidate before the JS bundle finishes executing. React
  // hydration replaces the whole subtree once mounted.
  const shell = renderStaticShell(route);
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
function writeRouteFile(route, html) {
  if (route.path === "/") {
    // Root — overwrite the main index.html so the homepage gets the
    // brand-tuned title/description too.
    writeFileSync(INDEX_HTML, html, "utf8");
    return;
  }
  const trimmed = route.path.replace(/^\/+/, "");
  const outPath = join(PUBLIC_DIR, trimmed, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
}

// ─── Main ────────────────────────────────────────────────────────────────────
const baseHtml = readFileSync(INDEX_HTML, "utf8");

const allRoutes = [
  ...ROUTES,
  ...SERVICES.map((s) => ({
    path: `/szolgaltatasok/${s.slug}`,
    title: s.title,
    description: s.description,
    ogTitle: s.ogTitle,
  })),
  ...INDUSTRIES.map((i) => ({
    path: `/iparagi/${i.slug}`,
    title: i.title,
    description: i.description,
    ogTitle: i.ogTitle,
  })),
];

let written = 0;
for (const route of allRoutes) {
  const html = renderRouteHtml(baseHtml, route);
  writeRouteFile(route, html);
  written++;
}

console.log(`✔ Prerendered meta for ${written} routes → dist/public/`);
console.log(`  Static (${ROUTES.length}) + services (${SERVICES.length}) + industries (${INDUSTRIES.length})`);
