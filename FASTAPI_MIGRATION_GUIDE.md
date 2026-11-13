# DermaCare AI — Express.js to FastAPI authentication migration

## Important findings from the supplied project
- The existing backend uses **MySQL**, not PostgreSQL.
- The database name in the supplied setup/schema is `dermacare_db`.
- The existing React frontend already calls `/api/auth/signup`, `/login`, `/me`,
  `/logout`, `/forgot-password`, `/reset-password`, and `/api/dashboard`.
- The new FastAPI backend keeps these API paths and the `dc_token` HttpOnly cookie.
- Existing users and bcryptjs password hashes are intended to remain usable. The
  Python bcrypt dependency is pinned to 4.0.1 for compatibility.

## Safety
1. Keep the old `backend/` folder as a backup until all tests pass.
2. Do not upload or share `.env` files. The supplied archive contained a backend
   `.env`; it has deliberately NOT been copied into this conversion package.
3. Do not delete or recreate your MySQL database.
4. Before production use, configure a real email provider for password reset.
   For now, forgot-password reset links are printed only in the FastAPI terminal
   in development mode, matching the old Express project's development behavior.

## Setup on Windows / PowerShell

### 1. Configure FastAPI environment
Open `backend_fastapi` in VS Code terminal:

```powershell
cd backend_fastapi
copy .env.example .env
```

Open `backend_fastapi/.env` and copy the MySQL values from your existing
`backend/.env`:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

Use `dermacare_db` for DB_NAME if that is the database your existing backend uses.
Set `PORT=8000`, `CLIENT_ORIGIN=http://localhost:5173`, and set a new random
JWT_SECRET of at least 32 characters. Do not reuse or publish a secret.

### 2. Create and activate Python environment
```powershell
python -m venv venv
.\venv\Scripts\Activate
```

If PowerShell blocks activation, use Command Prompt instead:
```cmd
venv\Scripts\activate.bat
```

### 3. Install packages
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Start FastAPI
From inside `backend_fastapi`:
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Expected terminal output includes a message similar to:
`FastAPI running. MySQL database 'dermacare_db' connected.`

If it reports `Table "users" was not found`, check that DB_NAME points to the
same database used by your old Express backend. Do not create a new empty DB
unless that is intentional.

### 5. Test backend
Open these URLs:
- http://127.0.0.1:8000/  (basic status)
- http://127.0.0.1:8000/api/health  (database connectivity)
- http://127.0.0.1:8000/docs  (interactive API docs)

`/api/health` should return `{"ok": true, "db": "connected"}`.

### 6. Start frontend in a SECOND terminal
```powershell
cd frontend
npm install
npm run dev
```
The Vite proxy is already changed to forward `/api` to `127.0.0.1:8000`.
Open the URL printed by Vite (normally http://localhost:5173).

### 7. Authentication tests
1. Open `/signup` and create a test account.
2. Confirm it appears in MySQL `users` and `user_preferences`.
3. Logout, then login with the same email/password.
4. Refresh the page; `/api/auth/me` should restore the user from the HttpOnly cookie.
5. Open `/dashboard`; the protected dashboard endpoint should respond.
6. Test a wrong password; it should return `Incorrect email or password.`.
7. Test forgot password; in development, copy the reset link printed in the FastAPI terminal.

## What remains in the old backend
The original `backend/` folder is intentionally retained as a backup. Do not run
Express and FastAPI on the same port. Once FastAPI passes the tests above, you
can stop using the Express backend. You may archive/delete it later after making
a separate backup.

## Notes / limitations
- This migration implements the existing auth routes, cookie session, MySQL user
  records, interests, login audit, and development password-reset flow.
- The supplied Express version did not actually send password-reset emails; it
  printed the link to its development terminal. The FastAPI version preserves
  that behavior. SMTP/Resend/SendGrid integration is a separate step.
- Email ownership verification is not implemented in the supplied Express code,
  so it is not silently added here. It can be added as a separate verified-email
  feature once you decide the email provider.
- In-memory rate limiting from the Express version is not replicated here; add a
  production-grade rate limiter before public deployment.
