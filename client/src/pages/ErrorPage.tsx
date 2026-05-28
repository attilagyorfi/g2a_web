/**
 * Generic error page — rendered by ErrorBoundary when a React tree throws,
 * and reachable directly at `/500` if we ever want to test it.
 *
 * Design mirrors NotFound's brand language (obsidian hero + teal accent +
 * helpful CTAs) so the user doesn't suddenly land on a generic shadcn
 * screen if something goes wrong. The error stack trace is collapsed
 * behind a "details" disclosure and only auto-expanded in dev mode so
 * production visitors don't see internals.
 */
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Home, RotateCcw, AlertTriangle, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

interface ErrorPageProps {
  error?: Error | null;
  /** Reset handler — usually wired to component re-mount or location change. */
  onReset?: () => void;
}

export default function ErrorPage({ error, onReset }: ErrorPageProps) {
  const reduce = useReducedMotion();
  // Show full stack trace in development; only the short message in production.
  const isDev = import.meta.env.DEV;

  const handleRetry = () => {
    if (onReset) onReset();
    else window.location.reload();
  };

  return (
    <>
      <SeoHead
        title="Hiba történt — G2A Marketing"
        description="Váratlan hiba történt az oldal betöltése során."
        noIndex
      />
      <Navigation />
      <main
        style={{
          paddingTop: "100px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(239,68,68,0.10) 0%, transparent 55%), var(--g2a-bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="g2a-grid-pattern"
          style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }}
        />
        <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem", maxWidth: 720 }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            <AlertTriangle size={12} /> Hiba történt
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="g2a-headline-xl"
            style={{ marginBottom: "1.25rem" }}
          >
            Valami félrement.{" "}
            <span className="g2a-gradient-text">Sajnáljuk.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              fontSize: "1.05rem",
              color: "var(--g2a-text-secondary)",
              lineHeight: "1.7",
              maxWidth: "560px",
              marginBottom: "1.5rem",
              fontFamily: "Geist, sans-serif",
            }}
          >
            Az oldal betöltése közben váratlan hiba történt. Próbáld újra a frissítést — ha továbbra is hibát kapsz, vedd fel velünk a kapcsolatot.
          </motion.p>

          {/* Error message — short, plain, only visible in production. Stack
              trace is dev-only behind a <details>. */}
          {error?.message && !isDev && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.78rem",
                color: "var(--g2a-text-muted)",
                marginBottom: "2rem",
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(239,68,68,0.2)",
                maxWidth: "560px",
              }}
            >
              <div style={{ color: "#f87171", fontSize: "0.65rem", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Hibakód
              </div>
              {error.message.slice(0, 200)}
            </motion.div>
          )}

          {isDev && error?.stack && (
            <motion.details
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              open
              style={{
                marginBottom: "2rem",
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(239,68,68,0.2)",
                maxWidth: "100%",
              }}
            >
              <summary style={{ cursor: "pointer", color: "#f87171", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Stack trace (csak dev környezetben látható)
              </summary>
              <pre
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.7rem",
                  color: "var(--g2a-text-muted)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflow: "auto",
                  maxHeight: 240,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {error.stack}
              </pre>
            </motion.details>
          )}

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}
          >
            <button
              onClick={handleRetry}
              className="g2a-btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", border: "none", font: "inherit" }}
            >
              <RotateCcw size={16} /> Próbáld újra
            </button>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span className="g2a-btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Home size={16} /> Vissza a főoldalra
              </span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="g2a-btn-secondary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", border: "none", font: "inherit" }}
            >
              <ArrowLeft size={16} /> Előző oldal
            </button>
          </motion.div>

          {/* Support contact */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(20,184,166,0.06)",
              border: "1px solid rgba(20,184,166,0.2)",
              maxWidth: 560,
              fontSize: "0.85rem",
              color: "var(--g2a-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Ha a hiba ismétlődik, kérlek jelezd:{" "}
            <a
              href="mailto:info@g2amarketing.hu?subject=Weboldal%20hiba"
              style={{
                color: "var(--g2a-brand-teal)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
              }}
            >
              <Mail size={13} /> info@g2amarketing.hu
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
