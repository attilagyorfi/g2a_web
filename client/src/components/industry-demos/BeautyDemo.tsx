import { motion, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Play } from "lucide-react";

const ACCENT = "#ec4899";

/**
 * Beauty industry demo — Instagram Reel preview phone frame + engagement counters.
 */
export default function BeautyDemo() {
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
        background: `radial-gradient(120% 80% at 0% 0%, ${ACCENT}1f, transparent 55%), radial-gradient(120% 80% at 100% 100%, #f5970022, transparent 55%), var(--g2a-card-glass-base)`,
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px ${ACCENT}33`,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        gap: 14,
      }}
    >
      {/* Phone reel mockup */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          aspectRatio: "9 / 16",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${ACCENT}, #f59e0b 50%, #6366f1)`,
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: `0 0 24px ${ACCENT}55`,
          overflow: "hidden",
        }}
      >
        {/* Soft shapes */}
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.18)", filter: "blur(8px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.12)", filter: "blur(6px)" }} />
        {/* Play badge */}
        <div style={{ position: "absolute", top: 8, right: 8, padding: "2px 6px", borderRadius: 999, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "#fff" }}>
          <Play size={8} fill="#fff" /> Reel
        </div>
        {/* Bottom caption */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 8px", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", color: "#fff" }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.7rem" }}>@kozmetika.studio</div>
          <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.6rem", opacity: 0.8 }}>Tavaszi look ✨</div>
        </div>
        {/* Side action stack */}
        <div style={{ position: "absolute", right: 4, bottom: 60, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", color: "#fff" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Heart size={14} fill="#fff" />
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem" }}>4.2k</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <MessageCircle size={14} />
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem" }}>312</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Bookmark size={14} />
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem" }}>89</span>
          </div>
        </div>
      </motion.div>

      {/* Right metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
        <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Reel · 7 nap
        </div>
        {[
          { v: "+520%", l: "Instagram követő" },
          { v: "45k", l: "Reach / hét" },
          { v: "+190%", l: "Online foglalás" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={reduce ? false : { opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              background: i === 0 ? `${ACCENT}1a` : "rgba(255,255,255,0.03)",
              border: `1px solid ${i === 0 ? `${ACCENT}40` : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: i === 0 ? ACCENT : "var(--g2a-text-primary)", lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", marginTop: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
