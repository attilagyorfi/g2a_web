import { motion, useReducedMotion } from "framer-motion";
import { Type, Palette } from "lucide-react";

/**
 * Mini brand design system preview — colour palette + type sample + logo lockup.
 */
export default function BrandDesignDemo() {
  const reduce = useReducedMotion();

  const palette = [
    { name: "Primary", hex: "var(--g2a-brand-teal)" },
    { name: "Deep", hex: "var(--g2a-brand-teal-dark)" },
    { name: "Ink", hex: "#0F172A" },
    { name: "Neutral", hex: "#A1A1AA" },
    { name: "Light", hex: "#F5F5F4" },
  ];

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        padding: "1.25rem",
        borderRadius: 18,
        background:
          "radial-gradient(120% 80% at 100% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px rgba(20,184,166,0.18)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -40,
          width: 220,
          height: 220,
          background: "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 65%)",
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo lockup */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: "relative",
          padding: "16px 14px",
          borderRadius: 12,
          background: "var(--g2a-tile)",
          border: "1px solid var(--g2a-tile-border)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg, #14B8A6, #0D9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "Geist Mono, monospace",
            fontWeight: 800,
            fontSize: "0.95rem",
            boxShadow: "0 0 14px rgba(20,184,166,0.4)",
          }}
        >
          G2A
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", letterSpacing: "-0.01em" }}>
            G2A Marketing
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Logo lockup · primary
          </div>
        </div>
      </motion.div>

      {/* Color palette */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ position: "relative", marginBottom: 12 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <Palette size={11} style={{ color: "var(--g2a-brand-teal)" }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Színpaletta
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
          {palette.map((p, i) => (
            <motion.div
              key={p.hex}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
            >
              <div
                style={{
                  height: 38,
                  borderRadius: 6,
                  background: p.hex,
                  border: "1px solid var(--g2a-tile-border)",
                  boxShadow: i === 0 ? "0 0 12px rgba(20,184,166,0.4)" : undefined,
                }}
              />
              <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.52rem", color: "var(--g2a-text-muted)", marginTop: 3, textAlign: "center" }}>
                {p.hex.toLowerCase()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Type specimen */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{
          position: "relative",
          padding: "12px 14px",
          borderRadius: 10,
          background: "rgba(20,184,166,0.05)",
          border: "1px solid rgba(20,184,166,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Type size={11} style={{ color: "var(--g2a-brand-teal)" }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Tipográfia · Geist
          </span>
        </div>
        <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--g2a-text-primary)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Brand Stories
        </div>
        <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: "0.78rem", color: "var(--g2a-text-secondary)", marginTop: 2 }}>
          Erős vizuális identitás minden részletében.
        </div>
      </motion.div>
    </div>
  );
}
