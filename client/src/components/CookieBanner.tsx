/**
 * Cookie consent banner.
 *
 * Current 3rd-party tooling on g2amarketing.hu (2026-04):
 *  - **Plausible analytics** — cookie-free by design, no consent legally required (we still mention it for transparency)
 *  - **Calendly widget** — uses cookies WHEN LOADED (audit thank-you + /kapcsolat). Loaded only on those pages.
 *  - **Crisp chat / GTM** — only if admin enables them in /admin/settings; otherwise not loaded.
 *  - **Cloudinary / Resend / DeepL / OpenAI** — server-side or stateless image CDN, no visitor cookies.
 *  - **Manus OAuth session cookie** — functional (admin login), exempt from consent rules.
 *
 * Storage key: `g2a_cookie_consent` = "accepted" | "declined".
 * Decline still allows the site to function fully — we don't load Crisp/GTM
 * without consent. Plausible runs regardless (it has no cookies).
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("g2a_cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("g2a_cookie_consent", "accepted");
    setVisible(false);
    // Future: dispatch an event so ThirdPartyScripts can lazy-load Crisp/GTM
    window.dispatchEvent(new CustomEvent("g2a:cookie-consent", { detail: "accepted" }));
  };

  const decline = () => {
    localStorage.setItem("g2a_cookie_consent", "declined");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("g2a:cookie-consent", { detail: "declined" }));
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "1.25rem 1.5rem",
    }}>
      <div className="g2a-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
        <p style={{ color: "#b0b0b0", fontSize: "0.875rem", margin: 0, flex: 1, minWidth: 280, lineHeight: 1.55 }}>
          {t("cookie.message")}{" "}
          <Link href="/adatvedelmi-iranyelvek" style={{ color: "var(--g2a-brand-teal)", textDecoration: "underline" }}>
            {t("cookie.link")}
          </Link>
        </p>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={decline} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#b0b0b0", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem", fontFamily: "Geist Mono, monospace" }}>
            {t("cookie.decline")}
          </button>
          <button onClick={accept} className="g2a-btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
            {t("cookie.accept")}
          </button>
          <button onClick={decline} aria-label={t("cookie.close")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "0.25rem" }}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
