import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronUp } from "lucide-react";

export function RouteScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || location.startsWith("/admin")) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Vissza a tetejere"
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 998,
        width: "44px", height: "44px", borderRadius: "50%",
        backgroundColor: "var(--g2a-accent)", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(20,184,166,0.4)",
        transition: "transform 0.2s, box-shadow 0.2s", color: "#fff",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(20,184,166,0.6)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(20,184,166,0.4)";
      }}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
