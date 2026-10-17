import { Link } from 'react-router-dom';
import { Flower2, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import portrait from '../../assets/hero-portrait.jpg';
import skinThumb from '../../assets/skin-thumb.jpg';
import hairThumb from '../../assets/hair-thumb.jpg';
import './auth.css';

const SKIN = ['Acne', 'Dark Spots', 'Redness', 'Wrinkles'];
const HAIR = ['Hair Fall', 'Density', 'Hair Health'];
const PERKS = [
  { icon: Sparkles, label: 'AI Analysis' },
  { icon: ShieldCheck, label: 'Expert Guidance' },
  { icon: Lock, label: 'Secure & Private' },
];

export function Logo({ size = 'md' }) {
  return (
    <span className={`au-logo au-logo-${size}`}>
      <Flower2 strokeWidth={1.5} aria-hidden="true" />
      <b>DermaCare AI</b>
    </span>
  );
}

/* Login aur Signup dono isi layout ko use karte hain (left branding + right glass card) */
export default function AuthLayout({ variant = 'login', children }) {
  const isLogin = variant === 'login';
  return (
    <div className="au-page">
      <header className="au-top">
        <Link to="/" className="au-brand" aria-label="DermaCare AI home">
          <Flower2 strokeWidth={1.4} aria-hidden="true" />
          <span><b>DermaCare AI</b><small>Healthy Skin &bull; Stronger Hair &bull; Confident You</small></span>
        </Link>
        <p className="au-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Link to={isLogin ? '/signup' : '/login'} className="au-pill">{isLogin ? 'Sign Up' : 'Login'}</Link>
        </p>
      </header>

      <main className="au-stage">
        <section className={`au-visual au-visual-${variant}`} aria-label="DermaCare AI skin and hair analysis preview">
          <div className="au-portrait">
            <img src={portrait} alt="Woman with a glowing AI facial-scan overlay" />
            <span className="au-sweep" aria-hidden="true" />
          </div>

          <div className="au-cards">
            <div className="au-ai au-ai-skin">
              <img src={skinThumb} alt="" />
              <div><h3>Skin Analysis</h3><ul>{SKIN.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
            <div className="au-ai au-ai-hair">
              <img src={hairThumb} alt="" />
              <div><h3>Hair Analysis</h3><ul>{HAIR.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
          </div>

          {isLogin ? (
            <p className="au-tagline">Better Skin.<br />Healthier Hair.<br />With AI.</p>
          ) : (
            <div className="au-pitch">
              <h2>Personalized Care for Your <span>Skin &amp; Hair</span></h2>
              <p>Join DermaCare AI and get AI-powered insights, expert guidance and a healthier you — all in one place.</p>
              <ul>{PERKS.map(({ icon: Icon, label }) => <li key={label}><Icon size={16} aria-hidden="true" />{label}</li>)}</ul>
            </div>
          )}
        </section>

        <div className="au-card-wrap">{children}</div>
      </main>

      <svg className="au-waves" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="auw1" x1="0" x2="1"><stop offset="0" stopColor="#6d4aff" stopOpacity=".0" /><stop offset=".35" stopColor="#8a5cff" stopOpacity=".9" /><stop offset=".75" stopColor="#d65cf0" stopOpacity=".7" /><stop offset="1" stopColor="#d65cf0" stopOpacity="0" /></linearGradient>
          <linearGradient id="auw2" x1="0" x2="1"><stop offset="0" stopColor="#3b6bff" stopOpacity=".7" /><stop offset=".6" stopColor="#7a4bff" stopOpacity=".5" /><stop offset="1" stopColor="#7a4bff" stopOpacity="0" /></linearGradient>
        </defs>
        <path d="M0 210 C 220 90, 420 60, 640 150 S 1060 250, 1440 90 L1440 260 L0 260Z" fill="url(#auw2)" opacity=".18" />
        <path d="M0 210 C 220 90, 420 60, 640 150 S 1060 250, 1440 90" fill="none" stroke="url(#auw1)" strokeWidth="2" />
        <path d="M0 232 C 260 130, 470 110, 700 180 S 1100 240, 1440 130" fill="none" stroke="url(#auw2)" strokeWidth="1.4" />
        <path d="M0 190 C 300 60, 520 40, 760 130 S 1120 215, 1440 60" fill="none" stroke="url(#auw1)" strokeWidth="1" opacity=".6" />
      </svg>
    </div>
  );
}
