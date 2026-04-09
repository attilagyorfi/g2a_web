import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, Gift } from "lucide-react";
import { Link } from "wouter";

const STORAGE_KEY = "g2a_exit_popup_shown";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const show = useCallback(() => {
    if (dismissed) return;
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) return;
    setVisible(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, [dismissed]);

  useEffect(() => {
    // Exit intent: mouse leaves viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) show();
    };

    // Fallback: show after 45s of inactivity
    const inactivityTimer = setTimeout(show, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(inactivityTimer);
    };
  }, [show]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.65)",
          zIndex: 99998,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
        width: "min(560px, 92vw)",
        backgroundColor: "var(--g2a-bg-2)",
        border: "1px solid var(--g2a-border)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        animation: "slideInUp 0.35s ease",
      }}>
        {/* Amber top bar */}
        <div style={{ height: "4px", background: "var(--g2a-amber)", width: "100%" }} />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--g2a-text-muted)",
            padding: "0.25rem",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}
        >
          <X size={18} />
        </button>

        <div style={{ padding: "2.5rem 2rem 2rem" }}>
          {/* Icon */}
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "var(--g2a-amber-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}>
            <Gift size={26} style={{ color: "var(--g2a-amber)" }} />
          </div>

          {/* Headline */}
          <div style={{
            fontSize: "0.75rem",
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--g2a-amber)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "0.625rem",
          }}>
            Mielőtt elmész...
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.35rem, 3vw, 1.75rem)",
            color: "var(--g2a-text-primary)",
            lineHeight: 1.25,
            marginBottom: "0.875rem",
          }}>
            Kérd az ingyenes marketing auditot!
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.95rem",
            color: "var(--g2a-text-secondary)",
            lineHeight: 1.65,
            marginBottom: "1.75rem",
          }}>
            Derítsd ki, hol veszíted el az ügyfeleidet – és mit tehetsz ellene. A G2A csapata 48 órán belül személyre szabott javaslatokat küld.
          </p>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.75rem" }}>
            {[
              "Ingyenes, kötelezettség nélkül",
              "48 órán belüli visszajelzés",
              "Konkrét, megvalósítható javaslatok",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem", color: "var(--g2a-text-secondary)", fontFamily: "Inter, sans-serif" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--g2a-amber)", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <Link
              href="/ingyenes-audit"
              onClick={handleDismiss}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--g2a-amber)",
                color: "#0a0a0a",
                borderRadius: "10px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
                flex: "1 1 auto",
                justifyContent: "center",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}
            >
              Ingyenes audit kérése <ArrowRight size={15} />
            </Link>
            <button
              onClick={handleDismiss}
              style={{
                padding: "0.75rem 1.25rem",
                background: "none",
                border: "1px solid var(--g2a-border)",
                borderRadius: "10px",
                color: "var(--g2a-text-muted)",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--g2a-text-primary)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--g2a-text-muted)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--g2a-text-muted)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--g2a-border)"; }}
            >
              Nem érdekel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
