/**
 * Batch content-meta update from the content-review docs (B5/B6/B7)
 * plus the remaining flagged fixes:
 *   - 9 blog articles: metaTitle ×3 locales + HU metaDescription per
 *     the 2E batch doc, with the docx B5 title tightenings baked in.
 *     Existing EN/ZH descriptions are kept (present and reasonable;
 *     the docs didn't specify replacements).
 *   - 2 newer posts (tiktok / nemzetköziesedés): Hungarian text was
 *     sitting in the ZH meta fields (generated before the languageLock
 *     fix) — replaced with real Simplified Chinese.
 *   - 28 case studies: shortened HU metaTitle (docx B6 / 2D table),
 *     brand-new metaTitleEn (docx B7 / formula) and metaTitleZh
 *     (2D formula), brand-new EN + ZH metaDescription authored from
 *     each case's existing HU description. All ≤ 60 / ≤ 155 char.
 *   - zsok: "prioritizált" → "priorizált" in the HU body copy (docx D).
 *
 * Usage:
 *   node scripts/apply-content-metas.mjs          # dry run (prints diff)
 *   node scripts/apply-content-metas.mjs --apply  # write to DB
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");

// ─── Blog posts (B5 / 2E) ────────────────────────────────────────────
const POSTS = [
  {
    slug: "miert-nem-konvertal-a-weboldalad",
    metaTitle: "Miért nem konvertál a szép weboldalad? — 5 ok | G2A",
    metaTitleEn: "Why Your Beautiful Website Doesn't Convert | G2A",
    metaTitleZh: "漂亮的网站为何不转化？5 个原因与解法 | G2A",
    metaDescription: "Egy szép weboldal önmagában nem elég. 5 konkrét ok, amiért nem konvertál — sebesség, CTA, bizalom, mobil, A/B teszt — és mit tegyél ellenük.",
  },
  {
    slug: "a-vasarlo-nem-hulye-de-elfoglalt",
    metaTitle: "A vásárló nem hülye, csak elfoglalt | G2A",
    metaTitleEn: "The Customer Isn't Stupid — Just Busy | G2A",
    metaTitleZh: "顾客不傻，只是很忙 —— 把「清晰」当作营销武器 | G2A",
    metaDescription: "A modern vásárló nem buta — csak nincs ideje kitalálni, mit akarsz. Hogyan tedd egyértelművé az üzeneted és az utat a vásárlásig.",
  },
  {
    slug: "ai-a-marketingben-hatekonysag-vagy-onamitas",
    metaTitle: "AI a marketingben: valódi hatékonyság vagy önámítás? | G2A",
    metaTitleEn: "AI in Marketing: Real Efficiency or Self-Deception? | G2A",
    metaTitleZh: "营销中的 AI：真效率还是自欺？ | G2A",
    metaDescription: "Hol hoz az AI valódi ROI-t a marketingben, és hol csak hype? Őszinte, gyakorlati kép — ahogy mi napi szinten használjuk.",
  },
  {
    slug: "marketing-ugynokseg-vs-belsos-marketinges",
    metaTitle: "Marketing ügynökség vs belsős marketinges — melyik éri meg? | G2A",
    metaTitleEn: "Marketing Agency vs In-House — Which Pays Off? | G2A",
    metaTitleZh: "营销代理 vs 内部营销——哪个更划算？ | G2A",
    metaDescription: "Mikor érdemes ügynökséget, mikor belsős marketingest, és mikor hibrid modellt választani? Költség, szakértelem, sebesség összevetése.",
  },
  {
    slug: "mesterseges-intelligencia-marketing-2026",
    metaTitle: "AI a marketingben 2026 — trendek és valóság | G2A",
    metaTitleEn: "AI in Marketing 2026 — Trends and Reality | G2A",
    metaTitleZh: "2026 年营销中的人工智能——趋势与现实 | G2A",
    metaDescription: "Mi változik 2026-ban az AI-marketingben? GEO/AEO, AI Overviews, automatizáció, perszonalizáció — és mit kezdj velük KKV-ként.",
  },
  {
    slug: "miert-bukik-el-a-legtobb-marketingkampany",
    metaTitle: "Miért bukik el a legtöbb marketingkampány? — 5 valódi ok | G2A",
    metaTitleEn: "Why Most Marketing Campaigns Fail — 5 Real Reasons | G2A",
    metaTitleZh: "为何大多数营销活动失败？5 个真正原因 | G2A",
    metaDescription: "Nem a kreatív a fő bukás-ok. Stratégia, célzás, mérés, türelem és utánkövetés — az 5 leggyakoribb hiba és a megoldásuk.",
  },
  {
    slug: "miert-eg-el-a-marketingbudzse-meres-nelkul",
    metaTitle: "Miért ég el a marketingbudzséd mérés nélkül? | G2A",
    metaTitleEn: "Why Your Marketing Budget Burns Without Measurement | G2A",
    metaTitleZh: "没有衡量，你的营销预算为何被烧光？ | G2A",
    metaDescription: "Ha nem méred, nem tudod, mi működik — és a fele pénzed elszáll. Mit, hogyan és milyen eszközzel mérj (GA4, attribúció, KPI).",
  },
  {
    slug: "miert-nem-mukodik-a-legtobb-kkv-marketingje-2026",
    metaTitle: "Miért nem működik a legtöbb KKV marketingje 2026-ban? | G2A",
    metaTitleEn: "Why Most SME Marketing Doesn't Work in 2026 | G2A",
    metaTitleZh: "2026 年大多数中小企业营销为何无效？ | G2A",
    metaDescription: "Ad-hoc posztok, stratégia és mérés nélkül. A 2026-os KKV-marketing 5 buktatója — és a kiút egy adatvezérelt rendszerrel.",
  },
  {
    slug: "nem-az-a-kerdes-hasznal-e-ai-t-a-ceged",
    metaTitle: "Nem az a kérdés, használ-e AI-t a céged — hanem hogyan | G2A",
    metaTitleEn: "The Question Isn't Whether Your Company Uses AI — But How | G2A",
    metaTitleZh: "问题不是你的公司是否用 AI——而是怎么用 | G2A",
    metaDescription: "Az AI-t már mindenki használja; a kérdés a hogyan. Stratégiai AI-integráció vs ad-hoc kísérletezés — és miért számít a különbség.",
  },
  // ZH-mező bug-fix a két újabb cikknél (magyar szöveg volt a kínai mezőben)
  {
    slug: "tiktok-hirdetesek-2026-ban-mi-var-rank",
    metaTitleZh: "TikTok 广告 2026：中小企业的新机遇",
    metaDescriptionZh: "了解 2026 年 TikTok 广告趋势，以及中小企业如何从这些变化中获益。",
  },
  {
    slug: "hol-bukik-el-a-legtobb-kkv-a-nemzetkoziesedesnel",
    metaTitleZh: "中小企业国际化最常见的失误",
    metaDescriptionZh: "了解大多数中小企业在国际化过程中的常见失误，以及如何避开这些陷阱。",
  },
];

// ─── Case studies (B6 / B7 / 2D) ─────────────────────────────────────
const CASE_STUDIES = [
  {
    slug: "m-mernoki-iroda-kft",
    metaTitle: "M Mérnöki Iroda – modern online arculat | G2A",
    metaTitleEn: "M Engineering Office – Modern Online Identity | G2A",
    metaTitleZh: "M 工程事务所 – 现代线上形象案例 | G2A",
    metaDescription: "Hogyan modernizáltuk egy 30 éves múltú mérnöki iroda online jelenlétét? Marketing stratégia, UI/UX, webfejlesztés és közösségi média esettanulmány.",
    metaDescriptionEn: "How we modernised the online presence of an engineering office with 30 years of history: strategy, UI/UX, web development and social media.",
    metaDescriptionZh: "我们如何为一家拥有 30 年历史的工程事务所更新线上形象：战略、UI/UX、网站开发与社媒。",
  },
  {
    slug: "nissan-ste-ba",
    metaTitle: "Nissan Ste-Ba – Facebook Ads esettanulmány | G2A",
    metaTitleEn: "Nissan Ste-Ba – Facebook Ads Case Study | G2A",
    metaTitleZh: "Nissan Ste-Ba – 汽车 Facebook 广告案例 | G2A",
    metaDescriptionEn: "How we built a continuous, measurable Facebook Ads presence for a Nissan dealership in Pécs — strategy, creative copy and graphics.",
    metaDescriptionZh: "我们如何为佩奇的 Nissan 经销商打造持续、可衡量的 Facebook 广告存在——战略、创意文案与设计。",
  },
  {
    slug: "honda-ste-ba",
    metaTitle: "Honda Ste-Ba – folyamatos Facebook kampányok | G2A",
    metaTitleEn: "Honda Ste-Ba – Continuous Facebook Campaigns | G2A",
    metaTitleZh: "Honda Ste-Ba – 持续 Facebook 广告案例 | G2A",
    metaDescriptionEn: "How we built the continuous Facebook presence of a Honda dealership in Pécs — strategy, creative copywriting and graphics.",
    metaDescriptionZh: "我们如何为佩奇的 Honda 经销商建立持续的 Facebook 存在——战略、创意文案与设计。",
  },
  {
    slug: "childeric-hungary",
    metaTitle: "Childéric Hungary – prémium márka piacra vezetése | G2A",
    metaTitleEn: "Childéric Hungary – Premium Brand Market Launch | G2A",
    metaTitleZh: "Childéric Hungary – 高端品牌市场引入案例 | G2A",
    metaDescriptionEn: "How we launched a French premium brand on the Hungarian market from zero: brand identity, web development, social media and analytics.",
    metaDescriptionZh: "我们如何从零开始将一个法国高端品牌引入匈牙利市场：品牌形象、网站开发、社媒与分析。",
  },
  {
    slug: "royal-sports",
    metaTitle: "Royal Sports – sport retail marketing esettanulmány | G2A",
    metaTitleEn: "Royal Sports – Multi-Channel Ad Management | G2A",
    metaTitleZh: "Royal Sports – 多渠道广告管理案例 | G2A",
    metaDescriptionEn: "How we managed a sports brand's Facebook and Google ads in parallel — a case study in multi-channel campaign strategy.",
    metaDescriptionZh: "我们如何并行管理一个运动品牌的 Facebook 与 Google 广告——多渠道广告策略案例。",
  },
  {
    slug: "cafe-frei",
    metaTitleEn: "Cafe Frei – Modern UX/UI Website for a Café | G2A",
    metaTitleZh: "Cafe Frei – 咖啡品牌 UX/UI 网站案例 | G2A",
    metaDescriptionEn: "How we redesigned the Cafe Frei website: UX/UI design in Figma, implementation on WIX — an experience-led coffee website case study.",
    metaDescriptionZh: "我们如何重新设计 Cafe Frei 网站：Figma 中的 UX/UI 设计、WIX 实现——体验型咖啡网站案例。",
  },
  {
    slug: "tuke-busz-zrt",
    metaTitle: "Tüke Busz – Facebook arculat és kommunikáció | G2A",
    metaTitleEn: "Tüke Busz – Facebook Identity for Public Transport | G2A",
    metaTitleZh: "Tüke Busz – 公共交通 Facebook 传播案例 | G2A",
    metaDescriptionEn: "How we run the Facebook account of a city public-transport company: daily content, graphics and passenger-focused communication.",
    metaDescriptionZh: "我们如何运营一家城市公交公司的 Facebook 账号：日常内容、设计与以乘客为中心的传播。",
  },
  {
    slug: "grb-skin-clinic",
    metaTitle: "GRB Skin Clinic – bőrgyógyászati klinika marketingje | G2A",
    metaTitleEn: "GRB Skin Clinic – Digital Presence for a Clinic | G2A",
    metaTitleZh: "GRB Skin Clinic – 皮肤科诊所数字营销案例 | G2A",
    metaDescriptionEn: "Complex digital marketing for a dermatology clinic: Google Ads, SEO, web development and content — all from a single team.",
    metaDescriptionZh: "为一家皮肤科诊所提供的综合数字营销：Google Ads、SEO、网站开发与内容——由同一团队完成。",
  },
  {
    slug: "webzperx",
    metaTitleEn: "WebZperX – Google Ads Case Study | G2A",
    metaTitleZh: "WebZperX – Google Ads 广告案例 | G2A",
    metaDescriptionEn: "How we built a tech company's Google Ads campaign from keyword strategy to creative copy. A G2A case study.",
    metaDescriptionZh: "我们如何为一家科技公司搭建 Google Ads 广告——从关键词战略到创意文案。",
  },
  {
    slug: "ar-works",
    metaTitleEn: "AR Works – Modern Website for an AR/VR Studio | G2A",
    metaTitleZh: "AR Works – AR/VR 公司网站开发案例 | G2A",
    metaDescriptionEn: "Website development for an augmented-reality company on WordPress, with custom HTML and CSS. A B2B tech case study.",
    metaDescriptionZh: "为一家增强现实公司开发 WordPress 网站，定制 HTML 与 CSS。B2B 科技案例。",
  },
  {
    slug: "rehab-designer",
    metaTitle: "Rehab Designer – komplett digitális arculat | G2A",
    metaTitleEn: "Rehab Designer – Full Digital Identity | G2A",
    metaTitleZh: "Rehab Designer – 完整数字形象案例 | G2A",
    metaDescriptionEn: "Building the full digital identity of an accessibility-design firm: brand, website, social media, Google Ads and analytics.",
    metaDescriptionZh: "为一家无障碍设计公司构建完整数字形象：品牌、网站、社媒、Google Ads 与分析。",
  },
  {
    slug: "vidashop",
    metaTitle: "Vidashop – webáruház Google Ads kezelés | G2A",
    metaTitleEn: "Vidashop – Google Ads for an Online Store | G2A",
    metaTitleZh: "Vidashop – 网店 Google Ads 管理案例 | G2A",
    metaDescriptionEn: "How we manage an online store's full Google Ads strategy with creative copy and continuously optimized campaigns.",
    metaDescriptionZh: "我们如何管理一家网店的整体 Google Ads 战略——创意文案与持续优化的广告活动。",
  },
  {
    slug: "alkatreszvadasz",
    metaTitle: "Alkatrészvadász – autóipari webshop esettanulmány | G2A",
    metaTitleEn: "Alkatrészvadász – Automotive Parts Webshop | G2A",
    metaTitleZh: "Alkatrészvadász – 汽车配件网店开发案例 | G2A",
    metaDescriptionEn: "A custom OpenCart webshop for automotive parts: complex product catalogue, fast filtering and a mobile-friendly UX.",
    metaDescriptionZh: "为汽车配件打造的定制 OpenCart 网店：复杂产品目录、快速筛选与移动端友好体验。",
  },
  {
    slug: "donkey-pizza",
    metaTitle: "Donkey Pizza – közösségi média marketing | G2A",
    metaTitleEn: "Donkey Pizza – Social Media Marketing | G2A",
    metaTitleZh: "Donkey Pizza – 餐饮社媒营销案例 | G2A",
    metaDescriptionEn: "How we manage a pizzeria's Facebook, Instagram, TikTok and Google presence at once — one consistent brand voice across channels.",
    metaDescriptionZh: "我们如何同时运营一家披萨店的 Facebook、Instagram、TikTok 与 Google——多渠道统一品牌声音。",
  },
  {
    slug: "buborekpark",
    metaTitle: "Buborékpark – weboldal és hirdetések | G2A",
    metaTitleEn: "Buborékpark – Website and Ads | G2A",
    metaTitleZh: "Buborékpark – 网站与广告案例 | G2A",
    metaDescriptionEn: "A mobile-friendly WordPress website and local Google Ads campaigns for a family leisure attraction.",
    metaDescriptionZh: "为一家家庭休闲乐园打造移动端友好的 WordPress 网站与本地 Google Ads 广告。",
  },
  {
    slug: "dent-beauty",
    metaTitle: "Dent & Beauty – fogászati klinika weboldala | G2A",
    metaTitleEn: "Dent & Beauty – Website for a Dental Clinic | G2A",
    metaTitleZh: "Dent & Beauty – 牙科诊所网站案例 | G2A",
    metaDescriptionEn: "A mobile-friendly WordPress website for a dental and aesthetic clinic, with a patient-focused UX.",
    metaDescriptionZh: "为一家牙科与美学诊所打造移动端友好的 WordPress 网站——以患者为中心的体验。",
  },
  {
    slug: "vapor-spirit",
    metaTitleEn: "Vapor Spirit – Shopify E-commerce Store | G2A",
    metaTitleZh: "Vapor Spirit – Shopify 电商网店案例 | G2A",
    metaDescriptionEn: "A Shopify-based webshop for a CBD products company: integrated payments and an easily extensible product catalogue.",
    metaDescriptionZh: "为一家 CBD 产品公司打造 Shopify 网店：集成支付、易扩展的产品目录。",
  },
  {
    slug: "royal-portrait",
    metaTitle: "Royal Portrait – kép-központú weboldal és arculat | G2A",
    metaTitleEn: "Royal Portrait – Image-Led Website and Identity | G2A",
    metaTitleZh: "Royal Portrait – 摄影网站与形象案例 | G2A",
    metaDescriptionEn: "An image-led WordPress website for a portrait photographer: visual identity, graphic elements and a portfolio experience.",
    metaDescriptionZh: "为一位人像摄影师打造以影像为核心的 WordPress 网站：视觉识别、设计元素与作品集体验。",
  },
  {
    slug: "eno-ceramics",
    metaTitle: "ENO Ceramics – weboldal és SEO-stratégia | G2A",
    metaTitleEn: "ENO Ceramics – Website and SEO Strategy | G2A",
    metaTitleZh: "ENO Ceramics – 网站与 SEO 战略案例 | G2A",
    metaDescriptionEn: "WordPress web design and a comprehensive SEO strategy for a premium ceramics brand. A design-led case study.",
    metaDescriptionZh: "为一个高端陶瓷品牌提供 WordPress 网页设计与全面 SEO 战略。以设计为先的案例。",
  },
  {
    slug: "variatok",
    metaTitle: "Variátok – egyedi WordPress weboldal | G2A",
    metaTitleEn: "Variátok – Custom WordPress Website | G2A",
    metaTitleZh: "Variátok – 定制 WordPress 网站案例 | G2A",
    metaDescriptionEn: "A custom WordPress website for Variatok with an easy-to-manage content structure.",
    metaDescriptionZh: "为 Variatok 打造的定制 WordPress 网站——内容结构易于管理。",
  },
  {
    slug: "granvisus",
    metaTitle: "Granvisus – közösségi média menedzsment | G2A",
    metaTitleEn: "Granvisus – Social Media Management | G2A",
    metaTitleZh: "Granvisus – 社媒运营案例 | G2A",
    metaDescriptionEn: "How we manage the Facebook and Instagram presence of a premium eyewear brand — a lifestyle-led social media case study.",
    metaDescriptionZh: "我们如何运营一个高端眼镜品牌的 Facebook 与 Instagram——以生活方式为导向的社媒案例。",
  },
  {
    slug: "zsok",
    metaTitleEn: "ZSÖK – Zsolnay Heritage SEO Audit | G2A",
    metaTitleZh: "ZSÖK – 若尔奈文化遗产 SEO 审计案例 | G2A",
    metaDescriptionEn: "An SEO audit with prioritized recommendations for the Zsolnay Heritage Management Nonprofit. A cultural nonprofit case study.",
    metaDescriptionZh: "为 Zsolnay 文化遗产管理非营利机构提供 SEO 审计与按优先级排序的优化建议。",
  },
  {
    slug: "proverium-ugyvedi-iroda",
    metaTitle: "Proverium Ügyvédi Iroda – digitális megjelenés | G2A",
    metaTitleEn: "Proverium Law Firm – Authoritative Digital Presence | G2A",
    metaTitleZh: "Proverium 律师事务所 – 数字形象案例 | G2A",
    metaDescriptionEn: "A WordPress website, SEO and graphic templates for a law firm — an authoritative online presence in the legal sector.",
    metaDescriptionZh: "为一家律师事务所提供 WordPress 网站、SEO 与设计模板——法律行业的权威线上形象。",
  },
  {
    slug: "aktual-mernokiroda-kft",
    metaTitle: "Aktuál Mérnökiroda – WordPress weboldal és SEO | G2A",
    metaTitleEn: "Aktuál Mérnökiroda – WordPress Website and SEO | G2A",
    metaTitleZh: "Aktuál 工程事务所 – WordPress 网站与 SEO 案例 | G2A",
    metaDescriptionEn: "A modern WordPress website and SEO strategy for an engineering design office — measurable online visibility.",
    metaDescriptionZh: "为一家工程设计事务所打造现代 WordPress 网站与 SEO 战略——可衡量的线上可见度。",
  },
  {
    slug: "korean-autohaz-kft",
    metaTitle: "Korean Autóház – komplex autóipari marketing | G2A",
    metaTitleEn: "Korean Autóház – Automotive Marketing | G2A",
    metaTitleZh: "Korean Autóház – 综合汽车营销案例 | G2A",
    metaDescriptionEn: "A complete marketing package for a car dealership: WordPress, Google Ads, social media and SEO under one strategy.",
    metaDescriptionZh: "为一家汽车经销商提供完整营销组合：WordPress、Google Ads、社媒与 SEO，统一战略。",
  },
  {
    slug: "emi-tuv-sud",
    metaTitle: "ÉMI-TÜV SÜD – SEO és hirdetési tanácsadás | G2A",
    metaTitleEn: "ÉMI-TÜV SÜD – SEO and Advertising Consulting | G2A",
    metaTitleZh: "ÉMI-TÜV SÜD – SEO 与广告咨询案例 | G2A",
    metaDescriptionEn: "An SEO review and advertising consulting for a B2B certification company — measurement-based decision support.",
    metaDescriptionZh: "为一家 B2B 认证公司提供 SEO 评估与广告咨询——以测量为基础的决策支持。",
  },
  {
    slug: "innok-tudasmenedzsment-intezet-nonprofit-kft",
    metaTitle: "InnoK – teljes brand- és tartalmi ökoszisztéma | G2A",
    metaTitleEn: "InnoK – Full Brand and Content Ecosystem | G2A",
    metaTitleZh: "InnoK – 品牌与内容生态系统案例 | G2A",
    metaDescriptionEn: "Brand identity, website, social media, photo/video and PR — delivered by a single team for a knowledge-management institute.",
    metaDescriptionZh: "品牌形象、网站、社媒、摄影/视频与公关——由同一团队为一家知识管理机构交付。",
  },
  {
    slug: "finadin-solutions",
    metaTitle: "FinAdin Solutions – SEO, hirdetés, CRM tanácsadás | G2A",
    metaTitleEn: "FinAdin Solutions – SEO, Ads and CRM Consulting | G2A",
    metaTitleZh: "FinAdin Solutions – SEO、广告与 CRM 咨询案例 | G2A",
    metaDescriptionEn: "An SEO review, advertising consulting and CRM optimization for a financial B2B company. A complex case study.",
    metaDescriptionZh: "为一家金融 B2B 公司提供 SEO 评估、广告咨询与 CRM 优化。综合案例。",
  },
];

// ─── Length sanity (warn only) ───────────────────────────────────────
const warn = (where, field, val, cap) => {
  if (val && val.length > cap) console.warn(`  ⚠ ${where}.${field} ${val.length} > ${cap}: ${val.slice(0, 70)}…`);
};
for (const p of POSTS) {
  warn(p.slug, "metaTitle", p.metaTitle, 65);
  warn(p.slug, "metaTitleEn", p.metaTitleEn, 65);
  warn(p.slug, "metaDescription", p.metaDescription, 155);
}
for (const c of CASE_STUDIES) {
  warn(c.slug, "metaTitle", c.metaTitle, 60);
  warn(c.slug, "metaTitleEn", c.metaTitleEn, 60);
  warn(c.slug, "metaDescriptionEn", c.metaDescriptionEn, 155);
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let updated = 0;
try {
  for (const p of POSTS) {
    const { slug, ...fields } = p;
    const keys = Object.keys(fields);
    if (!APPLY) {
      console.log(`[dry] posts/${slug}: ${keys.join(", ")}`);
      continue;
    }
    const setSql = keys.map((k) => `\`${k}\` = ?`).join(", ");
    const [res] = await conn.query(
      `UPDATE posts SET ${setSql} WHERE slug = ?`,
      [...keys.map((k) => fields[k]), slug],
    );
    console.log(`posts/${slug}: ${res.affectedRows} sor (${keys.length} mező)`);
    updated += res.affectedRows;
  }

  for (const c of CASE_STUDIES) {
    const { slug, ...fields } = c;
    const keys = Object.keys(fields);
    if (!APPLY) {
      console.log(`[dry] case_studies/${slug}: ${keys.join(", ")}`);
      continue;
    }
    const setSql = keys.map((k) => `\`${k}\` = ?`).join(", ");
    const [res] = await conn.query(
      `UPDATE case_studies SET ${setSql} WHERE slug = ?`,
      [...keys.map((k) => fields[k]), slug],
    );
    console.log(`case_studies/${slug}: ${res.affectedRows} sor (${keys.length} mező)`);
    updated += res.affectedRows;
  }

  // zsok: prioritizált → priorizált (docx D) in HU body fields
  if (APPLY) {
    const [res] = await conn.query(
      `UPDATE case_studies SET
         challenge = REPLACE(challenge, 'prioritizált', 'priorizált'),
         solution  = REPLACE(solution,  'prioritizált', 'priorizált'),
         results   = REPLACE(results,   'prioritizált', 'priorizált')
       WHERE slug = 'zsok'`,
    );
    console.log(`zsok prioritizált→priorizált: ${res.affectedRows} sor`);
  } else {
    console.log(`[dry] zsok: prioritizált → priorizált (challenge/solution/results)`);
  }

  console.log(APPLY ? `\n✓ Kész — ${updated} sor frissítve.` : `\n[dry run] — futtasd --apply kapcsolóval az íráshoz.`);
} finally {
  await conn.end();
}
