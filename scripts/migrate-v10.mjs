import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
try {
  await conn.execute("ALTER TABLE `newsletter_subscribers` ADD COLUMN `segment` varchar(128)");
  console.log("Added segment column");
} catch (e) { console.log("segment already exists or error:", e.message); }
try {
  await conn.execute("ALTER TABLE `newsletter_subscribers` ADD COLUMN `source` varchar(128)");
  console.log("Added source column");
} catch (e) { console.log("source already exists or error:", e.message); }
try {
  await conn.execute("ALTER TABLE `newsletter_subscribers` ADD COLUMN `tags` text");
  console.log("Added tags column");
} catch (e) { console.log("tags already exists or error:", e.message); }
try {
  await conn.execute("ALTER TABLE `pages` ADD COLUMN `keywords` text");
  console.log("Added keywords column");
} catch (e) { console.log("keywords already exists or error:", e.message); }
console.log("Migration complete");
await conn.end();
