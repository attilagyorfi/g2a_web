import { motion, useReducedMotion } from "framer-motion";
import { Newspaper, Clock, BookOpen, Sparkles } from "lucide-react";

const ACCENT = "#14B8A6";

/**
 * Blog hero demo — fanned article-card stack + category chips + reading-time meta.
 */
export default function BlogHeroDemo() {
  const reduce = useReducedMotion();

  const cards = [
    {
      tag: "AI",
      tagColor: "#8b5cf6",
      title: "Hogyan változtatja meg az AI a 2026-os marketinget",
      meta: "8 perc",
      gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      icon: <Sparkles size={20} />,
      rotate: -7,
      x: -12,
    },
    {
      tag: "SEO",
      tagColor: "var(--g2a-brand-teal)",
      title: "Core Web Vitals 2026 – mit mér a Google?",
      meta: "12 perc",
      gradient: "linear-gradient(135deg, #14B8A6, #0d9488)",
      icon: <BookOpen size={20} />,
      rotate: 0,
      x: 0,
      featured: true,
    },
    {
      tag: "PPC",
      tagColor: "#3b82f6",
      title: "Google Ads ROAS optimalizálás",
      meta: "6 perc",
      gradient: "linear-gradient(135deg, #3b82f6, #1e40af)",
      icon: <Newspaper size={20} />,
      rotate: 7,
      x: 12,
    },
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
        background: `radial-gradient(120% 80% at 50% 0%, ${ACCENT}1f, transparent 55%), var(--g2a-card-glass-base)`,
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px ${ACCENT}33`,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Newspaper size={14} style={{ color: ACCENT }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Friss cikkek · heti
          </span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, background: `${ACCENT}1f`, color: ACCENT, fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", fontWeight: 700 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />
          ÚJ · 3
        </span>
      </div>

      {/* Fanned article stack */}
      <div style={{ position: "relative", height: 200, marginBottom: 14, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={reduce ? false : { opacity: 0, y: 20, rotate: c.rotate, x: c.x }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate, x: c.x }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              width: 150,
              height: 190,
              borderRadius: 12,
              padding: 12,
              background: "var(--g2a-card-glass-base)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${c.featured ? `${c.tagColor}55` : "var(--g2a-card-glass-border)"}`,
              boxShadow: c.featured ? `0 18px 40px -12px rgba(0,0,0,0.5), 0 0 16px ${c.tagColor}33` : "0 12px 28px -8px rgba(0,0,0,0.5)",
              zIndex: c.featured ? 3 : 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflow: "hidden",
            }}
          >
            {/* Feature image */}
            <div style={{ height: 78, borderRadius: 8, background: c.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0, position: "relative", overflow: "hidden" }}>
              {c.icon}
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  padding: "2px 6px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(4px)",
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.5rem",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.06em",
                }}
              >
                {c.tag}
              </span>
            </div>
            {/* Title */}
            <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "var(--g2a-text-primary)", lineHeight: 1.3, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const }}>
              {c.title}
            </div>
            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)" }}>
              <Clock size={9} /> {c.meta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category chips */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: "relative",
          display: "flex",
          gap: 5,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "8px 10px",
          borderRadius: 8,
          background: "var(--g2a-tile)",
          border: "1px solid var(--g2a-tile-border)",
        }}
      >
        {[
          { name: "AI", color: "#8b5cf6" },
          { name: "SEO", color: ACCENT },
          { name: "PPC", color: "#3b82f6" },
          { name: "Tartalom", color: "#f59e0b" },
          { name: "Brand", color: "#ec4899" },
          { name: "Stratégia", color: "#10b981" },
        ].map((c) => (
          <span
            key={c.name}
            style={{
              padding: "3px 8px",
              borderRadius: 999,
              background: `${c.color}15`,
              border: `1px solid ${c.color}33`,
              color: c.color,
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            {c.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
