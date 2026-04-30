import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, MousePointerClick, DollarSign } from "lucide-react";

/**
 * Mini Google Ads / PPC dashboard widget — KPIs + spend trend.
 * Used by: ppc-google-ads, hirdeteskezeles
 */
export default function AdsDashboardDemo() {
  const reduce = useReducedMotion();

  const kpis = [
    { icon: <MousePointerClick size={11} />, label: "CTR", value: "4.8%", delta: "+0.7" },
    { icon: <DollarSign size={11} />, label: "CPA", value: "€18", delta: "−24%" },
    { icon: <TrendingUp size={11} />, label: "ROAS", value: "5.2×", delta: "+1.3" },
  ];

  const spendBars = [62, 58, 70, 65, 78, 82, 90];

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
      <div
        style={{
          position: "absolute",
          bottom: -50,
          right: -50,
          width: 240,
          height: 240,
          background: "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 65%)",
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Aktív kampány
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, color: "var(--g2a-text-primary)", fontSize: "0.95rem" }}>
            Q4 · Brand awareness
          </div>
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
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
          LIVE
        </span>
      </div>

      {/* KPIs */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            style={{
              padding: "10px",
              borderRadius: 10,
              background: "var(--g2a-tile)",
              border: "1px solid var(--g2a-tile-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--g2a-text-muted)", marginBottom: 4 }}>
              {k.icon}
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {k.label}
              </span>
            </div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--g2a-text-primary)", lineHeight: 1 }}>
              {k.value}
            </div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "#10b981", marginTop: 3, fontWeight: 700 }}>
              {k.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spend trend */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Költés · 7 nap
          </span>
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-primary)", fontWeight: 600 }}>
            €1,247
          </span>
        </div>
        <div style={{ display: "flex", gap: 5, height: 40, alignItems: "flex-end" }}>
          {spendBars.map((h, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: 1,
                background: i >= spendBars.length - 2
                  ? "linear-gradient(180deg, #14B8A6, #0D9488)"
                  : "rgba(20,184,166,0.3)",
                borderRadius: 2,
                minHeight: 4,
                boxShadow: i === spendBars.length - 1 ? "0 0 10px rgba(20,184,166,0.5)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
