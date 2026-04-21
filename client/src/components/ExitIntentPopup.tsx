import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, Link } from "wouter";
import { X } from "lucide-react";

export default function ExitIntentPopup() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    const dismissed = sessionStorage.getItem("exit_popup_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !triggered.current) {
          triggered.current = true;
          setVisible(true);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, 5000);
    return () => clearTimeout(timer);
  }, [location]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("exit_popup_dismissed", "1");
  };

  if (!visible || location.startsWith("/admin")) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={dismiss}>
      <div style={{ background: "var(--g2a-bg-2)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "2.5rem", maxWidth: "480px", width: "100%", position: "relative", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
        <button onClick={dismiss} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--g2a-text-secondary)", padding: "0.25rem" }}>
          <X size={20} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎯</div>
          <h3 style={{ color: "var(--g2a-text-primary)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>{t("popup.title")}</h3>
          <p style={{ color: "var(--g2a-text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
            Kérd az <strong style={{ color: "var(--g2a-amber)" }}>ingyenes marketing auditot</strong> és derítsd ki, hogyan növelheted bevételeidet 30%-kal!
          </p>
          <Link href="/ingyenes-audit" onClick={dismiss}>
            <span className="g2a-btn-primary" style={{ display: "inline-flex", marginBottom: "0.75rem" }}>{t("popup.cta")}</span>
          </Link>
          <div>
            <button onClick={dismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", textDecoration: "underline" }}>{t("popup.decline")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
