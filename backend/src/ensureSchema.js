// Server start hote hi 3 extra tables (agar nahi hain) khud bana deta hai.
// Isse "npm run db:init" bhool jane par signup/login audit 500 error nahi dete.
import { pool } from './db.js';

const TABLES = [
  `CREATE TABLE IF NOT EXISTS user_preferences (
     user_id CHAR(36) NOT NULL,
     interest ENUM('skin','hair') NOT NULL,
     PRIMARY KEY (user_id, interest),
     CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS login_audit (
     id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id CHAR(36) NULL,
     email VARCHAR(255) NOT NULL,
     success BOOLEAN NOT NULL,
     ip_address VARCHAR(45) NULL,
     user_agent VARCHAR(255) NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_audit_user (user_id),
     INDEX idx_audit_email (email)
   ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS password_resets (
     id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id CHAR(36) NOT NULL,
     token_hash CHAR(64) NOT NULL UNIQUE,
     expires_at DATETIME NOT NULL,
     used_at DATETIME NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB`,
];

export async function ensureSchema() {
  const [rows] = await pool.query("SHOW TABLES LIKE 'users'");
  if (!rows.length) {
    console.error('Table "users" not found in this database. Create your tables first (run your schema SQL), then restart.');
    process.exit(1);
  }
  for (const sql of TABLES) await pool.query(sql);
  console.log('Database tables verified.');
}
