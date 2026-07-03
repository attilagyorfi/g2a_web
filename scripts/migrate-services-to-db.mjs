#!/usr/bin/env node
/**
 * One-off: migrate the 14 hard-coded serviceConfigs (HU/EN/ZH) into the
 * `services` table so the NewServicePage layout becomes fully DB-driven and
 * admin-editable. Scalars → field/En/Zh columns; benefits/process/faq →
 * single JSON columns with localized subfields ({hu,en,zh}) per item.
 *
 * Prereq: `npx esbuild client/src/data/serviceConfigs.ts --format=esm
 *          --outfile=.tmp_sc.mjs` (the default export = { hu, en, zh }).
 *
 *   node scripts/migrate-services-to-db.mjs            # dry run
 *   node scripts/migrate-services-to-db.mjs --apply    # write
 */
import "dotenv/config";
import mysql from "mysql2/promise";
import sc from "../.tmp_sc.mjs";

const APPLY = process.argv.includes("--apply");
const SLUGS = Object.keys(sc.hu); // 14, in config order

const loc = (slug, field) => ({
  hu: sc.hu[slug]?.[field] ?? "",
  en: sc.en[slug]?.[field] ?? sc.hu[slug]?.[field] ?? "",
  zh: sc.zh[slug]?.[field] ?? sc.hu[slug]?.[field] ?? "",
});

function mergeBenefits(slug) {
  const hu = sc.hu[slug].benefits, en = sc.en[slug].benefits, zh = sc.zh[slug].benefits;
  return hu.map((b, i) => ({
    title: { hu: b.title, en: en[i]?.title ?? b.title, zh: zh[i]?.title ?? b.title },
    desc: { hu: b.desc, en: en[i]?.desc ?? b.desc, zh: zh[i]?.desc ?? b.desc },
  }));
}
function mergeProcess(slug) {
  const hu = sc.hu[slug].process, en = sc.en[slug].process, zh = sc.zh[slug].process;
  return hu.map((p, i) => ({
    step: p.step,
    title: { hu: p.title, en: en[i]?.title ?? p.title, zh: zh[i]?.title ?? p.title },
    desc: { hu: p.desc, en: en[i]?.desc ?? p.desc, zh: zh[i]?.desc ?? p.desc },
  }));
}
function mergeFaq(slug) {
  const hu = sc.hu[slug].faq, en = sc.en[slug].faq, zh = sc.zh[slug].faq;
  return hu.map((f, i) => ({
    q: { hu: f.q, en: en[i]?.q ?? f.q, zh: zh[i]?.q ?? f.q },
    a: { hu: f.a, en: en[i]?.a ?? f.a, zh: zh[i]?.a ?? f.a },
  }));
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [existing] = await conn.query("SELECT slug, number, sortOrder FROM services");
const bySlug = Object.fromEntries(existing.map((r) => [r.slug, r]));
let nextOrder = Math.max(0, ...existing.map((r) => Number(r.sortOrder) || 0)) + 1;

console.log(`${SLUGS.length} szolgáltatás migrálása${APPLY ? " — ÍRÁS" : " (dry run)"}\n`);

for (const slug of SLUGS) {
  const huc = sc.hu[slug];
  const title = loc(slug, "title");
  const subtitle = loc(slug, "subtitle");
  const heroDesc = loc(slug, "heroDesc");
  const intro = loc(slug, "intro");
  const metaT = loc(slug, "metaTitle");
  const metaD = loc(slug, "metaDesc");
  const cta = loc(slug, "cta");
  const benefits = JSON.stringify(mergeBenefits(slug));
  const process = JSON.stringify(mergeProcess(slug));
  const faq = JSON.stringify(mergeFaq(slug));
  const isNew = !bySlug[slug];
  const number = bySlug[slug]?.number ?? String(nextOrder).padStart(2, "0");
  const sortOrder = bySlug[slug]?.sortOrder ?? nextOrder;
  if (isNew) nextOrder++;

  console.log(`  ${isNew ? "INSERT" : "UPDATE"} #${number} ${slug.padEnd(24)} b=${mergeBenefits(slug).length} p=${mergeProcess(slug).length} f=${mergeFaq(slug).length}`);

  if (!APPLY) continue;

  const cols = {
    slug, number, sortOrder, icon: huc.icon, color: huc.color,
    title: title.hu, titleEn: title.en, titleZh: title.zh,
    subtitle: subtitle.hu, subtitleEn: subtitle.en, subtitleZh: subtitle.zh,
    heroTitle: title.hu, heroTitleEn: title.en, heroTitleZh: title.zh,
    heroSubtitle: heroDesc.hu, heroSubtitleEn: heroDesc.en, heroSubtitleZh: heroDesc.zh,
    shortDescription: subtitle.hu, shortDescriptionEn: subtitle.en, shortDescriptionZh: subtitle.zh,
    intro: intro.hu, introEn: intro.en, introZh: intro.zh,
    metaTitle: metaT.hu, metaTitleEn: metaT.en, metaTitleZh: metaT.zh,
    metaDescription: metaD.hu, metaDescriptionEn: metaD.en, metaDescriptionZh: metaD.zh,
    cta: cta.hu, ctaEn: cta.en, ctaZh: cta.zh,
    benefits, process, faq,
  };
  const keys = Object.keys(cols);
  const updates = keys.filter((k) => k !== "slug").map((k) => `\`${k}\`=VALUES(\`${k}\`)`).join(", ");
  await conn.execute(
    `INSERT INTO services (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES (${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${updates}`,
    keys.map((k) => cols[k])
  );
}

await conn.end();
console.log(APPLY ? "\n✓ Kész." : "\n[dry run] — futtasd --apply kapcsolóval.");
