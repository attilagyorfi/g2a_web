import { motion, useReducedMotion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ACCENT = "#14B8A6";

/**
 * Contact hero demo — channel cards (phone/email/WeChat) + response time + Pécs office card.
 */
export default function ContactHeroDemo() {
  const reduce = useReducedMotion();

  const channels = [
    { icon: <Phone size={14} />, label: "Telefon", value: "+36 30 190 2575", status: "Most elérhető", color: "#10b981" },
    { icon: <Mail size={14} />, label: "Email", value: "info@g2amarketing.hu", status: "Válasz < 4 óra", color: ACCENT },
    { icon: () => <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", fontWeight: 800 }}>微</span>, label: "WeChat", value: "QR a Kapcsolatban", status: "ZH ügyfeleknek", color: "#22c55e" },
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
        background: `radial-gradient(120% 80% at 100% 0%, ${ACCENT}1f, transparent 55%), var(--g2a-card-glass-base)`,
        border: "1px solid var(--g2a-card-glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px ${ACCENT}33`,
        overflow: "hidden",
      }}
    >
      {/* Header card — response time hero stat */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          padding: "14px 16px",
          borderRadius: 12,
          background: `linear-gradient(135deg, ${ACCENT}1a, transparent)`,
          border: `1px solid ${ACCENT}40`,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT}, #0d9488)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${ACCENT}55`, flexShrink: 0 }}>
          <Clock size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Tipikus válaszidő
          </div>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: ACCENT, lineHeight: 1.1 }}>
            &lt; 4 óra
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", marginTop: 2 }}>
            Mo-Fr · 08:00–17:00
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 999, background: "rgba(16,185,129,0.18)", color: "#10b981", fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
          ONLINE
        </span>
      </motion.div>

      {/* Channels list */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {channels.map((c, i) => {
          const Icon = typeof c.icon === "function" ? c.icon : null;
          return (
            <motion.div
              key={c.label}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "30px 1fr auto",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                background: "var(--g2a-tile)",
                border: "1px solid var(--g2a-tile-border)",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: `${c.color}25`,
                  border: `1px solid ${c.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.color,
                  flexShrink: 0,
                }}
              >
                {Icon ? <Icon /> : c.icon as React.ReactNode}
              </span>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{c.label}</div>
                <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.78rem", color: "var(--g2a-text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.value}</div>
              </div>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", color: c.color, fontWeight: 700, whiteSpace: "nowrap" }}>{c.status}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Office card */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: "relative",
          padding: "10px 12px",
          borderRadius: 8,
          background: `${ACCENT}10`,
          border: `1px solid ${ACCENT}28`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <MapPin size={14} style={{ color: ACCENT, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.78rem", color: "var(--g2a-text-primary)", fontWeight: 600 }}>
            Pécs · Dél-Dunántúl
          </div>
          <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>
            HU · EN · 中文 ügyfélszolgálat
          </div>
        </div>
        <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)" }}>UTC+1</span>
      </motion.div>
    </div>
  );
}
