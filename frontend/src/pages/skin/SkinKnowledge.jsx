import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { KNOWLEDGE } from './skinData.js';

export default function SkinKnowledge() {
  const [open, setOpen] = useState(0);
  return (
    <div className="sk-page sk-narrow">
      <Link to="/dashboard/skin" className="dsh-back"><ArrowLeft size={16} aria-hidden="true" /> Back to Skin Dashboard</Link>
      <header className="dsh-head"><h1>Knowledge Base</h1><p>Quick answers about skin types, analysis and skincare basics.</p></header>
      <div className="sk-faq">
        {KNOWLEDGE.map((k, i) => (
          <section key={k.q} className={`dsh-card ${open === i ? 'open' : ''}`}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{k.q}<ChevronDown size={18} aria-hidden="true" /></button>
            {open === i && <p>{k.a}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
