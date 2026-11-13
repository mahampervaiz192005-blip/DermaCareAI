import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck, ScanFace } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Disclaimer } from '../../components/ui/bits.jsx';
import portrait from '../../assets/hero-portrait.jpg';
import HairArt, { HairIcon } from './HairArt.jsx';
import { MODULE_INFO } from './moduleConfig.js';

function ModuleCard({ m, icon: Icon, children }) {
  return (
    <article className={`dsh-card dsh-mod dsh-mod-${m.key}`}>
      <div className="dsh-mod-art" aria-hidden="true">{children}</div>
      <div className="dsh-mod-body">
        <span className="dsh-mod-icon"><Icon size={32} strokeWidth={1.5} aria-hidden="true" /></span>
        <h2>{m.cardTitle}</h2>
        <p>{m.cardDesc}</p>
        <Link to={`/dashboard/${m.key}`} className="dsh-btn dsh-btn-blue stretch">{m.explore} <ArrowRight size={16} aria-hidden="true" /></Link>
        <ul className="dsh-checks">{m.features.map((f) => <li key={f}><CircleCheck size={17} aria-hidden="true" />{f}</li>)}</ul>
      </div>
    </article>
  );
}

/* Login ke baad pehli screen: Skin ya Hair module chunna */
export default function ModuleSelect() {
  const { user } = useAuth();   // asli logged-in user ka naam (backend /auth/me se)
  const firstName = user.full_name.split(' ')[0];

  return (
    <>
      <header className="dsh-head">
        <h1>Welcome back, {firstName}! <span aria-hidden="true">👋</span></h1>
        <p>Choose a module to start your personalized skin &amp; hair wellness journey.</p>
      </header>

      <div className="dsh-mods">
        <ModuleCard m={MODULE_INFO.skin} icon={ScanFace}><img src={portrait} alt="" /></ModuleCard>
        <ModuleCard m={MODULE_INFO.hair} icon={HairIcon}><HairArt /></ModuleCard>
      </div>
      <Disclaimer />
    </>
  );
}
