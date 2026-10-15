import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Menu, X } from 'lucide-react';
import './Navbar.css';

// Section ids jin par link scroll karta hai (Welcome.jsx me same ids hain)
const LINKS = [
  { id: 'top', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How It Works' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('top');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30); // 30px ke baad navbar solid ho jata hai
      let current = 'top';
      LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled || open ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="DermaCare AI home" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Flower2 size={26} strokeWidth={1.6} /></span>
          <span><b>DermaCare AI</b><small>Healthy Skin · Stronger Hair · Confident You</small></span>
        </Link>

        <nav className={`nav-links ${open ? 'nav-open' : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} aria-current={active === l.id ? 'true' : undefined} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="nav-mobile-actions">
            <Link to="/login" className="nav-login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/signup" className="nav-cta" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        </nav>

        <div className="nav-right">
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/signup" className="nav-cta">Get Started</Link>
          <button className="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
