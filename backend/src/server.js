import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';
import { ensureSchema } from './ensureSchema.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch {
    res.status(500).json({ ok: false, db: 'unreachable' });
  }
});

app.use('/api/auth', authRoutes);

// Example protected route: bina login ke 401 milta hai.
app.get('/api/dashboard', requireAuth, (req, res) => {
  res.json({ message: `Welcome, ${req.user.full_name}`, user: req.user });
});

app.use((_req, res) => res.status(404).json({ message: 'Not found.' }));

// Koi bhi unexpected error aaye to server crash nahi hota, JSON error milta hai
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled route error:', err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ message: err.status && err.status < 500 ? err.message : 'Something went wrong. Please try again.' });
});

// Aakhri safety net: unhandled promise error ko log karo, process band mat karo
process.on('unhandledRejection', (reason) => console.error('Unhandled promise rejection (server kept running):', reason));
process.on('uncaughtException', (err) => console.error('Uncaught exception (server kept running):', err));

try {
  const conn = await pool.getConnection();
  conn.release();
  console.log(`MySQL connected: ${config.db.database}@${config.db.host}`);
} catch (err) {
  console.error('MySQL connection FAILED:', err.message);
  console.error('Check backend/.env credentials and that MySQL is running, then run: npm run db:init');
  process.exit(1);
}

await ensureSchema();

app.listen(config.port, () => console.log(`API running on http://localhost:${config.port}`));
