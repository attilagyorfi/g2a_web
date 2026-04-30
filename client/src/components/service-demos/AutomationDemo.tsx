import { motion, useReducedMotion } from "framer-motion";
import { Mail, UserPlus, Sparkles, ArrowDown, CheckCircle } from "lucide-react";

/**
 * Mini marketing automation workflow — trigger → conditions → actions chain.
 */
export default function AutomationDemo() {
  const reduce = useReducedMotion();

  const steps = [
    { icon: <UserPlus size={14} />, label: "Új feliratkozó", kind: "trigger" },
    { icon: <Sparkles size={14} />, label: "AI szegmentálás", kind: "filter" },
    { icon: <Mail size={14} />, label: "Welcome email · 2 perc", kind: "action" },
    { icon: <Mail size={14} />, label: "Follow-up · 3 nap", kind: "action" },
    { icon: <CheckCircle size={14} />, label: "Lead score +25", kind: "result" },
  ];

  const colorFor = (kind: string) =>
    kind === "trigger" ? "#14B8A6"
      : kind === "filter" ? "#fbbf24"
      : kind === "action" ? "#60a5fa"
      : "#10b981";

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
          "radial-gradient(120% 80% at 50% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
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
          right: -40,
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 65%)",
          filter: "blur(36px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, color: "var(--g2a-text-primary)", fontSize: "0.9rem" }}>
          Workflow · Lead nurture
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            borderRadius: 999,
            background: "rgba(16,185,129,0.15)",
            color: "#10b981",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.62rem",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          AKTÍV
        </span>
      </div>

      {/* Steps chain */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4 }}>
        {steps.map((s, i) => (
          <div key={i}>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                background: `${colorFor(s.kind)}10`,
                border: `1px solid ${colorFor(s.kind)}30`,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: `${colorFor(s.kind)}25`,
                  border: `1px solid ${colorFor(s.kind)}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colorFor(s.kind),
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </span>
              <span style={{ fontFamily: "Geist, sans-serif", fontSize: "0.78rem", color: "var(--g2a-text-primary)", fontWeight: 500, flex: 1 }}>
                {s.label}
              </span>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", color: "var(--g2a-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {s.kind}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
                <ArrowDown size={11} style={{ color: "var(--g2a-text-muted)", opacity: 0.5 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stat ribbon */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          position: "relative",
          marginTop: 12,
          padding: "8px 12px",
          borderRadius: 8,
          background: "rgba(20,184,166,0.07)",
          border: "1px solid rgba(20,184,166,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.7rem",
        }}
      >
        <span style={{ color: "var(--g2a-text-muted)" }}>Lefutott · 24h</span>
        <span style={{ color: "var(--g2a-brand-teal)", fontWeight: 800 }}>1,847 ×</span>
      </motion.div>
    </div>
  );
}
