import { motion, useReducedMotion } from "framer-motion";
import { Languages, Sparkles } from "lucide-react";

/**
 * Localization service demo — source HU paragraph + 3 target language chips
 * (EN/ZH/DE) with quality scores. Visualizes "one source → multiple culturally
 * adapted versions".
 */
export default function LocalizationDemo() {
  const reduce = useReducedMotion();

  const targets = [
    { flag: "🇬🇧", code: "EN", text: "Premium B2B marketing for Central Europe", quality: 98 },
    { flag: "🇨🇳", code: "ZH", text: "面向中欧的高端 B2B 营销服务", quality: 95 },
    { flag: "🇩🇪", code: "DE", text: "Premium-B2B-Marketing für Mitteleuropa", quality: 97 },
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
      {/* Source language card (HU) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          padding: "12px 14px",
          borderRadius: 10,
          background: "var(--g2a-tile, rgba(255,255,255,0.03))",
          border: "1px solid var(--g2a-tile-border, rgba(255,255,255,0.06))",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: "1rem" }}>🇭🇺</span>
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Forrás · HU
          </span>
          <span style={{ marginLeft: "auto", fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-brand-teal)", fontWeight: 700 }}>EREDETI</span>
        </div>
        <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.82rem", color: "var(--g2a-text-primary)", lineHeight: 1.45 }}>
          Prémium B2B marketing közép-európai vállalatoknak
        </div>
      </motion.div>

      {/* Sparkle separator */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ display: "flex", justifyContent: "center", margin: "4px 0 8px" }}
      >
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          borderRadius: 999,
          background: "rgba(20,184,166,0.15)",
          color: "var(--g2a-brand-teal)",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.55rem",
          fontWeight: 700,
        }}>
          <Sparkles size={9} /> AI lokalizáció
        </span>
      </motion.div>

      {/* Translated targets */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6 }}>
        {targets.map((tg, i) => (
          <motion.div
            key={tg.code}
            initial={reduce ? false : { opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 32px 1fr auto",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              background: "rgba(20,184,166,0.06)",
              border: "1px solid rgba(20,184,166,0.20)",
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>{tg.flag}</span>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", fontWeight: 800, color: "var(--g2a-brand-teal)", letterSpacing: "0.06em" }}>{tg.code}</span>
            <span style={{ fontFamily: "Geist, sans-serif", fontSize: "0.74rem", color: "var(--g2a-text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tg.text}
            </span>
            <span style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.58rem",
              color: tg.quality >= 95 ? "#10b981" : "#fbbf24",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 999,
              background: tg.quality >= 95 ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)",
            }}>
              {tg.quality}%
            </span>
          </motion.div>
        ))}
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          borderRadius: 8,
          background: "rgba(20,184,166,0.10)",
          border: "1px solid rgba(20,184,166,0.30)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.65rem",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)" }}>
          <Languages size={11} style={{ color: "var(--g2a-brand-teal)" }} />
          20+ nyelv · kulturális adaptáció
        </span>
        <span style={{ color: "var(--g2a-brand-teal)", fontWeight: 800 }}>~48h</span>
      </motion.div>
    </div>
  );
}
