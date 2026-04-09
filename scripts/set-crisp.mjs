import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

await conn.execute(
  "INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?",
  ['crisp_website_id', '77fba720-7226-442d-87a1-e07553b6b328', '77fba720-7226-442d-87a1-e07553b6b328']
);

const [rows] = await conn.execute("SELECT `key`, value FROM site_settings WHERE `key` = 'crisp_website_id'");
console.log('Crisp Website ID saved successfully:', rows[0]?.value);

await conn.end();
