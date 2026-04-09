import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Zap, X } from "lucide-react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!dismissed) {
        setVisible(window.scrollY > 400);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      animation: "fadeInUp 0.3s ease",
    }}>
      <Link href="/ingyenes-audit" style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        background: "var(--g2a-amber)",
        color: "#000",
        padding: "0.875rem 1.5rem",
        borderRadius: "3rem",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: "0.875rem",
        textDecoration: "none",
        boxShadow: "0 8px 32px var(--g2a-amber-glow)",
        transition: "all 0.2s ease",
        letterSpacing: "0.01em",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.background = "var(--g2a-amber-hover)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(245,158,11,0.5)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.background = "var(--g2a-amber)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px var(--g2a-amber-glow)";
        }}
      >
        <Zap size={16} />
        Ingyenes Audit
      </Link>
      <button
        onClick={() => { setDismissed(true); setVisible(false); }}
        style={{
          background: "var(--g2a-bg-card)",
          border: "1px solid var(--g2a-border)",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--g2a-text-muted)",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-amber)"; (e.currentTarget as HTMLElement).style.color = "var(--g2a-amber)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-border)"; (e.currentTarget as HTMLElement).style.color = "var(--g2a-text-muted)"; }}
        title="Bezárás"
      >
        <X size={14} />
      </button>
    </div>
  );
}
