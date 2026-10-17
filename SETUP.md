# DermaCare AI — Login/Signup setup

## 1. Database (MySQL 8+)
```bash
cd backend
npm install
cp .env.example .env        # phir .env me DB_PASSWORD aur JWT_SECRET bharein
npm run db:init             # dermacare_db + tables bana deta hai (existing `users` table safe rehti hai)
```
Naye tables: `user_preferences` (signup interests), `login_audit` (har login attempt), `password_resets`.
`users` table me koi column add/change nahi hota.

JWT_SECRET banane ke liye:
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## 2. Run
```bash
# Terminal 1
cd backend && npm run dev          # http://localhost:5000  ("MySQL connected" dikhna chahiye)
# Terminal 2
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## 3. Test
1. `/signup` par account banayein -> `SELECT * FROM users;` me naya row (password_hash `$2a$12$...` se shuru).
2. Logout -> `/login` par wahi email/password -> `/dashboard` khulta hai.
3. Galat password -> "Incorrect email or password." (`login_audit` me success=0 row).
4. `/dashboard` bina login -> `/login` par redirect.
5. Inactive test: `UPDATE users SET is_active=0 WHERE email='...';` -> login block.
6. Forgot password: email nahi bheja jata (SMTP configured nahi). Development me reset link backend terminal me print hota hai.

## Production
`NODE_ENV=production`, HTTPS, `CLIENT_ORIGIN` = asli frontend URL, frontend par `VITE_API_URL` set karein.
