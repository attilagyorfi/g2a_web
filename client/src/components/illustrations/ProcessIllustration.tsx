import { motion, useReducedMotion } from "framer-motion";
import { Search, Compass, Rocket, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ACCENT = "#14B8A6";

/**
 * 4-step workflow visualization for the agency's methodology:
 *   01 Audit → 02 Stratégia → 03 Megvalósítás → 04 Mérés
 *
 * Renders as a horizontal connected pipeline (responsive: stacks vertically
 * on narrow viewports). Each step is a card with an icon, number, title and
 * short description. The connecting lines animate left → right on enter.
 *
 * Used on /rolunk and /szolgaltatasok between major sections.
 */
export default function ProcessIllustration() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  const steps = [
    { num: "01", icon: <Search size={20} />, title: t("process.step1.title"), desc: t("process.step1.desc") },
    { num: "02", icon: <Compass size={20} />, title: t("process.step2.title"), desc: t("process.step2.desc") },
    { num: "03", icon: <Rocket size={20} />, title: t("process.step3.title"), desc: t("process.step3.desc") },
    { num: "04", icon: <BarChart3 size={20} />, title: t("process.step4.title"), desc: t("process.step4.desc") },
  ];

  return (
    <div className="g2a-process-pipeline" aria-hidden style={{ position: "relative" }}>
      {steps.map((s, i) => (
        <div key={s.num} className="g2a-process-step" style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              padding: "1.5rem 1.25rem",
              borderRadius: 14,
              // Theme-aware: a teal accent overlay on top of the glass-base
              // — switches dark↔light via CSS vars so the methodology cards
              // are legible in both modes.
              background: `linear-gradient(135deg, var(--g2a-accent-light), transparent), var(--g2a-card-glass-base)`,
              border: "1px solid var(--g2a-card-glass-border)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 38px -16px rgba(0,0,0,0.5)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Number + icon row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  color: ACCENT,
                  letterSpacing: "0.12em",
                }}
              >
                {s.num}
              </span>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${ACCENT}, #0d9488)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: `0 0 14px ${ACCENT}55`,
                }}
              >
                {s.icon}
              </div>
            </div>
            {/* Title + desc */}
            <div>
              <div
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--g2a-text-primary)",
                  marginBottom: 4,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontSize: "0.82rem",
                  color: "var(--g2a-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {s.desc}
              </div>
            </div>
          </motion.div>

          {/* Connector line — last step has none */}
          {i < steps.length - 1 && (
            <svg
              className="g2a-process-connector"
              width="32" height="2" viewBox="0 0 32 2"
              fill="none"
              style={{
                position: "absolute",
                top: "50%",
                right: "-18px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <motion.line
                x1="0" y1="1" x2="32" y2="1"
                stroke={ACCENT}
                strokeWidth="1.4"
                strokeDasharray="3 3"
                opacity={0.6}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
