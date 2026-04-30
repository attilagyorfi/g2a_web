#!/usr/bin/env node
/**
 * Migrate the 28 case study screenshots + logos from /public/case-studies/<slug>/
 * to Cloudinary, then update the DB rows to point at the secure_url.
 *
 * Idempotent — skips any row where featuredImage / logoImage already starts with
 * https:// (i.e. has been migrated). Safe to re-run.
 *
 * Why: serving from Cloudinary gives auto WebP/AVIF + on-the-fly responsive
 * resizing via the existing <CloudinaryImage> component. Removes ~5 MB of PNGs
 * from the build artifact too.
 *
 * Usage:
 *   node scripts/migrate-case-studies-to-cloudinary.mjs           # live run
 *   node scripts/migrate-case-studies-to-cloudinary.mjs --dry-run # just preview
 *   node scripts/migrate-case-studies-to-cloudinary.mjs --slug=cafe-frei
 *
 * Env required:
 *   DATABASE_URL
 *   CLOUDINARY_URL  (cloudinary://<key>:<secret>@<cloud_name>)
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = join(__dirname, "..", "client", "public");
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ONLY_SLUG = args.find((a) => a.startsWith("--slug="))?.slice(7);

const C = {
  reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m",
  yellow: "\x1b[33m", cyan: "\x1b[36m", gray: "\x1b[90m", bold: "\x1b[1m",
};

// ─── Cloudinary config ────────────────────────────────────────────────────────
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  console.error(`${C.red}CLOUDINARY_URL not set in .env${C.reset}`);
  process.exit(1);
}
const m = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
if (!m) {
  console.error(`${C.red}Invalid CLOUDINARY_URL — expected cloudinary://key:secret@cloud${C.reset}`);
  process.exit(1);
}
const [, CLD_KEY, CLD_SECRET, CLD_CLOUD] = m;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function signParams(params, secret) {
  const sorted = Object.keys(params).sort();
  const toSign = sorted.map((k) => `${k}=${params[k]}`).join("&") + secret;
  return createHash("sha1").update(toSign).digest("hex");
}

async function uploadToCloudinary(filePath, folder, publicId) {
  const buffer = await readFile(filePath);
  const ext = filePath.split(".").pop().toLowerCase();
  const mimeMap = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" };
  const mime = mimeMap[ext] || "application/octet-stream";

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

  const endpoint = `https://api.cloudinary.com/v1_1/${CLD_CLOUD}/auto/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Cloudinary ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = await res.json();
  return { secureUrl: json.secure_url, bytes: json.bytes, format: json.format };
}

function localPathFor(publicUrl) {
  // /case-studies/foo/desktop.png → <repo>/client/public/case-studies/foo/desktop.png
  if (!publicUrl?.startsWith("/")) return null;
  return join(PUBLIC_ROOT, publicUrl.slice(1));
}

function isAlreadyMigrated(url) {
  return typeof url === "string" && /^https:\/\//.test(url);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`${C.bold}${C.cyan}Cloudinary migration${C.reset} ${C.gray}(cloud: ${CLD_CLOUD})${C.reset}`);
if (DRY_RUN) console.log(`${C.yellow}DRY RUN${C.reset} — no DB writes, no uploads`);
if (ONLY_SLUG) console.log(`Filter: ${C.cyan}slug=${ONLY_SLUG}${C.reset}`);

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const where = ONLY_SLUG ? "WHERE slug = ?" : "";
const params = ONLY_SLUG ? [ONLY_SLUG] : [];
const [rows] = await conn.execute(
  `SELECT id, slug, featuredImage, logoImage FROM case_studies ${where} ORDER BY sortOrder, id`,
  params,
);

console.log(`\n${C.gray}Found ${rows.length} case ${rows.length === 1 ? "study" : "studies"}${C.reset}\n`);

let uploaded = 0, skipped = 0, errors = 0, totalBytesIn = 0, totalBytesOut = 0;

for (const row of rows) {
  const targets = [
    { field: "featuredImage", file: "desktop", url: row.featuredImage },
    { field: "logoImage",     file: "logo",    url: row.logoImage },
  ];

  for (const t of targets) {
    const tag = `${C.gray}[${row.slug}]${C.reset} ${t.field}`;

    if (!t.url) { console.log(`  ${C.gray}·${C.reset} ${tag} — no value, skip`); skipped++; continue; }
    if (isAlreadyMigrated(t.url)) { console.log(`  ${C.gray}·${C.reset} ${tag} — already on CDN, skip`); skipped++; continue; }

    const localPath = localPathFor(t.url);
    if (!localPath || !existsSync(localPath)) {
      console.log(`  ${C.red}✗${C.reset} ${tag} — local file missing: ${C.gray}${t.url}${C.reset}`);
      errors++;
      continue;
    }

    const folder = `g2a/case-studies/${row.slug}`;
    const publicId = t.file;

    if (DRY_RUN) {
      const buf = await readFile(localPath);
      console.log(`  ${C.yellow}→${C.reset} ${tag}  ${C.gray}${(buf.length / 1024).toFixed(1)} KB → ${folder}/${publicId}${C.reset}`);
      totalBytesIn += buf.length;
      continue;
    }

    try {
      const { secureUrl, bytes, format } = await uploadToCloudinary(localPath, folder, publicId);
      const localBuf = await readFile(localPath);
      totalBytesIn += localBuf.length;
      totalBytesOut += bytes;

      await conn.execute(
        `UPDATE case_studies SET ${t.field} = ? WHERE id = ?`,
        [secureUrl, row.id],
      );

      console.log(`  ${C.green}✓${C.reset} ${tag} ${C.gray}${(localBuf.length / 1024).toFixed(1)} KB → ${format}, ${(bytes / 1024).toFixed(1)} KB${C.reset}`);
      uploaded++;
    } catch (err) {
      console.log(`  ${C.red}✗${C.reset} ${tag} — ${err.message}`);
      errors++;
    }
  }
}

await conn.end();

console.log("");
console.log(`${C.bold}Summary${C.reset}`);
console.log(`  ${C.green}${uploaded}${C.reset} uploaded · ${C.gray}${skipped}${C.reset} skipped · ${errors > 0 ? C.red : C.gray}${errors}${C.reset} errors`);
if (uploaded > 0) {
  console.log(`  ${C.gray}Total: ${(totalBytesIn / 1024).toFixed(1)} KB in → ${(totalBytesOut / 1024).toFixed(1)} KB on Cloudinary (raw)${C.reset}`);
  console.log(`  ${C.gray}Note: end users get f_auto/q_auto so actual delivered size will be 30-60% smaller.${C.reset}`);
}
process.exit(errors > 0 ? 1 : 0);
