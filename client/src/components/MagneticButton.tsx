import { CSSProperties, ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  /** how far (px) the button is pulled toward the cursor at max */
  strength?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  as?: "button" | "a" | "span" | "div";
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
};

export default function MagneticButton({
  children,
  strength = 18,
  className,
  style,
  onClick,
  as = "span",
  href,
  target,
  rel,
  type,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.3 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / rect.width) * (strength * 2);
    const dy = ((e.clientY - cy) / rect.height) * (strength * 2);
    x.set(Math.max(-strength, Math.min(strength, dx)));
    y.set(Math.max(-strength, Math.min(strength, dy)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const motionProps = {
    ref: ref as never,
    className,
    style: { ...style, x: sx, y: sy, display: "inline-flex" },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    "data-magnetic": true,
  };

  if (as === "a") return <motion.a {...motionProps} href={href} target={target} rel={rel}>{children}</motion.a>;
  if (as === "button") return <motion.button {...motionProps} type={type}>{children}</motion.button>;
  if (as === "div") return <motion.div {...motionProps}>{children}</motion.div>;
  return <motion.span {...motionProps}>{children}</motion.span>;
}
