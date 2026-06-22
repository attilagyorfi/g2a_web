/**
 * Insert the 4 new partner case studies (DunaDerm, Dr Krisztina
 * Phillips, Senzortech, Adept Electric) into case_studies, HU/EN/ZH.
 *
 * Source material: D:\G2A projektek\{DrPhillips, _archív\Dunaderm,
 * Senzortech, Adept Electric}. Content is qualitative — describing the
 * work actually done — with NO invented result numbers (consistent with
 * the existing 28 and the user's accuracy preference).
 *
 * Idempotent: INSERT ... ON DUPLICATE KEY UPDATE on the unique slug, so
 * re-running refreshes content without creating duplicates.
 *
 * Usage:
 *   node scripts/apply-new-partners.mjs            # dry run
 *   node scripts/apply-new-partners.mjs --apply    # write to DB
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");

const partners = [
  {
    slug: "dunaderm",
    client: "DunaDerm Clinic", clientEn: "DunaDerm Clinic", clientZh: "DunaDerm 诊所",
    industry: "szepsegipari", industryEn: "Beauty industry", industryZh: "美容行业",
    projectYear: "2026",
    sortOrder: 29,
    title: "DunaDerm Clinic", titleEn: "DunaDerm Clinic", titleZh: "DunaDerm 诊所",
    metaTitle: "DunaDerm Clinic – esztétikai klinika SEO és Google Ads | G2A Marketing",
    metaTitleEn: "DunaDerm Clinic – Aesthetic Clinic SEO & Google Ads | G2A",
    metaTitleZh: "DunaDerm 诊所 – 美学诊所 SEO 与 Google Ads | G2A",
    metaDescription: "Adatvezérelt, kétnyelvű (HU/EN) keresési jelenlét egy budapesti esztétikai klinikának: kulcsszó-kutatás, Google Ads, SEO és szezonális kampányok.",
    metaDescriptionEn: "Data-driven, bilingual (HU/EN) search presence for a Budapest aesthetic clinic: keyword research, Google Ads, SEO and seasonal campaigns.",
    metaDescriptionZh: "为布达佩斯美学诊所打造数据驱动、双语（HU/EN）的搜索存在：关键词研究、Google Ads、SEO 与季节性活动。",
    challenge: "A DunaDerm esztétikai és bőrgyógyászati klinika a budapesti prémium szegmensben versenyez, ahol a páciensek tudatosan keresnek, és a nemzetközi (expat) közönség is jelentős. Adatvezérelt, kétnyelvű online jelenlétre volt szükség, amely a magas vásárlói szándékú kereséseket éri el.",
    challengeEn: "DunaDerm, an aesthetic and dermatology clinic, competes in Budapest's premium segment where patients search deliberately and the international (expat) audience is significant. It needed a data-driven, bilingual online presence reaching high-intent searches.",
    challengeZh: "DunaDerm 美学与皮肤科诊所在布达佩斯高端市场竞争，患者主动搜索，国际（外籍）人群亦占重要比例。诊所需要数据驱动、双语的在线形象，触达高购买意图的搜索。",
    solution: "Részletes kulcsszó-kutatást és -térképezést végeztünk, majd erre építve magyar és angol nyelvű Google Ads kampányokat és SEO-stratégiát alakítottunk ki. Szezonális kampányokkal és folyamatos stratégiai tanácsadással támogattuk a klinika növekedését — végig a szabályozás-tudatos esztétikai kommunikáció keretein belül.",
    solutionEn: "We carried out detailed keyword research and mapping, then built Hungarian and English Google Ads campaigns and an SEO strategy on top. Seasonal campaigns and ongoing strategic guidance supported the clinic's growth — always within the bounds of compliance-aware aesthetic communication.",
    solutionZh: "我们进行了详细的关键词研究与映射，并据此构建匈牙利语与英语的 Google Ads 活动及 SEO 战略。以季节性活动与持续的战略咨询支持诊所成长——始终在合规意识强的美学传播框架内。",
    results: "Adatvezérelt, kétnyelvű (HU/EN) keresési jelenlét; strukturált kulcsszó-térkép a magas szándékú keresésekre; szezonális kampány-ritmus a klinika prioritásai köré.",
    resultsEn: "A data-driven, bilingual (HU/EN) search presence; a structured keyword map for high-intent searches; a seasonal campaign rhythm built around the clinic's priorities.",
    resultsZh: "数据驱动、双语（HU/EN）的搜索存在；面向高意图搜索的结构化关键词图谱；围绕诊所优先级的季节性活动节奏。",
    tags: JSON.stringify(["SEO", "Google Ads", "Kulcsszó-kutatás", "Stratégia"]),
  },
  {
    slug: "dr-krisztina-phillips",
    client: "Dr. Krisztina Phillips", clientEn: "Dr. Krisztina Phillips", clientZh: "Dr. Krisztina Phillips",
    industry: "szepsegipari", industryEn: "Beauty industry", industryZh: "美容行业",
    projectYear: "2026",
    sortOrder: 30,
    title: "Dr. Krisztina Phillips", titleEn: "Dr. Krisztina Phillips", titleZh: "Dr. Krisztina Phillips",
    metaTitle: "Dr. Krisztina Phillips – esztétikai klinika influenszer-marketing | G2A",
    metaTitleEn: "Dr. Krisztina Phillips – Aesthetic Clinic Influencer Marketing | G2A",
    metaTitleZh: "Dr. Krisztina Phillips – 美学诊所网红营销 | G2A",
    metaDescription: "Szabályozás-tudatos influenszer- és hirdetési stratégia egy esztétikai klinikának: Meta és Pinterest tölcsér, edukációs megközelítés, HU/EN célzás.",
    metaDescriptionEn: "Compliance-aware influencer and advertising strategy for an aesthetic clinic: Meta and Pinterest funnel, an educational approach, HU/EN targeting.",
    metaDescriptionZh: "为美学诊所制定合规意识强的网红与广告战略：Meta 与 Pinterest 漏斗、教育型方法、HU/EN 定向。",
    challenge: "Dr. Krisztina Phillips esztétikai klinikája az erősen szabályozott esztétikai szegmensben építi az ismertséget és a bizalmat, magyar és angolul beszélő (expat) közönség felé egyaránt. A kihívás: hiteles, szabálykövető jelenlét, amely nem ígér garantált eredményt, mégis érdeklődést épít.",
    challengeEn: "Dr. Krisztina Phillips's aesthetic clinic builds awareness and trust in the heavily regulated aesthetic segment, toward both Hungarian and English-speaking (expat) audiences. The challenge: a credible, compliant presence that promises no guaranteed results yet still builds interest.",
    challengeZh: "Dr. Krisztina Phillips 的美学诊所在受严格监管的美学领域建立知名度与信任，面向匈牙利语与英语（外籍）受众。挑战在于：可信、合规、不承诺保证效果，却仍能建立兴趣的形象。",
    solution: "Szabályozás-tudatos influenszer-marketing stratégiát és pilot-programot dolgoztunk ki: hiteles, bőrápolás-fókuszú mikro- és szakmai („doctor-creator”) alkotók, élmény- és edukációs szemszögből. A tartalmat a meglévő Meta- és Pinterest-hirdetési tölcsérbe forgattuk vissza, kötelező jelöléssel és jóváhagyási folyamattal — magyar és angol célzással.",
    solutionEn: "We developed a compliance-aware influencer-marketing strategy and pilot programme: credible, skincare-focused micro- and professional ('doctor-creator') creators, from an experience- and education-led angle. The content was fed back into the existing Meta and Pinterest advertising funnel, with mandatory disclosure and an approval process — targeting Hungarian and English.",
    solutionZh: "我们制定了合规意识强的网红营销战略与试点计划：可信、以护肤为核心的微型与专业（“医生创作者”）创作者，从体验与教育视角出发。内容回流至现有的 Meta 与 Pinterest 广告漏斗，配以强制披露与审批流程——面向匈牙利语与英语定向。",
    results: "Szabályozás-tudatos influenszer- és hirdetési keret; HU/EN kettős célzás; mérhető tölcsér egyedi kedvezménykódokkal és UTM-linkekkel; hiteles, edukációs hangvételű márkaépítés.",
    resultsEn: "A compliance-aware influencer and advertising framework; dual HU/EN targeting; a measurable funnel with unique discount codes and UTM links; credible, education-led brand building.",
    resultsZh: "合规意识强的网红与广告框架；HU/EN 双重定向；带专属优惠码与 UTM 链接的可衡量漏斗；可信、以教育为主的品牌建设。",
    tags: JSON.stringify(["Influenszer marketing", "Meta Ads", "Pinterest", "Stratégia"]),
  },
  {
    slug: "senzortech",
    client: "Senzortech", clientEn: "Senzortech", clientZh: "Senzortech",
    industry: "szolgaltato", industryEn: "Services", industryZh: "服务业",
    projectYear: "2025",
    sortOrder: 31,
    title: "Senzortech", titleEn: "Senzortech", titleZh: "Senzortech",
    metaTitle: "Senzortech – ipari szenzortechnológia arculat és bemutatóanyag | G2A",
    metaTitleEn: "Senzortech – Industrial Sensor-Tech Identity & Materials | G2A",
    metaTitleZh: "Senzortech – 工业传感技术形象与展示材料 | G2A",
    metaDescription: "Vizuális arculat és szakmai bemutatóanyag egy ipari szenzortechnológiai cégnek — a komplex műszaki kínálat érthető, hiteles kommunikációja.",
    metaDescriptionEn: "Visual identity and professional presentation materials for an industrial sensor-technology company — clear, credible communication of a complex technical range.",
    metaDescriptionZh: "为工业传感技术公司打造视觉识别与专业展示材料——清晰、可信地传达复杂的技术产品。",
    challenge: "A Senzortech ipari szenzortechnológiai megoldásokat kínál — komplex, magyarázatot igénylő műszaki termékkört, amelyet érthetően és hitelesen kell bemutatni a szakmai döntéshozóknak, korszerű, akár közösségi médiára kész megjelenéssel.",
    challengeEn: "Senzortech offers industrial sensor-technology solutions — a complex technical range that needs explaining, to be presented clearly and credibly to professional decision-makers, with a modern, even social-media-ready look.",
    challengeZh: "Senzortech 提供工业传感技术解决方案——一套复杂、需要解释的技术产品，须向专业决策者清晰、可信地呈现，并具备现代、甚至适配社媒的外观。",
    solution: "Vizuális arculatot és szakmai bemutató- és próbaanyagot készítettünk, amely a komplex műszaki kínálatot letisztult, megbízható formába önti. A logó- és arculati elemeket közösségi médiára (köztük TikTok-formátumra) is előkészítettük, hogy a cég modern csatornákon is egységesen jelenjen meg.",
    solutionEn: "We created a visual identity and professional presentation and sample materials that cast the complex technical range into a clean, trustworthy form. The logo and identity elements were also prepared for social media (including a TikTok format) so the company appears consistently on modern channels.",
    solutionZh: "我们制作了视觉识别与专业展示及样稿材料，把复杂的技术产品铸成干净、可信的形式。logo 与形象元素亦为社媒（含 TikTok 格式）做了准备，让公司在现代渠道也保持一致呈现。",
    results: "Letisztult, szakmailag hiteles vizuális megjelenés a komplex műszaki kínálat bemutatására; közösségi médiára kész arculati elemek; egységes márkamegjelenés.",
    resultsEn: "A clean, professionally credible visual presentation for the complex technical range; social-media-ready identity elements; a consistent brand appearance.",
    resultsZh: "为复杂技术产品打造干净、专业可信的视觉呈现；适配社媒的形象元素；一致的品牌呈现。",
    tags: JSON.stringify(["Arculat", "Vizuális identitás", "Bemutatóanyag", "Közösségi média"]),
  },
  {
    slug: "adept-electric",
    client: "Adept Electric Kft.", clientEn: "Adept Electric Ltd.", clientZh: "Adept Electric 公司",
    industry: "szolgaltato", industryEn: "Services", industryZh: "服务业",
    projectYear: "2026",
    sortOrder: 32,
    title: "Adept Electric Kft.", titleEn: "Adept Electric Ltd.", titleZh: "Adept Electric 公司",
    metaTitle: "Adept Electric – villanyszerelő cég marketing-stratégiája | G2A",
    metaTitleEn: "Adept Electric – Electrical Contractor Marketing Strategy | G2A",
    metaTitleZh: "Adept Electric – 电气工程公司营销战略 | G2A",
    metaDescription: "Üzenet-stratégia és marketing-tartalom egy villanyszerelési, vagyonvédelmi és kamerarendszer-szolgáltatónak — a komplex, egy kézben nyújtott szolgáltatás hiteles kommunikációja.",
    metaDescriptionEn: "Messaging strategy and marketing content for an electrical, security and camera-system provider — credible communication of a complex, all-in-one-hand service.",
    metaDescriptionZh: "为电气、安防与摄像系统服务商制定信息战略与营销内容——可信地传达复杂的一站式服务。",
    challenge: "Az Adept Electric villanyszerelési, vagyonvédelmi (riasztó) és videómegfigyelő (kamera) szolgáltatásokat nyújt egy kézben, ipari és lakossági ügyfeleknek egyaránt. A kihívás: a komplexitás és a megbízhatóság kommunikálása — a megfelelő üzenetekkel a megfelelő közönségnek, a nem-célzott szolgáltatások háttérbe szorításával.",
    challengeEn: "Adept Electric provides electrical, security (alarm) and video-surveillance (camera) services in one hand, to both industrial and residential clients. The challenge: communicating complexity and reliability — with the right messages to the right audience, while de-emphasising non-target services.",
    challengeZh: "Adept Electric 一站式提供电气、安防（报警）与视频监控（摄像）服务，面向工业与住宅客户。挑战在于：传达复杂性与可靠性——以正确的信息面向正确的受众，同时淡化非目标服务。",
    solution: "Üzenet-stratégiát és marketing-tartalmat dolgoztunk ki: a kulcsértékek — megbízhatóság, precizitás, minőség, az egy kézben nyújtott komplexitás (villany, riasztó, kamera), teljeskörűség, dokumentáció, garancia és ügyfélközpontúság — köré épített pozícionálást, a nem-célzott szolgáltatások tudatos kizárásával.",
    solutionEn: "We developed a messaging strategy and marketing content: positioning built around the key values — reliability, precision, quality, the all-in-one-hand complexity (electrical, alarm, camera), full-scope delivery, documentation, warranty and a customer-centric mindset — while deliberately excluding non-target services.",
    solutionZh: "我们制定了信息战略与营销内容：围绕核心价值——可靠、精准、质量、一站式复杂能力（电气、报警、摄像）、全流程交付、文档、质保与以客户为中心——构建定位，并有意排除非目标服务。",
    results: "Tiszta üzenet-stratégia és pozícionálás; a komplex, egy kézben nyújtott szolgáltatás hiteles kommunikációja; fókuszált üzenetek a megfelelő ipari és lakossági közönségnek.",
    resultsEn: "A clear messaging strategy and positioning; credible communication of the complex, all-in-one-hand service; focused messages for the right industrial and residential audiences.",
    resultsZh: "清晰的信息战略与定位；可信地传达复杂的一站式服务；面向正确的工业与住宅受众的聚焦信息。",
    tags: JSON.stringify(["Üzenet-stratégia", "Pozícionálás", "Marketing tartalom"]),
  },
];

console.log(`${partners.length} új partner esettanulmány.\n`);
for (const p of partners) {
  console.log(`${p.slug} [${p.industry}] ${p.client} — ch:${p.challenge.length} sol:${p.solution.length} res:${p.results.length}`);
}

if (!APPLY) {
  console.log("\n[dry run] — futtasd --apply kapcsolóval az íráshoz.");
  process.exit(0);
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let n = 0;
try {
  for (const p of partners) {
    const cols = [
      "slug", "client", "clientEn", "clientZh", "industry", "industryEn", "industryZh",
      "projectYear", "sortOrder", "title", "titleEn", "titleZh",
      "metaTitle", "metaTitleEn", "metaTitleZh", "metaDescription", "metaDescriptionEn", "metaDescriptionZh",
      "challenge", "challengeEn", "challengeZh", "solution", "solutionEn", "solutionZh",
      "results", "resultsEn", "resultsZh", "tags", "isActive",
    ];
    const vals = cols.map((c) => (c === "isActive" ? 1 : p[c]));
    const placeholders = cols.map(() => "?").join(", ");
    const updates = cols.filter((c) => c !== "slug").map((c) => `\`${c}\` = VALUES(\`${c}\`)`).join(", ");
    const [res] = await conn.query(
      `INSERT INTO case_studies (${cols.map((c) => `\`${c}\``).join(", ")}) VALUES (${placeholders})
       ON DUPLICATE KEY UPDATE ${updates}`,
      vals,
    );
    console.log(`case_studies/${p.slug}: ${res.affectedRows === 1 ? "beszúrva" : "frissítve"}`);
    n++;
  }
  console.log(`\n✓ Kész — ${n} partner esettanulmány a DB-ben.`);
} finally {
  await conn.end();
}
