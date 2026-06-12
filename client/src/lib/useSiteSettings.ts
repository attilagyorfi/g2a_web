/**
 * Shared hook for reading admin-configured site settings.
 *
 * The settings panel (AdminSettings.tsx) writes key/value rows to the
 * `site_settings` table — but historically those rows weren't actually
 * wired into the rendering layer, so editing e.g. `instagram_url` had
 * no effect on what the footer/navigation actually rendered. This hook
 * centralises the lookup so every consumer (Footer, Navigation,
 * jsonLd builders, etc.) reads from one place.
 *
 * Usage:
 *   const settings = useSiteSettings();
 *   const instagram = settings.get("instagram_url", FALLBACK_URL);
 *
 * Behaviour notes:
 *   - The tRPC query is shared across the React tree (staleTime 5min)
 *     so calling this hook in multiple components is cheap.
 *   - `get(key, fallback)` returns the fallback when the setting is
 *     unset, empty, or while the query is still loading — so the UI
 *     never flashes a blank URL during the first paint.
 *   - Values are trimmed of surrounding whitespace before comparison.
 */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";

export type SiteSettingsHook = {
  /** Returns the configured setting, or `fallback` if unset/loading. */
  get: (key: string, fallback?: string) => string;
  /** Raw key/value map — handy for components that want to drive a
   *  list (e.g. injecting multiple analytics scripts). */
  all: Record<string, string>;
  /** True while the initial tRPC query is in flight. Most callers
   *  don't need this — the `get` fallback already handles the gap. */
  loading: boolean;
};

export function useSiteSettings(): SiteSettingsHook {
  const { data, isLoading } = trpc.content.siteSettings.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const all = useMemo(() => {
    const map: Record<string, string> = {};
    if (Array.isArray(data)) {
      for (const row of data as Array<{ key: string; value: string | null | undefined }>) {
        const v = (row.value ?? "").trim();
        if (v) map[row.key] = v;
      }
    }
    return map;
  }, [data]);

  return {
    get: (key, fallback = "") => all[key] ?? fallback,
    all,
    loading: isLoading,
  };
}
