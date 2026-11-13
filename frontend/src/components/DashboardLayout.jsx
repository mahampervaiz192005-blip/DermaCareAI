import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ScanFace, Scissors, History, Bot, UserRound,
  Settings, LogOut, Menu, ChevronDown, PanelLeftClose, PanelLeftOpen, Flower2,
} from "lucide-react";
import useCurrentUser from "../../hooks/useCurrentUser";
import "../../styles/dashboard.css";

const MAIN_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/skin", label: "Skin Analysis", icon: ScanFace },
  { to: "/dashboard/hair", label: "Hair Analysis", icon: Scissors },
  { to: "/history", label: "History", icon: History },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/skin": "Skin Analysis",
  "/dashboard/hair": "Hair Analysis",
  "/history": "History",
  "/assistant": "AI Assistant",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function DashboardLayout() {
  const { name, logout } = useCurrentUser();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // route change par mobile drawer / menu band
  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // bahar click par profile menu band
  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initial = name.charAt(0).toUpperCase();
  const navLinkClass = ({ isActive }) => `dc-nav-item${isActive ? " is-active" : ""}`;

  return (
    <div className={`dc-shell${collapsed ? " is-collapsed" : ""}`}>
      {drawerOpen && <div className="dc-backdrop" onClick={() => setDrawerOpen(false)} />}

      <aside className={`dc-sidebar${drawerOpen ? " is-open" : ""}`}>
        <Link to="/dashboard" className="dc-brand">
          {/* Apna existing logo yahan lagayein: <img src={logo} alt="DermaCare AI" /> */}
          <span className="dc-brand-mark"><Flower2 size={26} /></span>
          <span className="dc-brand-text">
            <strong>DermaCare AI</strong>
            <small>Healthy Skin · Stronger Hair</small>
          </span>
        </Link>

        <nav className="dc-nav" aria-label="Main navigation">
          {MAIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass} title={label}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dc-nav dc-nav-bottom">
          <NavLink to="/settings" className={navLinkClass} title="Settings">
            <Settings size={19} /><span>Settings</span>
          </NavLink>
          <button type="button" className="dc-nav-item" onClick={logout} title="Logout">
            <LogOut size={19} /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dc-main">
        <header className="dc-topbar">
          <div className="dc-topbar-left">
            <button type="button" className="dc-icon-btn dc-only-mobile" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <button type="button" className="dc-icon-btn dc-only-desktop" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
              {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <span className="dc-page-title">{PAGE_TITLES[pathname] || ""}</span>
          </div>

          <div className="dc-profile" ref={menuRef}>
            <button type="button" className="dc-profile-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
              <span className="dc-avatar">{initial}</span>
              <span className="dc-profile-name">{name}</span>
              <ChevronDown size={16} />
            </button>
            {menuOpen && (
              <div className="dc-dropdown" role="menu">
                <Link to="/profile" role="menuitem"><UserRound size={16} /> Profile</Link>
                <Link to="/settings" role="menuitem"><Settings size={16} /> Settings</Link>
                <button type="button" role="menuitem" onClick={logout}><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </header>

        <main className="dc-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
