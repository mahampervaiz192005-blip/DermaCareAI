import { Link } from 'react-router-dom';
import { ArrowLeft, Hammer } from 'lucide-react';
import { EmptyState } from '../../components/ui/bits.jsx';
import { MODULE_INFO } from './moduleConfig.js';
import HairArt from './HairArt.jsx';
import portrait from '../../assets/hero-portrait.jpg';

/* Jo pages abhi tak nahi bane, unke liye proper placeholder (koi dead button nahi).
   Jab asli page ban jaye to App.jsx me route us page par laga dein. */
export default function ComingSoon({ title, module, text = 'This page is being built and will be available in an upcoming step.' }) {
  const m = module ? MODULE_INFO[module] : null;
  return (
    <>
      <header className="dsh-head">
        <h1>{m ? m.dashTitle : title}</h1>
        <p>{m ? m.dashSub : 'Coming soon.'}</p>
      </header>
      {m && (
        <section className={`dsh-card dsh-hero dsh-hero-${m.key}`}>
          <div className="dsh-hero-art" aria-hidden="true">{m.key === 'hair' ? <HairArt /> : <img src={portrait} alt="" />}</div>
          <div><h2>{m.journey}</h2><p>{m.journeyText}</p></div>
        </section>
      )}
      <EmptyState icon={Hammer} title={`${m ? `${m.short} dashboard` : title} — coming soon`} text={text}>
        <Link to="/dashboard" className="dsh-btn dsh-btn-ghost"><ArrowLeft size={16} aria-hidden="true" /> Back to Overview</Link>
      </EmptyState>
    </>
  );
}
