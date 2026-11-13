import hashlib
import secrets
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from . import config

COOKIE_NAME = "dc_token"
JWT_ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    # bcrypt 4.0.1 is pinned in requirements for compatibility with existing bcryptjs hashes.
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False

def create_access_token(user_id: str, remember: bool) -> tuple[str, int]:
    days = 30 if remember else 1
    expires = datetime.now(timezone.utc) + timedelta(days=days)
    token = jwt.encode({"sub": user_id, "exp": expires}, config.JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, days

def decode_access_token(token: str) -> str:
    payload = jwt.decode(token, config.JWT_SECRET, algorithms=[JWT_ALGORITHM])
    subject = payload.get("sub")
    if not subject:
        raise jwt.InvalidTokenError("Missing subject")
    return str(subject)

def new_reset_token() -> str:
    return secrets.token_hex(32)

def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()
