import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — zero setState on mousemove.
 * All visual state (position, scale, opacity) uses motion values so the browser
 * never has to run React reconciliation on pointer movement. Removed
 * `mix-blend-mode: difference` because it forces full-viewport repaint every
 * frame when layered above animated backgrounds (polygons/blobs/dashboard).
 */
export default function CustomCursor() {
  const [fineCursor, setFineCursor] = useState(false);

  // Position
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  // Ring lags behind cursor
  const sx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 320, damping: 28, mass: 0.3 });

  // Scale + opacity as motion values (no React re-render on change)
  const ringScale = useMotionValue(1);
  const smoothRingScale = useSpring(ringScale, { stiffness: 300, damping: 22 });
  const opacity = useMotionValue(1);

  // Detect fine (mouse) pointer
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    const onChange = () => setFineCursor(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mount listeners only when a fine pointer is available
  useEffect(() => {
    if (!fineCursor) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const HOVER_SELECTOR = 'a, button, [role="button"], [data-magnetic], input[type="submit"], input[type="button"], label';
    const over = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest(HOVER_SELECTOR)) ringScale.set(1.7);
    };
    const out = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest(HOVER_SELECTOR)) ringScale.set(1);
    };
    const leaveWindow = () => opacity.set(0);
    const enterWindow = () => opacity.set(1);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("mouseleave", leaveWindow);
    document.addEventListener("mouseenter", enterWindow);

    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leaveWindow);
      document.removeEventListener("mouseenter", enterWindow);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [fineCursor, x, y, ringScale, opacity]);

  if (!fineCursor) return null;

  return (
    <>
      {/* Ring – follows with spring lag, scales on interactive-element hover */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderRadius: "50%",
          border: "1.5px solid #14B8A6",
          pointerEvents: "none",
          zIndex: 9998,
          x: sx,
          y: sy,
          scale: smoothRingScale,
          opacity,
          willChange: "transform, opacity",
        }}
      />
      {/* Dot – directly tied to cursor, instant */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          backgroundColor: "var(--g2a-brand-teal)",
          pointerEvents: "none",
          zIndex: 9999,
          x,
          y,
          opacity,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
