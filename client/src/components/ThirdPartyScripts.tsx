import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function ThirdPartyScripts() {
  const [location] = useLocation();
  const { data: settings } = trpc.content.siteSettings.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!settings) return;
    if (location.startsWith("/admin")) return;

    const settingsMap: Record<string, string> = {};
    (settings as Array<{ key: string; value: string }>).forEach(s => {
      settingsMap[s.key] = s.value;
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
  }, [settings, location]);

  return null;
}
