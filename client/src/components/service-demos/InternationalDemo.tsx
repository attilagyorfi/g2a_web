import { motion, useReducedMotion } from "framer-motion";
import { Globe2, TrendingUp } from "lucide-react";

/**
 * International marketing demo — multi-country campaign performance with
 * flag rows, reach bars, conversion counts, and aggregated lift indicator.
 */
export default function InternationalDemo() {
  const reduce = useReducedMotion();

  const markets = [
    { flag: "🇩🇪", code: "DE", reach: "248k", conv: 1840, pct: 92, primary: true },
    { flag: "🇦🇹", code: "AT", reach: "98k", conv: 720, pct: 78 },
    { flag: "🇨🇭", code: "CH", reach: "62k", conv: 540, pct: 70 },
    { flag: "🇨🇿", code: "CZ", reach: "84k", conv: 430, pct: 64 },
    { flag: "🇸🇰", code: "SK", reach: "44k", conv: 280, pct: 52 },
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
        background: "var(--g2a-card-glass-bg, radial-gradient(120% 80% at 50% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base))",
        border: "1px solid var(--g2a-card-glass-border, rgba(255,255,255,0.08))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--g2a-card-glass-shadow, inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px rgba(20,184,166,0.18))",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #14B8A6, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe2 size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>Cross-border kampány</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>5 piac · DACH + V4</div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 999, background: "rgba(16,185,129,0.18)", color: "#10b981", fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", fontWeight: 700 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          LIVE
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
              gridTemplateColumns: "26px 26px 1fr 50px 50px",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: 8,
              background: m.primary ? "rgba(20,184,166,0.10)" : "var(--g2a-tile, rgba(255,255,255,0.03))",
              border: `1px solid ${m.primary ? "rgba(20,184,166,0.30)" : "var(--g2a-tile-border, rgba(255,255,255,0.06))"}`,
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>{m.flag}</span>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", fontWeight: 800, color: "var(--g2a-text-primary)" }}>{m.code}</span>
            <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${m.pct}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: m.primary ? "linear-gradient(90deg, #14B8A6, #0d9488)" : "rgba(20,184,166,0.4)", borderRadius: 999, boxShadow: m.primary ? "0 0 6px rgba(20,184,166,0.55)" : "none" }}
              />
            </div>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-secondary)", textAlign: "right" }}>{m.reach}</span>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-brand-teal)", fontWeight: 700, textAlign: "right" }}>{m.conv}</span>
          </motion.div>
        ))}
      </div>

      {/* Aggregated stat strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: "rgba(20,184,166,0.10)",
          border: "1px solid rgba(20,184,166,0.30)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          textAlign: "center",
        }}
      >
        {[
          { v: "536k", l: "összes elérés" },
          { v: "3 810", l: "konverzió" },
          { v: "+186%", l: "YoY", icon: <TrendingUp size={10} /> },
        ].map((s) => (
          <div key={s.l}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "0.92rem", color: "var(--g2a-brand-teal)", lineHeight: 1, display: "inline-flex", alignItems: "center", gap: 3 }}>
              {s.icon}{s.v}
            </div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
