import uuid
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPBearer
import jwt
from ..database import get_connection
from ..schemas import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from ..security import (
    COOKIE_NAME, create_access_token, decode_access_token, hash_password,
    verify_password, new_reset_token, sha256_hex
)
from .. import config

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
# Dummy bcrypt hash reduces obvious timing differences for unknown email addresses.
DUMMY_HASH = bcrypt.hashpw(b"dummy-password-for-timing", bcrypt.gensalt(rounds=12)).decode("utf-8")

def public_user(user):
    return {"id": user["id"], "full_name": user["full_name"], "email": user["email"]}

def set_auth_cookie(response: Response, user_id: str, remember: bool):
    token, days = create_access_token(user_id, remember)
    options = {
        "key": COOKIE_NAME,
        "value": token,
        "httponly": True,
        "secure": config.IS_PRODUCTION,
        "samesite": "lax",
        "path": "/",
    }
    if remember:
        options["max_age"] = days * 24 * 60 * 60
    response.set_cookie(**options)

def clear_auth_cookie(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME, path="/", httponly=True,
        secure=config.IS_PRODUCTION, samesite="lax"
    )

def current_user(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Please log in to continue.")
    try:
        user_id = decode_access_token(token)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please log in again.")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, full_name, email, is_active FROM users WHERE id=%s LIMIT 1",
                (user_id,)
            )
            user = cur.fetchone()
    finally:
        conn.close()
    if not user or not user["is_active"]:
        raise HTTPException(status_code=401, detail="Please log in to continue.")
    return user

def write_audit(conn, user_id, email, success, request):
    try:
        ip = request.client.host if request.client else None
        agent = request.headers.get("user-agent", "")
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO login_audit
                   (user_id, email, success, ip_address, user_agent)
                   VALUES (%s, %s, %s, %s, %s)""",
                (user_id, email, 1 if success else 0, (ip or "")[:45], agent[:255])
            )
    except Exception as exc:
        # Audit failure should not hide the authentication result.
        print("login audit failed:", str(exc))

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, response: Response):
    user_id = str(uuid.uuid4())
    email = payload.email.strip().lower()
    interests = sorted(set(payload.interests))
    password_hash = hash_password(payload.password)
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO users (id, full_name, email, password_hash, is_active)
                   VALUES (%s, %s, %s, %s, 1)""",
                (user_id, payload.full_name.strip(), email, password_hash)
            )
            for interest in interests:
                cur.execute(
                    "INSERT INTO user_preferences (user_id, interest) VALUES (%s, %s)",
                    (user_id, interest)
                )
        conn.commit()
    except Exception as exc:
        conn.rollback()
        if getattr(exc, "args", [None])[0] == 1062:
            raise HTTPException(
                status_code=409,
                detail={"message": "An account with this email already exists.",
                        "errors": {"email": "This email is already registered."}}
            )
        print("signup error:", repr(exc))
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")
    finally:
        conn.close()
    set_auth_cookie(response, user_id, True)
    return {"user": {"id": user_id, "full_name": payload.full_name.strip(), "email": email}}

@router.post("/login")
def login(payload: LoginRequest, request: Request, response: Response):
    email = payload.email.strip().lower()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, full_name, email, password_hash, is_active FROM users WHERE email=%s LIMIT 1",
                (email,)
            )
            user = cur.fetchone()
        # Keep response identical for unknown email and incorrect password.
        valid = verify_password(payload.password, user["password_hash"] if user else DUMMY_HASH)
        if not user or not valid:
            write_audit(conn, user["id"] if user else None, email, False, request)
            conn.commit()
            raise HTTPException(status_code=401, detail="Incorrect email or password.")
        if not user["is_active"]:
            write_audit(conn, user["id"], email, False, request)
            conn.commit()
            raise HTTPException(status_code=403, detail="This account has been deactivated. Please contact support.")
        write_audit(conn, user["id"], email, True, request)
        conn.commit()
    except HTTPException:
        raise
    except Exception as exc:
        conn.rollback()
        print("login error:", repr(exc))
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")
    finally:
        conn.close()
    set_auth_cookie(response, user["id"], payload.remember)
    return {"user": public_user(user)}

@router.get("/me")
def me(user=Depends(current_user)):
    return {"user": public_user(user)}

@router.post("/logout")
def logout(response: Response):
    clear_auth_cookie(response)
    return {"ok": True}

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    email = payload.email.strip().lower()
    generic = {"message": "If an account exists for that email, a reset link has been sent."}
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE email=%s AND is_active=1 LIMIT 1", (email,))
            user = cur.fetchone()
            if user:
                token = new_reset_token()
                token_hash = sha256_hex(token)
                cur.execute(
                    """INSERT INTO password_resets (user_id, token_hash, expires_at)
                       VALUES (%s, %s, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))""",
                    (user["id"], token_hash)
                )
                link = f"{config.CLIENT_ORIGIN}/reset-password?token={token}"
                if not config.IS_PRODUCTION:
                    print(f"\n[DEV] Password reset link for {email}:\n{link}\n")
        conn.commit()
    except Exception as exc:
        conn.rollback()
        print("forgot-password error:", repr(exc))
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")
    finally:
        conn.close()
    return generic

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest):
    token_hash = sha256_hex(payload.token)
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, user_id FROM password_resets
                   WHERE token_hash=%s AND used_at IS NULL
                     AND expires_at > UTC_TIMESTAMP()
                   LIMIT 1 FOR UPDATE""",
                (token_hash,)
            )
            reset = cur.fetchone()
            if not reset:
                conn.rollback()
                raise HTTPException(status_code=400, detail="This reset link is invalid or has expired.")
            cur.execute(
                "UPDATE users SET password_hash=%s WHERE id=%s",
                (hash_password(payload.password), reset["user_id"])
            )
            cur.execute(
                "UPDATE password_resets SET used_at=UTC_TIMESTAMP() WHERE user_id=%s AND used_at IS NULL",
                (reset["user_id"],)
            )
        conn.commit()
    except HTTPException:
        raise
    except Exception as exc:
        conn.rollback()
        print("reset-password error:", repr(exc))
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")
    finally:
        conn.close()
    return {"message": "Password updated. You can now log in."}
