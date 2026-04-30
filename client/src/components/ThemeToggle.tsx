import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Sun/Moon toggle button that flips the global theme. Renders nothing if the
 * ThemeProvider was instantiated without `switchable` (defensive — keeps
 * old call sites working).
 *
 * Visually: 36×36 round chip, accent-colored icon that swaps with a soft
 * cross-fade + scale pop. Reduced-motion users get an instant swap.
 */
export default function ThemeToggle({ size = 36 }: { size?: number }) {
  const { theme, toggleTheme, switchable } = useTheme();
  const reduce = useReducedMotion();

  if (!switchable) return null;

  const isDark = theme === "dark";
  const label = isDark ? "Világos téma" : "Sötét téma";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Use the button's center as the wipe origin so the brush effect
    // radiates from the icon the user clicked, not from a corner.
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--g2a-bg-card)",
        border: "1px solid var(--g2a-border)",
        color: "var(--g2a-accent)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.2s, border-color 0.2s, transform 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "var(--g2a-accent-light)";
        el.style.borderColor = "var(--g2a-accent-border)";
        el.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "var(--g2a-bg-card)";
        el.style.borderColor = "var(--g2a-border)";
        el.style.transform = "scale(1)";
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reduce ? false : { rotate: -45, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { rotate: 45, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2, ease: [0.22, 1.4, 0.4, 1] }}
          style={{ display: "inline-flex" }}
        >
          {isDark ? <Moon size={16} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
