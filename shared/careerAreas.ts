/**
 * Activity areas an applicant can pick on the career page ("what would you
 * enjoy working on?"). Shared so the form checkboxes, the server-side
 * validation, the confirmation/notification emails, and the admin view all
 * speak the same keys. Labels are trilingual.
 */
export type Lang = "hu" | "en" | "zh";

export type CareerArea = {
  key: string;
  label: Record<Lang, string>;
};

export const CAREER_AREAS: CareerArea[] = [
  { key: "content_seo", label: { hu: "Tartalomgyártás & SEO", en: "Content & SEO", zh: "内容创作与 SEO" } },
  { key: "ppc", label: { hu: "Hirdetéskezelés (PPC)", en: "Paid ads (PPC)", zh: "付费广告（PPC）" } },
  { key: "social", label: { hu: "Közösségi média", en: "Social media", zh: "社交媒体" } },
  { key: "ai_marketing", label: { hu: "AI-marketing & automatizáció", en: "AI marketing & automation", zh: "AI 营销与自动化" } },
  { key: "account", label: { hu: "B2B account management", en: "B2B account management", zh: "B2B 客户管理" } },
  { key: "strategy", label: { hu: "Marketingstratégia", en: "Marketing strategy", zh: "营销战略" } },
  { key: "webdev", label: { hu: "Webfejlesztés", en: "Web development", zh: "网站开发" } },
  { key: "design", label: { hu: "Grafika & arculat", en: "Graphic design & branding", zh: "平面设计与品牌" } },
  { key: "video", label: { hu: "Videó & kreatív", en: "Video & creative", zh: "视频与创意" } },
  { key: "other", label: { hu: "Egyéb", en: "Other", zh: "其他" } },
];

const AREA_MAP = new Map(CAREER_AREAS.map((a) => [a.key, a]));

/** True when every key is a known area. */
export function areValidAreaKeys(keys: string[]): boolean {
  return keys.every((k) => AREA_MAP.has(k));
}

/** Human labels for a set of keys, in the given language (for emails / admin). */
export function areaLabels(keys: string[], lang: Lang = "hu"): string[] {
  return keys.map((k) => AREA_MAP.get(k)?.label[lang] ?? k);
}
