import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { TrendingUp, Sparkles, Bell, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Collage of floating "dashboard" cards — KPI numbers, mini chart, AI badge, lead notification, progress ring.
 * - Each card has a subtle infinite Y-bob animation with staggered phase
 * - Whole collage tilts toward the cursor based on parent element's bounds
 * - Hidden on viewport < 1100px
 */
export default function FloatingDashboard() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const stx = useSpring(tx, { stiffness: 80, damping: 18, mass: 0.8 });
  const sty = useSpring(ty, { stiffness: 80, damping: 18, mass: 0.8 });
  const rotX = useTransform(sty, [-40, 40], [6, -6]);
  const rotY = useTransform(stx, [-40, 40], [-8, 8]);

  useEffect(() => {
    if (reduce) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const parent = wrapper.parentElement;
    if (!parent) return;

    const move = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      tx.set(((e.clientX - cx) / rect.width) * 80);
      ty.set(((e.clientY - cy) / rect.height) * 80);
    };
    const leave = () => {
      tx.set(0);
      ty.set(0);
    };
    parent.addEventListener("mousemove", move);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [reduce, tx, ty]);

  return (
    <motion.div
      ref={wrapperRef}
      aria-hidden
      className="g2a-floating-dashboard"
      style={{
        position: "absolute",
        right: "2rem",
        top: "calc(50% - 230px)",
        width: 460,
        height: 460,
        perspective: 1200,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* CARD 1 — Big KPI */}
        <FloatCard
          delay={0}
          duration={5.5}
          style={{ top: "5%", right: "6%", width: 200 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <TrendingUp size={14} style={{ color: "var(--g2a-brand-teal)" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--g2a-text-muted)", textTransform: "uppercase", fontFamily: "Geist Mono, monospace" }}>
              {t("home.hero.dashboard.organicTraffic")}
            </span>
          </div>
          <div style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--g2a-text-primary)", lineHeight: 1, fontFamily: "Geist, sans-serif", letterSpacing: "-0.03em" }}>
            +340<span style={{ color: "var(--g2a-brand-teal)" }}>%</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--g2a-text-secondary)", marginTop: 4 }}>
            {t("home.hero.dashboard.vsLastQuarter")}
          </div>
        </FloatCard>

        {/* CARD 2 — Mini bar chart */}
        <FloatCard
          delay={0.6}
          duration={6.2}
          style={{ top: "38%", right: "55%", width: 170 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Activity size={14} style={{ color: "var(--g2a-brand-teal)" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--g2a-text-muted)", textTransform: "uppercase", fontFamily: "Geist Mono, monospace" }}>
              {t("home.hero.dashboard.conversions")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 56 }}>
            {[35, 50, 28, 65, 80, 55, 90].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flex: 1,
                  background: i === 6 ? "#14B8A6" : "rgba(20,184,166,0.35)",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </FloatCard>

        {/* CARD 3 — AI badge */}
        <FloatCard
          delay={1.2}
          duration={5.0}
          style={{ top: "60%", right: "8%", width: 195 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #14B8A6, #0D9488)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--g2a-text-primary)", fontFamily: "Geist, sans-serif" }}>
                {t("home.hero.dashboard.aiAuditReady")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--g2a-text-secondary)", fontFamily: "Geist Mono, monospace" }}>
                {t("home.hero.dashboard.recommendationsGenerated")}
              </div>
            </div>
          </div>
        </FloatCard>

        {/* CARD 4 — Notification */}
        <FloatCard
          delay={1.8}
          duration={5.8}
          style={{ top: "8%", right: "55%", width: 200 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--g2a-brand-teal)", boxShadow: "0 0 8px #14B8A6" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--g2a-text-muted)", textTransform: "uppercase", fontFamily: "Geist Mono, monospace" }}>
              {t("home.hero.dashboard.newLead")}
            </span>
            <Bell size={11} style={{ color: "var(--g2a-text-muted)", marginLeft: "auto" }} />
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-primary)", fontFamily: "Geist, sans-serif", fontWeight: 500 }}>
            {t("home.hero.dashboard.healthcareAudit")}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--g2a-text-muted)", marginTop: 2 }}>
            {t("home.hero.dashboard.timeAgo")}
          </div>
        </FloatCard>

        {/* CARD 5 — Progress ring */}
        <FloatCard
          delay={2.4}
          duration={5.4}
          style={{ top: "78%", right: "48%", width: 160 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ProgressRing value={98} />
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--g2a-text-muted)", textTransform: "uppercase", fontFamily: "Geist Mono, monospace" }}>
                {t("home.hero.dashboard.satisfaction")}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist, sans-serif" }}>
                98%
              </div>
            </div>
          </div>
        </FloatCard>
      </motion.div>
    </motion.div>
  );
}

function FloatCard({
  children,
  delay,
  duration,
  style,
}: {
  children: React.ReactNode;
  delay: number;
  duration: number;
  style: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: [0, -10, 0], scale: 1 }
      }
      transition={{
        opacity: { duration: 0.7, delay: 0.5 + delay * 0.2, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.7, delay: 0.5 + delay * 0.2, ease: [0.22, 1, 0.36, 1] },
        y: reduce
          ? { duration: 0.7, delay: 0.5 + delay * 0.2 }
          : { duration, delay, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        position: "absolute",
        // Theme-aware glass surface — switches between dark and light via CSS vars
        background: "var(--g2a-card-glass-base)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid var(--g2a-card-glass-border)",
        borderRadius: 14,
        padding: "1rem 1.1rem",
        boxShadow: "var(--g2a-card-glass-shadow)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--g2a-tile-border)" strokeWidth="3" />
      <motion.circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="#14B8A6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * value) / 100 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
