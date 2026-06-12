import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT ?? "";
const ANALYTICS_WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID ?? "";
// Plausible domain (use your site domain; defaults to g2amarketing.hu in prod)
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? "";

export default function ThirdPartyScripts() {
  const [location] = useLocation();
  const { data: settings } = trpc.content.siteSettings.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Inject analytics scripts ONCE on mount (don't depend on tRPC settings)
  useEffect(() => {
    if (location.startsWith("/admin")) return;

    // Plausible (preferred — privacy-friendly, no cookies)
    if (PLAUSIBLE_DOMAIN && !document.getElementById("g2a-plausible")) {
      const script = document.createElement("script");
      script.id = "g2a-plausible";
      script.defer = true;
      script.src = "https://plausible.io/js/script.js";
      script.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
      document.head.appendChild(script);
    }

    // Umami (alternative — also privacy-friendly)
    if (ANALYTICS_ENDPOINT && ANALYTICS_WEBSITE_ID && !document.getElementById("g2a-umami")) {
      const script = document.createElement("script");
      script.id = "g2a-umami";
      script.defer = true;
      script.src = `${ANALYTICS_ENDPOINT.replace(/\/$/, "")}/umami`;
      script.setAttribute("data-website-id", ANALYTICS_WEBSITE_ID);
      document.head.appendChild(script);
    }
  }, [location]);

  useEffect(() => {
    if (!settings) return;
    if (location.startsWith("/admin")) return;

    const settingsMap: Record<string, string> = {};
    (settings as Array<{ key: string; value: string }>).forEach(s => {
      settingsMap[s.key] = (s.value ?? "").trim();
    });

    const crispId = settingsMap["crisp_website_id"];
    if (crispId && !document.getElementById("crisp-script")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).$crisp = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).CRISP_WEBSITE_ID = crispId;
      const script = document.createElement("script");
      script.id = "crisp-script";
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const gtmId = settingsMap["gtm_id"];
    if (gtmId && !document.getElementById("gtm-script")) {
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","${gtmId}");`;
      document.head.appendChild(script);
    }

    // ─── GA4 — standalone gtag.js loader. Skip if GTM is already
    // injecting the same measurement ID (GTM lifts the GA4 tag for
    // you), but a lot of clients use GA4 directly without GTM —
    // that's what this block supports.
    const ga4Id = settingsMap["ga4_id"];
    if (ga4Id && !gtmId && !document.getElementById("ga4-loader")) {
      const loader = document.createElement("script");
      loader.id = "ga4-loader";
      loader.async = true;
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
      document.head.appendChild(loader);
      const init = document.createElement("script");
      init.id = "ga4-init";
      init.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${ga4Id}");`;
      document.head.appendChild(init);
    }

    // ─── Meta (Facebook) Pixel. Standard fbq snippet with PageView.
    // SPA route changes are picked up by the useEffect dependency on
    // `location` — every navigation that crosses a route fires a new
    // PageView through fbq("track", "PageView") below.
    const pixelId = settingsMap["meta_pixel_id"];
    if (pixelId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (!document.getElementById("meta-pixel")) {
        const init = document.createElement("script");
        init.id = "meta-pixel";
        init.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${pixelId}");fbq("track","PageView");`;
        document.head.appendChild(init);
      } else if (typeof w.fbq === "function") {
        // Already loaded — fire a manual PageView on SPA route change.
        try { w.fbq("track", "PageView"); } catch { /* swallow */ }
      }
    }

    // ─── Google Search Console site-verification meta tag. The admin
    // can paste either the full <meta> snippet or just the content
    // value — we normalise.
    const gscRaw = settingsMap["google_search_console"];
    if (gscRaw) {
      const contentMatch = gscRaw.match(/content=["']([^"']+)["']/);
      const content = contentMatch?.[1] ?? gscRaw.replace(/^google-site-verification=/i, "");
      const existing = document.querySelector('meta[name="google-site-verification"]');
      if (!existing) {
        const m = document.createElement("meta");
        m.setAttribute("name", "google-site-verification");
        m.setAttribute("content", content);
        document.head.appendChild(m);
      } else if (existing.getAttribute("content") !== content) {
        existing.setAttribute("content", content);
      }
    }
  }, [settings, location]);

  return null;
}
