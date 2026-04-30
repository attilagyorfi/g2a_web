#!/usr/bin/env node
/**
 * Upload team portraits to Cloudinary at predictable public_ids that the
 * RolunkPage references. Run once per portrait change.
 *
 *   node scripts/upload-team-portraits.mjs <attila.jpg> <bence.jpg>
 *
 * Or upload one at a time with the --slot flag:
 *   node scripts/upload-team-portraits.mjs ./Attila.jpg --slot=attila
 *   node scripts/upload-team-portraits.mjs ./Bence.png --slot=bence
 *
 * The Cloudinary public_ids are fixed (`g2a/team/gyorfi-attila` and
 * `g2a/team/rado-bence`) so the URLs in RolunkPage.tsx don't need to change
 * — re-running this script overwrites the existing assets.
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  console.error("✗ CLOUDINARY_URL not set in .env");
  process.exit(1);
}
const m = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
if (!m) {
  console.error("✗ Invalid CLOUDINARY_URL format");
  process.exit(1);
}
const [, CLD_KEY, CLD_SECRET, CLD_CLOUD] = m;

function signParams(params, secret) {
  const sorted = Object.keys(params).sort();
  const toSign = sorted.map((k) => `${k}=${params[k]}`).join("&") + secret;
  return createHash("sha1").update(toSign).digest("hex");
}

async function upload(filePath, publicId, folder = "g2a/team") {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  const buffer = readFileSync(filePath);
  const ext = filePath.toLowerCase().split(".").pop() || "jpg";
  const mimeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
  const mime = mimeMap[ext] || "image/jpeg";

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
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Cloudinary ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = await res.json();
  return json.secure_url;
}

const args = process.argv.slice(2);
const slotFlag = args.find((a) => a.startsWith("--slot="))?.slice(7);
const files = args.filter((a) => !a.startsWith("--"));

const SLOTS = {
  attila: "gyorfi-attila",
  bence: "rado-bence",
};

const tasks = [];
if (slotFlag) {
  // Single explicit slot: use the first non-flag arg as the file
  const publicId = SLOTS[slotFlag];
  if (!publicId) {
    console.error(`✗ Unknown slot "${slotFlag}". Valid: ${Object.keys(SLOTS).join(", ")}`);
    process.exit(1);
  }
  if (!files[0]) { console.error("✗ Provide a file path."); process.exit(1); }
  tasks.push({ file: files[0], publicId });
} else {
  // Positional: arg 0 → attila, arg 1 → bence
  if (files[0]) tasks.push({ file: files[0], publicId: SLOTS.attila });
  if (files[1]) tasks.push({ file: files[1], publicId: SLOTS.bence });
  if (tasks.length === 0) {
    console.error(`Usage: node scripts/upload-team-portraits.mjs <attila.jpg> [bence.jpg]\n   or: node scripts/upload-team-portraits.mjs <file> --slot=attila|bence`);
    process.exit(1);
  }
}

console.log("Uploading to Cloudinary...\n");
for (const { file, publicId } of tasks) {
  try {
    process.stdout.write(`▶ ${file} → g2a/team/${publicId}  `);
    const url = await upload(file, publicId);
    console.log(`✓\n  ${url}\n`);
  } catch (err) {
    console.log(`✗ ${err.message}\n`);
  }
}
