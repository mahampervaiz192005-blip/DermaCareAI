import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Info, Sparkles } from 'lucide-react';
import portrait from '../../assets/hero-portrait.jpg';
import { useAnalysis } from './SkinFlowContext.jsx';
import { HEAT_REGIONS } from './skinData.js';
import Heatmap from './Heatmap.jsx';

const MODES = [['side', 'Side by side'], ['original', 'Original'], ['heatmap', 'Heatmap'], ['overlay', 'Overlay']];

export default function SkinGradCam() {
  const a = useAnalysis();
  const img = a.image || portrait;
  const [mode, setMode] = useState('side');
  const [level, setLevel] = useState(100);

  return (
    <div className="sk-page">
      <Link to="/dashboard/skin/results" className="dsh-back"><ArrowLeft size={16} aria-hidden="true" /> Back to Results</Link>
      <header className="dsh-head"><h1>Grad-CAM Visualization</h1><p>See which facial regions influenced the AI&apos;s analysis the most.</p></header>

      <div className="sk-gc-layout">
        <section className="dsh-card sk-gc-view">
          <div className="dsh-tabs" role="tablist" aria-label="View mode">
            {MODES.map(([k, l]) => <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>{l}</button>)}
          </div>
          {mode === 'side' ? (
            <div className="sk-gc-pair"><figure><Heatmap src={img} mode="original" /><figcaption>Original Image</figcaption></figure><figure><Heatmap src={img} mode="heatmap" intensity={level / 100} /><figcaption>Grad-CAM Heatmap</figcaption></figure></div>
          ) : <Heatmap src={img} mode={mode} intensity={level / 100} className="sk-heat-lg" />}
          <label className="sk-slider">Heat intensity
            <input type="range" min="30" max="130" value={level} onChange={(e) => setLevel(+e.target.value)} disabled={mode === 'original'} />
          </label>
          <div className="sk-legend" aria-hidden="true"><span>Low</span><i /><span>High</span></div>
        </section>

        <section className="dsh-card sk-gc-side">
          <h3 className="dsh-h3">Highlighted regions</h3>
          <ul className="sk-regions">
            {[...HEAT_REGIONS].sort((x, y) => y.power - x.power).map((r) => (
              <li key={r.name}>
                <div><b>{r.name}</b><span>{Math.round(r.power * 100)}%</span></div>
                <div className="dsh-bar" aria-hidden="true"><i style={{ width: `${r.power * 100}%` }} /></div>
                <small>{r.note}</small>
              </li>
            ))}
          </ul>
          <div className="sk-insights"><h3 className="dsh-h3"><Sparkles size={16} aria-hidden="true" /> Key Insights</h3>
            <ul><li>High attention on acne-prone areas</li><li>Focus on forehead and cheeks</li><li>Model detected multiple skin concerns</li></ul></div>
          <p className="dsh-privacy"><Info size={15} aria-hidden="true" /> This is a demonstration heatmap. Real Grad-CAM output will appear once the model is connected.</p>
          <div className="dsh-foot two sk-gc-nav">
            <Link to="/dashboard/skin/results" className="dsh-btn dsh-btn-ghost"><ArrowLeft size={16} aria-hidden="true" /> Back</Link>
            <Link to="/dashboard/skin/guidance" className="dsh-btn">Next: Guidance <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
