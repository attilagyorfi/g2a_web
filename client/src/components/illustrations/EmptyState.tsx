import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "no-results" | "no-content" | "coming-soon";

type Props = {
  variant?: Variant;
  title: string;
  description?: string;
  action?: ReactNode;
};

/**
 * Reusable empty-state component with 3 brand-aligned SVG illustrations.
 *
 * - `no-results`: filter returned nothing (magnifying glass over empty grid)
 * - `no-content`: DB hasn't been populated yet (empty document with dashed lines)
 * - `coming-soon`: feature/page in progress (geometric clock-like rings)
 *
 * All variants use the brand teal (#14B8A6) accent and respect reduced motion.
 */
export default function EmptyState({ variant = "no-content", title, description, action }: Props) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3.5rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Illustration variant={variant} />
      <div>
        <div
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--g2a-text-primary)",
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: "0.88rem",
              color: "var(--g2a-text-secondary)",
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </div>
  );
}

function Illustration({ variant }: { variant: Variant }) {
  const reduce = useReducedMotion();
  const accent = "#14B8A6";

  if (variant === "no-results") {
    // Magnifying glass over an empty (dashed) grid
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="es-glow-1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#es-glow-1)" />
        {/* Grid (dashed, faint) */}
        {[20, 40, 60, 80].map((y) => (
          <line key={`h-${y}`} x1="14" y1={y} x2="106" y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
        ))}
        {[20, 40, 60, 80, 100].map((x) => (
          <line key={`v-${x}`} x1={x} y1="14" x2={x} y2="100" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
        ))}
        {/* Magnifying glass */}
        <motion.g
          initial={reduce ? false : { rotate: -8, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { rotate: [-8, 4, -8], opacity: 1 }}
          transition={
            reduce
              ? { duration: 0.5 }
              : { rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.5 } }
          }
          style={{ transformOrigin: "60px 60px" }}
        >
          <circle cx="55" cy="55" r="22" fill="rgba(20,20,22,0.85)" stroke={accent} strokeWidth="2.5" />
          <circle cx="55" cy="55" r="22" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.4" style={{ filter: `drop-shadow(0 0 6px ${accent}88)` }} />
          <line x1="71" y1="71" x2="86" y2="86" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
          {/* Inside glass — small "no match" dash */}
          <line x1="48" y1="55" x2="62" y2="55" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </motion.g>
      </svg>
    );
  }

  if (variant === "coming-soon") {
    // Concentric pulsing rings — "in progress"
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="es-glow-2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#es-glow-2)" />
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="60" cy="60" r={20 + i * 10}
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            opacity={0.6 - i * 0.18}
            initial={reduce ? false : { scale: 0.85, opacity: 0 }}
            animate={
              reduce
                ? { opacity: 0.6 - i * 0.18 }
                : { scale: [0.85, 1.05, 0.85], opacity: [0, 0.6 - i * 0.18, 0] }
            }
            transition={
              reduce
                ? { duration: 0.5 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }
            }
            style={{ transformOrigin: "60px 60px" }}
          />
        ))}
        {/* Center dot */}
        <circle cx="60" cy="60" r="6" fill={accent} style={{ filter: `drop-shadow(0 0 8px ${accent})` }} />
        <circle cx="60" cy="60" r="2.5" fill="#fff" />
      </svg>
    );
  }

  // Default: no-content — empty document with dashed content lines
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="es-glow-3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="url(#es-glow-3)" />
      {/* Document body */}
      <motion.g
        initial={reduce ? false : { y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="34" y="28" width="52" height="64" rx="6" fill="rgba(20,20,22,0.85)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Folded corner */}
        <path d="M 76 28 L 86 38 L 76 38 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Dashed empty content lines */}
        {[42, 52, 62, 72, 82].map((y, i) => (
          <line
            key={y}
            x1="42"
            y1={y}
            x2={i === 4 ? 64 : 78}
            y2={y}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
        ))}
        {/* Teal accent dot */}
        <circle cx="42" cy="42" r="2.5" fill={accent} style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
      </motion.g>
    </svg>
  );
}
