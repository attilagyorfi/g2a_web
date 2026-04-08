import { createConnection } from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) { console.error('No DATABASE_URL'); process.exit(1); }

const conn = await createConnection(dbUrl);

const statements = [
  `CREATE TABLE IF NOT EXISTS \`audit_leads\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`name\` varchar(256) NOT NULL,
    \`email\` varchar(320) NOT NULL,
    \`phone\` varchar(64),
    \`company\` varchar(256),
    \`website\` text,
    \`monthlyBudget\` varchar(128),
    \`currentChallenges\` text,
    \`goals\` text,
    \`isContacted\` boolean NOT NULL DEFAULT false,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`audit_leads_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`case_studies\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`title\` varchar(512) NOT NULL,
    \`slug\` varchar(512) NOT NULL,
    \`client\` varchar(256),
    \`industry\` varchar(256),
    \`challenge\` text,
    \`solution\` text,
    \`results\` text,
    \`featuredImage\` text,
    \`featuredImageAlt\` varchar(512),
    \`tags\` text,
    \`isActive\` boolean NOT NULL DEFAULT true,
    \`sortOrder\` int DEFAULT 0,
    \`metaTitle\` varchar(512),
    \`metaDescription\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`case_studies_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`case_studies_slug_unique\` UNIQUE(\`slug\`)
  )`
];

for (const stmt of statements) {
  try {
    await conn.execute(stmt);
    console.log('✓ Table created');
  } catch(e) {
    console.log('Result:', e.message);
  }
}
await conn.end();
console.log('Done!');
