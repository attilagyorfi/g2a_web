import { motion, useReducedMotion } from "framer-motion";
import { Building2, Filter, Target, CheckCircle2 } from "lucide-react";

const ACCENT = "#14B8A6";

/**
 * B2B industry demo — ABM funnel with 4 stages + qualified lead counter.
 */
export default function B2bDemo() {
  const reduce = useReducedMotion();

  const stages = [
    { icon: <Building2 size={13} />, label: "Target accounts", count: "1 200", pct: 100, kind: "target" },
    { icon: <Filter size={13} />, label: "Engaged", count: "468", pct: 78, kind: "engaged" },
    { icon: <Target size={13} />, label: "Qualified (MQL)", count: "184", pct: 50, kind: "qualified" },
    { icon: <CheckCircle2 size={13} />, label: "Closed-won", count: "32", pct: 22, kind: "closed" },
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
        background: `radial-gradient(120% 80% at 50% 0%, ${ACCENT}1f, transparent 55%), var(--g2a-card-glass-base)`,
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px ${ACCENT}33`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, background: `radial-gradient(circle, ${ACCENT}29 0%, transparent 65%)`, filter: "blur(38px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "var(--g2a-text-primary)" }}>ABM Funnel</div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>Q1 · enterprise pipeline</div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, background: "rgba(16,185,129,0.18)", color: "#10b981", fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", fontWeight: 700 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          LIVE
        </span>
      </div>

      {/* Funnel rows */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {stages.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
            style={{
              position: "relative",
              padding: "10px 12px",
              borderRadius: 8,
              background: "var(--g2a-tile)",
              border: "1px solid var(--g2a-tile-border)",
              overflow: "hidden",
              width: `${s.pct}%`,
              minWidth: 200,
              alignSelf: "flex-start",
            }}
          >
            {/* Fill bar */}
            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, ${ACCENT}28, ${ACCENT}14)`,
                transformOrigin: "left",
              }}
            />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: `${ACCENT}25`, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {s.icon}
                </span>
                <span style={{ fontFamily: "Geist, sans-serif", fontSize: "0.74rem", color: "var(--g2a-text-primary)", fontWeight: 500 }}>{s.label}</span>
              </div>
              <span style={{ fontFamily: "Geist Mono, monospace", fontWeight: 800, fontSize: "0.85rem", color: i === stages.length - 1 ? ACCENT : "var(--g2a-text-primary)" }}>{s.count}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stat strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <div style={{ padding: "8px 10px", borderRadius: 8, background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, textAlign: "center" }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1rem", color: ACCENT }}>+180%</div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>qualified lead</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.28)", textAlign: "center" }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#10b981" }}>−40%</div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>sales ciklus</div>
        </div>
      </motion.div>
    </div>
  );
}
