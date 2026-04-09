import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("g2a_cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("g2a_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("g2a_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      backgroundColor: "var(--g2a-bg-card)", borderTop: "1px solid var(--g2a-border)",
      padding: "1.25rem 1.5rem",
    }}>
      <div className="g2a-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
        <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", margin: 0, flex: 1 }}>
          Weboldalunk sütiket (cookie-kat) használ a jobb felhasználói élmény érdekében.{" "}
          <Link href="/adatvedelmi-iranyelvek" style={{ color: "var(--g2a-amber)", textDecoration: "underline" }}>
            Adatvédelmi irányelvek
          </Link>
        </p>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={decline} style={{ background: "none", border: "1px solid var(--g2a-border)", color: "var(--g2a-text-secondary)", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem", fontFamily: "Roboto Mono, monospace" }}>
            Elutasítom
          </button>
          <button onClick={accept} className="g2a-btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
            Elfogadom
          </button>
          <button onClick={decline} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "0.25rem" }}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
