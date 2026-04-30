import { motion, useReducedMotion } from "framer-motion";

/**
 * Broken constellation — 404 hero illustration.
 *
 * A network of connected nodes with one orphan node floating in the middle,
 * disconnected from the constellation. Visually evokes "this point isn't
 * connected to anything" — a perfect metaphor for a missing page. Uses the
 * brand teal (#14B8A6) as the accent and reuses the polygon-network motif
 * from the home hero.
 */
export default function BrokenConstellation({ size = 320 }: { size?: number }) {
  const reduce = useReducedMotion();

  // Network of 7 connected nodes (the "rest of the site")
  const nodes = [
    { x: 60, y: 70, r: 4 },
    { x: 130, y: 40, r: 5 },
    { x: 230, y: 60, r: 4 },
    { x: 280, y: 130, r: 4 },
    { x: 250, y: 220, r: 5 },
    { x: 130, y: 250, r: 4 },
    { x: 50, y: 180, r: 4 },
  ];

  // Edges connecting the 7 nodes (forming the constellation)
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
    [0, 2], [2, 5], [1, 5], [3, 6],
  ];

  // Orphan node in the middle — "the missing page"
  const orphan = { x: 160, y: 145, r: 7 };

  // Broken/dashed lines reaching toward orphan from nearest neighbors,
  // but stopping short — evokes "broken connection"
  const brokenReaches = [
    { from: 1, midX: 145, midY: 95 },
    { from: 3, midX: 230, midY: 130 },
    { from: 5, midX: 145, midY: 200 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* Soft radial backdrop glow behind the orphan node */}
      <defs>
        <radialGradient id="orphan-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="net-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background ambient glow */}
      <circle cx="160" cy="145" r="140" fill="url(#net-glow)" />

      {/* Constellation edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={`edge-${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Constellation nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="rgba(255,255,255,0.9)"
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.06, ease: [0.22, 1.4, 0.4, 1] }}
          style={{ transformOrigin: `${n.x}px ${n.y}px`, filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))" }}
        />
      ))}

      {/* Broken reaches (dashed, stopping short of orphan) */}
      {brokenReaches.map((reach, i) => (
        <motion.line
          key={`broken-${i}`}
          x1={nodes[reach.from].x}
          y1={nodes[reach.from].y}
          x2={reach.midX}
          y2={reach.midY}
          stroke="#14B8A6"
          strokeWidth="1.2"
          strokeDasharray="3 4"
          opacity={0.6}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 0.7, delay: 1.2 + i * 0.1 }}
        />
      ))}

      {/* Orphan node — pulsing teal */}
      <motion.circle
        cx={orphan.x}
        cy={orphan.y}
        r="50"
        fill="url(#orphan-glow)"
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={
          reduce
            ? { scale: 1, opacity: 1 }
            : { scale: [0.95, 1.1, 0.95], opacity: [0.7, 1, 0.7] }
        }
        transition={
          reduce
            ? { duration: 0.5, delay: 1.4 }
            : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.4 }
        }
        style={{ transformOrigin: `${orphan.x}px ${orphan.y}px` }}
      />
      <motion.circle
        cx={orphan.x}
        cy={orphan.y}
        r={orphan.r}
        fill="#14B8A6"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6, ease: [0.22, 1.4, 0.4, 1] }}
        style={{
          transformOrigin: `${orphan.x}px ${orphan.y}px`,
          filter: "drop-shadow(0 0 12px #14B8A6)",
        }}
      />

      {/* Orphan node "404" label inside */}
      <motion.text
        x={orphan.x}
        y={orphan.y + 28}
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="11"
        fontWeight="800"
        fill="#14B8A6"
        letterSpacing="0.15em"
        initial={reduce ? false : { opacity: 0, y: orphan.y + 35 }}
        animate={{ opacity: 1, y: orphan.y + 28 }}
        transition={{ duration: 0.6, delay: 2.0 }}
      >
        404
      </motion.text>
    </svg>
  );
}
