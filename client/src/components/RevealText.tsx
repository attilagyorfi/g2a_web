import { CSSProperties, ElementType, ReactNode } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** delay before the first word/line animates in */
  delay?: number;
  /** stagger between successive words */
  stagger?: number;
  /** split mode: words (default) or lines (whole children block at once) */
  mode?: "words" | "block";
  className?: string;
  style?: CSSProperties;
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function RevealText({
  children,
  as: Tag = "span",
  delay = 0,
  stagger = 0.04,
  mode = "words",
  className,
  style,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const Static = Tag as ElementType;
    return (
      <Static className={className} style={style}>
        {children}
      </Static>
    );
  }

  if (mode === "block" || typeof children !== "string") {
    return (
      <motion.span
        className={className}
        style={style}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        custom={delay}
        variants={blockVariants}
      >
        {children}
      </motion.span>
    );
  }

  const words = children.split(/(\s+)/);

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", ...style }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((w, i) =>
        /\s+/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          >
            <motion.span style={{ display: "inline-block" }} variants={wordVariants}>
              {w}
            </motion.span>
          </span>
        )
      )}
    </motion.span>
  );
}
