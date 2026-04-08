import { useEffect } from "react";

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaJson?: string;
  noIndex?: boolean;
}

export default function SeoHead({
  title = "G2A Marketing – Adatvezérelt Online Marketing Ügynökség",
  description = "A G2A Marketing adatvezérelt, kreatív online marketing ügynökség Pécsről. Keresőoptimalizálás, hirdetéskezelés, webfejlesztés, közösségi média és arculattervezés.",
  ogTitle,
  ogDescription,
  ogImage = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png",
  canonicalUrl,
  schemaJson,
  noIndex = false,
}: SeoHeadProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set/update meta tag
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
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', ogTitle || title);
    setMeta('meta[name="twitter:description"]', ogDescription || description);
    setMeta('meta[name="twitter:image"]', ogImage);

    if (noIndex) {
      setMeta('meta[name="robots"]', "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "index, follow");
    }

    // Canonical
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
    }

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
  }, [title, description, ogTitle, ogDescription, ogImage, canonicalUrl, schemaJson, noIndex]);

  return null;
}
