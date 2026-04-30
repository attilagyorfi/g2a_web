import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type Props = {
  /** spotlight diameter in px */
  size?: number;
  /** color in any CSS-valid form (rgba recommended for transparency) */
  color?: string;
};

export default function CursorSpotlight({ size = 520, color = "rgba(20,184,166,0.18)" }: Props) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.7 });
  const opacity = useMotionValue(0);
  const sOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (reduce) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const parent = wrapper.parentElement;
    if (!parent) return;

    const move = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    const enter = () => opacity.set(1);
    const leave = () => opacity.set(0);

    parent.addEventListener("mousemove", move);
    parent.addEventListener("mouseenter", enter);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseenter", enter);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [x, y, opacity, reduce]);

  return (
    <motion.div
      ref={wrapperRef}
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
        pointerEvents: "none",
        zIndex: 1,
        x: sx,
        y: sy,
        opacity: sOpacity,
        willChange: "transform, opacity",
      }}
    />
  );
}
