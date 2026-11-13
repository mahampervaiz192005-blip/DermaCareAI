import pymysql
from pymysql.cursors import DictCursor
from . import config

def get_connection():
    return pymysql.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=False,
        connect_timeout=8,
    )

def check_database():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 AS ok")
            cur.fetchone()
    finally:
        conn.close()

def ensure_schema():
    """Create only the supporting tables; existing users table/data are not altered."""
    statements = [
        """
        CREATE TABLE IF NOT EXISTS user_preferences (
            user_id CHAR(36) NOT NULL,
            interest ENUM('skin','hair') NOT NULL,
            PRIMARY KEY (user_id, interest),
            CONSTRAINT fk_pref_user FOREIGN KEY (user_id)
                REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
        """,
        """
        CREATE TABLE IF NOT EXISTS login_audit (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id CHAR(36) NULL,
            email VARCHAR(255) NOT NULL,
            success BOOLEAN NOT NULL,
            ip_address VARCHAR(45) NULL,
            user_agent VARCHAR(255) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_audit_user (user_id),
            INDEX idx_audit_email (email)
        ) ENGINE=InnoDB
        """,
        """
        CREATE TABLE IF NOT EXISTS password_resets (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id CHAR(36) NOT NULL,
            token_hash CHAR(64) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            used_at DATETIME NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_reset_user FOREIGN KEY (user_id)
                REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
        """,
    ]
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SHOW TABLES LIKE 'users'")
            if not cur.fetchone():
                raise RuntimeError(
                    f'Table "users" was not found in MySQL database "{config.DB_NAME}". '
                    "Create/restore your existing users table before starting FastAPI."
                )
            for sql in statements:
                cur.execute(sql)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
