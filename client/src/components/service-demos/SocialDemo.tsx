import { motion, useReducedMotion } from "framer-motion";
import { Instagram, Camera } from "lucide-react";

/**
 * Mini Instagram-style 3×3 grid mockup with engagement counters.
 */
export default function SocialDemo() {
  const reduce = useReducedMotion();

  // 9 tiles with abstract gradient compositions (different colors per tile)
  const tiles = [
    { g: "linear-gradient(135deg, #14B8A6, #0D9488)", emoji: "✨" },
    { g: "linear-gradient(135deg, #0891B2, #0E7490)", emoji: "📊" },
    { g: "linear-gradient(135deg, #14B8A6, #06b6d4)", emoji: "🎯" },
    { g: "linear-gradient(135deg, #0D9488, #14B8A6)", emoji: "💡" },
    { g: "radial-gradient(circle at 30% 40%, #14B8A6, #064e4a)", emoji: "🔥" },
    { g: "linear-gradient(135deg, #06b6d4, #0D9488)", emoji: "🚀" },
    { g: "linear-gradient(135deg, #0E7490, #14B8A6)", emoji: "📈" },
    { g: "linear-gradient(135deg, #14B8A6, #0891B2)", emoji: "🎨" },
    { g: "radial-gradient(circle at 70% 60%, #0D9488, #064e4a)", emoji: "🌟" },
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
        background:
          "radial-gradient(120% 80% at 0% 0%, rgba(236,72,153,0.08), transparent 50%), radial-gradient(120% 80% at 100% 100%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px rgba(20,184,166,0.18)",
        overflow: "hidden",
      }}
    >
      {/* Profile header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6)",
            padding: 2,
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--g2a-brand-teal)",
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.7rem",
              fontWeight: 800,
            }}
          >
            G2A
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "var(--g2a-text-primary)" }}>
            g2amarketing
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>
            12.4k követő · +2.3k / hét
          </div>
        </div>
        <Instagram size={16} style={{ color: "#ec4899" }} />
      </div>

      {/* 3×3 grid */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          aspectRatio: "1 / 1",
          marginBottom: 12,
        }}
      >
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
            style={{
              borderRadius: 6,
              background: t.g,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span style={{ filter: "grayscale(0.2)" }}>{t.emoji}</span>
            {i === 4 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 999,
                  padding: "2px 6px",
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.55rem",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Camera size={8} /> Reel
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Engagement footer */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          position: "relative",
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(20,184,166,0.07)",
          border: "1px solid rgba(20,184,166,0.2)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          textAlign: "center",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.65rem",
        }}
      >
        {[
          { v: "8.2%", l: "engagement" },
          { v: "45k", l: "elérés / hét" },
          { v: "+340", l: "új követő" },
        ].map((s) => (
          <div key={s.l}>
            <div style={{ color: "var(--g2a-brand-teal)", fontWeight: 800, fontSize: "0.85rem", fontFamily: "Geist, sans-serif" }}>
              {s.v}
            </div>
            <div style={{ color: "var(--g2a-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.55rem", marginTop: 1 }}>
              {s.l}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
