import { CSSProperties, ImgHTMLAttributes } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "style"> & {
  /** delay in seconds before the reveal starts */
  delay?: number;
  /** direction the mask sweeps from */
  from?: "bottom" | "left" | "right" | "top";
  wrapperStyle?: CSSProperties;
  imgStyle?: CSSProperties;
};

const variants: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  visible: (delay: number) => ({
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 1.0, ease: [0.77, 0, 0.175, 1], delay },
  }),
};

const dirToInset: Record<NonNullable<Props["from"]>, { hidden: string; visible: string }> = {
  bottom: { hidden: "inset(100% 0 0 0)", visible: "inset(0% 0 0 0)" },
  top: { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0% 0)" },
  left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
  right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
};

export default function RevealImage({
  delay = 0,
  from = "bottom",
  wrapperStyle,
  imgStyle,
  ...imgProps
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const masks = dirToInset[from];

  if (prefersReducedMotion) {
    return (
      <span style={{ display: "block", overflow: "hidden", ...wrapperStyle }}>
        <img {...imgProps} style={imgStyle} />
      </span>
    );
  }

  const v: Variants = {
    hidden: { clipPath: masks.hidden },
    visible: (d: number) => ({
      clipPath: masks.visible,
      transition: { duration: 1.0, ease: [0.77, 0, 0.175, 1], delay: d },
    }),
  };

  return (
    <motion.span
      style={{ display: "block", overflow: "hidden", ...wrapperStyle }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={v}
      custom={delay}
    >
      <motion.span
        style={{ display: "block", width: "100%", height: "100%" }}
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay } }}
        viewport={{ once: true, margin: "-10% 0px" }}
      >
        <img {...imgProps} style={imgStyle} />
      </motion.span>
    </motion.span>
  );
}
