/**
 * Read-only: dump current meta title/description per locale for posts
 * + case studies, with char lengths, to scope the B5/B6/B7 batch.
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [posts] = await conn.query(
    `SELECT slug, metaTitle, metaTitleEn, metaTitleZh,
            CHAR_LENGTH(COALESCE(metaDescription,'')) AS mdHu,
            CHAR_LENGTH(COALESCE(metaDescriptionEn,'')) AS mdEn,
            CHAR_LENGTH(COALESCE(metaDescriptionZh,'')) AS mdZh
     FROM posts ORDER BY id`,
  );
  console.log("=== POSTS META ===");
  for (const p of posts) {
    console.log(`\n${p.slug}`);
    console.log(`  HU(${(p.metaTitle || "").length}): ${p.metaTitle}`);
    console.log(`  EN(${(p.metaTitleEn || "").length}): ${p.metaTitleEn}`);
    console.log(`  ZH(${(p.metaTitleZh || "").length}): ${p.metaTitleZh}`);
    console.log(`  desc len HU:${p.mdHu} EN:${p.mdEn} ZH:${p.mdZh}`);
  }

  const [cs] = await conn.query(
    `SELECT slug, metaTitle, metaTitleEn,
            CHAR_LENGTH(COALESCE(metaTitleZh,'')) AS mtZh,
            CHAR_LENGTH(COALESCE(metaDescription,'')) AS mdHu,
            CHAR_LENGTH(COALESCE(metaDescriptionEn,'')) AS mdEn,
            CHAR_LENGTH(COALESCE(metaDescriptionZh,'')) AS mdZh
     FROM case_studies ORDER BY id`,
  );
  console.log("\n\n=== CASE STUDIES META ===");
  for (const c of cs) {
    console.log(`${c.slug}`);
    console.log(`  HU(${(c.metaTitle || "").length}): ${c.metaTitle}`);
    console.log(`  EN(${(c.metaTitleEn || "").length}): ${c.metaTitleEn}`);
    console.log(`  ZH len:${c.mtZh} | desc HU:${c.mdHu} EN:${c.mdEn} ZH:${c.mdZh}`);
  }
} finally {
  await conn.end();
}
