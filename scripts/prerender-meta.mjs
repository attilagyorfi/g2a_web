/**
 * Build-time prerender — generates per-route HTML files in `dist/public/` so
 * social-media crawlers (LinkedIn, Facebook, X, Slack, Discord) that don't
 * execute JavaScript still see route-specific `<title>`, `<meta description>`,
 * and Open Graph tags. The React SeoHead component updates these tags at
 * runtime, but pure HTML scrapers miss that update.
 *
 * Approach: take the Vite-built `dist/public/index.html`, do regex string
 * replacement on the meta tags, and write a copy to `dist/public/<route>.html`.
 * Vercel serves `<route>.html` for a `/<route>` request when `cleanUrls: true`
 * is set, with no rewrite needed.
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

function renderRouteHtml(baseHtml, route) {
  const ogTitle = route.ogTitle || route.title;
  const ogImageUrl = ogImage(ogTitle, route.ogSubtitle || "G2A Marketing");
  const url = `${ORIGIN}${route.path}`;

  let html = baseHtml;
  html = setTitle(html, route.title);
  html = setMetaTag(html, "name", "description", route.description);
  html = setMetaTag(html, "property", "og:title", route.title);
  html = setMetaTag(html, "property", "og:description", route.description);
  html = setMetaTag(html, "property", "og:url", url);
  html = setMetaTag(html, "property", "og:image", ogImageUrl);
  html = setMetaTag(html, "name", "twitter:title", route.title);
  html = setMetaTag(html, "name", "twitter:description", route.description);
  html = setMetaTag(html, "name", "twitter:image", ogImageUrl);
  return html;
}

/**
 * Write a prerendered file at `dist/public/<route>.html`. Vercel's
 * `cleanUrls: true` setting maps `/<route>` requests to this file.
 *
 * For nested routes (e.g. `/szolgaltatasok/ai-marketing`) we create
 * `dist/public/szolgaltatasok/ai-marketing.html`. mkdirSync ensures the
 * parent directory exists.
 */
function writeRouteFile(route, html) {
  if (route.path === "/") {
    // Root — overwrite the main index.html so the homepage gets the
    // brand-tuned title/description too.
    writeFileSync(INDEX_HTML, html, "utf8");
    return;
  }
  const trimmed = route.path.replace(/^\/+/, "");
  const outPath = join(PUBLIC_DIR, `${trimmed}.html`);
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
