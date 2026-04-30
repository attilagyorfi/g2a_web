import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";

const ACCENT = "#14B8A6";

/**
 * References hero demo — industry distribution donut + 23 partner counter + result highlights.
 */
export default function ReferencesHeroDemo() {
  const reduce = useReducedMotion();

  // Industry slices (count out of 23 partners) — colors match industry pages
  const slices = [
    { name: "Egészségügy", count: 6, color: "#10b981" },
    { name: "Szépségipar", count: 4, color: "#ec4899" },
    { name: "Autóipar", count: 3, color: "#3b82f6" },
    { name: "Mérnöki", count: 3, color: "#f59e0b" },
    { name: "Tech", count: 3, color: "#8b5cf6" },
    { name: "B2B", count: 2, color: "var(--g2a-brand-teal)" },
    { name: "Jogi", count: 1, color: "#6366f1" },
    { name: "Önkormányzati", count: 1, color: "#0ea5e9" },
  ];
  const total = slices.reduce((acc, s) => acc + s.count, 0);

  // Donut geometry
  const cx = 80, cy = 80, r = 56, stroke = 18;
  const circ = 2 * Math.PI * r;
  let offsetAcc = 0;

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
      {/* Donut + legend row */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, alignItems: "center", marginBottom: 12 }}>
        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
            {slices.map((s, i) => {
              const portion = s.count / total;
              const dash = circ * portion;
              const gap = circ - dash;
              const dashoffset = -offsetAcc;
              offsetAcc += dash;
              return (
                <motion.circle
                  key={s.name}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`0 ${circ}`}
                  initial={reduce ? { strokeDasharray: `${dash} ${gap}`, strokeDashoffset: dashoffset } : { strokeDasharray: `0 ${circ}`, strokeDashoffset: dashoffset }}
                  animate={{ strokeDasharray: `${dash} ${gap}`, strokeDashoffset: dashoffset }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}
          </svg>
          {/* Center label */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--g2a-text-primary)", lineHeight: 1 }}>{total}</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>partner</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: ACCENT, marginTop: 2 }}>{slices.length} iparág</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {slices.map((s, i) => (
            <motion.div
              key={s.name}
              initial={reduce ? false : { opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
              style={{ display: "grid", gridTemplateColumns: "10px 1fr auto", alignItems: "center", gap: 7 }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, boxShadow: `0 0 5px ${s.color}66` }} />
              <span style={{ fontFamily: "Geist, sans-serif", fontSize: "0.7rem", color: "var(--g2a-text-secondary)" }}>{s.name}</span>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", fontWeight: 700 }}>{s.count}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Result highlights row */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 6,
        }}
      >
        {[
          { v: "+340%", l: "organic", color: "#10b981" },
          { v: "−45%", l: "cpa", color: "#3b82f6" },
          { v: "+520%", l: "social", color: "#ec4899" },
        ].map((s) => (
          <div key={s.l} style={{ padding: "8px 10px", borderRadius: 8, background: `${s.color}14`, border: `1px solid ${s.color}33`, textAlign: "center" }}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: s.color, lineHeight: 1, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <TrendingUp size={11} />{s.v}
            </div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* Footer hint */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        style={{ position: "relative", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}
      >
        <Briefcase size={10} style={{ color: ACCENT }} />
        Verifikált esettanulmányok
      </motion.div>
    </div>
  );
}
