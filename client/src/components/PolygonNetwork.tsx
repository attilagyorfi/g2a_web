import { useEffect, useRef } from "react";

type Props = {
  /** Pontok sűrűsége: ~0.4 ritka, ~0.8 sűrű (per 10000 px²) */
  density?: number;
  /** Mozgási sebesség (px/s) */
  speed?: number;
  /** Vonal-rajzolási küszöb (px) */
  maxDistance?: number;
  /** rgb tripla string ("255,255,255") */
  color?: string;
  /** Pont alpha 0..1 */
  pointAlpha?: number;
  /** Vonal max alpha 0..1 (a távolsággal csökken) */
  lineAlpha?: number;
  pointRadius?: number;
  lineWidth?: number;
  /** Kurzor körüli taszítási sugár (0 = kikapcsolva) */
  mouseRadius?: number;
  /** true: fixed viewport, false: kitölti a parentet (absolute) */
  fixed?: boolean;
  /** Globális opacity a canvas-on */
  opacity?: number;
  /** Min/max pont szám hard cap */
  minPoints?: number;
  maxPoints?: number;
};

export default function PolygonNetwork({
  density = 0.45,
  speed = 22,
  maxDistance = 145,
  color = "255,255,255",
  pointAlpha = 0.55,
  lineAlpha = 0.18,
  pointRadius = 1.4,
  lineWidth = 0.7,
  mouseRadius = 180,
  fixed = true,
  opacity = 1,
  minPoints = 25,
  maxPoints = 130,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;

    const measure = () => {
      if (fixed) {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const rect = canvas.parentElement?.getBoundingClientRect();
        width = rect?.width ?? window.innerWidth;
        height = rect?.height ?? window.innerHeight;
      }
    };

    const resize = () => {
      measure();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(
        minPoints,
        Math.min(maxPoints, Math.round(((width * height) / 10000) * density))
      );

      if (particles.length === 0) {
        particles = Array.from({ length: target }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
        }));
      } else if (target > particles.length) {
        for (let i = particles.length; i < target; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
          });
        }
      } else if (target < particles.length) {
        particles.length = target;
      }

      for (const p of particles) {
        if (p.x > width) p.x = width * Math.random();
        if (p.y > height) p.y = height * Math.random();
      }
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx * speed * dt;
        p.y += p.vy * speed * dt;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        if (mouseRadius > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < mouseRadius * mouseRadius && d2 > 1) {
            const dist = Math.sqrt(d2);
            const force = (mouseRadius - dist) / mouseRadius;
            p.x += (dx / dist) * force * 1.4;
            p.y += (dy / dist) * force * 1.4;
          }
        }
      }

      ctx.lineWidth = lineWidth;
      const md2 = maxDistance * maxDistance;
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < md2) {
            const a = (1 - d2 / md2) * lineAlpha;
            ctx.strokeStyle = `rgba(${color},${a})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgba(${color},${pointAlpha})`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (mouseRadius > 0) {
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("mouseleave", onLeave);
    }

    if (reduce) {
      tick(performance.now());
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, speed, maxDistance, color, pointAlpha, lineAlpha, pointRadius, lineWidth, mouseRadius, fixed, minPoints, maxPoints]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: fixed ? "fixed" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}
