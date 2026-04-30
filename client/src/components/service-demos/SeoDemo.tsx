import { motion, useReducedMotion } from "framer-motion";
import { Search, TrendingUp, ArrowUp } from "lucide-react";

/**
 * Mini SEO ranking widget — top keywords + position deltas + tiny bar chart.
 */
export default function SeoDemo() {
  const reduce = useReducedMotion();

  const keywords = [
    { kw: "marketing ügynökség pécs", pos: 1, delta: "+4" },
    { kw: "ai marketing b2b", pos: 3, delta: "+7" },
    { kw: "seo szolgáltatás", pos: 5, delta: "+2" },
    { kw: "google ads kezelés", pos: 8, delta: "+11" },
  ];
  const bars = [40, 55, 48, 70, 65, 88, 95];

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
          "radial-gradient(120% 80% at 100% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
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
          left: -30,
          width: 220,
          height: 200,
          background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)",
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "rgba(20,184,166,0.15)",
              border: "1px solid rgba(20,184,166,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--g2a-brand-teal)",
            }}
          >
            <Search size={13} />
          </span>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, color: "var(--g2a-text-primary)", fontSize: "0.88rem" }}>
            Top kulcsszavak
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 7px",
            borderRadius: 999,
            background: "rgba(20,184,166,0.16)",
            color: "var(--g2a-brand-teal)",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.65rem",
            fontWeight: 700,
          }}
        >
          <TrendingUp size={10} /> +24% / hét
        </span>
      </div>

      {/* Keyword rows */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {keywords.map((k, i) => (
          <motion.div
            key={k.kw}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            style={{
              display: "grid",
              gridTemplateColumns: "26px 1fr auto",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: 8,
              background: i === 0 ? "rgba(20,184,166,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${i === 0 ? "rgba(20,184,166,0.2)" : "rgba(255,255,255,0.04)"}`,
            }}
          >
            <span
              style={{
                fontFamily: "Geist Mono, monospace",
                fontWeight: 700,
                fontSize: "0.78rem",
                color: i === 0 ? "#14B8A6" : "var(--g2a-text-secondary)",
                textAlign: "center",
              }}
            >
              #{k.pos}
            </span>
            <span
              style={{
                fontFamily: "Geist, sans-serif",
                color: "var(--g2a-text-primary)",
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {k.kw}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                color: "#10b981",
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              <ArrowUp size={9} /> {k.delta}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Mini sparkline bars */}
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Organikus forgalom · 7 nap
        </div>
        <div style={{ display: "flex", gap: 5, height: 38, alignItems: "flex-end" }}>
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: 1,
                background: i === bars.length - 1
                  ? "linear-gradient(180deg, #14B8A6, #0D9488)"
                  : "rgba(20,184,166,0.32)",
                borderRadius: 2,
                minHeight: 4,
                boxShadow: i === bars.length - 1 ? "0 0 12px rgba(20,184,166,0.5)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
