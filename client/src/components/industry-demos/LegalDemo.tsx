import { motion, useReducedMotion } from "framer-motion";
import { Scale, Award, ShieldCheck } from "lucide-react";

const ACCENT = "#6366f1";

/**
 * Legal industry demo — premium serif logo + Google #1 ranking + organic growth.
 */
export default function LegalDemo() {
  const reduce = useReducedMotion();

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
      {/* Brand card (premium serif lockup) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          padding: "16px 18px",
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(255,255,255,0.02))",
          border: "1px solid var(--g2a-card-glass-border)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${ACCENT}, #4338ca)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 16px ${ACCENT}55`,
          }}
        >
          <Scale size={22} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            Dr. Kovács <span style={{ color: ACCENT }}>&amp;</span> Társai
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", color: "var(--g2a-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
            Ügyvédi Iroda · est. 2008
          </div>
        </div>
      </motion.div>

      {/* Google search rank card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ position: "relative", padding: "12px 14px", borderRadius: 10, background: "var(--g2a-tile)", border: "1px solid var(--g2a-tile-border)", marginBottom: 12 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Google · &quot;válóperes ügyvéd budapest&quot;
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 999, background: `${ACCENT}25`, color: ACCENT, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", fontWeight: 800 }}>
            <Award size={9} /> #1
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { rank: 1, you: true, title: "Dr. Kovács & Társai – Válóperes szakértő" },
            { rank: 2, you: false, title: "Online ügyvéd kereső – találat" },
            { rank: 3, you: false, title: "Jogi tanácsadás · ügyvédkereső" },
          ].map((r) => (
            <div key={r.rank} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 6, background: r.you ? `${ACCENT}1a` : "transparent", border: `1px solid ${r.you ? `${ACCENT}40` : "transparent"}` }}>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", fontWeight: 800, color: r.you ? ACCENT : "var(--g2a-text-muted)", minWidth: 14 }}>{r.rank}.</span>
              <span style={{ fontFamily: "Geist, sans-serif", fontSize: "0.7rem", color: r.you ? "var(--g2a-text-primary)" : "var(--g2a-text-secondary)", fontWeight: r.you ? 600 : 400, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer stats */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
      >
        <div style={{ padding: "8px 10px", borderRadius: 8, background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, textAlign: "center" }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1rem", color: ACCENT }}>+250%</div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>organikus</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--g2a-tile)", border: "1px solid var(--g2a-tile-border)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ShieldCheck size={13} style={{ color: "#10b981" }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-secondary)" }}>GDPR · adatbiztos</span>
        </div>
      </motion.div>
    </div>
  );
}
