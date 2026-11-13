import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Bot, ChevronDown, ChevronsLeft, ChevronsRight, Flower2, History, LayoutDashboard, LogOut, Menu, ScanFace, Settings, User, X } from 'lucide-react';
import { HairIcon } from '../pages/dashboard/HairArt.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../pages/dashboard/dashboard.css';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/skin', label: 'Skin Analysis', icon: ScanFace },
  { to: '/dashboard/hair', label: 'Hair Analysis', icon: HairIcon },
  { to: '/history', label: 'History', icon: History },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/profile', label: 'Profile', icon: User },
];

const SKIN_STEPS = { persona: 'SkinPersona', upload: 'Upload Image', processing: 'Analyzing', results: 'Results', gradcam: 'Grad-CAM', guidance: 'Guidance', knowledge: 'Knowledge Base' };
const SKIN = { label: 'Skin Analysis', to: '/dashboard/skin' };
function crumbs(path) {
  const p = path.replace(/\/+$/, '');
  if (p === '/dashboard') return [];
  if (p === '/dashboard/skin') return [{ label: 'Skin Analysis' }];
  if (p.startsWith('/dashboard/skin/')) return [SKIN, { label: SKIN_STEPS[p.split('/')[3]] || 'New Analysis' }];
  if (p === '/dashboard/hair') return [{ label: 'Hair Analysis' }];
  if (p === '/dashboard/hair/new') return [{ label: 'Hair Analysis', to: '/dashboard/hair' }, { label: 'New Analysis' }];
  if (p.startsWith('/analysis/')) return [{ label: 'History', to: '/history' }, { label: 'Analysis Results' }];
  return [{ label: { '/history': 'History', '/assistant': 'AI Assistant', '/profile': 'Profile', '/settings': 'Settings' }[p] || 'Dashboard' }];
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({ left: `${(i * 37 + 11) % 100}%`, '--s': `${3 + (i % 4) * 2}px`, '--d': `${12 + (i % 6) * 3}s`, '--dl': `${-(i * 1.7)}s` }));

export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'U';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('dc_sidebar') === '1'; } catch { return false; } });
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const menuRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => { setDrawer(false); setMenu(false); setBell(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); if (bellRef.current && !bellRef.current.contains(e.target)) setBell(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const toggle = () => setCollapsed((c) => { try { localStorage.setItem('dc_sidebar', c ? '0' : '1'); } catch { /* ignore */ } return !c; });
  // Pehle landing page par jao, phir session clear karo (warna ProtectedRoute beech me /login par bhej deta hai)
  const doLogout = async () => { navigate('/', { replace: true }); await logout(); };
  const trail = crumbs(pathname);

  return (
    <div className={`dsh ${collapsed ? 'collapsed' : ''}`}>
      <div className="dsh-particles" aria-hidden="true">{PARTICLES.map((p, i) => <span key={i} style={p} />)}</div>
      {drawer && <div className="dsh-scrim" onClick={() => setDrawer(false)} aria-hidden="true" />}
      <aside className={`dsh-side ${drawer ? 'open' : ''}`} aria-label="Main navigation">
        <div className="dsh-side-head">
          <Link to="/dashboard" className="dsh-brand" aria-label="DermaCare AI overview">
            <Flower2 strokeWidth={1.4} aria-hidden="true" />
            <span><b>DermaCare AI</b><small>Healthy Skin • Stronger Hair</small></span>
          </Link>
          <button className="dsh-icon-btn dsh-only-mobile" onClick={() => setDrawer(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="dsh-nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `dsh-nav-item ${isActive ? 'active' : ''}`} title={label}>
              <Icon size={19} aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dsh-nav dsh-nav-bottom">
          <NavLink to="/settings" className={({ isActive }) => `dsh-nav-item ${isActive ? 'active' : ''}`} title="Settings"><Settings size={19} aria-hidden="true" /><span>Settings</span></NavLink>
          <button className="dsh-nav-item" onClick={doLogout} title="Logout"><LogOut size={19} aria-hidden="true" /><span>Logout</span></button>
        </div>
        <button className="dsh-collapse dsh-only-desktop" onClick={toggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </aside>

      <div className="dsh-main">
        <header className="dsh-top">
          <div className="dsh-top-l">
            <button className="dsh-icon-btn dsh-only-mobile" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu size={22} /></button>
            {trail.length > 0 && <nav className="dsh-crumbs" aria-label="Breadcrumb">
              <Link to="/dashboard">Dashboard</Link>
              {trail.map((t, i) => <span key={t.label}><i aria-hidden="true">/</i>{t.to && i < trail.length - 1 ? <Link to={t.to}>{t.label}</Link> : <b className={i === trail.length - 1 ? 'cur' : ''}>{t.label}</b>}</span>)}
            </nav>}
          </div>
          <div className="dsh-top-r">
          <div className="dsh-bell" ref={bellRef}>
            <button className="dsh-icon-btn round" onClick={() => setBell((b) => !b)} aria-haspopup="true" aria-expanded={bell} aria-label="Notifications"><Bell size={19} /></button>
            {bell && (
              <div className="dsh-menu dsh-notif" role="status">
                <b>Notifications</b>
                <p>You're all caught up. New updates about your analyses will appear here.</p>
              </div>
            )}
          </div>
          <div className="dsh-profile" ref={menuRef}>
            <button className="dsh-profile-btn" onClick={() => setMenu((m) => !m)} aria-haspopup="menu" aria-expanded={menu}>
              <span className="dsh-avatar">{initials(user.full_name)}</span>
              <span className="dsh-uname">{user.full_name.split(' ')[0]}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            {menu && (
              <div className="dsh-menu" role="menu">
                <div className="dsh-menu-who"><b>{user.full_name}</b><small>{user.email}</small></div>
                <Link role="menuitem" to="/profile"><User size={16} /> Profile</Link>
                <Link role="menuitem" to="/settings"><Settings size={16} /> Settings</Link>
                <button role="menuitem" onClick={doLogout}><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
          </div>
        </header>
        <main className="dsh-content" key={pathname}><Outlet /></main>
      </div>
    </div>
  );
}
