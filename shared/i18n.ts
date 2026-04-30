/**
 * Language-aware field picker.
 *
 * DB rows have `field`, `fieldEn`, `fieldZh` columns (HU is the default in `field`).
 * Call `pickLocalized(row, "title", lang)` to get the right value with HU fallback.
 */
export type Lang = "hu" | "en" | "zh";

export function pickLocalized<T extends Record<string, unknown>, K extends string>(
  row: T | null | undefined,
  field: K,
  lang: Lang,
): string {
  if (!row) return "";
  const base = (row as Record<string, unknown>)[field];
  if (lang === "hu") return typeof base === "string" ? base : "";
  const suffix = lang === "en" ? "En" : "Zh";
  const localized = (row as Record<string, unknown>)[`${field}${suffix}`];
  if (typeof localized === "string" && localized.trim().length > 0) return localized;
  return typeof base === "string" ? base : "";
}
