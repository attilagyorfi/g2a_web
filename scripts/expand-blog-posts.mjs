/**
 * Expand short blog-post stubs into full-length SEO articles + auto-translate
 * to EN/ZH via DeepL.
 *
 * Why: the 9 current posts are 80–120 word stubs (~500 chars). Google's
 * ranking signals heavily favour deeper, well-structured content (~1000–1500
 * words). This script takes each stub as a brief and asks GPT-4o-mini to
 * write a full HU article respecting the original angle, then runs DeepL to
 * produce EN and ZH versions in lockstep.
 *
 * Two modes:
 *   DRY-RUN  (default)     — generates + writes `tmp/expand-blog-<id>.json`,
 *                            leaves the DB untouched. Inspect the JSON files,
 *                            iterate prompts if needed.
 *   APPLY    (--apply)     — reads the same JSON files and UPDATEs the posts
 *                            table. Skips any IDs without a JSON on disk.
 *
 * Idempotent: by default skips posts where `contentEn` is already populated.
 * Pass `--force` to regenerate all posts including translated ones.
 *
 * Cost estimate at 9 posts:
 *   OpenAI gpt-4o-mini: ~3000 output tokens × 9 = $0.02
 *   DeepL free tier:    ~150k chars / 500k-monthly cap = 30%
 *
 * Run:
 *   node scripts/expand-blog-posts.mjs                # dry-run all stubs
 *   node scripts/expand-blog-posts.mjs --only=1,3     # only IDs 1 and 3
 *   node scripts/expand-blog-posts.mjs --force        # ignore "already has EN"
 *   node scripts/expand-blog-posts.mjs --apply        # write to DB
 */
import "dotenv/config";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TMP_DIR = join(ROOT, "tmp");

// ─── CLI ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.some((a) => a === `--${name}`);
const val = (name) => {
  const a = argv.find((a) => a.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : null;
};

const APPLY = flag("apply");
const FORCE = flag("force");
const ONLY_IDS = (val("only") || "").split(",").map((s) => parseInt(s.trim(), 10)).filter(Number.isFinite);

// ─── DB ──────────────────────────────────────────────────────────────────────
async function connectDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const u = new URL(process.env.DATABASE_URL);
  return mysql.createConnection({
    host: u.hostname,
    port: parseInt(u.port),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    ssl: { minVersion: "TLSv1.2" },
  });
}

// ─── OpenAI ──────────────────────────────────────────────────────────────────
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function openaiChat(messages, { temperature = 0.55, maxTokens = 4000 } = {}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY required");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

const EXPAND_SYSTEM_PROMPT = `Te a G2A Marketing tartalom-stratégája vagy — egy magyar B2B marketing ügynökség, Pécsen. KKV-knak és nagyvállalatoknak írsz SEO-optimalizált, mély blog cikkeket.

Adott egy rövid blog poszt vázlat (címmel, lead bekezdéssel és néhány kulcsmondattal). Bővítsd ki egy teljes értékű, 1200-1800 szavas mély cikkre magyar nyelven.

KÖVETELMÉNYEK:

1. **Formátum**: HTML — kizárólag <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em> tag-eket használj. Csak a tartalom HTML-jét add vissza — NE rakj köré \`\`\`html\`\`\` blokkot, NE adj fejlécet, NE adj magyarázatot.

2. **Hangnem**: Te-formát használj (NEM önözést). Szakmai, de barátságos. NE használj klisét ("Manapság...", "A mai világban...", "Mindenki tudja, hogy..."). Konkrét, tárgyilagos.

3. **Struktúra**: 4–7 alfejezet H2-vel. Mindegyik H2 alatt 2–4 bekezdés (<p>) vagy lista. Az ELSŐ bekezdés az eredeti lead — TARTSD meg vagy minimálisan finomítsd. Az UTOLSÓ alfejezet "Mit tegyél most?" jellegű gyakorlati lezárás konkrét akciópontokkal.

4. **Tartalmi mélység**: A vázlatban felvetett gondolatokat fejtsd ki konkrétumokkal:
   - Konkrét magyar piaci adatok, statisztikák ha helytálló (NE találj ki számokat — csak ami közismert)
   - Konkrét eszközök, platformok, módszertanok megnevezése (HubSpot, Google Ads, GA4, Performance Max, stb.)
   - Példák tipikus magyar B2B / KKV szituációkból
   - Hibák amik gyakran fordulnak elő + ezek elkerülése

5. **SEO**: Természetes módon szerepeljen a cím kulcsszava és a téma 2-3 szinonimája. Hosszú-tail kulcsszavakat építs be (pl. "B2B marketing ROAS", "KKV digitális stratégia").

6. **Brand-konzisztencia**: Ne emlegesd magunkat ("a G2A...", "csapatunk..."), kivéve egyszer az utolsó CTA bekezdésben. A cikk ne legyen sales pitch — érték-elsősorban-tudás formátum.

7. **NE találj ki** ESG akreditációt vagy más tényt ami nincs az eredeti vázlatban. Az SZTFH NEM akkreditált ESG-jelentéstevők vagyunk — ha ESG-ről van szó, közöld hogy csak kommunikációs oldalon segítünk.

Csak a kibővített HTML cikket add vissza. Semmi más.`;

async function expandHungarianContent({ title, excerpt, content }) {
  const userPrompt = `EREDETI POSZT VÁZLAT:

CÍM: ${title}

EXCERPT: ${excerpt || "(nincs)"}

CONTENT (HTML):
${content}

—

Most bővítsd ezt egy 1200-1800 szavas teljes cikkre HTML-ben a fenti követelmények szerint.`;

  return openaiChat(
    [
      { role: "system", content: EXPAND_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.55, maxTokens: 4500 },
  );
}

async function generateMetaSeo(title, excerpt, lang) {
  const langName = lang === "hu" ? "magyar" : lang === "en" ? "angol" : "kínai (egyszerűsített)";
  const system = `Adott egy blog poszt címe és összefoglalója. Generálj SEO meta-title-t (max 60 karakter) és meta-description-t (max 155 karakter) ${langName} nyelven. JSON-ban válaszolj: {"title": "...", "description": "..."}. Semmi más.`;
  const user = `TITLE: ${title}\n\nEXCERPT: ${excerpt}`;

  const raw = await openaiChat(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature: 0.3, maxTokens: 300 },
  );
  // Strip code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return { title: parsed.title || "", description: parsed.description || "" };
  } catch {
    console.warn("[seo] Could not parse JSON:", raw.slice(0, 100));
    return { title: "", description: "" };
  }
}

// ─── DeepL ───────────────────────────────────────────────────────────────────
async function deeplTranslate(text, target) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY required");
  if (!text || !text.trim()) return "";

  const host = key.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const body = new URLSearchParams();
  body.set("text", text.trim());
  body.set("source_lang", "HU");
  body.set("target_lang", target === "zh" ? "ZH" : "EN-US");
  if (/<[a-z][^>]*>/i.test(text)) body.set("tag_handling", "html");

  const res = await fetch(host, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`DeepL ${res.status}: ${t.slice(0, 200) || res.statusText}`);
  }

  const data = await res.json();
  return data.translations?.[0]?.text ?? "";
}

// ─── Per-post pipeline ───────────────────────────────────────────────────────
async function processOne(post) {
  console.log(`\n[${post.id}] ${post.slug}`);
  console.log(`  HU title: ${post.title}`);
  console.log(`  HU content: ${post.content?.length || 0} chars → expanding…`);

  // 1. Expand HU
  const newContentHu = await expandHungarianContent({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
  });
  console.log(`  HU expanded: ${newContentHu.length} chars`);

  // 2. Translate content to EN + ZH
  console.log(`  Translating to EN…`);
  const contentEn = await deeplTranslate(newContentHu, "en");
  console.log(`  EN content: ${contentEn.length} chars`);

  console.log(`  Translating to ZH…`);
  const contentZh = await deeplTranslate(newContentHu, "zh");
  console.log(`  ZH content: ${contentZh.length} chars`);

  // 3. Translate title + excerpt
  const titleEn = await deeplTranslate(post.title, "en");
  const titleZh = await deeplTranslate(post.title, "zh");
  const excerptEn = post.excerpt ? await deeplTranslate(post.excerpt, "en") : "";
  const excerptZh = post.excerpt ? await deeplTranslate(post.excerpt, "zh") : "";

  // 4. SEO meta (generated, not translated — better-targeted per locale)
  console.log(`  SEO meta…`);
  const metaHu = await generateMetaSeo(post.title, post.excerpt, "hu");
  const metaEn = await generateMetaSeo(titleEn, excerptEn, "en");
  const metaZh = await generateMetaSeo(titleZh, excerptZh, "zh");

  return {
    id: post.id,
    slug: post.slug,
    content: newContentHu,
    titleEn,
    titleZh,
    excerptEn,
    excerptZh,
    contentEn,
    contentZh,
    metaTitle: metaHu.title,
    metaDescription: metaHu.description,
    metaTitleEn: metaEn.title,
    metaDescriptionEn: metaEn.description,
    metaTitleZh: metaZh.title,
    metaDescriptionZh: metaZh.description,
  };
}

// ─── DB read / write ─────────────────────────────────────────────────────────
async function readPosts(conn) {
  let sql = `SELECT id, slug, title, excerpt, content, contentEn FROM posts WHERE status = 'published'`;
  const params = [];
  if (ONLY_IDS.length > 0) {
    sql += ` AND id IN (${ONLY_IDS.map(() => "?").join(",")})`;
    params.push(...ONLY_IDS);
  }
  sql += ` ORDER BY id`;
  const [rows] = await conn.execute(sql, params);
  return rows;
}

async function updatePost(conn, result) {
  await conn.execute(
    `UPDATE posts SET
       content = ?,
       titleEn = ?, titleZh = ?,
       excerptEn = ?, excerptZh = ?,
       contentEn = ?, contentZh = ?,
       metaTitle = ?, metaDescription = ?,
       metaTitleEn = ?, metaDescriptionEn = ?,
       metaTitleZh = ?, metaDescriptionZh = ?
     WHERE id = ?`,
    [
      result.content,
      result.titleEn, result.titleZh,
      result.excerptEn, result.excerptZh,
      result.contentEn, result.contentZh,
      result.metaTitle, result.metaDescription,
      result.metaTitleEn, result.metaDescriptionEn,
      result.metaTitleZh, result.metaDescriptionZh,
      result.id,
    ],
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

  const conn = await connectDb();

  if (APPLY) {
    // Read JSON files from tmp/, write to DB.
    const files = readdirSync(TMP_DIR).filter((f) => /^expand-blog-\d+\.json$/.test(f));
    if (files.length === 0) {
      console.error("No expand-blog-*.json files in tmp/. Run dry-run first.");
      process.exit(1);
    }
    console.log(`Applying ${files.length} files to DB…`);
    for (const f of files) {
      const data = JSON.parse(readFileSync(join(TMP_DIR, f), "utf8"));
      if (ONLY_IDS.length > 0 && !ONLY_IDS.includes(data.id)) continue;
      console.log(`  [${data.id}] ${data.slug}`);
      await updatePost(conn, data);
    }
    await conn.end();
    console.log(`✔ Done. ${files.length} posts updated.`);
    return;
  }

  // Dry-run: generate and write JSON
  const posts = await readPosts(conn);
  console.log(`Found ${posts.length} published posts.`);

  for (const post of posts) {
    if (!FORCE && post.contentEn && post.contentEn.length > 100) {
      console.log(`[${post.id}] ${post.slug} — already has EN content (${post.contentEn.length} chars), skipping. Use --force to regenerate.`);
      continue;
    }
    const result = await processOne(post);
    const outPath = join(TMP_DIR, `expand-blog-${post.id}.json`);
    writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
    console.log(`  ✔ Saved ${outPath}`);
  }

  await conn.end();
  console.log(`\n✔ Dry-run complete. Review the JSON files in tmp/, then run with --apply.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
