import { motion, useReducedMotion } from "framer-motion";

type Blob = {
  size: number;
  color: string;
  initial: { x: string; y: string };
  animate: { x: (string | number)[]; y: (string | number)[] };
  duration: number;
  blur: number;
};

const BLOBS: Blob[] = [
  {
    size: 520,
    color: "rgba(20,184,166,0.35)", // teal-500
    initial: { x: "10%", y: "10%" },
    animate: { x: ["10%", "25%", "5%", "10%"], y: ["10%", "25%", "20%", "10%"] },
    duration: 22,
    blur: 110,
  },
  {
    size: 420,
    color: "rgba(45,212,191,0.28)", // teal-400
    initial: { x: "65%", y: "20%" },
    animate: { x: ["65%", "55%", "75%", "65%"], y: ["20%", "35%", "10%", "20%"] },
    duration: 28,
    blur: 100,
  },
  {
    size: 380,
    color: "rgba(13,148,136,0.30)", // teal-600
    initial: { x: "40%", y: "70%" },
    animate: { x: ["40%", "60%", "30%", "40%"], y: ["70%", "55%", "75%", "70%"] },
    duration: 32,
    blur: 90,
  },
  {
    size: 300,
    color: "rgba(8,145,178,0.22)", // cyan-600 hint for color variety
    initial: { x: "85%", y: "80%" },
    animate: { x: ["85%", "70%", "90%", "85%"], y: ["80%", "65%", "85%", "80%"] },
    duration: 26,
    blur: 80,
  },
];

export default function AnimatedBlobs() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          initial={b.initial}
          animate={reduce ? b.initial : b.animate}
          transition={{
            duration: b.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 70%)`,
            filter: `blur(${b.blur}px)`,
            mixBlendMode: "screen",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
