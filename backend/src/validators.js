const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normEmail = (v) => String(v ?? '').trim().toLowerCase();
export const isEmail = (v) => v.length <= 255 && EMAIL_RE.test(v);

// bcrypt sirf pehle 72 bytes use karta hai, isliye max 72 chars.
export function passwordProblem(pw) {
  if (typeof pw !== 'string' || pw.length < 8) return 'Password must be at least 8 characters.';
  if (pw.length > 72) return 'Password must be 72 characters or fewer.';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Password must include at least one letter and one number.';
  return null;
}
