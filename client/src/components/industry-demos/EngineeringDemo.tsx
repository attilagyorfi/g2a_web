import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, ThumbsUp, Lightbulb, Target } from "lucide-react";

const ACCENT = "#f59e0b";

/**
 * Engineering industry demo — LinkedIn thought-leadership post + reactions.
 */
export default function EngineeringDemo() {
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
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #0a66c2, #004182)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Linkedin size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>Tervező Iroda Kft.</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>2 481 követő · 4 órája</div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 999, background: `${ACCENT}1f`, color: ACCENT, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em" }}>
          SPONSORED
        </span>
      </div>

      {/* Post body */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ position: "relative", marginBottom: 10 }}
      >
        <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.78rem", color: "var(--g2a-text-primary)", lineHeight: 1.5, marginBottom: 8 }}>
          Hogyan csökkentettünk <strong style={{ color: ACCENT }}>32%-kal</strong> egy gyártócsarnok energiafelhasználását egy átgondolt szerkezeti módosítással? Friss esettanulmányunk ↓
        </div>

        {/* Article preview card */}
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--g2a-card-glass-border)", background: "var(--g2a-tile)" }}>
          <div style={{ height: 80, background: `linear-gradient(135deg, ${ACCENT}, #c2410c 70%, #1e293b)`, position: "relative", overflow: "hidden" }}>
            {/* Schematic lines */}
            <svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
              <line x1="20" y1="10" x2="20" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="20" y1="10" x2="380" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="20" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="380" y1="10" x2="380" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="100" y1="10" x2="100" y2="70" stroke="rgba(255,255,255,0.25)" strokeDasharray="2,3" />
              <line x1="200" y1="10" x2="200" y2="70" stroke="rgba(255,255,255,0.25)" strokeDasharray="2,3" />
              <line x1="300" y1="10" x2="300" y2="70" stroke="rgba(255,255,255,0.25)" strokeDasharray="2,3" />
            </svg>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "var(--g2a-text-primary)", lineHeight: 1.3 }}>
              Energetikai retrofit – ipari csarnok esettanulmány
            </div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", color: "var(--g2a-text-muted)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              tervezoiroda.hu · 6 perc olvasás
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reactions row */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 10 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#0a66c2", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <ThumbsUp size={9} color="#fff" />
          </span>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: ACCENT, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: -8 }}>
            <Lightbulb size={9} color="#fff" />
          </span>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#10b981", display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: -8 }}>
            <Target size={9} color="#fff" />
          </span>
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-muted)", marginLeft: 6 }}>284 reakció</span>
        </div>
        <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>47 megosztás · 8 312 megjelenés</span>
      </motion.div>

      {/* Stat ribbon */}
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
        <span style={{ color: "var(--g2a-text-muted)" }}>Új ügyfél / hónap</span>
        <span style={{ color: ACCENT, fontWeight: 800 }}>+15 ↑</span>
      </motion.div>
    </div>
  );
}
