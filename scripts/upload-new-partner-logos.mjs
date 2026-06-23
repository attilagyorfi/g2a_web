#!/usr/bin/env node
/**
 * Upload the 4 new partner logos (DunaDerm, Dr. Krisztina Phillips,
 * Senzortech, Adept Electric) to Cloudinary and set logoImage +
 * logoImageAlt + externalLinks on their case_studies rows.
 *
 * Source: D:\Partnerek\<Partner>\ (logo + linkek.docx). These four are the
 * only active case studies without a featuredImage; the Referenciák card /
 * detail page render a branded logo-tile fallback when featuredImage is
 * absent but logoImage is present.
 *
 *   node scripts/upload-new-partner-logos.mjs           # dry run
 *   node scripts/upload-new-partner-logos.mjs --apply   # upload + write DB
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");

const cloudinaryUrl = process.env.CLOUDINARY_URL;
const m = cloudinaryUrl?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
if (!m) { console.error("✗ CLOUDINARY_URL missing/invalid in .env"); process.exit(1); }
const [, CLD_KEY, CLD_SECRET, CLD_CLOUD] = m;

function signParams(params, secret) {
  const sorted = Object.keys(params).sort();
  return createHash("sha1").update(sorted.map((k) => `${k}=${params[k]}`).join("&") + secret).digest("hex");
}

async function upload(filePath, publicId, folder = "g2a/case-studies") {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  const buffer = readFileSync(filePath);
  const ext = filePath.toLowerCase().split(".").pop() || "png";
  const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[ext] || "image/png";
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { folder, public_id: publicId, overwrite: "true", timestamp };
  const signature = signParams(signed, CLD_SECRET);
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mime }), filePath.split(/[\\/]/).pop());
  form.append("api_key", CLD_KEY);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("signature", signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLD_CLOUD}/auto/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Cloudinary ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  return (await res.json()).secure_url;
}

const PARTNERS = [
  {
    slug: "dunaderm", client: "DunaDerm Clinic",
    logo: "D:/Partnerek/Dunaderm/logo.png", publicId: "dunaderm-logo",
    links: { website: "https://dunadermclinic.com/hu/fooldal/", facebook: "https://www.facebook.com/dunadermclinic", instagram: "https://www.instagram.com/dunadermclinic/" },
  },
  {
    slug: "dr-krisztina-phillips", client: "Dr. Krisztina Phillips",
    logo: "D:/Partnerek/Dr K Phillips/DRKP_logo.png", publicId: "dr-krisztina-phillips-logo",
    links: { website: "https://drkphillips.com/", facebook: "https://www.facebook.com/drkphillips", instagram: "https://www.instagram.com/drkrisztinaphillips/" },
  },
  {
    slug: "senzortech", client: "Senzortech",
    logo: "D:/Partnerek/Senzortech/senzortech-logo_nobg.png", publicId: "senzortech-logo",
    links: { website: "https://senzortech.hu/", facebook: "https://www.facebook.com/senzortech", instagram: "https://www.instagram.com/senzortech/", tiktok: "https://www.tiktok.com/@senzortech" },
  },
  {
    slug: "adept-electric", client: "Adept Electric Kft.",
    logo: "D:/Partnerek/Adept Electric/Logo.png", publicId: "adept-electric-logo",
    links: { website: "https://adeptelectric.hu/", facebook: "https://www.facebook.com/adeptelectrickft", instagram: "https://www.instagram.com/adeptelectrickft/", linkedin: "https://www.linkedin.com/company/adept-electric-kft/" },
  },
];

console.log(`${PARTNERS.length} partner logó + link${APPLY ? " — ÍRÁS" : " (dry run)"}\n`);
for (const p of PARTNERS) {
  console.log(`  ${p.slug.padEnd(22)} logo=${existsSync(p.logo) ? "ok" : "HIÁNYZIK"} links=${Object.keys(p.links).join(",")}`);
}

if (!APPLY) {
  console.log("\n[dry run] — futtasd --apply kapcsolóval a feltöltéshez + DB-íráshoz.");
  process.exit(0);
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log("");
for (const p of PARTNERS) {
  try {
    process.stdout.write(`▶ ${p.slug}: feltöltés… `);
    const url = await upload(p.logo, p.publicId);
    const [r] = await conn.execute(
      "UPDATE case_studies SET logoImage=?, logoImageAlt=?, externalLinks=? WHERE slug=?",
      [url, `${p.client} logó`, JSON.stringify(p.links), p.slug]
    );
    console.log(`✓ (${r.affectedRows} sor)\n  ${url}`);
  } catch (e) {
    console.log(`✗ ${e.message}`);
  }
}
await conn.end();
console.log("\n✓ Kész.");
