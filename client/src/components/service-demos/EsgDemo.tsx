import { motion, useReducedMotion } from "framer-motion";
import { Leaf, Users, Shield, TrendingUp } from "lucide-react";

/**
 * ESG communications demo — sustainability scorecard with 3 pillars
 * (Environmental / Social / Governance) + headline CO2 reduction stat.
 */
export default function EsgDemo() {
  const reduce = useReducedMotion();

  const pillars = [
    { code: "E", name: "Környezet", icon: <Leaf size={13} />, score: 84, color: "#10b981", trend: "+12" },
    { code: "S", name: "Társadalom", icon: <Users size={13} />, score: 78, color: "var(--g2a-brand-teal)", trend: "+8" },
    { code: "G", name: "Vállalatirányítás", icon: <Shield size={13} />, score: 91, color: "#0d9488", trend: "+5" },
  ];

  // Overall ESG score ring
  const ringR = 28;
  const ringC = 2 * Math.PI * ringR;
  const overall = Math.round(pillars.reduce((acc, p) => acc + p.score, 0) / pillars.length);

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
        background: "var(--g2a-card-glass-bg, radial-gradient(120% 80% at 50% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base))",
        border: "1px solid var(--g2a-card-glass-border, rgba(255,255,255,0.08))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--g2a-card-glass-shadow, inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px rgba(20,184,166,0.18))",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", bottom: -50, right: -50, width: 220, height: 220, background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)", filter: "blur(38px)", pointerEvents: "none" }} />

      {/* Header — overall ESG ring */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
          <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="34" cy="34" r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <motion.circle
              cx="34" cy="34" r={ringR}
              fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={ringC}
              initial={reduce ? false : { strokeDashoffset: ringC }}
              animate={{ strokeDashoffset: ringC - (ringC * overall) / 100 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.55))" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#10b981" }}>
            {overall}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ESG Scorecard · 2026
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginTop: 2 }}>
            Fenntarthatósági értékelés
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "#10b981", marginTop: 2 }}>
            <TrendingUp size={9} style={{ display: "inline", marginRight: 3 }} />
            +12 pont YoY
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {pillars.map((p, i) => (
          <motion.div
            key={p.code}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "26px 26px 1fr 38px 38px",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${p.color}10`,
              border: `1px solid ${p.color}30`,
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: 6,
              background: `${p.color}25`,
              border: `1px solid ${p.color}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: p.color,
              fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", fontWeight: 800,
            }}>
              {p.code}
            </span>
            <span style={{ color: p.color, display: "inline-flex", alignItems: "center" }}>{p.icon}</span>
            <span style={{ fontFamily: "Geist, sans-serif", fontSize: "0.74rem", color: "var(--g2a-text-primary)", fontWeight: 500 }}>
              {p.name}
            </span>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: p.color, textAlign: "right" }}>
              {p.score}
            </span>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", color: "#10b981", fontWeight: 700, textAlign: "right" }}>
              {p.trend}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CO2 reduction strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: "rgba(16,185,129,0.10)",
          border: "1px solid rgba(16,185,129,0.30)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Leaf size={13} style={{ color: "#10b981" }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>CO₂ csökkentés</span>
        </div>
        <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#10b981" }}>−42%</span>
      </motion.div>
    </div>
  );
}
