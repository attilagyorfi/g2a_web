/**
 * Update services rows in TiDB with strategy-doc-aligned content.
 *
 * Per the strategy document section 4.3-4.13, we improve:
 *   - shortDescription (HU/EN/ZH): the card-level pitch under the title
 *   - heroSubtitle (HU/EN/ZH): the page-hero lead paragraph
 *   - metaTitle (HU/EN/ZH): SEO title under 60 chars with primary keyword
 *   - metaDescription (HU/EN/ZH): SEO description 140–160 chars, with CTA
 *
 * Idempotent: looks up by slug. Doesn't touch admin-curated `content`,
 * `heroTitle` (kept short and brand-y), `heroImage`, `sortOrder`, `icon` —
 * these stay under admin control.
 *
 * Run: node --env-file=.env scripts/seed-service-content.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set — run with --env-file=.env");
  process.exit(1);
}

const SERVICES = [
  {
    slug: "strategiai-marketing",
    titleHu: "Stratégiai Marketing",
    titleEn: "Strategic Marketing",
    titleZh: "战略营销",
    shortHu:
      "Audit, piackutatás, célcsoport-meghatározás és akcióterv. Építs adatvezérelt marketingrendszert, amely pontos célokat és KPI-okat tartalmaz.",
    shortEn:
      "Audit, market research, persona definition and an action plan. Build a data-driven marketing system with clear goals and KPIs.",
    shortZh:
      "审计、市场研究、用户画像与行动计划。构建包含明确目标与 KPI 的数据驱动营销系统。",
    heroSubHu:
      "A sikeres marketingrendszer alapja a stratégia. Átfogó auditunkkal feltérképezzük vállalkozásod jelenlegi helyzetét, versenytársaidat és célközönségedet — majd ezen alapuló stratégiát készítünk pontos célokkal és KPI-okkal.",
    heroSubEn:
      "Strategy is the foundation of a successful marketing system. Our comprehensive audit maps your current situation, competitors and target audience — then we build a strategy on top with concrete goals and KPIs.",
    heroSubZh:
      "战略是成功营销系统的基础。我们通过全面审计梳理您的现状、竞争对手与目标受众,然后据此制定带明确目标与 KPI 的战略。",
    metaTitleHu: "Stratégiai marketing tanácsadás – G2A Marketing",
    metaTitleEn: "Strategic Marketing Consulting – G2A Marketing",
    metaTitleZh: "战略营销咨询 – G2A Marketing",
    metaDescHu:
      "Marketingstratégia audit, piackutatás, célcsoport-meghatározás és akcióterv KKV-k és B2B cégek részére. Építs adatvezérelt marketingrendszert szakértőinkkel.",
    metaDescEn:
      "Marketing strategy audit, market research, persona definition and action plan for SMBs and B2B companies. Build a data-driven marketing system with our experts.",
    metaDescZh:
      "面向中小企业与 B2B 公司的营销战略审计、市场研究、用户画像与行动计划。与专家共同搭建数据驱动的营销系统。",
  },
  {
    slug: "keresooptimalizalas",
    titleHu: "Keresőoptimalizálás (SEO)",
    titleEn: "Search Engine Optimisation (SEO)",
    titleZh: "搜索引擎优化 (SEO)",
    shortHu:
      "Technikai SEO audit, on-page optimalizálás, tartalommarketing és linképítés. Mérhető organikus növekedés, átlátható havi riport.",
    shortEn:
      "Technical SEO audit, on-page optimisation, content marketing and link building. Measurable organic growth, transparent monthly reporting.",
    shortZh:
      "技术 SEO 审计、On-page 优化、内容营销与链接建设。可衡量的自然增长,透明月度报告。",
    heroSubHu:
      "Az organikus keresés az egyik legjobb befektetés: a Google találati lista első oldalán lenni folyamatos forgalmat és hitelességet hoz. Technikai és tartalmi szakértőink segítenek weboldalad optimalizálásában, hogy a megfelelő emberek rád találjanak.",
    heroSubEn:
      "Organic search is one of the best investments: ranking on Google's first page brings ongoing traffic and credibility. Our technical and content specialists help optimise your site so the right people find you.",
    heroSubZh:
      "自然搜索是最佳投资之一:登上 Google 首页带来持续流量与品牌信任。我们的技术与内容专家帮助优化您的网站,让对的人找到您。",
    metaTitleHu: "Keresőoptimalizálás (SEO) szakértőkkel – G2A Marketing",
    metaTitleEn: "Search Engine Optimisation (SEO) Experts – G2A Marketing",
    metaTitleZh: "SEO 专家服务 – G2A Marketing",
    metaDescHu:
      "Növeld weboldalad organikus forgalmát: technikai SEO audit, on-page optimalizálás, tartalommarketing, linképítés és lokális SEO. Mérhető fejlődés, átlátható riportok.",
    metaDescEn:
      "Grow your website's organic traffic: technical SEO audit, on-page optimisation, content marketing, link building and local SEO. Measurable progress, transparent reports.",
    metaDescZh:
      "提升网站自然流量:技术 SEO 审计、On-page 优化、内容营销、链接建设与本地 SEO。可衡量的进展,透明的报告。",
  },
  {
    slug: "hirdeteskezeles",
    titleHu: "PPC & Hirdetéskezelés",
    titleEn: "PPC & Ad Management",
    titleZh: "PPC 与广告管理",
    shortHu:
      "Adatvezérelt Google Ads, Meta, LinkedIn és TikTok kampányok. ROI-ra építő struktúra, A/B tesztek, folyamatos optimalizálás.",
    shortEn:
      "Data-driven Google Ads, Meta, LinkedIn and TikTok campaigns. ROI-focused structure, A/B testing and continuous optimisation.",
    shortZh:
      "数据驱动的 Google Ads、Meta、LinkedIn 与 TikTok 广告。以 ROI 为核心的结构,A/B 测试,持续优化。",
    heroSubHu:
      "Fizetett hirdetések nélkülözhetetlenek, ha gyorsan akarsz új ügyfeleket. Csapatunk adatvezérelt PPC kampányokat épít a Google keresőben, Display Networkön, Shoppingon és YouTube-on — mindig az üzleti céljaidhoz igazítva.",
    heroSubEn:
      "Paid ads are essential when you need new customers fast. Our team builds data-driven PPC campaigns on Google Search, Display, Shopping and YouTube — always aligned with your business goals.",
    heroSubZh:
      "需要快速获客时,付费广告不可或缺。我们的团队在 Google 搜索、展示网络、Shopping 与 YouTube 上构建数据驱动的 PPC 活动 — 始终对齐您的业务目标。",
    metaTitleHu: "PPC és Google Ads szakértői szolgáltatások – G2A Marketing",
    metaTitleEn: "PPC and Google Ads Expert Services – G2A Marketing",
    metaTitleZh: "PPC 与 Google Ads 专家服务 – G2A Marketing",
    metaDescHu:
      "Adatvezérelt PPC kampányok: Search, Display, Shopping, YouTube és Performance Max. Több platform, egyetlen stratégia — mérhető ROI a G2A Marketinggel.",
    metaDescEn:
      "Data-driven PPC campaigns: Search, Display, Shopping, YouTube and Performance Max. Multiple platforms, one strategy — measurable ROI with G2A Marketing.",
    metaDescZh:
      "数据驱动的 PPC 活动:Search、Display、Shopping、YouTube 与 Performance Max。多平台,统一战略 — G2A Marketing 带来可衡量的 ROI。",
  },
  {
    slug: "kozossegi-media",
    titleHu: "Közösségi média menedzsment",
    titleEn: "Social Media Management",
    titleZh: "社交媒体管理",
    shortHu:
      "Stratégia, tartalomgyártás, közösségkezelés és influencer együttműködések. Követőkből lojális közösséget építünk.",
    shortEn:
      "Strategy, content production, community management and influencer collaborations. We turn followers into a loyal community.",
    shortZh:
      "战略、内容生产、社区管理与红人合作。把粉丝转化为忠实社区。",
    heroSubHu:
      "A közösségi média nem csak posztok publikálásáról szól; követőkből lojalitással rendelkező közösséget építünk. Professzionális social media menedzsment szolgáltatásunk a stratégiaalkotástól a tartalomgyártáson át a moderálásig támogatja vállalkozásod, hogy hangod kitűnjön a zajból.",
    heroSubEn:
      "Social media isn't just publishing posts; we turn followers into a loyal community. Our professional social media management — from strategy to content production to moderation — helps your voice stand out from the noise.",
    heroSubZh:
      "社交媒体不只是发帖;我们把粉丝转化为忠实社区。我们的专业社媒管理覆盖从战略、内容到管理的全流程,让您的声音在喧嚣中脱颖而出。",
    metaTitleHu: "Közösségi média menedzsment – Márkaépítés | G2A Marketing",
    metaTitleEn: "Social Media Management – Brand Building | G2A Marketing",
    metaTitleZh: "社交媒体管理 – 品牌建设 | G2A Marketing",
    metaDescHu:
      "Organikus jelenlét és közösségépítés a Facebookon, Instagramon, LinkedInen és TikTokon. Stratégia, tartalomtervezés, moderálás és influencer együttműködések.",
    metaDescEn:
      "Organic presence and community building on Facebook, Instagram, LinkedIn and TikTok. Strategy, content planning, moderation and influencer collaborations.",
    metaDescZh:
      "在 Facebook、Instagram、LinkedIn 与 TikTok 上的自然存在与社区建设。战略、内容规划、管理与红人合作。",
  },
  {
    slug: "webfejlesztes",
    titleHu: "Webfejlesztés és CRO",
    titleEn: "Web Development & CRO",
    titleZh: "网站开发与 CRO",
    shortHu:
      "Egyedi weboldalak, webáruházak és landing oldalak konverzióra optimalizálva. WordPress, Shopify és custom megoldások.",
    shortEn:
      "Custom websites, online stores and landing pages optimised for conversion. WordPress, Shopify and custom solutions.",
    shortZh:
      "针对转化优化的定制网站、电商与落地页。WordPress、Shopify 与定制方案。",
    heroSubHu:
      "Weboldalad az első benyomás. Csapatunk modern, gyors és mobilbarát honlapokat és webshopokat tervez, amelyek nem csak szépek, hanem konverzióra optimalizáltak. Egyedi fejlesztéstől a WordPress megoldásokig mindenben segítünk.",
    heroSubEn:
      "Your website is the first impression. Our team builds modern, fast, mobile-friendly websites and shops — not just pretty, but conversion-optimised. From custom development to WordPress, we cover the spectrum.",
    heroSubZh:
      "网站是第一印象。我们的团队构建现代、快速、移动友好的网站与店铺 — 不仅外观出色,更针对转化优化。从定制开发到 WordPress,全方位覆盖。",
    metaTitleHu: "Webfejlesztés és CRO – Modern weboldalak | G2A Marketing",
    metaTitleEn: "Web Development & CRO – Modern Websites | G2A Marketing",
    metaTitleZh: "网站开发与 CRO – 现代网站 | G2A Marketing",
    metaDescHu:
      "Egyedi weboldalak és webáruházak fejlesztése, konverzióoptimalizált felületek, WordPress megoldások és folyamatos karbantartás. Professzionális UX és technikai SEO.",
    metaDescEn:
      "Custom websites and webshops, conversion-optimised UIs, WordPress solutions and ongoing maintenance. Professional UX and technical SEO.",
    metaDescZh:
      "定制网站与电商开发、转化优化界面、WordPress 方案与持续维护。专业 UX 与技术 SEO。",
  },
  {
    slug: "arculattervezes",
    titleHu: "Arculattervezés és branding",
    titleEn: "Brand Design",
    titleZh: "品牌视觉设计",
    shortHu:
      "Logó, arculati kézikönyv, digitális és nyomtatott anyagok. Egyedi vizuális identitás, ami megkülönböztet és bizalmat épít.",
    shortEn:
      "Logo, brand guidelines, digital and print materials. A unique visual identity that differentiates and builds trust.",
    shortZh:
      "标志、品牌手册、数字与印刷物料。打造与众不同、建立信任的视觉身份。",
    heroSubHu:
      "A márkád vizuális identitása többet mond ezer szónál. Segítünk megteremteni az egyedi stílust: logót, színeket, tipográfiát és grafikai elemeket, amelyek minden felületeden következetesek. Ezzel növeled a márkád felismerhetőségét és bizalmat építesz.",
    heroSubEn:
      "Your brand's visual identity speaks louder than words. We help craft a unique style — logo, colours, typography and graphic elements — consistent across every surface. Recognition rises, trust grows.",
    heroSubZh:
      "品牌视觉胜过千言。我们帮您打造独特风格 — 标志、色彩、字体与图形元素 — 在每一处保持一致。识别度提升,信任增加。",
    metaTitleHu: "Arculattervezés és branding – Vizuális identitás | G2A Marketing",
    metaTitleEn: "Brand Design – Visual Identity | G2A Marketing",
    metaTitleZh: "品牌视觉设计 – 视觉身份 | G2A Marketing",
    metaDescHu:
      "Logó, márkaarculati kézikönyv, nyomtatott és digitális anyagok tervezése. Építs professzionális vizuális identitást, amely megkülönböztet és bizalmat épít.",
    metaDescEn:
      "Logo, brand guidelines, print and digital materials. Build a professional visual identity that differentiates and builds trust.",
    metaDescZh:
      "标志、品牌手册、印刷与数字物料的设计。打造与众不同、建立信任的专业视觉身份。",
  },
  {
    slug: "lokalizacio",
    titleHu: "Lokalizáció és nemzetközi marketing",
    titleEn: "Localisation & International Marketing",
    titleZh: "本地化与国际营销",
    shortHu:
      "Nyelvi és kulturális lokalizáció, multilinguális SEO, piaci belépési stratégia. Globális piacok helyi szemlélettel.",
    shortEn:
      "Language and cultural localisation, multilingual SEO, market entry strategy. Global markets, local perspective.",
    shortZh:
      "语言与文化本地化、多语种 SEO、市场进入战略。本地视角应对全球市场。",
    heroSubHu:
      "Külföldi piacokra lépnél? A siker titka a lokalizáció: nem elég lefordítani a weboldalt, a kulturális sajátosságokhoz és helyi keresőmotorokhoz kell igazodnunk. Nyelvi szakértőink és SEO-csapatunk biztosítják, hogy üzeneted minden országban érthető és versenyképes legyen.",
    heroSubEn:
      "Entering foreign markets? Localisation is the key to success: a website translation isn't enough — you need to adapt to cultural particularities and local search engines. Our language experts and SEO team ensure your message resonates in every country.",
    heroSubZh:
      "进入海外市场?成功的关键在于本地化:仅翻译网站远远不够,需要适应文化特性与本地搜索引擎。我们的语言专家与 SEO 团队确保您的信息在每个国家都能产生共鸣。",
    metaTitleHu: "Lokalizáció és nemzetközi marketing – G2A Marketing",
    metaTitleEn: "Localisation & International Marketing – G2A Marketing",
    metaTitleZh: "本地化与国际营销 – G2A Marketing",
    metaDescHu:
      "Nyelvi és kulturális lokalizáció, multilinguális SEO, piaci belépési stratégia. Segítünk globális piacra lépni helyi szemlélettel.",
    metaDescEn:
      "Language and cultural localisation, multilingual SEO, market entry strategy. We help you go global with a local perspective.",
    metaDescZh:
      "语言与文化本地化、多语种 SEO、市场进入战略。以本地视角助您走向全球。",
  },
];

const conn = await mysql.createConnection({
  uri: DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

let updated = 0;
let skipped = 0;

try {
  for (const s of SERVICES) {
    const [rows] = await conn.execute("SELECT id FROM services WHERE slug = ? LIMIT 1", [s.slug]);
    if (rows.length === 0) {
      console.log(`  · skip (slug not in DB): ${s.slug}`);
      skipped++;
      continue;
    }
    await conn.execute(
      `UPDATE services SET
         title = ?, titleEn = ?, titleZh = ?,
         shortDescription = ?, shortDescriptionEn = ?, shortDescriptionZh = ?,
         heroSubtitle = ?, heroSubtitleEn = ?, heroSubtitleZh = ?,
         metaTitle = ?, metaTitleEn = ?, metaTitleZh = ?,
         metaDescription = ?, metaDescriptionEn = ?, metaDescriptionZh = ?
       WHERE id = ?`,
      [
        s.titleHu, s.titleEn, s.titleZh,
        s.shortHu, s.shortEn, s.shortZh,
        s.heroSubHu, s.heroSubEn, s.heroSubZh,
        s.metaTitleHu, s.metaTitleEn, s.metaTitleZh,
        s.metaDescHu, s.metaDescEn, s.metaDescZh,
        rows[0].id,
      ],
    );
    console.log(`  ✓ updated: ${s.slug}`);
    updated++;
  }
  console.log(`\nDone — updated: ${updated}, skipped: ${skipped}`);
} finally {
  await conn.end();
}
