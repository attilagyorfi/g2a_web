import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wheel-smoothing only mounts on desktop pointer devices.
 *
 * Two reasons to skip on touch / Lighthouse-style audit environments:
 *   1. Touch devices already have native scroll inertia — Lenis just adds
 *      latency and battery drain.
 *   2. Lenis runs a `requestAnimationFrame` loop that applies
 *      `transform: translate3d(...)` to the page every frame. Lighthouse's
 *      LCP detector sees the continuous repaints and fails to identify a
 *      stable largest content paint, returning `NO_LCP` for the entire
 *      audit. Skipping Lenis on non-fine pointers (which Lighthouse mobile
 *      emulates) lets LCP measure correctly.
 *
 * Additional guard: skip if `prefers-reduced-motion: reduce` is set —
 * smooth-scroll is gratuitous motion for users who opted out.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
