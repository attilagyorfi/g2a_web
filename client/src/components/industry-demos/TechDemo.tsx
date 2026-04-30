import { motion, useReducedMotion } from "framer-motion";
import { Globe2, Code2 } from "lucide-react";

const ACCENT = "#8b5cf6";

/**
 * Tech industry demo — multilingual SEO panel + market grid + demo bookings stat.
 */
export default function TechDemo() {
  const reduce = useReducedMotion();

  const markets = [
    { flag: "🇭🇺", code: "HU", traffic: "12.4k", growth: "+38%", primary: true },
    { flag: "🇬🇧", code: "EN", traffic: "8.9k", growth: "+62%" },
    { flag: "🇩🇪", code: "DE", traffic: "5.2k", growth: "+41%" },
    { flag: "🇨🇳", code: "ZH", traffic: "3.1k", growth: "+118%" },
    { flag: "🇪🇸", code: "ES", traffic: "1.8k", growth: "+24%" },
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
        background: `radial-gradient(120% 80% at 100% 0%, ${ACCENT}1f, transparent 55%), var(--g2a-card-glass-base)`,
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
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, #6d28d9)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe2 size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>Multilingual SEO</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>5 piac · 12 nyelv</div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 999, background: "rgba(16,185,129,0.18)", color: "#10b981", fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", fontWeight: 700 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          INDEXÁLT
        </span>
      </div>

      {/* Markets grid */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {markets.map((m, i) => (
          <motion.div
            key={m.code}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
            style={{
              display: "grid",
              gridTemplateColumns: "26px 30px 1fr auto auto",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: 8,
              background: m.primary ? `${ACCENT}14` : "rgba(255,255,255,0.03)",
              border: `1px solid ${m.primary ? `${ACCENT}33` : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>{m.flag}</span>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", fontWeight: 800, color: "var(--g2a-text-primary)" }}>{m.code}</span>
            <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${Math.min(parseInt(m.traffic) * 7, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: ACCENT, borderRadius: 999, boxShadow: m.primary ? `0 0 6px ${ACCENT}88` : "none" }}
              />
            </div>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-secondary)", minWidth: 38, textAlign: "right" }}>{m.traffic}</span>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "#10b981", fontWeight: 700, minWidth: 38, textAlign: "right" }}>{m.growth}</span>
          </motion.div>
        ))}
      </div>

      {/* Footer stat strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: `${ACCENT}14`,
          border: `1px solid ${ACCENT}33`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Code2 size={13} style={{ color: ACCENT }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Demo foglalás</span>
        </div>
        <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1rem", color: ACCENT }}>+280%</span>
      </motion.div>
    </div>
  );
}
