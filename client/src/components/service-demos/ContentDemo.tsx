import { motion, useReducedMotion } from "framer-motion";
import { FileText, Clock, Eye } from "lucide-react";

/**
 * Mini blog article preview card — title, excerpt, meta line, read time.
 */
export default function ContentDemo() {
  const reduce = useReducedMotion();

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
          "radial-gradient(120% 80% at 0% 100%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
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
          top: -40,
          right: -50,
          width: 220,
          height: 220,
          background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)",
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />

      {/* Featured image area */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: "relative",
          height: 100,
          borderRadius: 10,
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.5) 0%, rgba(13,148,136,0.3) 50%, rgba(8,145,178,0.4) 100%)",
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.18), transparent 50%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <FileText size={10} /> Cikk
        </span>
      </motion.div>

      {/* Title + excerpt */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", margin: "0 0 6px", lineHeight: 1.3 }}>
          A 2025-ös B2B SEO checklist: 12 lépés a Google előrejutáshoz
        </h3>
        <p style={{ fontFamily: "Geist, sans-serif", fontSize: "0.78rem", color: "var(--g2a-text-secondary)", margin: 0, lineHeight: 1.55 }}>
          A keresési algoritmusok 2025-ben már a felhasználói szándékot értik —
          itt vannak a legfontosabb taktikák, amelyekkel B2B cégek is...
        </p>
      </motion.div>

      {/* Meta */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "var(--g2a-text-muted)",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.65rem",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Clock size={10} /> 8 perc olvasás
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Eye size={10} /> 2,341
        </span>
        <span style={{ marginLeft: "auto", color: "var(--g2a-brand-teal)", fontWeight: 700 }}>
          Tovább →
        </span>
      </motion.div>
    </div>
  );
}
