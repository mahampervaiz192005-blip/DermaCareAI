import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { pool } from '../db.js';

export const COOKIE_NAME = 'dc_token';

export function setAuthCookie(res, userId, remember) {
  const days = remember ? 30 : 1;
  const token = jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: `${days}d` });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,                 // JavaScript token ko padh nahi sakta (XSS safe)
    secure: config.isProd,          // production me sirf HTTPS
    sameSite: 'lax',
    path: '/',
    // Remember me OFF => session cookie (browser band hote hi khatam)
    ...(remember ? { maxAge: days * 24 * 60 * 60 * 1000 } : {}),
  });
}

export const clearAuthCookie = (res) =>
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: config.isProd, sameSite: 'lax', path: '/' });

// Protected routes ke liye: token verify + DB se check ki account abhi bhi active hai.
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
    const { sub } = jwt.verify(token, config.jwtSecret);
    const [rows] = await pool.execute(
      'SELECT id, full_name, email FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
      [sub],
    );
    if (!rows.length) {
      clearAuthCookie(res);
      return res.status(401).json({ message: 'Please log in to continue.' });
    }
    req.user = rows[0];
    next();
  } catch {
    clearAuthCookie(res);
    res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}
