import { useMemo } from 'react';

// Deterministic "hair parting" illustration (SVG). Koi real person/image nahi, sirf decorative art.
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export default function HairArt() {
  const strands = useMemo(() => {
    const r = rng(42); const out = [];
    for (let y = 16; y <= 330; y += 3.2) {
      for (const dir of [-1, 1]) {
        const reach = 150 + r() * 120, drop = 40 + r() * 90, sway = r() * 30;
        const x0 = 200 + dir * (1 + r() * 2);
        out.push({
          d: `M ${x0} ${y} C ${x0 + dir * reach * 0.35} ${y - 8 + sway}, ${x0 + dir * reach * 0.8} ${y + drop * 0.4}, ${x0 + dir * reach} ${y + drop}`,
          w: 0.7 + r() * 1.5, o: 0.35 + r() * 0.6, hl: r() > 0.86,
        });
      }
    }
    return out;
  }, []);
  return (
    <svg className="dsh-hairart" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of hair parting with a scan frame">
      <defs>
        <linearGradient id="hs" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2a2470" /><stop offset="1" stopColor="#0b0c33" /></linearGradient>
        <linearGradient id="hl" x1="0" x2="1"><stop offset="0" stopColor="#6d5cff" /><stop offset="1" stopColor="#c07bff" /></linearGradient>
        <radialGradient id="hg" cx="50%" cy="20%" r="60%"><stop offset="0" stopColor="#8f7bff" stopOpacity=".55" /><stop offset="1" stopColor="#8f7bff" stopOpacity="0" /></radialGradient>
        <filter id="hb"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="400" height="420" fill="url(#hg)" />
      {strands.map((s, i) => <path key={i} d={s.d} fill="none" stroke={s.hl ? 'url(#hl)' : 'url(#hs)'} strokeWidth={s.w} strokeLinecap="round" opacity={s.hl ? 0.75 : s.o} />)}
      <line x1="200" y1="8" x2="200" y2="340" stroke="#d9cfff" strokeWidth="2.4" opacity=".75" filter="url(#hb)" />
      <line x1="200" y1="8" x2="200" y2="340" stroke="#f1ebff" strokeWidth="1" opacity=".9" />
      <rect x="82" y="120" width="190" height="150" rx="14" fill="none" stroke="#5a86ff" strokeWidth="1.6" opacity=".85" />
      <circle cx="82" cy="120" r="3" fill="#8fb0ff" /><circle cx="272" cy="270" r="3" fill="#8fb0ff" />
    </svg>
  );
}


/* Sidebar / card badge ke liye hair icon (lucide me hair icon nahi hota) */
export function HairIcon({ size = 20, strokeWidth = 1.7, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d="M12 3c-4 0-7 3-7 8 0 4 1.5 6.5 2 10" />
      <path d="M12 3c4 0 7 3 7 8 0 4-1.5 6.5-2 10" />
      <path d="M12 3c-1.6 3-1.6 8 0 12 1.6-4 1.6-9 0-12Z" />
      <path d="M9 21c.4-2 .6-4 .5-6" /><path d="M15 21c-.4-2-.6-4-.5-6" />
    </svg>
  );
}
