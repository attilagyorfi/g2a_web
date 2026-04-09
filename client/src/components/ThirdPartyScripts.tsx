import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Dynamically injects GTM, GA4, and Crisp chat scripts
 * based on values stored in site_settings table.
 * Keys: gtm_id, ga4_id, crisp_website_id
 */
export default function ThirdPartyScripts() {
  const { data: settings } = trpc.content.siteSettings.useQuery();

  useEffect(() => {
    if (!settings) return;

    const get = (key: string) =>
      settings.find((s: { key: string; value: string | null }) => s.key === key)?.value?.trim() || "";

    const gtmId = get("gtm_id");
    const ga4Id = get("ga4_id");
    const crispId = get("crisp_website_id");

    // ── Google Tag Manager ──────────────────────────────────────────────────
    if (gtmId && !document.getElementById("gtm-script")) {
      // dataLayer init
      const dlScript = document.createElement("script");
      dlScript.id = "gtm-datalayer";
      dlScript.textContent = `window.dataLayer = window.dataLayer || []; window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`;
      document.head.appendChild(dlScript);

      const script = document.createElement("script");
      script.id = "gtm-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);

      // noscript iframe
      const noscript = document.createElement("noscript");
      noscript.id = "gtm-noscript";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = "0";
      iframe.width = "0";
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
    }

    // ── Google Analytics 4 (standalone, without GTM) ────────────────────────
    if (ga4Id && !gtmId && !document.getElementById("ga4-script")) {
      const script = document.createElement("script");
      script.id = "ga4-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(script);

      const init = document.createElement("script");
      init.id = "ga4-init";
      init.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${ga4Id}');`;
      document.head.appendChild(init);
    }

    // ── Crisp Chat ──────────────────────────────────────────────────────────
    if (crispId && !document.getElementById("crisp-script")) {
      const script = document.createElement("script");
      script.id = "crisp-script";
      script.textContent = `
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = "${crispId}";
        (function() {
          var d = document;
          var s = d.createElement("script");
          s.src = "https://client.crisp.chat/l.js";
          s.async = 1;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();
      `;
      document.head.appendChild(script);
    }
  }, [settings]);

  return null;
}
