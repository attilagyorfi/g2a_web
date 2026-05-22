/**
 * Newsletter signup popup.
 *
 * Trigger: 35 seconds on page OR 50% scroll, whichever first. After the
 * user dismisses (X / "not now" / outside click) we set
 * `newsletter_popup_dismissed=1` in **localStorage** so it doesn't
 * reappear on every page reload (sessionStorage was too aggressive — it
 * came back the next day on a fresh tab).
 *
 * Already-subscribed users get the same dismissal cookie via the
 * "Already subscribed" link, which sets the flag without showing the form.
 *
 * Hidden on /admin (no public chrome there) and on /hirlevel (the page
 * itself is the signup form). Doesn't compete with ExitIntentPopup —
 * if the audit popup fires first, the user can still see the newsletter
 * version after dismissing it (different CTA, different page goal).
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const STORAGE_KEY = "g2a_newsletter_popup_dismissed";
const DELAY_MS = 35_000;
const SCROLL_THRESHOLD = 0.5; // 50%

export default function NewsletterPopup() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    if (location.startsWith("/hirlevel")) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    let armed = true;

    const trigger = () => {
      if (!armed) return;
      armed = false;
      setVisible(true);
    };

    const timer = window.setTimeout(trigger, DELAY_MS);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const ratio = window.scrollY / max;
      if (ratio >= SCROLL_THRESHOLD) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      armed = false;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private browsing / quota — fine, popup just may reappear */
    }
  };

  if (!visible) return null;

  return (
    <div
      className="g2a-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--g2a-bg-2)",
          border: "1px solid var(--g2a-border)",
          borderRadius: "1rem",
          padding: "2.25rem",
          maxWidth: "520px",
          width: "100%",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={dismiss}
          aria-label={t("newsletter.popup.dismiss")}
          style={{
            position: "absolute",
            top: "0.85rem",
            right: "0.85rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--g2a-text-muted)",
            padding: "0.4rem",
            display: "flex",
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(20,184,166,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--g2a-brand-teal)",
              flexShrink: 0,
            }}
          >
            <Mail size={18} />
          </div>
          <h3
            id="newsletter-popup-title"
            style={{
              color: "var(--g2a-text-primary)",
              fontSize: "1.25rem",
              fontWeight: 700,
              margin: 0,
              fontFamily: "Geist, sans-serif",
            }}
          >
            {t("newsletter.popup.title")}
          </h3>
        </div>

        <p
          style={{
            color: "var(--g2a-text-secondary)",
            fontSize: "0.9rem",
            lineHeight: 1.55,
            marginTop: 0,
            marginBottom: "1.25rem",
          }}
        >
          {t("newsletter.popup.subtitle")}
        </p>

        <NewsletterForm
          variant="full"
          showBenefits={false}
          surface="transparent"
          onSuccess={() => {
            // Auto-dismiss after success — give the user a beat to read the
            // confirmation, then close.
            window.setTimeout(dismiss, 2500);
          }}
        />

        <button
          onClick={dismiss}
          style={{
            marginTop: "1rem",
            background: "none",
            border: "none",
            color: "var(--g2a-text-muted)",
            fontSize: "0.8rem",
            textDecoration: "underline",
            cursor: "pointer",
            display: "block",
            width: "100%",
            textAlign: "center",
            padding: 0,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {t("newsletter.popup.dismiss")}
        </button>
      </div>
    </div>
  );
}
