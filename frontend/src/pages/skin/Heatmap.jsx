import { HEAT_REGIONS } from './skinData.js';
import portrait from '../../assets/hero-portrait.jpg';

/* Demo Grad-CAM heatmap: radial gradients image ke upar (real model output backend ke baad aayega) */
export default function Heatmap({ src, intensity = 1, mode = 'overlay', className = '' }) {
  const bg = HEAT_REGIONS.map((r) => {
    const a = Math.min(0.95, r.power * intensity);
    return `radial-gradient(circle at ${r.x}% ${r.y}%, rgba(255,30,40,${a}) 0%, rgba(255,150,30,${a * 0.9}) ${r.r * 0.4}%, rgba(255,240,60,${a * 0.85}) ${r.r * 0.7}%, rgba(60,230,120,${a * 0.75}) ${r.r * 1}%, rgba(40,200,255,${a * 0.6}) ${r.r * 1.3}%, rgba(30,60,255,${a * 0.5}) ${r.r * 1.8}%, transparent ${r.r * 2.3}%)`;
  }).join(',');
  return (
    <div className={`sk-heat ${className}`}>
      <img src={src || portrait} alt={mode === 'heatmap' ? 'Grad-CAM heatmap' : 'Facial image with Grad-CAM overlay'} />
      {mode !== 'original' && <span className={`sk-heat-layer ${mode}`} style={{ backgroundImage: bg }} />}
    </div>
  );
}
