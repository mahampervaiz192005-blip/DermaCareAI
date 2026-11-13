import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useSkinFlow } from './SkinFlowContext.jsx';
import { SKIN_TYPES } from './skinData.js';
import FlowSteps from './FlowSteps.jsx';

export default function SkinPersona() {
  const navigate = useNavigate();
  const { skinType, setSkinType } = useSkinFlow();

  return (
    <div className="sk-page sk-narrow">
      <FlowSteps current={0} />
      <header className="sk-center-head">
        <span className="dsh-ai-badge">SkinPersona</span>
        <h1>SkinPersona – Discover Your Skin Type</h1>
        <p>Let&apos;s understand your skin better! Answer one simple question to help us personalize your skincare guidance.</p>
      </header>

      <section className="dsh-card sk-q" aria-labelledby="sk-q1">
        <div className="sk-q-top">
          <span>Question 1 of 1</span>
          <div className="dsh-progress-static" role="progressbar" aria-valuemin={0} aria-valuemax={1} aria-valuenow={skinType ? 1 : 0} aria-label="Questionnaire progress"><i style={{ width: skinType ? '100%' : '8%' }} /></div>
          <span>{skinType ? '100%' : '0%'}</span>
        </div>
        <fieldset className="sk-fieldset">
          <legend id="sk-q1">Face wash karne ke 1–2 ghante baad aapki skin usually kaisi feel hoti hai?</legend>
          <div className="sk-types">
            {SKIN_TYPES.map(({ value, label, desc, icon: Icon }) => (
              <label key={value} className={`sk-type ${skinType === value ? 'on' : ''}`}>
                <input type="radio" name="skinType" value={value} checked={skinType === value} onChange={() => setSkinType(value)} />
                <span className="sk-type-ico"><Icon size={30} strokeWidth={1.5} aria-hidden="true" /></span>
                <b>{label}</b>
                <small>{desc}</small>
                <span className="sk-type-check" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="dsh-foot two">
          <button type="button" className="dsh-btn dsh-btn-ghost" onClick={() => navigate('/dashboard/skin')}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
          <button type="button" className="dsh-btn" disabled={!skinType} onClick={() => navigate('/dashboard/skin/upload')}>Continue <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </section>
    </div>
  );
}
