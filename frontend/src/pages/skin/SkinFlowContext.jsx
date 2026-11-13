import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DEMO_CONCERNS } from './skinData.js';
import './skin.css';

/* Skin flow ka temporary frontend state (backend aane tak). */
const Ctx = createContext(null);
export const useSkinFlow = () => useContext(Ctx);

const KEY = 'dc_skin_latest';
const readLatest = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };

export const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateTime = (d) => { const x = new Date(d); return `${formatDate(x)} • ${x.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`; };

export function SkinFlowProvider({ children }) {
  const [skinType, setSkinType] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [latest, setLatest] = useState(readLatest);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const pickFile = useCallback((f) => { setFile(f); setPreviewUrl(f ? URL.createObjectURL(f) : ''); }, []);
  const reset = useCallback(() => { setSkinType(''); pickFile(null); setResult(null); }, [pickFile]);

  const finish = useCallback(() => {
    const r = { id: Date.now(), date: new Date().toISOString(), skinType, status: 'completed', image: previewUrl, concerns: DEMO_CONCERNS };
    const summary = { id: r.id, date: r.date, skinType, status: 'completed', top: [...DEMO_CONCERNS].sort((a, b) => b.confidence - a.confidence)[0].name, count: DEMO_CONCERNS.length };
    try { localStorage.setItem(KEY, JSON.stringify(summary)); } catch { /* ignore */ }
    setLatest(summary); setResult(r);
    return r;
  }, [skinType, previewUrl]);

  const value = useMemo(() => ({ skinType, setSkinType, file, previewUrl, pickFile, result, finish, reset, latest }), [skinType, file, previewUrl, pickFile, result, finish, reset, latest]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* Layout route: /dashboard/skin/* ke sab pages ek hi state share karte hain */
export function SkinFlowLayout() {
  return <SkinFlowProvider><Outlet /></SkinFlowProvider>;
}

/* Flow guards: step skip karne par pichle step par bhej do */
export function RequireSkinType({ children }) {
  const { skinType } = useSkinFlow();
  return skinType ? children : <Navigate to="/dashboard/skin/persona" replace />;
}
export function RequireImage({ children }) {
  const { skinType, file } = useSkinFlow();
  if (!skinType) return <Navigate to="/dashboard/skin/persona" replace />;
  return file ? children : <Navigate to="/dashboard/skin/upload" replace />;
}

/* Results/GradCAM/Guidance: agar abhi analysis nahi hua to saved ya demo data dikhao (koi dead end nahi) */
export function useAnalysis() {
  const { result, latest, skinType } = useSkinFlow();
  return useMemo(() => result || {
    id: latest?.id || 0,
    date: latest?.date || new Date().toISOString(),
    skinType: latest?.skinType || skinType || 'combination',
    status: 'completed', image: '', concerns: DEMO_CONCERNS, demo: true,
  }, [result, latest, skinType]);
}
