import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL not set');

const sql = readFileSync('/tmp/migration_new_tables.sql', 'utf8');
const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

const conn = await mysql.createConnection(dbUrl);
console.log('Connected to database');

for (const stmt of statements) {
  try {
    await conn.execute(stmt);
    const tableName = stmt.match(/CREATE TABLE `(\w+)`/)?.[1] || 'unknown';
    console.log(`✓ Created: ${tableName}`);
  } catch (err) {
    if (err.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log(`⚠ Already exists, skipping`);
    } else {
      console.error(`✗ Error: ${err.message}`);
    }
  }
}

await conn.end();
console.log('Migration complete!');
