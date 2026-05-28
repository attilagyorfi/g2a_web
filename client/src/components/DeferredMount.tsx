/**
 * Defers mounting its children until after the first paint + a configurable
 * delay. Used to keep heavy, continuously-animating background components
 * (animated blobs, cursor spotlight, floating dashboard collage,
 * polygon-network canvas) off the critical render path.
 *
 * Why this matters for Lighthouse / Core Web Vitals:
 *   - Components that run `requestAnimationFrame` loops or apply changing
 *     `transform` / `filter` values every frame put the layout in a state
 *     of continuous repaint. The LCP detector can't lock onto a "stable
 *     largest element" and reports NO_LCP, blocking every subsequent audit.
 *   - Deferring mount by ~200ms gives the LCP detector a clean window:
 *     the static hero H1 renders, LCP fires, audits score normally, then
 *     the decorative chrome fades in.
 *
 * For real users the 200ms delay is imperceptible — these elements are
 * background polish anyway, not first-glance content.
 */
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Milliseconds to wait after first paint before mounting children. */
  delay?: number;
};

export default function DeferredMount({ children, delay = 200 }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // requestIdleCallback when available (browsers schedule it after the page
    // is genuinely idle); fall back to setTimeout for Safari/older.
    const ric =
      (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback;
    if (ric) {
      const id = ric(() => setShow(true), { timeout: delay + 500 });
      const fallback = window.setTimeout(() => setShow(true), delay + 1000);
      return () => {
        const cic =
          (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        if (cic) cic(id);
        window.clearTimeout(fallback);
      };
    }
    const id = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  if (!show) return null;
  return <>{children}</>;
}
