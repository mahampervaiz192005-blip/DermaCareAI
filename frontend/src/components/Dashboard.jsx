import { Droplets, Sun, Gauge, Target, Activity } from 'lucide-react';
import './Dashboard.css';

/* NOTE: Yeh data sample/preview hai. Real data aane par `skin` object replace kar dein. */
const skin = {
  score: 82,
  weekly: [48, 62, 55, 70, 64, 78, 82],
  hydration: [38, 44, 41, 52, 58, 55, 66, 72],
  fatigue: 32,
  oiliness: 54,
  focus: 78,
  age: 26,
};
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Smooth curve path (area chart ke liye)
function smoothPath(vals, w, h, pad = 6) {
  const max = Math.max(...vals) * 1.1, min = Math.min(...vals) * 0.8;
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * w, h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return { line: d, area: `${d} L${w},${h} L0,${h} Z` };
}

function Ring({ value, label, caption, id }) {
  const r = 38, c = 2 * Math.PI * r;
  return (
    <div className="ring" role="img" aria-label={`${label}: ${value} percent`}>
      <svg viewBox="0 0 100 100" width="104" height="104">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--primary)" /><stop offset="1" stopColor="var(--primary-deep)" /></linearGradient></defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--soft)" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} transform="rotate(-90 50 50)" />
        <text x="50" y="56" textAnchor="middle" className="ring-num">{caption}</text>
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const hyd = smoothPath(skin.hydration, 220, 80);
  return (
    <section className="dash-section section-pad" id="dashboard">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">Your skin at a glance</span>
            <h2>Understand your skin, <em>every single day.</em></h2>
          </div>
          <p>A preview of the insights you'll see inside your DermaCare space. Sample data shown here.</p>
        </div>

        <div className="dash-grid reveal">
          <article className="dash-card glass score-card">
            <header><span className="dash-icon"><Gauge size={18} /></span><h3>Skin score</h3><span className="chip chip-good">Good</span></header>
            <div className="score-body">
              <strong className="score-num">{skin.score}</strong>
              <div className="bars" role="img" aria-label="Skin score over the last 7 days">
                {skin.weekly.map((v, i) => (
                  <div key={i} className="bar-col"><i style={{ height: `${v}%` }} className={i === skin.weekly.length - 1 ? 'now' : ''} /><small>{days[i]}</small></div>
                ))}
              </div>
            </div>
          </article>

          <article className="dash-card glass hydra-card">
            <header><span className="dash-icon"><Droplets size={18} /></span><h3>Hydration</h3><span className="chip chip-good">Good</span></header>
            <p className="dash-value">72<small>%</small></p>
            <svg viewBox="0 0 220 80" preserveAspectRatio="none" className="area" role="img" aria-label="Hydration trend, rising">
              <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity=".35" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
              <path d={hyd.area} fill="url(#hg)" />
              <path d={hyd.line} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </article>

          <article className="dash-card glass mini-card">
            <header><span className="dash-icon"><Activity size={18} /></span><h3>Skin fatigue</h3></header>
            <p className="dash-value">{skin.fatigue}<small>%</small></p>
            <span className="chip chip-good">Low</span>
            <div className="meter"><i style={{ width: `${skin.fatigue}%` }} /></div>
          </article>

          <article className="dash-card glass mini-card">
            <header><span className="dash-icon"><Sun size={18} /></span><h3>Oiliness</h3></header>
            <p className="dash-value">{skin.oiliness}<small>%</small></p>
            <span className="chip chip-warn">Moderate</span>
            <div className="meter"><i style={{ width: `${skin.oiliness}%` }} /></div>
          </article>

          <article className="dash-card glass rings-card">
            <header><span className="dash-icon"><Target size={18} /></span><h3>Today's focus &amp; skin age</h3></header>
            <div className="rings">
              <Ring id="r1" value={skin.focus} label="Today's focus" caption={`${skin.focus}%`} />
              <Ring id="r2" value={(skin.age / 50) * 100} label="Skin age" caption={`${skin.age} yrs`} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
