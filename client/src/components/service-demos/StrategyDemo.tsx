import { motion, useReducedMotion } from "framer-motion";
import { Target, CheckCircle, Clock } from "lucide-react";

/**
 * Mini strategy roadmap — 4 phases with progress + KPI ring.
 */
export default function StrategyDemo() {
  const reduce = useReducedMotion();

  const phases = [
    { num: "01", name: "Audit & Research", state: "done", weeks: "2 hét" },
    { num: "02", name: "Stratégia kidolgozás", state: "done", weeks: "3 hét" },
    { num: "03", name: "Implementáció", state: "active", weeks: "8 hét" },
    { num: "04", name: "Mérés & optimalizálás", state: "future", weeks: "folyamatos" },
  ];

  // Progress ring values
  const ringRadius = 22;
  const ringCircum = 2 * Math.PI * ringRadius;
  const progressPct = 62;

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
          bottom: -50,
          right: -50,
          width: 220,
          height: 220,
          background: "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 65%)",
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />

      {/* Header with progress ring */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <motion.circle
              cx="28"
              cy="28"
              r={ringRadius}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={ringCircum}
              initial={reduce ? false : { strokeDashoffset: ringCircum }}
              animate={{ strokeDashoffset: ringCircum - (ringCircum * progressPct) / 100 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 0 6px rgba(20,184,166,0.5))" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Geist, sans-serif",
              fontWeight: 800,
              fontSize: "0.85rem",
              color: "var(--g2a-brand-teal)",
            }}
          >
            {progressPct}%
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Roadmap · Q4
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)" }}>
            B2B növekedési stratégia
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", marginTop: 2 }}>
            <Target size={9} style={{ display: "inline", marginRight: 4, color: "var(--g2a-brand-teal)" }} />
            cél · +35% MQL
          </div>
        </div>
      </div>

      {/* Phase list */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6 }}>
        {phases.map((p, i) => {
          const stateColor =
            p.state === "done" ? "#10b981"
              : p.state === "active" ? "#14B8A6"
              : "var(--g2a-text-muted)";
          return (
            <motion.div
              key={p.num}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "26px 1fr auto auto",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                background:
                  p.state === "active" ? "rgba(20,184,166,0.08)"
                    : p.state === "done" ? "rgba(16,185,129,0.04)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  p.state === "active" ? "rgba(20,184,166,0.28)"
                    : p.state === "done" ? "rgba(16,185,129,0.2)"
                    : "rgba(255,255,255,0.05)"
                }`,
              }}
            >
              <span style={{ fontFamily: "Geist Mono, monospace", fontWeight: 700, fontSize: "0.7rem", color: stateColor, textAlign: "center" }}>
                {p.num}
              </span>
              <span style={{ fontFamily: "Geist, sans-serif", color: "var(--g2a-text-primary)", fontSize: "0.78rem", fontWeight: 500 }}>
                {p.name}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", color: "var(--g2a-text-muted)" }}>
                <Clock size={9} />
                {p.weeks}
              </span>
              {p.state === "done" && <CheckCircle size={11} style={{ color: stateColor }} />}
              {p.state === "active" && (
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: stateColor, boxShadow: `0 0 6px ${stateColor}` }} />
              )}
              {p.state === "future" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
