import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Users } from "lucide-react";

const ACCENT = "#14B8A6";

/**
 * About hero demo — industry competence radar + Pécs HQ pin + team summary.
 * Visualizes the agency's breadth across 8 industries.
 */
export default function AboutHeroDemo() {
  const reduce = useReducedMotion();

  // 8 industry segments arranged on radar (angle in degrees from top, clockwise)
  const industries = [
    { name: "Egészségügy", short: "EÜ", strength: 0.9, angle: 0 },
    { name: "Szépségipar", short: "SZ", strength: 0.85, angle: 45 },
    { name: "Mérnöki", short: "ME", strength: 0.7, angle: 90 },
    { name: "Autóipar", short: "AU", strength: 0.75, angle: 135 },
    { name: "Jogi", short: "JG", strength: 0.65, angle: 180 },
    { name: "Tech", short: "TE", strength: 0.95, angle: 225 },
    { name: "Önkormányzati", short: "ÖK", strength: 0.6, angle: 270 },
    { name: "B2B", short: "B2", strength: 0.92, angle: 315 },
  ];

  const cx = 110, cy = 110, maxR = 90;
  const points = industries.map((ind) => {
    const rad = ((ind.angle - 90) * Math.PI) / 180;
    const r = maxR * ind.strength;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad), labelX: cx + (maxR + 14) * Math.cos(rad), labelY: cy + (maxR + 14) * Math.sin(rad), short: ind.short };
  });
  const polygonStr = points.map((p) => `${p.x},${p.y}`).join(" ");

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
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 220, height: 220, background: `radial-gradient(circle, ${ACCENT}29 0%, transparent 65%)`, filter: "blur(38px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Iparági kompetencia · 2026
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 999, background: `${ACCENT}20`, color: ACCENT, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", fontWeight: 800 }}>
          <MapPin size={9} /> Pécs
        </span>
      </div>

      {/* Radar SVG */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Concentric grid rings */}
          {[0.33, 0.66, 1].map((scale) => (
            <circle
              key={scale}
              cx={cx} cy={cy} r={maxR * scale}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray={scale === 1 ? "" : "2,3"}
            />
          ))}
          {/* Spokes */}
          {industries.map((ind) => {
            const rad = ((ind.angle - 90) * Math.PI) / 180;
            return (
              <line
                key={ind.short}
                x1={cx} y1={cy}
                x2={cx + maxR * Math.cos(rad)}
                y2={cy + maxR * Math.sin(rad)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            );
          })}
          {/* Filled polygon */}
          <motion.polygon
            points={polygonStr}
            fill={`${ACCENT}33`}
            stroke={ACCENT}
            strokeWidth="1.5"
            initial={reduce ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px`, filter: `drop-shadow(0 0 8px ${ACCENT}55)` }}
          />
          {/* Vertex dots */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x} cy={p.y} r="3.5"
              fill={ACCENT}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
            />
          ))}
          {/* Labels */}
          {points.map((p, i) => (
            <text
              key={`l-${i}`}
              x={p.labelX} y={p.labelY + 3}
              textAnchor="middle"
              fontFamily="Geist Mono, monospace"
              fontSize="9"
              fontWeight="700"
              fill="var(--g2a-text-muted)"
              style={{ letterSpacing: "0.04em" }}
            >
              {p.short}
            </text>
          ))}
          {/* Center HQ pin */}
          <circle cx={cx} cy={cy} r="6" fill={ACCENT} style={{ filter: `drop-shadow(0 0 8px ${ACCENT})` }} />
          <circle cx={cx} cy={cy} r="2.5" fill="#fff" />
        </svg>
      </div>

      {/* Bottom stats strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 6,
          padding: "10px 12px",
          borderRadius: 8,
          background: `${ACCENT}14`,
          border: `1px solid ${ACCENT}33`,
        }}
      >
        {[
          { v: "2022", l: "alapítás" },
          { v: "23", l: "partner" },
          { v: "8", l: "iparág", icon: <Users size={11} /> },
        ].map((s) => (
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1rem", color: ACCENT, lineHeight: 1, display: "inline-flex", alignItems: "center", gap: 4 }}>
              {s.icon}{s.v}
            </div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
