import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Check, Download, Lightbulb, Moon, Sunrise, X } from 'lucide-react';
import { Disclaimer } from '../../components/ui/bits.jsx';
import { useAnalysis } from './SkinFlowContext.jsx';
import { LIFESTYLE, buildGuidance, skinTypeLabel } from './skinData.js';
import { downloadReport } from './SkinResults.jsx';

export default function SkinGuidance() {
  const a = useAnalysis();
  const g = buildGuidance(a.skinType, a.concerns);

  return (
    <div className="sk-page">
      <Link to="/dashboard/skin/results" className="dsh-back"><ArrowLeft size={16} aria-hidden="true" /> Back to Results</Link>
      <header className="dsh-head"><h1>Personalized Skincare Guidance</h1><p>Based on your <strong>{skinTypeLabel(a.skinType)}</strong> and the concerns detected in your analysis.</p></header>

      <section className="dsh-card dsh-pad sk-guide-sum"><Lightbulb size={22} aria-hidden="true" /><p>{g.summary}</p></section>

      <div className="sk-routine">
        <section className="dsh-card dsh-pad"><h3 className="dsh-h3"><Sunrise size={18} aria-hidden="true" /> Morning routine</h3><ol>{g.am.map((s) => <li key={s}>{s}</li>)}</ol></section>
        <section className="dsh-card dsh-pad"><h3 className="dsh-h3"><Moon size={18} aria-hidden="true" /> Night routine</h3><ol>{g.pm.map((s) => <li key={s}>{s}</li>)}</ol></section>
      </div>

      <div className="sk-routine">
        <section className="dsh-card dsh-pad"><h3 className="dsh-h3">Ingredients to look for</h3><ul className="sk-tick">{g.use.map((s) => <li key={s}><Check size={15} aria-hidden="true" />{s}</li>)}</ul></section>
        <section className="dsh-card dsh-pad"><h3 className="dsh-h3">Better to avoid</h3><ul className="sk-tick bad">{g.avoid.map((s) => <li key={s}><X size={15} aria-hidden="true" />{s}</li>)}</ul></section>
      </div>

      <div className="dsh-row-between"><h3 className="dsh-h3">Tips for your detected concerns</h3></div>
      <div className="sk-tips">
        {g.tips.map(({ key, name, icon: Icon, confidence, tip }) => (
          <article key={key} className="dsh-card sk-tip">
            <span className="sk-qico"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
            <div><b>{name} <em>{confidence}%</em></b><p>{tip}</p></div>
          </article>
        ))}
      </div>

      <section className="dsh-card dsh-pad" style={{ marginTop: 18 }}>
        <h3 className="dsh-h3">Healthy habits</h3>
        <ul className="sk-tick">{LIFESTYLE.map((s) => <li key={s}><Check size={15} aria-hidden="true" />{s}</li>)}</ul>
      </section>

      <div className="dsh-actions">
        <Link to="/assistant" className="dsh-btn"><Bot size={17} aria-hidden="true" /> Ask AI Assistant</Link>
        <button type="button" className="dsh-btn dsh-btn-ghost" onClick={() => downloadReport(a)}><Download size={17} aria-hidden="true" /> Download Report</button>
        <Link to="/dashboard/skin" className="dsh-btn dsh-btn-ghost"><ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard</Link>
      </div>
      <Disclaimer />
    </div>
  );
}
