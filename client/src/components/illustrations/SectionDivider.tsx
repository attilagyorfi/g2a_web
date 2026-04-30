import { motion, useReducedMotion } from "framer-motion";

type Variant = "wave" | "dots" | "lines";

type Props = {
  variant?: Variant;
  /** Optional label rendered centered above the divider */
  label?: string;
};

const ACCENT = "#14B8A6";

/**
 * Decorative SVG divider between major sections. Adds visual rhythm without
 * the heaviness of a horizontal rule. Three variants for variety:
 *
 * - `wave`:  flowing organic wave with teal glow midpoint
 * - `dots`:  staggered horizontal dot row that animates left → right
 * - `lines`: 3 stacked offset lines (asymmetric, modern)
 */
export default function SectionDivider({ variant = "wave", label }: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        padding: "2rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {label && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.62rem",
            color: "var(--g2a-text-muted)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </motion.div>
      )}

      {variant === "wave" && (
        <svg width="240" height="32" viewBox="0 0 240 32" fill="none" style={{ overflow: "visible" }}>
          <motion.path
            d="M 0 16 Q 60 0, 120 16 T 240 16"
            stroke={ACCENT}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${ACCENT}66)` }}
          />
          {/* Center pulse dot */}
          <motion.circle
            cx="120"
            cy="16"
            r="3"
            fill={ACCENT}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.9, ease: [0.22, 1.4, 0.4, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${ACCENT})` }}
          />
        </svg>
      )}

      {variant === "dots" && (
        <svg width="240" height="14" viewBox="0 0 240 14" fill="none">
          {Array.from({ length: 9 }).map((_, i) => {
            const x = 8 + i * 28;
            const isCenter = i === 4;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy="7"
                r={isCenter ? 3.5 : 2}
                fill={isCenter ? ACCENT : "rgba(255,255,255,0.25)"}
                initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1.4, 0.4, 1] }}
                style={isCenter ? { filter: `drop-shadow(0 0 6px ${ACCENT})` } : undefined}
              />
            );
          })}
        </svg>
      )}

      {variant === "lines" && (
        <svg width="220" height="22" viewBox="0 0 220 22" fill="none">
          {[
            { x1: 30, x2: 120, y: 6, color: "rgba(255,255,255,0.18)", w: 1, delay: 0 },
            { x1: 60, x2: 200, y: 12, color: ACCENT, w: 1.4, delay: 0.15, glow: true },
            { x1: 90, x2: 170, y: 18, color: "rgba(255,255,255,0.12)", w: 1, delay: 0.3 },
          ].map((l, i) => (
            <motion.line
              key={i}
              x1={l.x1}
              y1={l.y}
              x2={l.x2}
              y2={l.y}
              stroke={l.color}
              strokeWidth={l.w}
              strokeLinecap="round"
              opacity={l.glow ? 0.7 : 1}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: l.glow ? 0.7 : 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: l.delay, ease: [0.22, 1, 0.36, 1] }}
              style={l.glow ? { filter: `drop-shadow(0 0 4px ${ACCENT}88)` } : undefined}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
