// `npm run db:init` -> db/schema.sql chala kar tables bana deta hai (mysql CLI ki zaroorat nahi).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from './config.js';

const sql = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../db/schema.sql'), 'utf8');
const conn = await mysql.createConnection({ ...config.db, database: undefined, multipleStatements: true });
await conn.query(sql.replaceAll('dermacare_db', config.db.database));
await conn.end();
console.log(`Database "${config.db.database}" is ready (tables created / verified).`);
