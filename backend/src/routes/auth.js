import crypto from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { pool } from '../db.js';
import { config } from '../config.js';
import { isEmail, normEmail, passwordProblem } from '../validators.js';
import { clearAuthCookie, requireAuth, setAuthCookie } from '../middleware/auth.js';

const router = Router();
const BCRYPT_COST = 12;
// Email na milne par bhi bcrypt chalate hain taake response time se pata na chale ki email exist karta hai.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', BCRYPT_COST);

const limiter = (max, windowMin) =>
  rateLimit({
    windowMs: windowMin * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
  });

const publicUser = (u) => ({ id: u.id, full_name: u.full_name, email: u.email });
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

/* ---------------- SIGNUP ---------------- */
router.post('/signup', limiter(10, 15), async (req, res) => {
  const full_name = String(req.body.full_name ?? '').trim();
  const email = normEmail(req.body.email);
  const { password } = req.body;
  const interests = [...new Set((Array.isArray(req.body.interests) ? req.body.interests : []).filter((i) => ['skin', 'hair'].includes(i)))];

  const errors = {};
  if (full_name.length < 2 || full_name.length > 100) errors.full_name = 'Enter your full name (2–100 characters).';
  if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  const pwErr = passwordProblem(password);
  if (pwErr) errors.password = pwErr;
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });

  const id = crypto.randomUUID();
  const password_hash = await bcrypt.hash(password, BCRYPT_COST);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      'INSERT INTO users (id, full_name, email, password_hash, is_active) VALUES (?, ?, ?, ?, 1)',
      [id, full_name, email, password_hash],
    );
    for (const interest of interests) {
      await conn.execute('INSERT INTO user_preferences (user_id, interest) VALUES (?, ?)', [id, interest]);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An account with this email already exists.', errors: { email: 'This email is already registered.' } });
    }
    console.error('signup error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  } finally {
    conn.release();
  }

  setAuthCookie(res, id, true);
  res.status(201).json({ user: { id, full_name, email } });
});

/* ---------------- LOGIN ---------------- */
router.post('/login', limiter(10, 15), async (req, res) => {
  const email = normEmail(req.body.email);
  const { password } = req.body;
  const remember = req.body.remember === true;

  if (!email || typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  if (!isEmail(email)) return res.status(400).json({ message: 'Enter a valid email address.', errors: { email: 'Enter a valid email address.' } });

  const audit = (userId, success) =>
    pool
      .execute('INSERT INTO login_audit (user_id, email, success, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)', [
        userId, email, success ? 1 : 0, (req.ip || '').slice(0, 45), String(req.get('user-agent') || '').slice(0, 255),
      ])
      .catch((e) => console.error('audit log failed:', e.message));

  try {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, password_hash, is_active FROM users WHERE email = ? LIMIT 1',
      [email],
    );
    const user = rows[0];
    const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

    if (!user || !ok) {
      await audit(user?.id ?? null, false);
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    if (!user.is_active) {
      await audit(user.id, false);
      return res.status(403).json({ message: 'This account has been deactivated. Please contact support.' });
    }

    await audit(user.id, true);
    setAuthCookie(res, user.id, remember);
    res.json({ user: publicUser(user) });   // password_hash kabhi response me nahi jata
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

/* ---------------- SESSION ---------------- */
router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

/* ---------------- FORGOT / RESET PASSWORD ---------------- */
router.post('/forgot-password', limiter(5, 15), async (req, res) => {
  const email = normEmail(req.body.email);
  const generic = { message: 'If an account exists for that email, a reset link has been sent.' };
  if (!isEmail(email)) return res.status(400).json({ message: 'Enter a valid email address.' });

  try {
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1', [email]);
    if (rows.length) {
      const token = crypto.randomBytes(32).toString('hex');
      await pool.execute(
        'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))',
        [rows[0].id, sha256(token)],
      );
      const link = `${config.clientOrigin}/reset-password?token=${token}`;
      // TODO: email service (SMTP / Resend / SendGrid) yahan connect karein.
      // Abhi email setup nahi hai, isliye link sirf development me server console me print hota hai.
      if (!config.isProd) console.log(`\n[DEV] Password reset link for ${email}:\n${link}\n`);
    }
    res.json(generic);   // email exist kare ya na kare, jawab same
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

router.post('/reset-password', limiter(10, 15), async (req, res) => {
  const { token, password } = req.body;
  const pwErr = passwordProblem(password);
  if (pwErr) return res.status(400).json({ message: pwErr, errors: { password: pwErr } });
  if (typeof token !== 'string' || token.length !== 64) return res.status(400).json({ message: 'This reset link is invalid or has expired.' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute(
      'SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP() LIMIT 1 FOR UPDATE',
      [sha256(token)],
    );
    if (!rows.length) {
      await conn.rollback();
      return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
    }
    const hash = await bcrypt.hash(password, BCRYPT_COST);
    await conn.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, rows[0].user_id]);
    await conn.execute('UPDATE password_resets SET used_at = UTC_TIMESTAMP() WHERE user_id = ? AND used_at IS NULL', [rows[0].user_id]);
    await conn.commit();
    res.json({ message: 'Password updated. You can now log in.' });
  } catch (err) {
    await conn.rollback();
    console.error('reset-password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  } finally {
    conn.release();
  }
});

export default router;
