/**
 * Read-only inventory of the blog posts + case studies currently in
 * the database — slugs, title, content length per locale. Used to
 * scope the content-upload batch from the D:\ TELJES documents.
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [posts] = await conn.query(
    `SELECT id, slug, status,
            CHAR_LENGTH(COALESCE(content,'')) AS hu_len,
            CHAR_LENGTH(COALESCE(contentEn,'')) AS en_len,
            CHAR_LENGTH(COALESCE(contentZh,'')) AS zh_len,
            CHAR_LENGTH(COALESCE(metaTitle,'')) AS mt,
            title
     FROM posts ORDER BY id`,
  );
  console.log("=== POSTS (" + posts.length + ") ===");
  for (const p of posts) {
    console.log(`#${p.id} [${p.status}] ${p.slug}`);
    console.log(`   HU:${p.hu_len} EN:${p.en_len} ZH:${p.zh_len} metaT:${p.mt} | ${p.title?.slice(0, 60)}`);
  }

  const [cs] = await conn.query(
    `SELECT id, slug, isActive,
            CHAR_LENGTH(COALESCE(challenge,'')) AS ch,
            CHAR_LENGTH(COALESCE(challengeEn,'')) AS chEn,
            CHAR_LENGTH(COALESCE(solution,'')) AS sol,
            CHAR_LENGTH(COALESCE(results,'')) AS res,
            CHAR_LENGTH(COALESCE(metaTitle,'')) AS mt,
            client, tags
     FROM case_studies ORDER BY id`,
  );
  console.log("\n=== CASE STUDIES (" + cs.length + ") ===");
  for (const c of cs) {
    console.log(`#${c.id} [${c.isActive ? "aktív" : "inaktív"}] ${c.slug}`);
    console.log(`   ch:${c.ch}/${c.chEn} sol:${c.sol} res:${c.res} metaT:${c.mt} | ${c.client} | tags: ${(c.tags || "").slice(0, 60)}`);
  }
} finally {
  await conn.end();
}
