import mysql from 'mysql2/promise';
import { config } from './config.js';

// Connection pool: React kabhi MySQL se direct connect nahi hota, sirf ye backend karta hai.
export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});
