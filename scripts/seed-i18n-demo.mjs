// Demo: egy szolgáltatásra (SEO) + egy esettanulmányra EN/ZH fordítás feltöltése,
// hogy élőben látható legyen a pickLocalized fallback rendszer.
import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. SEO szolgáltatás — title + shortDescription + heroTitle + heroSubtitle
console.log("Updating service 'seo' with EN/ZH...");
await conn.execute(
  `UPDATE services SET
    titleEn = ?, titleZh = ?,
    shortDescriptionEn = ?, shortDescriptionZh = ?,
    heroTitleEn = ?, heroTitleZh = ?,
    heroSubtitleEn = ?, heroSubtitleZh = ?,
    metaTitleEn = ?, metaTitleZh = ?,
    metaDescriptionEn = ?, metaDescriptionZh = ?
   WHERE slug = 'keresooptimalizalas'`,
  [
    "SEO", "搜索引擎优化",
    "How we help companies rank higher on Google and beyond",
    "帮助企业在 Google 搜索中获得更好排名",
    "SEO – Sustainable organic growth",
    "SEO —— 可持续的自然增长",
    "We help your business show up where your clients are searching — with technical SEO, content marketing and international multilingual strategy.",
    "我们帮助您的业务出现在客户搜索的地方 —— 提供技术性 SEO、内容营销与国际化多语种战略。",
    "SEO – G2A Marketing Pécs",
    "搜索引擎优化 – G2A Marketing Pécs",
    "Professional SEO services: keyword research, technical SEO, content marketing, local and multilingual strategy.",
    "专业 SEO 服务:关键词研究、技术性 SEO、内容营销、本地化与多语种战略。",
  ]
);

// 2. Case study — az első (healthcare)
console.log("Updating first case_study with EN/ZH...");
const [csResult] = await conn.execute(`SELECT id FROM case_studies ORDER BY sortOrder, id LIMIT 1`);
if (csResult.length > 0) {
  const firstId = csResult[0].id;
  await conn.execute(
    `UPDATE case_studies SET
      titleEn = ?, titleZh = ?,
      clientEn = ?, clientZh = ?,
      industryEn = ?, industryZh = ?,
      challengeEn = ?, challengeZh = ?,
      solutionEn = ?, solutionZh = ?,
      resultsEn = ?, resultsZh = ?
     WHERE id = ?`,
    [
      "Private clinic — Pécs", "私立诊所 —— 佩奇",
      "Private clinic", "私立诊所",
      "Healthcare", "医疗健康",
      "Low online booking volume, weak SEO presence; patients couldn't find us on Google Maps for local searches.",
      "在线预约量低、SEO 表现弱;患者在 Google 地图上无法找到我们。",
      "Full SEO strategy + Google Ads + website redesign with an integrated online booking system.",
      "完整的 SEO 战略 + Google Ads + 带集成在线预约系统的网站重塑。",
      "+340% organic traffic, +180% online bookings in 6 months",
      "6 个月内自然流量 +340%、在线预约 +180%",
      firstId,
    ]
  );
  console.log(`  ✓ Updated case study id=${firstId}`);
} else {
  console.log("  ⚠ No case studies found");
}

// 3. Egy blog cikk (ha van)
console.log("Updating first blog post with EN/ZH...");
const [postResult] = await conn.execute(`SELECT id, title FROM posts WHERE status='published' ORDER BY publishedAt DESC LIMIT 1`);
if (postResult.length > 0) {
  const firstPost = postResult[0];
  await conn.execute(
    `UPDATE posts SET
      titleEn = ?, titleZh = ?,
      excerptEn = ?, excerptZh = ?
     WHERE id = ?`,
    [
      "Marketing trends for 2025 — what works now",
      "2025 年营销趋势 —— 现在最有效的做法",
      "A practical overview of which marketing channels and AI tools deliver real ROI for B2B companies in 2025.",
      "概览 2025 年 B2B 企业真正带来 ROI 的营销渠道与 AI 工具。",
      firstPost.id,
    ]
  );
  console.log(`  ✓ Updated post id=${firstPost.id} ("${firstPost.title}")`);
} else {
  console.log("  ⚠ No published posts found");
}

await conn.end();
console.log("\n✅ Demo i18n data seeded.");
console.log("Nyisd meg a böngészőben:");
console.log("  http://localhost:3000/szolgaltatasok/keresooptimalizalas?lang=hu");
console.log("  http://localhost:3000/szolgaltatasok/keresooptimalizalas?lang=en");
console.log("  http://localhost:3000/szolgaltatasok/keresooptimalizalas?lang=zh");
console.log("  http://localhost:3000/referenciak?lang=zh  (első kártya ZH-ban)");
