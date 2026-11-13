import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSkinFlow } from './SkinFlowContext.jsx';
import ScanArt from './ScanArt.jsx';
import FlowSteps from './FlowSteps.jsx';

const STAGES = ['Detecting facial regions', 'Examining skin texture', 'Identifying possible concerns', 'Preparing Grad-CAM & guidance'];
const TOTAL_MS = 5200; // demo loading

export default function SkinProcessing() {
  const navigate = useNavigate();
  const { previewUrl, finish } = useSkinFlow();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t0 = Date.now();
    const tick = setInterval(() => setPct(Math.min(100, Math.round(((Date.now() - t0) / TOTAL_MS) * 100))), 100);
    const done = setTimeout(() => { finish(); navigate('/dashboard/skin/results', { replace: true }); }, TOTAL_MS);
    return () => { clearInterval(tick); clearTimeout(done); };
  }, [finish, navigate]);

  const stage = Math.min(STAGES.length - 1, Math.floor((pct / 100) * STAGES.length));

  return (
    <div className="sk-page sk-narrow">
      <FlowSteps current={2} />
      <section className="dsh-card sk-proc" aria-live="polite">
        <ScanArt src={previewUrl} className="sk-proc-art" label="Scanning your facial image" />
        <h1>Analyzing Your Skin...</h1>
        <p>Our AI is examining your skin to identify possible concerns.</p>
        <div className="sk-proc-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: `${pct}%` }} /></div>
        <div className="sk-proc-meta"><span>{STAGES[stage]}…</span><b>{pct}%</b></div>
        <button type="button" className="dsh-btn dsh-btn-ghost dsh-btn-sm" onClick={() => navigate('/dashboard/skin/upload', { replace: true })}><X size={14} aria-hidden="true" /> Cancel</button>
      </section>
    </div>
  );
}
