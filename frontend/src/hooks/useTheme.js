import { useSyncExternalStore } from 'react';

// Theme store: 'blue' ya 'pink'. Choice localStorage me yaad rehti hai.
const KEY = 'dermacare-theme';
const read = () => { try { return localStorage.getItem(KEY) === 'pink' ? 'pink' : 'blue'; } catch { return 'blue'; } };
let theme = read();
const listeners = new Set();
const apply = () => { document.documentElement.dataset.theme = theme; };
apply();

export function setTheme(next) {
  theme = next;
  apply();
  try { localStorage.setItem(KEY, next); } catch { /* storage blocked — ignore */ }
  listeners.forEach((l) => l());
}

export default function useTheme() {
  const t = useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => theme);
  return [t, setTheme];
}
