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

/**
 * Strict variant — NO Hungarian fallback for EN/ZH.
 *
 * Returns the value for the requested language only: the HU `field` for `hu`,
 * the `fieldEn`/`fieldZh` column for `en`/`zh`, and "" when that localized
 * column is empty. This is what page-level SEO overrides need: admin `pages`
 * records often have only the HU `metaTitle` filled, so `pickLocalized` would
 * leak Hungarian onto EN/ZH pages. With the strict picker the caller can do
 * `pickLocalizedStrict(seo, "metaTitle", lang) || t("...seoTitle")` and get the
 * localized default whenever a language-specific override isn't present.
 */
export function pickLocalizedStrict<T extends Record<string, unknown>, K extends string>(
  row: T | null | undefined,
  field: K,
  lang: Lang,
): string {
  if (!row) return "";
  if (lang === "hu") {
    const base = (row as Record<string, unknown>)[field];
    return typeof base === "string" ? base : "";
  }
  const suffix = lang === "en" ? "En" : "Zh";
  const localized = (row as Record<string, unknown>)[`${field}${suffix}`];
  return typeof localized === "string" && localized.trim().length > 0 ? localized : "";
}
