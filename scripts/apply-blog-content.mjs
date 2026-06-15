/**
 * Full long-form blog content upload from
 * docs/content-source/G2A-blogcikkek-TELJES.md (9 articles × HU/EN/ZH).
 *
 * The TELJES doc is markdown with a rigid per-article shape:
 *   # N. <title>
 *   `/hirek/<slug>`
 *   ## 🇭🇺 MAGYAR | ## 🇬🇧 ENGLISH | ## 🇨🇳 中文
 *     **Meta cím/title:** …      (skipped — applied in a previous batch)
 *     **H1: …**                  → title field
 *     *TL;DR: …*                 → lead paragraph (italic) + excerpt
 *     plain / bold-lead paragraphs → <p> / <h2>+<p>
 *     **Heading:** + "- item" lines → <h2> + <ul>
 *     CTA line (contains markdown links) → <p><strong>…</strong> … <a>…</a></p>
 *     **★ AEO…:** *…*           → closing <em> paragraph (label dropped)
 *
 * Output per article/locale: clean HTML using only the tags the
 * BlogPostPage renderer supports (<p> <h2> <h3> <ul> <ol> <li>
 * <strong> <em> <a>). The docx A1 typo (béménél → bérénél) is fixed
 * during conversion.
 *
 * Usage:
 *   node scripts/apply-blog-content.mjs            # dry run (stats + sample)
 *   node scripts/apply-blog-content.mjs --apply    # write to DB
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");
const __dirname = dirname(fileURLToPath(import.meta.url));
const DOC = readFileSync(
  resolve(__dirname, "../docs/content-source/G2A-blogcikkek-TELJES.md"),
  "utf-8",
)
  // A1 fix (docx): typo lived in article 4's key points + AEO summary.
  .replace(/béménél/g, "bérénél");

// ─── Inline markdown → HTML ──────────────────────────────────────────
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(md) {
  let s = esc(md.trim());
  // links first (their text may contain ** which we want intact inside <a>)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => `<a href="${url}">${text}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // single-asterisk italic (avoid ** leftovers — none remain at this point)
  s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return s;
}

/** Strip ALL markdown emphasis/link syntax — for title/excerpt fields. */
function plain(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .trim();
}

// ─── Block-level conversion ──────────────────────────────────────────
/**
 * Convert one language section's body (array of blank-line-separated
 * blocks, meta lines already removed) to { title, excerpt, html }.
 */
function convertSection(body) {
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  let title = "";
  let excerpt = "";
  const out = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    // H1 line → title (handles "H1:" and full-width "H1：")
    const h1m = lines[0].match(/^\*\*H1[:：]\s*(.+?)\*\*$/);
    if (h1m) {
      title = plain(h1m[1]);
      // any remaining lines in this block are unexpected; treat as paragraph
      for (const rest of lines.slice(1)) out.push(`<p>${inline(rest)}</p>`);
      continue;
    }

    // TL;DR block: *TL;DR: …* (whole block italic) → lead paragraph + excerpt
    const tldr = block.match(/^\*TL;DR[:：]?\s*([\s\S]+)\*$/);
    if (tldr) {
      excerpt = plain(tldr[1]).replace(/\s+/g, " ");
      out.push(`<p><em>TL;DR: ${inline(tldr[1].replace(/\n/g, " "))}</em></p>`);
      continue;
    }

    // AEO summary: **★ …:** *text* → closing italic paragraph, label dropped
    const aeo = block.match(/^\*\*★[^*]*\*\*\s*\*([\s\S]+)\*$/);
    if (aeo) {
      out.push(`<p><em>${inline(aeo[1].replace(/\n/g, " "))}</em></p>`);
      continue;
    }

    // Bold-only heading + immediate "- " list in the same block
    // (e.g. **Kulcspontok (TL;DR):** \n - item \n - item)
    if (/^\*\*[^*]+\*\*$/.test(lines[0]) && lines.slice(1).every((l) => l.startsWith("- "))) {
      const heading = plain(lines[0]).replace(/[:：]\s*$/, "");
      const items = lines.slice(1).map((l) => `<li>${inline(l.slice(2))}</li>`).join("");
      out.push(`<h2>${esc(heading)}</h2>`);
      if (items) out.push(`<ul>${items}</ul>`);
      continue;
    }

    // Pure list block
    if (lines.every((l) => l.startsWith("- "))) {
      out.push(`<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`);
      continue;
    }

    // Single-paragraph blocks (join soft-wrapped lines)
    const text = lines.join(" ");

    // CTA paragraph: bold lead + markdown link(s) → plain <p>
    const boldLead = text.match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
    if (boldLead && /\]\(/.test(text)) {
      const lead = boldLead[1].trim();
      const rest = boldLead[2].replace(/^→\s*/, "").trim();
      out.push(`<p><strong>${inline(lead)}</strong> ${inline(rest)}</p>`);
      continue;
    }

    // Bold-lead section: **Heading.** rest → <h2> + <p>
    if (boldLead && boldLead[2].trim().length > 0) {
      const headRaw = boldLead[1].trim();
      const head = headRaw.replace(/[.。]\s*$/, ""); // strip trailing period only
      out.push(`<h2>${esc(head)}</h2>`);
      out.push(`<p>${inline(boldLead[2])}</p>`);
      continue;
    }

    // Bold-only line without list → standalone heading
    if (boldLead && boldLead[2].trim().length === 0) {
      out.push(`<h2>${esc(plain(text).replace(/[:：]\s*$/, ""))}</h2>`);
      continue;
    }

    // Plain paragraph
    out.push(`<p>${inline(text)}</p>`);
  }

  return { title, excerpt, html: out.join("\n") };
}

// ─── Document split ──────────────────────────────────────────────────
const articles = [];
// Articles start with "# N. " headers
const parts = DOC.split(/^# (?=\d+\.)/m).slice(1);
for (const part of parts) {
  const slugM = part.match(/`\/hirek\/([a-z0-9-]+)`/);
  if (!slugM) continue;
  const slug = slugM[1];

  const huM = part.match(/## 🇭🇺 MAGYAR\s*\n([\s\S]*?)(?=## 🇬🇧)/);
  const enM = part.match(/## 🇬🇧 ENGLISH\s*\n([\s\S]*?)(?=## 🇨🇳)/);
  const zhM = part.match(/## 🇨🇳 中文\s*\n([\s\S]*?)(?=\n---|\n# |$)/);
  if (!huM || !enM || !zhM) {
    console.warn(`⚠ ${slug}: hiányzó nyelvi szekció — kihagyva`);
    continue;
  }

  // Drop the meta lines (already applied in the previous batch)
  const stripMeta = (s) => s.replace(/^\*\*Meta[^\n]*\n?/gm, "");

  const hu = convertSection(stripMeta(huM[1]));
  const en = convertSection(stripMeta(enM[1]));
  const zh = convertSection(stripMeta(zhM[1]));
  articles.push({ slug, hu, en, zh });
}

// ─── Report ──────────────────────────────────────────────────────────
const wordCount = (html, cjk = false) => {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (cjk) return (text.match(/[一-鿿]/g) || []).length;
  return text.split(" ").filter(Boolean).length;
};

console.log(`${articles.length} cikk felismerve:\n`);
for (const a of articles) {
  console.log(`${a.slug}`);
  console.log(`  HU: "${a.hu.title.slice(0, 55)}" — ${wordCount(a.hu.html)} szó, ${a.hu.html.length} char HTML`);
  console.log(`  EN: "${a.en.title.slice(0, 55)}" — ${wordCount(a.en.html)} szó`);
  console.log(`  ZH: "${a.zh.title.slice(0, 55)}" — ${wordCount(a.zh.html, true)} írásjegy`);
}

if (!APPLY) {
  console.log("\n─── MINTA (1. cikk HU HTML, első 2500 karakter) ───\n");
  console.log(articles[0].hu.html.slice(-2200));
  console.log("\n[dry run] — futtasd --apply kapcsolóval az íráshoz.");
  process.exit(0);
}

// ─── Apply ───────────────────────────────────────────────────────────
const conn = await mysql.createConnection(process.env.DATABASE_URL);
let updated = 0;
try {
  for (const a of articles) {
    const [res] = await conn.query(
      `UPDATE posts SET
         title = ?, titleEn = ?, titleZh = ?,
         excerpt = ?, excerptEn = ?, excerptZh = ?,
         content = ?, contentEn = ?, contentZh = ?
       WHERE slug = ?`,
      [
        a.hu.title, a.en.title, a.zh.title,
        a.hu.excerpt, a.en.excerpt, a.zh.excerpt,
        a.hu.html, a.en.html, a.zh.html,
        a.slug,
      ],
    );
    console.log(`posts/${a.slug}: ${res.affectedRows} sor`);
    updated += res.affectedRows;
  }
  console.log(`\n✓ Kész — ${updated} cikk frissítve (title + excerpt + content × 3 nyelv).`);
} finally {
  await conn.end();
}
