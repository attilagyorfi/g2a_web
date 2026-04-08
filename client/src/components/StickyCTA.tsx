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
        background: "#e91130",
        color: "#ffffff",
        padding: "0.875rem 1.5rem",
        borderRadius: "3rem",
        fontFamily: "Roboto Mono, monospace",
        fontWeight: 600,
        fontSize: "0.875rem",
        textDecoration: "none",
        boxShadow: "0 8px 32px rgba(233, 17, 48, 0.4)",
        transition: "all 0.2s ease",
        letterSpacing: "0.02em",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(233, 17, 48, 0.5)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(233, 17, 48, 0.4)";
        }}
      >
        <Zap size={16} />
        Ingyenes Audit
      </Link>
      <button
        onClick={() => { setDismissed(true); setVisible(false); }}
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
        }}
        title="Bezárás"
      >
        <X size={14} />
      </button>
    </div>
  );
}
