/**
 * Single source of truth for prerendered route metadata.
 *
 * Imported by:
 *   - scripts/build-translations.mjs  (feeds DeepL to populate EN+ZH)
 *   - scripts/prerender-meta.mjs       (writes the actual HTML)
 *
 * Keeping the data here (rather than inline in prerender-meta.mjs) lets the
 * translation pass run independently — once per content update — and stash
 * its output in `prerender-translations.json` for the build to pick up.
 *
 * Route shape:
 *   { path, title, description, ogTitle?, ogSubtitle? }
 *
 * Path is the canonical (HU) URL path. EN gets prefixed with `/en`, ZH with
 * `/zh`. The `ogTitle` (when present) drives the static-shell H1 and the
 * Cloudinary OG card; falls back to `title` (with brand suffix stripped at
 * render time).
 */

export const ROUTES = [
  {
    path: "/",
    title: "G2A Marketing — Adatvezérelt B2B Marketing Ügynökség Pécs",
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
    description: "Kérj ingyenes marketing auditot. 24 órán belül felvesszük a kapcsolatot, 5-7 munkanapon belül átadjuk a részletes audit-riportot.",
    ogTitle: "Ingyenes marketing audit",
  },
  // /marketing-audit removed — Vercel 301 redirects to /ingyenes-audit
  // (audit §3.3 consolidation, was kulcsszó-kannibalizáció with the other
  // free-audit landing page).
  {
    path: "/ingyenes-seo-audit",
    title: "Ingyenes SEO audit — G2A Marketing",
    description: "Ingyenes SEO audit weboldaladhoz. Technikai SEO, on-page, off-page, helyi keresőoptimalizálás — 24 órán belül kapcsolatba lépünk, 5-7 munkanap a részletes riport.",
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
    title: "Iparágak — G2A Marketing",
    description: "Iparági szakértelmünk: egészségügy, autóipar, B2B, ESG, technológia, közigazgatás. Specializált csapat minden vertikálishoz.",
    ogTitle: "Iparágak",
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

export const SERVICES = [
  { slug: "ai-marketing", title: "AI Marketing — G2A Marketing", description: "AI-alapú marketing megoldások: tartalomgenerálás, perszonalizáció, prediktív analitika, agentic kampánykezelés. Praktikus eszközök KKV-knak.", ogTitle: "AI Marketing" },
  { slug: "ppc-google-ads", title: "PPC & Google Ads — G2A Marketing", description: "Google Ads és PPC kampánykezelés. Search, Display, YouTube, Performance Max. Mérhető ROAS, transzparens riport.", ogTitle: "PPC & Google Ads" },
  { slug: "meta-hirdetes", title: "Meta hirdetés — G2A Marketing", description: "Facebook + Instagram hirdetések. Kreatív, célzás, retargeting, advantage+ kampányok. iOS 14+ utáni signal-recovery.", ogTitle: "Meta hirdetés" },
  { slug: "tartalommarketing", title: "Tartalommarketing — G2A Marketing", description: "B2B és B2C tartalommarketing: blog, lead magnet, e-book, videó, podcast. SEO-driven content stratégia.", ogTitle: "Tartalommarketing" },
  { slug: "marketing-automatizacio", title: "Marketing automatizáció — G2A Marketing", description: "HubSpot, Mailchimp, Klaviyo, Brevo bevezetés. Email automation, lead nurturing, lifecycle marketing.", ogTitle: "Marketing automatizáció" },
  { slug: "esg-kommunikacio", title: "ESG kommunikáció — G2A Marketing", description: "ESG (Environmental, Social, Governance) kommunikációs tanácsadás. FIGYELEM: nem vagyunk SZTFH-akkreditált ESG jelentéstevő szolgáltató — csak kommunikációs oldalon segítünk.", ogTitle: "ESG kommunikáció" },
  { slug: "employer-branding", title: "Employer branding — G2A Marketing", description: "Munkáltatói márkaépítés. Karrier oldal, LinkedIn, EVP, recruitment marketing — kifejezetten technológiai és egészségügyi cégeknek.", ogTitle: "Employer branding" },
  { slug: "nemzetkozi-marketing", title: "Nemzetközi marketing — G2A Marketing", description: "Magyar cégek külpiaci marketingje: nyelvi lokalizáció, multi-market PPC, kínai (WeChat, Baidu) és európai piacok.", ogTitle: "Nemzetközi marketing" },
];

export const INDUSTRIES = [
  { slug: "marketing-egeszsegugyi-cegeknek", title: "Egészségügyi marketing klinikáknak és magánorvosoknak — G2A Marketing", description: "Marketing magánrendelőknek, klinikáknak, egészségügyi szolgáltatóknak. Etikai szabályozás-kompatibilis kommunikáció, betegszerzés.", ogTitle: "Marketing egészségügyi cégeknek" },
  { slug: "marketing-szepsegipari-cegeknek", title: "Szépségipari marketing szalonoknak és klinikáknak — G2A Marketing", description: "Szépségipari marketing: szépségszalonok, kozmetikai márkák, esztétikai klinikák. Instagram-vezérelt B2C növekedés.", ogTitle: "Marketing szépségipari cégeknek" },
  { slug: "marketing-mernoki-irodaknak", title: "Mérnöki marketing tervező irodáknak — G2A Marketing", description: "B2B marketing mérnöki és tervezői irodáknak. Műszaki tartalommarketing, LinkedIn, hosszú értékesítési ciklus.", ogTitle: "Marketing mérnöki irodáknak" },
  { slug: "marketing-autoipari-cegeknek", title: "Autóipari marketing márkakereskedőknek és szervizeknek — G2A Marketing", description: "Autóipari marketing: márkakereskedések, alkatrész-forgalmazók, szervizek. Local SEO + leadgenerálás.", ogTitle: "Marketing autóipari cégeknek" },
  { slug: "marketing-ugyvedi-irodaknak", title: "Ügyvédi marketing jogi irodáknak — G2A Marketing", description: "Marketing ügyvédi és jogi irodáknak. Magyar Ügyvédi Kamara reklámkorlátozás-konform kommunikáció.", ogTitle: "Marketing ügyvédi irodáknak" },
  { slug: "marketing-technologiai-cegeknek", title: "B2B tech marketing SaaS-nak és IT-cégeknek — G2A Marketing", description: "B2B SaaS és tech marketing: pozícionálás, product-led growth, content marketing, ABM, demógyűjtés.", ogTitle: "Marketing technológiai cégeknek" },
  { slug: "marketing-onkormanyzati-projekteknek", title: "Önkormányzati marketing EU-projekteknek — G2A Marketing", description: "EU-támogatott önkormányzati projektek kommunikációja és lakossági kampányok. Közbeszerzés-kompatibilis ajánlatok.", ogTitle: "Marketing önkormányzati projekteknek" },
  { slug: "marketing-b2b-cegeknek", title: "B2B marketing gyártóknak és nagykereskedőknek — G2A Marketing", description: "B2B marketing stratégia gyártóknak, nagykereskedőknek, szolgáltatóknak. LinkedIn, ABM, hosszú deal-ciklus.", ogTitle: "Marketing B2B cégeknek" },
  { slug: "marketing-kreativ-cegeknek", title: "Kreatív marketing fotósoknak és stúdióknak — G2A Marketing", description: "Vizuális-első marketing kreatív vállalkozásoknak: portfólió-weboldal, képközpontú arculat, közösségi jelenlét.", ogTitle: "Kreatív marketing" },
  { slug: "marketing-vendeglatas-cegeknek", title: "Vendéglátó marketing éttermeknek és kávézóknak — G2A Marketing", description: "Helyi, vizuális marketing vendéglátóhelyeknek: közösségi média, Google-jelenlét, foglalás és rendelés.", ogTitle: "Vendéglátó marketing" },
  { slug: "marketing-webshopoknak", title: "Webshop marketing és e-commerce hirdetés — G2A Marketing", description: "Konverzió-fókuszú webshop marketing: Google és Meta hirdetés, termék-feed, SEO, CRO. Mérhető ROAS.", ogTitle: "Webshop marketing" },
  { slug: "marketing-szolgaltato-cegeknek", title: "Marketing szolgáltató és ipari cégeknek — G2A Marketing", description: "B2B marketing szolgáltató és ipari cégeknek: hiteles weboldal, szakmai tartalom, leadgenerálás.", ogTitle: "Marketing szolgáltató cégeknek" },
  { slug: "marketing-kozlekedesi-cegeknek", title: "Közlekedési és közszolgáltatói marketing — G2A Marketing", description: "Közérthető, megbízható kommunikáció közlekedési és közszolgáltató vállalatoknak: tájékoztatás, közösségi média, arculat.", ogTitle: "Közlekedési marketing" },
];

/** Flatten all 32 routes for the translation pass. */
export function allRoutes() {
  return [
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
}
