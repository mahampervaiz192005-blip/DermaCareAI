import axios from 'axios';

// Dev me Vite proxy '/api' ko backend (localhost:5000) tak pahunchata hai.
// Production me VITE_API_URL set karein (e.g. https://api.yourdomain.com/api).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,   // httpOnly session cookie bhejne ke liye
});

// Backend ka error message (ya fallback) nikalta hai
export function apiError(err, fallback = 'Something went wrong. Please try again.') {
  if (!err.response) return 'Cannot reach the server. Please check your connection and try again.';
  return { message: err.response.data?.message || fallback, fields: err.response.data?.errors || {} };
}
