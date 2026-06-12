/** Read-only: HU meta descriptions of all case studies + the ZH meta
 *  fields of the two suspect newer posts. Input for authoring EN/ZH. */
import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [cs] = await conn.query(
    `SELECT slug, client, industry, metaDescription FROM case_studies ORDER BY id`,
  );
  for (const c of cs) {
    console.log(`${c.slug} | ${c.client} | ${c.industry || "-"}`);
    console.log(`  ${c.metaDescription}`);
  }
  const [posts] = await conn.query(
    `SELECT slug, metaTitleZh, metaDescriptionZh FROM posts WHERE slug IN ('tiktok-hirdetesek-2026-ban-mi-var-rank','hol-bukik-el-a-legtobb-kkv-a-nemzetkoziesedesnel')`,
  );
  console.log("\n=== SUSPECT ZH ===");
  for (const p of posts) {
    console.log(`${p.slug}\n  T: ${p.metaTitleZh}\n  D: ${p.metaDescriptionZh}`);
  }
} finally {
  await conn.end();
}
