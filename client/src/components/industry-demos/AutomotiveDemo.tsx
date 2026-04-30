import { motion, useReducedMotion } from "framer-motion";
import { Car, TrendingDown, TrendingUp } from "lucide-react";

const ACCENT = "#3b82f6";

/**
 * Automotive industry demo — PPC performance: CPA reduction + lead generation chart.
 */
export default function AutomotiveDemo() {
  const reduce = useReducedMotion();

  // Weekly leads — bar chart values
  const weeks = [
    { w: "H1", before: 18, after: 24 },
    { w: "H2", before: 22, after: 38 },
    { w: "H3", before: 19, after: 52 },
    { w: "H4", before: 25, after: 67 },
    { w: "H5", before: 21, after: 78 },
    { w: "H6", before: 24, after: 94 },
  ];
  const max = 100;

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
      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, #1e40af)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>PPC Performance</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>Q1 vs Q2 · 6 hét</div>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "#10b981", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            <TrendingDown size={10} /> CPA
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#10b981", lineHeight: 1 }}>−45%</div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 3 }}>9 200 → 5 060 Ft</div>
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          style={{ padding: "10px 12px", borderRadius: 10, background: `${ACCENT}14`, border: `1px solid ${ACCENT}40` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: ACCENT, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            <TrendingUp size={10} /> Lead
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: ACCENT, lineHeight: 1 }}>+220%</div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 3 }}>129 → 413 lead</div>
        </motion.div>
      </div>

      {/* Bar chart */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ position: "relative", padding: "10px 12px", borderRadius: 10, background: "var(--g2a-tile)", border: "1px solid var(--g2a-tile-border)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Lead / hét</span>
          <div style={{ display: "flex", gap: 8, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 8, height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 2 }} /> előtte
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 8, height: 8, background: ACCENT, borderRadius: 2 }} /> után
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70 }}>
          {weeks.map((w, i) => (
            <div key={w.w} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 56, width: "100%", justifyContent: "center" }}>
                <motion.div
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: `${(w.before / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: 8, background: "rgba(255,255,255,0.18)", borderRadius: "2px 2px 0 0" }}
                />
                <motion.div
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: `${(w.after / max) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.55 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: 8, background: ACCENT, borderRadius: "2px 2px 0 0", boxShadow: i === 5 ? `0 0 8px ${ACCENT}88` : "none" }}
                />
              </div>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.5rem", color: "var(--g2a-text-muted)" }}>{w.w}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
