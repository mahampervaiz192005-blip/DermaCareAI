import os
from pathlib import Path
from dotenv import load_dotenv

# Load backend_fastapi/.env (one level above app/)
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

PORT = int(os.getenv("PORT", "8000"))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PRODUCTION = ENVIRONMENT == "production"
CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "http://localhost:5173").rstrip("/")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "dermacare_db")

JWT_SECRET = os.getenv("JWT_SECRET", "")
if len(JWT_SECRET) < 32:
    raise RuntimeError(
        "JWT_SECRET missing or too short. Set a random secret of at least 32 characters in backend_fastapi/.env"
    )
