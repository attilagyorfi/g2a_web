import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, ShieldCheck, Clock } from "lucide-react";

const ACCENT = "#10b981";

/**
 * Healthcare hero demo — online booking widget with date + time slot grid + GDPR shield.
 */
export default function HealthcareDemo() {
  const reduce = useReducedMotion();

  const days = [
    { date: "22", day: "K", count: 4 },
    { date: "23", day: "Sze", count: 7, active: true },
    { date: "24", day: "Cs", count: 2 },
    { date: "25", day: "P", count: 5 },
  ];
  const slots = [
    { t: "08:30", state: "free" },
    { t: "09:00", state: "free" },
    { t: "09:30", state: "taken" },
    { t: "10:00", state: "selected" },
    { t: "10:30", state: "free" },
    { t: "11:00", state: "taken" },
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
      <div style={{ position: "absolute", bottom: -50, right: -50, width: 220, height: 220, background: `radial-gradient(circle, ${ACCENT}29 0%, transparent 65%)`, filter: "blur(38px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, #047857)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalendarCheck size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>Időpontfoglalás</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Április · 2026</div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, background: `${ACCENT}25`, color: ACCENT, fontFamily: "Geist Mono, monospace", fontSize: "0.58rem", fontWeight: 700 }}>
          <ShieldCheck size={9} /> GDPR
        </span>
      </div>

      {/* Days */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
        {days.map((d, i) => (
          <motion.div
            key={d.date}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            style={{
              padding: "8px 6px",
              borderRadius: 8,
              background: d.active ? `${ACCENT}1f` : "rgba(255,255,255,0.03)",
              border: `1px solid ${d.active ? `${ACCENT}55` : "rgba(255,255,255,0.06)"}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{d.day}</div>
            <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: d.active ? ACCENT : "var(--g2a-text-primary)" }}>{d.date}</div>
            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.55rem", color: "var(--g2a-text-muted)" }}>{d.count} szabad</div>
          </motion.div>
        ))}
      </div>

      {/* Slots */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <Clock size={11} style={{ color: ACCENT }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Szerda · 23.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
          {slots.map((s, i) => (
            <motion.div
              key={s.t}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              style={{
                padding: "6px 4px",
                borderRadius: 6,
                textAlign: "center",
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.7rem",
                fontWeight: 600,
                background:
                  s.state === "selected" ? ACCENT
                    : s.state === "taken" ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.06)",
                color:
                  s.state === "selected" ? "#fff"
                    : s.state === "taken" ? "var(--g2a-text-muted)"
                    : "var(--g2a-text-primary)",
                border: `1px solid ${s.state === "selected" ? ACCENT : s.state === "taken" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)"}`,
                textDecoration: s.state === "taken" ? "line-through" : "none",
                opacity: s.state === "taken" ? 0.5 : 1,
                boxShadow: s.state === "selected" ? `0 0 12px ${ACCENT}66` : "none",
              }}
            >
              {s.t}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "relative",
          marginTop: 12,
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
        <span style={{ color: "var(--g2a-text-muted)" }}>+180% online foglalás</span>
        <span style={{ color: ACCENT, fontWeight: 800 }}>6 hónap alatt</span>
      </motion.div>
    </div>
  );
}
