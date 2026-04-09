import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUp } from "lucide-react";

// Scroll to top on route change
export function RouteScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return null;
}

// Back-to-top floating button
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Vissza a tetejére"
      aria-label="Vissza a tetejére"
      style={{
        position: "fixed",
        bottom: "9rem",
        right: "1.5rem",
        zIndex: 1001,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        backgroundColor: "var(--g2a-bg-card)",
        border: "1px solid var(--g2a-border)",
        color: "var(--g2a-text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        transition: "all 0.2s ease",
        animation: "fadeInUp 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--g2a-amber)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-amber)";
        (e.currentTarget as HTMLElement).style.color = "#000";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--g2a-bg-card)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-border)";
        (e.currentTarget as HTMLElement).style.color = "var(--g2a-text-secondary)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <ArrowUp size={18} />
    </button>
  );
}
