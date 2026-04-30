import { motion, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle, Eye, ArrowUp } from "lucide-react";

/**
 * Mini Meta (Facebook/Instagram) Ads creative + engagement preview.
 */
export default function MetaAdsDemo() {
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
        background:
          "radial-gradient(120% 80% at 100% 100%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base)",
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
          top: -40,
          left: -40,
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 65%)",
          filter: "blur(36px)",
          pointerEvents: "none",
        }}
      />

      {/* Sponsored post card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: "relative",
          background: "var(--g2a-tile)",
          border: "1px solid var(--g2a-card-glass-border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Post header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #14B8A6, #0D9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.7rem",
              fontWeight: 800,
              boxShadow: "0 0 8px rgba(20,184,166,0.4)",
            }}
          >
            G2A
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "var(--g2a-text-primary)" }}>
              G2A Marketing
            </div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.62rem", color: "var(--g2a-text-muted)" }}>
              Sponsored · 1h
            </div>
          </div>
        </div>

        {/* Creative — abstract gradient mock */}
        <div
          style={{
            height: 140,
            background:
              "radial-gradient(circle at 30% 40%, rgba(20,184,166,0.45), transparent 60%), radial-gradient(circle at 75% 70%, rgba(13,148,136,0.4), transparent 55%), #0a1f1d",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 800,
              fontSize: "1.3rem",
              color: "#fff",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            +180% lead
          </div>
        </div>

        {/* Engagement bar */}
        <div style={{ display: "flex", gap: 14, padding: "10px 12px", color: "var(--g2a-text-secondary)", fontSize: "0.7rem", fontFamily: "Geist Mono, monospace" }}>
          <motion.span
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Heart size={11} style={{ color: "#ec4899" }} /> 1,243
          </motion.span>
          <motion.span
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <MessageCircle size={11} /> 87
          </motion.span>
          <motion.span
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: "auto", color: "var(--g2a-brand-teal)" }}
          >
            <Eye size={11} /> 24.5k
          </motion.span>
        </div>
      </motion.div>

      {/* Quick stat ribbon */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 12,
        }}
      >
        {[
          { label: "ROAS", value: "4.8×" },
          { label: "CPM", value: "€2.10" },
          { label: "Reach", value: "412k" },
        ].map((m, i) => (
          <div
            key={m.label}
            style={{
              padding: "8px",
              borderRadius: 8,
              background: "rgba(20,184,166,0.06)",
              border: "1px solid rgba(20,184,166,0.18)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {m.label}
            </div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, color: "var(--g2a-brand-teal)", fontSize: "0.9rem", marginTop: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                {i === 0 && <ArrowUp size={10} />}
                {m.value}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
