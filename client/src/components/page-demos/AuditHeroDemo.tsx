import { motion, useReducedMotion } from "framer-motion";
import { Search, Zap, ShieldCheck, FileText } from "lucide-react";

const ACCENT = "#14B8A6";

/**
 * Audit hero demo — live SEO audit running with progress bar + 4 dimension scores.
 * Mimics the look of a Lighthouse-style audit screen.
 */
export default function AuditHeroDemo() {
  const reduce = useReducedMotion();

  const dimensions = [
    { icon: <Search size={13} />, name: "SEO", score: 92, color: "#10b981" },
    { icon: <Zap size={13} />, name: "Performance", score: 78, color: "#fbbf24" },
    { icon: <ShieldCheck size={13} />, name: "Accessibility", score: 88, color: "#10b981" },
    { icon: <FileText size={13} />, name: "Tartalom", score: 65, color: "#f97316" },
  ];

  // Overall score ring
  const ringR = 30;
  const ringC = 2 * Math.PI * ringR;
  const overall = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length);

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
      {/* "Sample / illustration" badge — audit §3.10. Demo numbers in the
          score ring and dimensions used to look like real client data,
          which felt misleading on a marketing-agency site. This chip makes
          the placeholder status visually obvious without hiding the demo. */}
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          padding: "3px 8px",
          fontSize: "0.55rem",
          fontFamily: "Geist Mono, monospace",
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.7)",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 4,
          textTransform: "uppercase",
          backdropFilter: "blur(6px)",
        }}
      >
        Minta
      </span>
      {/* Header — URL bar mock */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          padding: "8px 12px",
          borderRadius: 8,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid var(--g2a-card-glass-border)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
        </div>
        <Search size={11} style={{ color: "var(--g2a-text-muted)", marginLeft: 6 }} />
        <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          https://az-on-weboldala.hu
        </span>
        <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: ACCENT, fontWeight: 700 }}>SCAN</span>
      </motion.div>

      {/* Score header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="36" cy="36" r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <motion.circle
              cx="36" cy="36" r={ringR}
              fill="none" stroke={ACCENT} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={ringC}
              initial={reduce ? false : { strokeDashoffset: ringC }}
              animate={{ strokeDashoffset: ringC - (ringC * overall) / 100 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: `drop-shadow(0 0 8px ${ACCENT}88)` }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: ACCENT, lineHeight: 1 }}>{overall}</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.5rem", color: "var(--g2a-text-muted)" }}>/ 100</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            SEO Audit · összpontszám
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginTop: 2 }}>
            12 javaslat generálva
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", marginTop: 2 }}>
            ~2 perc · ingyenes · regisztráció nélkül
          </div>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {dimensions.map((d, i) => (
          <motion.div
            key={d.name}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 36px",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px",
              borderRadius: 7,
              background: "var(--g2a-tile)",
              border: "1px solid var(--g2a-tile-border)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Geist, sans-serif", fontSize: "0.72rem", color: "var(--g2a-text-secondary)" }}>
              <span style={{ color: d.color }}>{d.icon}</span>
              {d.name}
            </span>
            <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${d.score}%` }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: d.color, borderRadius: 999, boxShadow: `0 0 5px ${d.color}88` }}
              />
            </div>
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", color: d.color, fontWeight: 800, textAlign: "right" }}>{d.score}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          position: "relative",
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
        <span style={{ color: "var(--g2a-text-muted)" }}>ingyenes · részletes riport</span>
        <span style={{ color: ACCENT, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
          PDF · 12 oldal
        </span>
      </motion.div>
    </div>
  );
}
