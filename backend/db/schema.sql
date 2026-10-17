-- DermaCare AI  |  MySQL 8+  |  Safe to run more than once.
CREATE DATABASE IF NOT EXISTS dermacare_db CHARACTER SET utf8mb4;
USE dermacare_db;

-- Aapki existing table (agar pehle se hai to ye skip ho jayegi, kuch change nahi hoga)
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Signup par chuni hui interests (Skin Care / Hair Care). users table ko touch nahi karta.
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id  CHAR(36) NOT NULL,
  interest ENUM('skin','hair') NOT NULL,
  PRIMARY KEY (user_id, interest),
  CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Har login attempt ka record (success / fail)
CREATE TABLE IF NOT EXISTS login_audit (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    CHAR(36)     NULL,
  email      VARCHAR(255) NOT NULL,
  success    BOOLEAN      NOT NULL,
  ip_address VARCHAR(45)  NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_email (email)
) ENGINE=InnoDB;

-- Forgot-password tokens (sirf SHA-256 hash store hota hai, asli token nahi)
CREATE TABLE IF NOT EXISTS password_resets (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at    DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
