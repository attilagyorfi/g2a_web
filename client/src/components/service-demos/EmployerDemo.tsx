import { motion, useReducedMotion } from "framer-motion";
import { Star, Users, Briefcase, ArrowDown } from "lucide-react";

/**
 * Employer branding demo — recruiting funnel + employer rating + applicant flow.
 */
export default function EmployerDemo() {
  const reduce = useReducedMotion();

  const funnel = [
    { label: "Megtekintések", value: "12 480", pct: 100, color: "var(--g2a-brand-teal)" },
    { label: "Jelentkezés", value: "284", pct: 65, color: "#0d9488" },
    { label: "Interjú", value: "42", pct: 32, color: "#0f766e" },
    { label: "Felvett", value: "8", pct: 12, color: "#10b981" },
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
        background: "var(--g2a-card-glass-bg, radial-gradient(120% 80% at 50% 0%, rgba(20,184,166,0.10), transparent 55%), var(--g2a-card-glass-base))",
        border: "1px solid var(--g2a-card-glass-border, rgba(255,255,255,0.08))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--g2a-card-glass-shadow, inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px rgba(20,184,166,0.18))",
        overflow: "hidden",
      }}
    >
      {/* Header — employer card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          padding: "12px 14px",
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(20,184,166,0.10), transparent)",
          border: "1px solid rgba(20,184,166,0.30)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg, #14B8A6, #0d9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "Geist Mono, monospace",
            fontWeight: 800,
            fontSize: "0.9rem",
            boxShadow: "0 0 14px rgba(20,184,166,0.4)",
            flexShrink: 0,
          }}
        >
          AM
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>
            Acme Mérnökiroda
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={10} fill={s <= 4 ? "#fbbf24" : "rgba(255,255,255,0.15)"} stroke="none" />
            ))}
            <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "var(--g2a-text-muted)", marginLeft: 4 }}>
              4.6 · 248 értékelés
            </span>
          </div>
        </div>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          borderRadius: 999,
          background: "rgba(16,185,129,0.18)",
          color: "#10b981",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.55rem",
          fontWeight: 800,
          letterSpacing: "0.06em",
        }}>
          TOP 5%
        </span>
      </motion.div>

      {/* Funnel */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
        {funnel.map((step, i) => (
          <div key={step.label}>
            <motion.div
              initial={reduce ? false : { opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                padding: "8px 12px",
                borderRadius: 8,
                background: `${step.color}14`,
                border: `1px solid ${step.color}33`,
                width: `${step.pct}%`,
                minWidth: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transformOrigin: "left",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Geist, sans-serif", fontSize: "0.74rem", color: "var(--g2a-text-primary)" }}>
                <Users size={11} style={{ color: step.color }} />
                {step.label}
              </span>
              <span style={{ fontFamily: "Geist Mono, monospace", fontWeight: 800, fontSize: "0.78rem", color: step.color }}>
                {step.value}
              </span>
            </motion.div>
            {i < funnel.length - 1 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "1px 0" }}>
                <ArrowDown size={10} style={{ color: "var(--g2a-text-muted)", opacity: 0.4 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          background: "rgba(20,184,166,0.10)",
          border: "1px solid rgba(20,184,166,0.30)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.65rem",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)" }}>
          <Briefcase size={11} style={{ color: "var(--g2a-brand-teal)" }} />
          Cost-per-hire
        </span>
        <span style={{ color: "var(--g2a-brand-teal)", fontWeight: 800 }}>−38% YoY</span>
      </motion.div>
    </div>
  );
}
