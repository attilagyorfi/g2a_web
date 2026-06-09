/**
 * HU → EN / ZH dictionary for case study tags.
 *
 * Audit §3.2b — case study tag chips were rendered raw from the DB
 * (Hungarian-only freeform text), so EN/ZH visitors saw "MARKETING
 * STRATÉGIA" and "WEBFEJLESZTÉS" plastered across the localised pages.
 * A full multilingual tags column in the DB is overkill — the working
 * vocabulary is small and stable — so we map at the render layer.
 *
 * Keys are case-insensitive; values are written natural-case and the
 * render-site applies its own uppercase styling. Unknown tags pass
 * through unchanged so admin-added niche tags don't disappear from
 * EN/ZH versions, they just stay in Hungarian.
 */
import type { Language } from "@/contexts/LanguageContext";

type LocaleMap = Record<"en" | "zh", string>;

const TAG_DICT: Record<string, LocaleMap> = {
  // ─── Strategy / branding ───────────────────────────────
  "marketing stratégia": { en: "Marketing strategy", zh: "营销战略" },
  "b2b marketing stratégia": { en: "B2B marketing strategy", zh: "B2B 营销战略" },
  "stratégia": { en: "Strategy", zh: "战略" },
  "branding": { en: "Branding", zh: "品牌建设" },
  "brand pozicionálás": { en: "Brand positioning", zh: "品牌定位" },
  "márkaépítés": { en: "Brand building", zh: "品牌建设" },
  "rebrand": { en: "Rebrand", zh: "品牌重塑" },
  "pozicionálás": { en: "Positioning", zh: "定位" },

  // ─── Web / dev ─────────────────────────────────────────
  "webfejlesztés": { en: "Web development", zh: "网站开发" },
  "weboldal": { en: "Website", zh: "网站" },
  "weboldalfejlesztés": { en: "Website development", zh: "网站开发" },
  "webdesign": { en: "Web design", zh: "网页设计" },
  "ux/ui": { en: "UX/UI", zh: "用户体验/界面" },
  "landing page": { en: "Landing page", zh: "落地页" },
  "e-commerce": { en: "E-commerce", zh: "电商" },
  "webshop": { en: "Webshop", zh: "网店" },

  // ─── SEO / SEM ─────────────────────────────────────────
  "seo": { en: "SEO", zh: "SEO" },
  "lokális seo": { en: "Local SEO", zh: "本地 SEO" },
  "technikai seo": { en: "Technical SEO", zh: "技术 SEO" },
  "on-page seo": { en: "On-page SEO", zh: "页面 SEO" },
  "tartalom seo": { en: "Content SEO", zh: "内容 SEO" },
  "kulcsszókutatás": { en: "Keyword research", zh: "关键词研究" },

  // ─── Paid media ────────────────────────────────────────
  "google ads": { en: "Google Ads", zh: "Google Ads" },
  "ppc": { en: "PPC", zh: "PPC" },
  "meta hirdetés": { en: "Meta ads", zh: "Meta 广告" },
  "facebook ads": { en: "Facebook Ads", zh: "Facebook 广告" },
  "instagram ads": { en: "Instagram Ads", zh: "Instagram 广告" },
  "linkedin ads": { en: "LinkedIn Ads", zh: "LinkedIn 广告" },
  "hirdetéskezelés": { en: "Paid media", zh: "付费广告" },
  "performance marketing": { en: "Performance marketing", zh: "效果营销" },
  "remarketing": { en: "Remarketing", zh: "再营销" },

  // ─── Content / social ──────────────────────────────────
  "tartalommarketing": { en: "Content marketing", zh: "内容营销" },
  "közösségi média": { en: "Social media", zh: "社交媒体" },
  "social media": { en: "Social media", zh: "社交媒体" },
  "blog": { en: "Blog", zh: "博客" },
  "videómarketing": { en: "Video marketing", zh: "视频营销" },
  "podcast": { en: "Podcast", zh: "播客" },
  "linkedin": { en: "LinkedIn", zh: "LinkedIn" },

  // ─── Email / automation ────────────────────────────────
  "email marketing": { en: "Email marketing", zh: "电子邮件营销" },
  "e-mail marketing": { en: "Email marketing", zh: "电子邮件营销" },
  "hírlevél": { en: "Newsletter", zh: "电子通讯" },
  "marketing automatizáció": { en: "Marketing automation", zh: "营销自动化" },
  "crm": { en: "CRM", zh: "CRM" },

  // ─── International / localisation ──────────────────────
  "nemzetközi marketing": { en: "International marketing", zh: "国际营销" },
  "lokalizáció": { en: "Localisation", zh: "本地化" },
  "kínai piac": { en: "Chinese market", zh: "中国市场" },
  "wechat": { en: "WeChat", zh: "微信" },
  "baidu": { en: "Baidu", zh: "百度" },

  // ─── Analytics / CRO ───────────────────────────────────
  "analitika": { en: "Analytics", zh: "数据分析" },
  "ga4": { en: "GA4", zh: "GA4" },
  "konverzió optimalizálás": { en: "Conversion optimisation", zh: "转化率优化" },
  "konverzióoptimalizálás": { en: "Conversion optimisation", zh: "转化率优化" },
  "cro": { en: "CRO", zh: "CRO" },
  "a/b teszt": { en: "A/B testing", zh: "A/B 测试" },

  // ─── Industry tags (commonly seen on B2B case studies) ─
  "egészségügy": { en: "Healthcare", zh: "医疗" },
  "autóipar": { en: "Automotive", zh: "汽车业" },
  "fintech": { en: "Fintech", zh: "金融科技" },
  "saas": { en: "SaaS", zh: "SaaS" },
  "ipari": { en: "Industrial", zh: "工业" },
  "b2b": { en: "B2B", zh: "B2B" },
  "kkv": { en: "SME", zh: "中小企业" },
};

/**
 * Translate a case study tag from Hungarian to the requested locale.
 * Returns the original tag verbatim if no mapping exists — admins can
 * always add niche tags without code changes; the HU rendering stays
 * intact on EN/ZH pages as a fallback.
 */
export function translateCaseStudyTag(tag: string, lang: Language): string {
  if (lang === "hu") return tag;
  const key = tag.trim().toLowerCase();
  const entry = TAG_DICT[key];
  if (!entry) return tag;
  return entry[lang];
}
