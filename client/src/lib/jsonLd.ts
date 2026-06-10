/**
 * Schema.org JSON-LD generators for the public site.
 *
 * Strategy:
 *   1. EVERY public page emits a base graph: Organization + LocalBusiness +
 *      WebSite. These are the entities Google indexes for the whole site;
 *      the company-card panel and the sitelinks searchbox come from here.
 *   2. Page-specific entities (Article, Service, BreadcrumbList, FAQPage,
 *      AboutPage…) are appended to the same `@graph` so search engines
 *      can connect them via @id references.
 *
 * Usage from a page:
 *   <SeoHead schemaJson={renderJsonLd([servicePageSchema(...)])} ... />
 *
 * The base graph is emitted automatically inside SeoHead — pages only need
 * to pass their additional entities. If a page passes nothing, the base
 * graph is still emitted.
 */

const SITE_URL = "https://g2amarketing.hu";

// ─── Stable @id refs (let entities cross-reference each other) ───────────
const ORG_ID = `${SITE_URL}/#organization`;
const LOCALBIZ_ID = `${SITE_URL}/#localbusiness`;
const SITE_ID = `${SITE_URL}/#website`;

// Company facts — kept in one place. Update if registry data changes.
const COMPANY = {
  legalName: "G2A Marketing Bt.",
  brandName: "G2A Marketing",
  founded: "2022",
  registrationNumber: "02-06-075160",
  taxId: "32070325-1-02",
  street: "Péter utca 1. fszt. 1.",
  postalCode: "7625",
  city: "Pécs",
  country: "HU",
  // Approximate centroid of Pécs centre (Belváros). Refine if the office
  // moves; affects only "near me" map results.
  latitude: 46.0727,
  longitude: 18.2330,
  email: "info@g2amarketing.hu",
  phone: "+36-30-190-2575",
  logoUrl:
    "https://res.cloudinary.com/dzh1unb6d/image/upload/w_512,h_512,c_pad,b_rgb:0a0a0a,q_auto,f_auto/g2a/og/default-logo.png",
  social: [
    "https://www.facebook.com/g2amarketing",
    "https://www.youtube.com/g2amarketing",
    "https://www.linkedin.com/company/g2a-marketing/",
  ],
};

// ─── Shared base graph — Organization + LocalBusiness + WebSite ───────────
function organization() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.brandName,
    legalName: COMPANY.legalName,
    foundingDate: COMPANY.founded,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: COMPANY.logoUrl,
      width: 512,
      height: 512,
    },
    image: COMPANY.logoUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: "customer service",
      availableLanguage: ["Hungarian", "English", "Chinese"],
      areaServed: ["HU", "EU", "CN"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.country,
    },
    identifier: [
      { "@type": "PropertyValue", propertyID: "VATID", value: COMPANY.taxId },
      {
        "@type": "PropertyValue",
        propertyID: "company-registration",
        value: COMPANY.registrationNumber,
      },
    ],
    sameAs: COMPANY.social,
  };
}

function localBusiness() {
  // Address + geo are kept because the company registration legally
  // attaches to a Hungarian street address (it's in the Impressum
  // anyway) and the local SEO signal helps "marketing ügynökség Pécs"
  // queries surface us. We deliberately DO NOT emit
  // `openingHoursSpecification` — that implies the office is
  // walk-in-friendly, which it isn't. All client work is remote /
  // scheduled via Calendly; there's no visitor reception.
  return {
    "@type": "ProfessionalService",
    "@id": LOCALBIZ_ID,
    name: COMPANY.brandName,
    image: COMPANY.logoUrl,
    url: SITE_URL,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY.latitude,
      longitude: COMPANY.longitude,
    },
    parentOrganization: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "Hungary" },
      { "@type": "Place", name: "European Union" },
    ],
    sameAs: COMPANY.social,
  };
}

function website(lang: "hu" | "en" | "zh") {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: COMPANY.brandName,
    inLanguage: lang === "hu" ? "hu" : lang === "en" ? "en" : "zh-CN",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Page-specific entity factories ───────────────────────────────────────

/** A marketing-service offering page (e.g. /szolgaltatasok/seo). */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string[];
}) {
  return {
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType ?? "Marketing services",
    provider: { "@id": ORG_ID },
    areaServed: (opts.areaServed ?? ["Hungary", "European Union"]).map(
      (name) => ({ "@type": "Place", name }),
    ),
  };
}

/** A blog or news article. Use for /hirek/[slug] and other long-form posts. */
export function articleSchema(opts: {
  headline: string;
  description?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string; // ISO 8601
  modifiedAt?: string;
  authorName?: string;
  /** Defaults to "BlogPosting"; pass "TechArticle" for technical posts. */
  type?: "BlogPosting" | "TechArticle" | "Article";
  /**
   * BCP-47 language tag the article is written in ("hu", "en", "zh").
   * Defaults to "hu". Google uses this to confirm the page-language
   * signal — must match the <html lang> and the actual content.
   */
  inLanguage?: "hu" | "en" | "zh";
  /**
   * Word count of the article body. Lifts the chance of being
   * surfaced for "long-form" article rich-result patterns and helps
   * estimated reading time in some SERP treatments.
   */
  wordCount?: number;
  /**
   * Plain-text body of the article (HTML tags stripped). Pass when
   * the article content is fully available client-side; helps Google
   * extract the article body without re-rendering. Truncated at 5000
   * chars to keep the JSON envelope tight.
   */
  articleBody?: string;
  /** Optional keyword string (comma-separated). */
  keywords?: string;
}) {
  const item: Record<string, unknown> = {
    "@type": opts.type ?? "BlogPosting",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    publisher: { "@id": ORG_ID },
    inLanguage: opts.inLanguage ?? "hu",
  };
  if (opts.imageUrl) item.image = opts.imageUrl;
  if (opts.publishedAt) item.datePublished = opts.publishedAt;
  if (opts.modifiedAt) item.dateModified = opts.modifiedAt;
  if (opts.authorName) {
    item.author = { "@type": "Person", name: opts.authorName };
  } else {
    item.author = { "@id": ORG_ID };
  }
  if (opts.wordCount && opts.wordCount > 0) item.wordCount = opts.wordCount;
  if (opts.articleBody) item.articleBody = opts.articleBody.slice(0, 5000);
  if (opts.keywords) item.keywords = opts.keywords;
  return item;
}

/** Q&A list — pair with FAQ accordion sections (industry pages, service pages). */
export function faqPageSchema(faqs: Array<{ q: string; a: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/** A breadcrumb trail. Pass items as { name, url } in order from root to leaf. */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Generic about-page wrapper — usable on /rolunk. */
export function aboutPageSchema(opts: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@type": "AboutPage",
    "@id": opts.url,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    about: { "@id": ORG_ID },
  };
}

// ─── Public render helper ────────────────────────────────────────────────
/**
 * Render the full @graph: base entities (org + localbiz + website) + any
 * page-specific entities passed in. Returns a JSON string ready to be set
 * as the `<script type="application/ld+json">` body.
 *
 * Pass `null`/`undefined` items in the array; they are filtered out, so
 * factories like `faqPageSchema(maybeEmpty)` can return null without the
 * caller worrying.
 */
export function renderJsonLd(
  pageEntities: Array<unknown | null | undefined> = [],
  lang: "hu" | "en" | "zh" = "hu",
): string {
  const graph = [
    organization(),
    localBusiness(),
    website(lang),
    ...pageEntities.filter((x) => x != null),
  ];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
