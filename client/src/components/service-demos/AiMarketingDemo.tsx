import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, User } from "lucide-react";

/**
 * Mini AI chat UI fragment — user prompts, assistant streams 3 SEO blog ideas.
 * Lives in the hero's right side. ~420px wide, ~360px tall.
 */
export default function AiMarketingDemo() {
  const reduce = useReducedMotion();

  const aiResponse = [
    "1. A 2025-ös SEO checklist B2B cégeknek",
    "2. AI-vezérelt kulcsszó-kutatás 30 perc alatt",
    "3. Lokális SEO: hogyan kerülj a térképre",
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
          "radial-gradient(120% 80% at 0% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px rgba(20,184,166,0.18)",
        overflow: "hidden",
      }}
    >
      {/* Soft glow blob behind */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 220,
          height: 220,
          background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 65%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Header chip */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 999,
            background: "rgba(20,184,166,0.14)",
            border: "1px solid rgba(20,184,166,0.32)",
            color: "var(--g2a-brand-teal)",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.66rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <Sparkles size={10} /> AI · idea
        </span>
        <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "#666", marginLeft: "auto" }}>
          gpt-4o · 0.8s
        </span>
      </div>

      {/* User message */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            flexShrink: 0,
          }}
        >
          <User size={13} />
        </span>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--g2a-tile-border)",
            borderRadius: 10,
            padding: "8px 12px",
            color: "var(--g2a-text-primary)",
            fontSize: "0.82rem",
            fontFamily: "Geist, sans-serif",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          Generálj 3 SEO blog cikk ötletet B2B cégeknek
        </div>
      </motion.div>

      {/* AI response */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #14B8A6, #0D9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(20,184,166,0.4)",
          }}
        >
          <Sparkles size={12} />
        </span>
        <div
          style={{
            background: "rgba(20,184,166,0.06)",
            border: "1px solid rgba(20,184,166,0.18)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "var(--g2a-text-primary)",
            fontSize: "0.82rem",
            fontFamily: "Geist, sans-serif",
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {aiResponse.map((line, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 1.0 + i * 0.35 }}
              style={{ marginBottom: i < aiResponse.length - 1 ? 4 : 0 }}
            >
              {line}
            </motion.div>
          ))}
          {!reduce && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                display: "inline-block",
                width: 7,
                height: 13,
                background: "var(--g2a-brand-teal)",
                marginLeft: 2,
                marginTop: 4,
                verticalAlign: "middle",
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
