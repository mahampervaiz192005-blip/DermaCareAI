import portrait from '../../assets/hero-portrait.jpg';

/* Futuristic face-scan visual: image + grid + moving scan line + corner brackets + landmark dots */
const DOTS = [[34, 38], [62, 36], [48, 52], [40, 66], [58, 66], [30, 54], [68, 54]];

export default function ScanArt({ src = portrait, className = '', label = '' }) {
  return (
    <div className={`sk-scan ${className}`} role="img" aria-label={label || 'AI facial scan visual'}>
      <img src={src} alt="" />
      <span className="sk-scan-grid" />
      <span className="sk-scan-line" />
      {['tl', 'tr', 'bl', 'br'].map((c) => <i key={c} className={`sk-corner ${c}`} />)}
      {DOTS.map(([x, y], i) => <b key={i} className="sk-dot" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.35}s` }} />)}
    </div>
  );
}
