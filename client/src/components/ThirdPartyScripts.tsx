import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT ?? "";
const ANALYTICS_WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID ?? "";
// Plausible domain (use your site domain; defaults to g2amarketing.hu in prod)
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? "";

/**
 * Defer third-party analytics/chat scripts (GTM, GA4, Meta Pixel,
 * Crisp, Plausible, Umami) until the first user interaction OR a short
 * idle window — whichever comes first. These tags are heavy
 * (fbevents.js ≈ 370KB, gtm.js ≈ 109KB) and contributed the bulk of
 * the main-thread Script Evaluation time / TBT on the homepage, yet
 * none of them are needed for the first paint. Loading them lazily
 * keeps the render-critical path lean without the chunk-load race the
 * vendor manualChunks split caused (see vite.config.ts).
 *
 * The idle fallback (~3s) guarantees bounce-and-leave visitors are
 * still counted; the interaction triggers cover everyone who engages
 * sooner. The Google Search Console verification <meta> is exempt — it
 * carries no JS cost and must be in <head> early for SEO.
 */
function whenReady(run: () => void): () => void {
  let fired = false;
  const fire = () => {
    if (fired) return;
    fired = true;
    cleanup();
    run();
  };
  const events: Array<keyof WindowEventMap> = [
    "pointerdown",
    "keydown",
    "touchstart",
    "scroll",
  ];
  const opts = { once: true, passive: true } as const;
  events.forEach((e) => window.addEventListener(e, fire, opts));
  // Idle fallback: a soft 3s timer, then requestIdleCallback so we
  // don't compete with any late hydration work.
  const timer = window.setTimeout(() => {
    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void })
        .requestIdleCallback(fire, { timeout: 1500 });
    } else {
      fire();
    }
  }, 3000);

  function cleanup() {
    events.forEach((e) => window.removeEventListener(e, fire));
    window.clearTimeout(timer);
  }
  return cleanup;
}

export default function ThirdPartyScripts() {
  const [location] = useLocation();
  const { data: settings } = trpc.content.siteSettings.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // `armed` flips true on the first interaction / idle tick. Until then
  // no analytics script is injected.
  const [armed, setArmed] = useState(false);
  const gateSet = useRef(false);

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    if (gateSet.current) return;
    gateSet.current = true;
    const cleanup = whenReady(() => setArmed(true));
    return cleanup;
  }, [location]);

  // Cookieless analytics (Plausible / Umami) — also gated behind the
  // interaction/idle trigger.
  useEffect(() => {
    if (!armed) return;
    if (location.startsWith("/admin")) return;

    if (PLAUSIBLE_DOMAIN && !document.getElementById("g2a-plausible")) {
      const script = document.createElement("script");
      script.id = "g2a-plausible";
      script.defer = true;
      script.src = "https://plausible.io/js/script.js";
      script.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
      document.head.appendChild(script);
    }

    if (ANALYTICS_ENDPOINT && ANALYTICS_WEBSITE_ID && !document.getElementById("g2a-umami")) {
      const script = document.createElement("script");
      script.id = "g2a-umami";
      script.defer = true;
      script.src = `${ANALYTICS_ENDPOINT.replace(/\/$/, "")}/umami`;
      script.setAttribute("data-website-id", ANALYTICS_WEBSITE_ID);
      document.head.appendChild(script);
    }
  }, [armed, location]);

  // Google Search Console verification meta tag — NOT gated. It's a
  // <meta>, not a script, and must be present early for SEO.
  useEffect(() => {
    if (!settings) return;
    if (location.startsWith("/admin")) return;
    const map: Record<string, string> = {};
    (settings as Array<{ key: string; value: string }>).forEach((s) => {
      map[s.key] = (s.value ?? "").trim();
    });
    const gscRaw = map["google_search_console"];
    if (!gscRaw) return;
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
  }, [settings, location]);

  // Heavy tag managers / pixels / chat — gated behind `armed`.
  useEffect(() => {
    if (!armed) return;
    if (!settings) return;
    if (location.startsWith("/admin")) return;

    const map: Record<string, string> = {};
    (settings as Array<{ key: string; value: string }>).forEach((s) => {
      map[s.key] = (s.value ?? "").trim();
    });

    const crispId = map["crisp_website_id"];
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

    const gtmId = map["gtm_id"];
    if (gtmId && !document.getElementById("gtm-script")) {
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","${gtmId}");`;
      document.head.appendChild(script);
    }

    // GA4 standalone (skip if GTM injects the same measurement ID).
    const ga4Id = map["ga4_id"];
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

    // Meta Pixel: inject once, then fire PageView on SPA route change.
    const pixelId = map["meta_pixel_id"];
    if (pixelId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (!document.getElementById("meta-pixel")) {
        const init = document.createElement("script");
        init.id = "meta-pixel";
        init.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${pixelId}");fbq("track","PageView");`;
        document.head.appendChild(init);
      } else if (typeof w.fbq === "function") {
        try { w.fbq("track", "PageView"); } catch { /* swallow */ }
      }
    }
  }, [armed, settings, location]);

  return null;
}
