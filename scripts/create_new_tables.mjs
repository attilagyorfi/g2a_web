import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env', 'utf8');
const dbUrl = envFile.match(/DATABASE_URL=(.+)/)?.[1]?.trim();

const sql = `CREATE TABLE IF NOT EXISTS \`audit_leads\` (
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
);`;

const sql2 = `CREATE TABLE IF NOT EXISTS \`case_studies\` (
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
);`;

const conn = await createConnection(dbUrl);
try { await conn.execute(sql); console.log('✓ audit_leads created'); } catch(e) { console.log('audit_leads:', e.message); }
try { await conn.execute(sql2); console.log('✓ case_studies created'); } catch(e) { console.log('case_studies:', e.message); }
await conn.end();
console.log('Done!');
