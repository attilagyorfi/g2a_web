/**
 * Skeleton placeholder for admin list pages while data is fetching.
 * Renders 5 row-shaped shimmer blocks — gives the user something to look at
 * instead of a flash of "Betöltés..." text.
 */
import { SkeletonBlock } from "@/components/Skeleton";

export default function AdminListSkeleton({ rows = 5, asCards = false }: { rows?: number; asCards?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }} aria-hidden="true" aria-label="Betöltés">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "var(--g2a-tile)",
            border: "1px solid var(--g2a-tile-border)",
            borderRadius: asCards ? 10 : 6,
            padding: asCards ? "1.25rem" : "0.875rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <SkeletonBlock width={28} height={28} radius={6} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <SkeletonBlock width="40%" height={14} />
            <SkeletonBlock width="65%" height={11} />
          </div>
          <SkeletonBlock width={64} height={12} />
        </div>
      ))}
    </div>
  );
}
