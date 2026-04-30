import { motion, useReducedMotion } from "framer-motion";
import { Users, Megaphone, Mail, Globe } from "lucide-react";

const ACCENT = "#14b8a6";

/**
 * Municipal industry demo — community engagement dashboard with channel reach + survey gauge.
 */
export default function MunicipalDemo() {
  const reduce = useReducedMotion();

  const channels = [
    { icon: <Globe size={12} />, name: "Weboldal", value: 87, count: "12.4k" },
    { icon: <Users size={12} />, name: "Facebook", value: 68, count: "8.9k" },
    { icon: <Mail size={12} />, name: "Hírlevél", value: 54, count: "5.2k" },
  ];

  // Survey participation ring
  const ringR = 26;
  const ringC = 2 * Math.PI * ringR;
  const surveyPct = 73;

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
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="32" cy="32" r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <motion.circle
              cx="32" cy="32" r={ringR}
              fill="none" stroke={ACCENT} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={ringC}
              initial={reduce ? false : { strokeDashoffset: ringC }}
              animate={{ strokeDashoffset: ringC - (ringC * surveyPct) / 100 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: `drop-shadow(0 0 6px ${ACCENT}88)` }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: ACCENT }}>{surveyPct}%</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Lakossági felmérés · 2026
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginTop: 2 }}>
            Részvétel
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: ACCENT, marginTop: 2 }}>
            <Users size={9} style={{ display: "inline", marginRight: 3 }} />
            4 218 / 5 800 lakos
          </div>
        </div>
      </div>

      {/* Channel reach bars */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Megaphone size={11} style={{ color: ACCENT }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Csatornánkénti elérés</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {channels.map((c, i) => (
            <motion.div
              key={c.name}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
              style={{ display: "grid", gridTemplateColumns: "70px 1fr 50px", alignItems: "center", gap: 8 }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "Geist, sans-serif", fontSize: "0.7rem", color: "var(--g2a-text-secondary)" }}>
                <span style={{ color: ACCENT }}>{c.icon}</span>
                {c.name}
              </span>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", background: `linear-gradient(90deg, ${ACCENT}, #0d9488)`, borderRadius: 999 }}
                />
              </div>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-secondary)", textAlign: "right" }}>{c.count}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer stat */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          background: `${ACCENT}14`,
          border: `1px solid ${ACCENT}33`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.65rem",
        }}
      >
        <span style={{ color: "var(--g2a-text-muted)" }}>Közösségi elérés</span>
        <span style={{ color: ACCENT, fontWeight: 800 }}>+400% YoY</span>
      </motion.div>
    </div>
  );
}
