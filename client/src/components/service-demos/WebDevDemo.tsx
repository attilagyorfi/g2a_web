import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";

/**
 * Mini code editor + Lighthouse score widget.
 * Shows a JSX snippet with syntax highlighting + perf score badges.
 */
export default function WebDevDemo() {
  const reduce = useReducedMotion();

  // Pseudo-syntax-highlighted code lines (each piece styled separately)
  type Token = { text: string; color: string };
  const lines: Token[][] = [
    [{ text: "import ", color: "#c084fc" }, { text: "{ Hero }", color: "#e2e8f0" }, { text: " from ", color: "#c084fc" }, { text: '"./components"', color: "#86efac" }, { text: ";", color: "#94a3b8" }],
    [],
    [{ text: "export default function ", color: "#c084fc" }, { text: "Page", color: "#fbbf24" }, { text: "() {", color: "#e2e8f0" }],
    [{ text: "  return ", color: "#c084fc" }, { text: "<", color: "#94a3b8" }, { text: "Hero", color: "#fbbf24" }, { text: " ", color: "#e2e8f0" }, { text: "title", color: "#7dd3fc" }, { text: "=", color: "#94a3b8" }, { text: '"G2A"', color: "#86efac" }, { text: " ", color: "#e2e8f0" }, { text: "/>", color: "#94a3b8" }, { text: ";", color: "#94a3b8" }],
    [{ text: "}", color: "#e2e8f0" }],
  ];

  const scores = [
    { label: "Performance", value: 98 },
    { label: "Accessibility", value: 100 },
    { label: "SEO", value: 100 },
  ];

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        padding: "1rem 1.1rem 1.1rem",
        borderRadius: 18,
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(20,184,166,0.08), transparent 55%), rgba(15,15,17,0.85)",
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
          top: -50,
          right: -40,
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 65%)",
          filter: "blur(36px)",
          pointerEvents: "none",
        }}
      />

      {/* Editor header bar */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 10,
          marginBottom: 10,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444", "#fbbf24", "#10b981"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.7 }} />
          ))}
        </div>
        <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", color: "var(--g2a-text-muted)" }}>
          Page.tsx
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, color: "#10b981", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem" }}>
          <CheckCircle size={10} /> built
        </span>
      </div>

      {/* Code body */}
      <div
        style={{
          position: "relative",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.74rem",
          lineHeight: 1.7,
          marginBottom: 14,
        }}
      >
        {lines.map((tokens, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
            style={{ display: "flex", alignItems: "baseline", whiteSpace: "pre" }}
          >
            <span style={{ color: "#3a3a3a", width: 22, flexShrink: 0, userSelect: "none" }}>{i + 1}</span>
            <span>
              {tokens.length === 0 ? "\u00A0" : tokens.map((t, j) => (
                <span key={j} style={{ color: t.color }}>
                  {t.text}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Lighthouse-like score row */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          padding: "8px 10px",
          borderRadius: 10,
          background: "rgba(20,184,166,0.06)",
          border: "1px solid rgba(20,184,166,0.18)",
        }}
      >
        {scores.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: s.value >= 90 ? "#14B8A6" : "#fbbf24",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.58rem",
                color: "var(--g2a-text-muted)",
                marginTop: 2,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </motion.div>
        ))}
        <Zap
          size={11}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "var(--g2a-brand-teal)",
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}
