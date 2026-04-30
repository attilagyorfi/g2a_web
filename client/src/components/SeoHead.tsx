import { useEffect } from "react";
import { useLanguage, parseLangPath, buildLangPath } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

const SITE_ORIGIN = "https://g2amarketing.hu";

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  /** If omitted, the canonical is auto-derived from current URL + active language. */
  canonicalUrl?: string;
  schemaJson?: string;
  noIndex?: boolean;
}

export default function SeoHead({
  title = "G2A Marketing – Adatvezérelt Online Marketing Ügynökség",
  description = "A G2A Marketing adatvezérelt, kreatív online marketing ügynökség Pécsről. Keresőoptimalizálás, hirdetéskezelés, webfejlesztés, közösségi média és arculattervezés.",
  ogTitle,
  ogDescription,
  // OG image — Cloudinary-transformed to 1200x630 (Facebook/LinkedIn recommended)
  // with dark background + center-fitted G2A logo. Falls back to plain logo if
  // Cloudinary ever returns an error (the URL still resolves to the source PNG).
  ogImage = "https://res.cloudinary.com/dzh1unb6d/image/upload/w_1200,h_630,c_pad,b_rgb:0a0a0a,q_auto,f_auto/g2a/og/default-logo.png",
  canonicalUrl,
  schemaJson,
  noIndex = false,
}: SeoHeadProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = title;

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
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:type"]', "website");
    setMeta('meta[property="og:locale"]', lang === "hu" ? "hu_HU" : lang === "en" ? "en_US" : "zh_CN");
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', ogTitle || title);
    setMeta('meta[name="twitter:description"]', ogDescription || description);
    setMeta('meta[name="twitter:image"]', ogImage);

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
    if (schemaJson) {
      let script = document.querySelector('script[data-seo-schema]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-seo-schema", "true");
        document.head.appendChild(script);
      }
      script.textContent = schemaJson;
    }
  }, [title, description, ogTitle, ogDescription, ogImage, canonicalUrl, schemaJson, noIndex, lang]);

  return null;
}
