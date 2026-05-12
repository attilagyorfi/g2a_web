import { useEffect } from "react";
import { useLanguage, parseLangPath, buildLangPath } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { renderJsonLd } from "@/lib/jsonLd";
import { ogImageUrl } from "@/lib/cloudinary";

const SITE_ORIGIN = "https://g2amarketing.hu";

/**
 * Strip the brand-name suffix from a page title before rendering it onto the
 * OG image. Titles in this codebase commonly end with `" – G2A Marketing"`,
 * `" – G2A"`, or `" | G2A …"` — the brand is already the subtitle line on the
 * OG card, so repeating it as part of the headline is visually noisy and
 * wastes the limited title width.
 */
function stripBrandSuffix(title: string): string {
  return title.replace(/\s*[–|—-]\s*G2A.*$/i, "").trim();
}

/** Hardcoded last-resort OG image if Cloudinary isn't configured at build time. */
const FALLBACK_OG_IMAGE =
  "https://res.cloudinary.com/dzh1unb6d/image/upload/w_1200,h_630,c_pad,b_rgb:0a0a0a,q_auto,f_auto/g2a/og/default-logo.png";

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  /** If omitted, the canonical is auto-derived from current URL + active language. */
  canonicalUrl?: string;
  /**
   * Raw JSON-LD body — full override. Most callers should pass `pageSchemas`
   * instead so the base graph (Organization + LocalBusiness + WebSite) is
   * still emitted alongside the page-specific entities.
   */
  schemaJson?: string;
  /**
   * Page-specific Schema.org entities (Service, Article, FAQPage,
   * BreadcrumbList…) appended to the always-emitted base graph. Build them
   * with the helpers in `@/lib/jsonLd`.
   */
  pageSchemas?: Array<unknown | null | undefined>;
  noIndex?: boolean;
}

export default function SeoHead({
  title = "G2A Marketing – Adatvezérelt Online Marketing Ügynökség",
  description = "A G2A Marketing adatvezérelt, kreatív online marketing ügynökség Pécsről. Keresőoptimalizálás, hirdetéskezelés, webfejlesztés, közösségi média és arculattervezés.",
  ogTitle,
  ogDescription,
  // OG image — when not explicitly set, auto-render a per-page 1200×630 card
  // with the page title baked in (via Cloudinary text-overlay transforms).
  // Callers can still pass `ogImage` for cases where a hero photo / featured
  // image makes more sense (blog posts, case studies).
  ogImage,
  canonicalUrl,
  schemaJson,
  pageSchemas,
  noIndex = false,
}: SeoHeadProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = title;

    // Resolve the effective OG image:
    //  1. Explicit prop (e.g. a blog post's featured image)
    //  2. Cloudinary-generated card with the page title baked in
    //  3. Plain-logo fallback if Cloudinary isn't configured
    const resolvedOgImage =
      ogImage ?? (ogImageUrl(stripBrandSuffix(ogTitle || title), "G2A Marketing") || FALLBACK_OG_IMAGE);

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("[name=") ? "name" : "property";
        const val = selector.match(/["']([^"']+)["']/)?.[1] || "";
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', ogTitle || title);
    setMeta('meta[property="og:description"]', ogDescription || description);
    setMeta('meta[property="og:image"]', resolvedOgImage);
    setMeta('meta[property="og:type"]', "website");
    setMeta('meta[property="og:locale"]', lang === "hu" ? "hu_HU" : lang === "en" ? "en_US" : "zh_CN");
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', ogTitle || title);
    setMeta('meta[name="twitter:description"]', ogDescription || description);
    setMeta('meta[name="twitter:image"]', resolvedOgImage);

    if (noIndex) {
      setMeta('meta[name="robots"]', "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "index, follow");
    }

    // ─── Canonical + hreflang alternates ──────────────────────────────────
    // Strip any existing canonical/alternate links we manage
    document.querySelectorAll('link[data-seo-href]').forEach(el => el.remove());

    const { rest } = parseLangPath(window.location.pathname);
    const setLink = (rel: string, href: string, hreflang?: string) => {
      const link = document.createElement("link");
      link.setAttribute("rel", rel);
      link.setAttribute("href", href);
      if (hreflang) link.setAttribute("hreflang", hreflang);
      link.setAttribute("data-seo-href", "true");
      document.head.appendChild(link);
    };

    // Canonical: either explicit or derived from current lang + path
    const canonical = canonicalUrl || `${SITE_ORIGIN}${buildLangPath(lang, rest)}`;
    setLink("canonical", canonical);

    // hreflang alternates for all three languages + x-default (HU)
    const langs: Language[] = ["hu", "en", "zh"];
    for (const l of langs) {
      const hreflang = l === "hu" ? "hu" : l === "en" ? "en" : "zh-CN";
      setLink("alternate", `${SITE_ORIGIN}${buildLangPath(l, rest)}`, hreflang);
    }
    // x-default points to the HU version (primary market)
    setLink("alternate", `${SITE_ORIGIN}${buildLangPath("hu", rest)}`, "x-default");

    // JSON-LD Schema
    // Always emit at least the base graph (Organization + LocalBusiness +
    // WebSite). If the caller passes `schemaJson` (raw override), use that;
    // otherwise build the @graph from `pageSchemas` (or just the base if
    // pageSchemas is empty).
    const finalJson = schemaJson ?? renderJsonLd(pageSchemas ?? [], lang);
    let script = document.querySelector('script[data-seo-schema]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo-schema", "true");
      document.head.appendChild(script);
    }
    script.textContent = finalJson;
  }, [title, description, ogTitle, ogDescription, ogImage, canonicalUrl, schemaJson, pageSchemas, noIndex, lang]);

  return null;
}
