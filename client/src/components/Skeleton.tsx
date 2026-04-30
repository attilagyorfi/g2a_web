/**
 * Theme-aware skeleton loader. Use to fill space while data is fetching, so the
 * page doesn't flicker between blank and rendered.
 *
 * Variants:
 *  - <Skeleton.Block /> — generic rectangle
 *  - <Skeleton.Text lines={3} /> — paragraph placeholder
 *  - <Skeleton.HeroPage /> — full hero+content layout for service/blog/case detail
 *
 * The shimmer animation uses CSS keyframes — no JS, GPU-accelerated.
 */
import { CSSProperties } from "react";

const baseStyle: CSSProperties = {
  background: "linear-gradient(90deg, var(--g2a-tile) 0%, var(--g2a-card-glass-base) 50%, var(--g2a-tile) 100%)",
  backgroundSize: "200% 100%",
  borderRadius: 6,
  animation: "g2a-shimmer 1.6s ease-in-out infinite",
};

export function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 6,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: CSSProperties;
}) {
  return <div style={{ ...baseStyle, width, height, borderRadius: radius, ...style }} aria-hidden="true" />;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = "70%",
  gap = 10,
}: {
  lines?: number;
  lastLineWidth?: string | number;
  gap?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          height={14}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Full-page hero + content skeleton — matches the layout of service/blog detail pages.
 * Use as: <SkeletonHeroPage /> while the tRPC query is loading.
 */
export function SkeletonHeroPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--g2a-bg)" }} aria-hidden="true" aria-label="Tartalom betöltése">
      <div style={{ height: 80 }} /> {/* nav placeholder */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Hero */}
        <SkeletonBlock width={120} height={20} radius={4} style={{ marginBottom: 18 }} />
        <SkeletonBlock width="80%" height={48} radius={4} style={{ marginBottom: 14 }} />
        <SkeletonBlock width="55%" height={48} radius={4} style={{ marginBottom: 24 }} />
        <SkeletonText lines={3} lastLineWidth="60%" />
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <SkeletonBlock width={160} height={44} radius={6} />
          <SkeletonBlock width={140} height={44} radius={6} />
        </div>

        {/* Content card grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 60 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ padding: 20, background: "var(--g2a-tile)", borderRadius: 10, border: "1px solid var(--g2a-tile-border)" }}>
              <SkeletonBlock width={36} height={36} radius={8} style={{ marginBottom: 14 }} />
              <SkeletonBlock width="80%" height={18} style={{ marginBottom: 10 }} />
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Skeleton = {
  Block: SkeletonBlock,
  Text: SkeletonText,
  HeroPage: SkeletonHeroPage,
};

export default Skeleton;
