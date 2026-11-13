import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, CalendarDays, Download, Eye, FileText, Layers, Microscope, ScanFace } from 'lucide-react';
import { StatusBadge, Disclaimer } from '../../components/ui/bits.jsx';
import portrait from '../../assets/hero-portrait.jpg';
import { formatDate, useAnalysis } from './SkinFlowContext.jsx';
import { buildGuidance, skinTypeLabel } from './skinData.js';
import Heatmap from './Heatmap.jsx';
import FlowSteps from './FlowSteps.jsx';

export function downloadReport(a) {
  const g = buildGuidance(a.skinType, a.concerns);
  const lines = [
    'DERMACARE AI — SKIN ANALYSIS REPORT (DEMO)', '='.repeat(44),
    `Date: ${formatDate(a.date)}`, `Skin type: ${skinTypeLabel(a.skinType)}`, 'Status: Completed', '',
    'DETECTED CONCERNS', ...a.concerns.map((c) => `- ${c.name}: ${c.confidence}%`), '',
    'GUIDANCE', g.summary, '', 'Morning:', ...g.am.map((s) => `  * ${s}`), 'Night:', ...g.pm.map((s) => `  * ${s}`), '',
    'Look for: ' + g.use.join(', '), 'Avoid: ' + g.avoid.join(', '), '',
    'Disclaimer: AI-assisted wellness insights only. Not a medical diagnosis.',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
  Object.assign(document.createElement('a'), { href: url, download: 'dermacare-skin-report.txt' }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function SkinResults() {
  const navigate = useNavigate();
  const a = useAnalysis();
  const img = a.image || portrait;
  const g = buildGuidance(a.skinType, a.concerns);

  return (
    <div className="sk-page">
      <FlowSteps current={3} />
      <header className="dsh-head dsh-head-row">
        <div><h1>Skin Analysis Results</h1><p>Here is what our AI found. {a.demo && <em className="sk-demo">Showing sample data.</em>}</p></div>
        <span className="dsh-ai-badge"><ScanFace size={14} aria-hidden="true" /> AI-assisted insights</span>
      </header>

      {/* A. Overview */}
      <section className="dsh-card sk-overview" aria-label="Analysis overview">
        <img src={img} alt="Analyzed facial image" />
        <dl>
          <div><dt>Skin type</dt><dd>{skinTypeLabel(a.skinType)}</dd></div>
          <div><dt>Analysis date</dt><dd><CalendarDays size={15} aria-hidden="true" /> {formatDate(a.date)}</dd></div>
          <div><dt>Status</dt><dd><StatusBadge status={a.status} /></dd></div>
          <div><dt>Concerns checked</dt><dd>{a.concerns.length}</dd></div>
        </dl>
      </section>

      {/* B. Concerns */}
      <div className="dsh-row-between"><h3 className="dsh-h3">Detected Skin Concerns</h3></div>
      <div className="sk-concerns">
        {a.concerns.map(({ key, name, confidence, icon: Icon }) => (
          <article key={key} className="dsh-card sk-concern">
            <span className="sk-qico"><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span>
            <b>{name}</b>
            <div className="dsh-bar" aria-hidden="true"><i style={{ width: `${confidence}%` }} /></div>
            <small>Confidence <strong>{confidence}%</strong></small>
          </article>
        ))}
      </div>

      {/* C. Grad-CAM */}
      <div className="dsh-row-between"><h3 className="dsh-h3">Grad-CAM Visualization</h3></div>
      <section className="dsh-card sk-gc">
        <div className="sk-gc-pair">
          <figure><Heatmap src={img} mode="original" /><figcaption>Original image</figcaption></figure>
          <figure><Heatmap src={img} mode="overlay" /><figcaption>Grad-CAM heatmap</figcaption></figure>
        </div>
        <div className="sk-gc-text">
          <p className="dsh-muted">Warmer colours (red / yellow) show the facial regions that influenced the AI the most — mainly the cheeks and the T-zone around the nose in this analysis.</p>
          <Link to="/dashboard/skin/gradcam" className="dsh-btn"><Microscope size={17} aria-hidden="true" /> View Grad-CAM</Link>
        </div>
      </section>

      {/* D. Guidance */}
      <div className="dsh-row-between"><h3 className="dsh-h3">Personalized Skincare Guidance</h3></div>
      <section className="dsh-card sk-guide-prev">
        <p><strong>{skinTypeLabel(a.skinType)}:</strong> {g.summary}</p>
        <ul className="sk-chips">{g.tips.slice(0, 3).map((t) => <li key={t.key}><t.icon size={14} aria-hidden="true" /> {t.name}</li>)}</ul>
        <div className="sk-guide-cols">
          <div><h4>Morning</h4><ol>{g.am.map((s) => <li key={s}>{s}</li>)}</ol></div>
          <div><h4>Night</h4><ol>{g.pm.map((s) => <li key={s}>{s}</li>)}</ol></div>
        </div>
      </section>

      {/* E. Actions */}
      <div className="dsh-actions sk-final">
        <Link to="/dashboard/skin/guidance" className="dsh-btn"><FileText size={17} aria-hidden="true" /> View Full Guidance</Link>
        <Link to="/assistant" className="dsh-btn dsh-btn-ghost"><Bot size={17} aria-hidden="true" /> Ask AI Assistant</Link>
        <button type="button" className="dsh-btn dsh-btn-ghost" onClick={() => downloadReport(a)}><Download size={17} aria-hidden="true" /> Download Report</button>
        <button type="button" className="dsh-btn dsh-btn-ghost" onClick={() => navigate('/dashboard/skin')}><ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard</button>
      </div>
      <Disclaimer />
    </div>
  );
}
