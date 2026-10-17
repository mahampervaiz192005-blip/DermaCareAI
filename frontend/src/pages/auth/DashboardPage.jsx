import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './auth.css';

// Protected page. Data backend ke protected /api/dashboard se aata hai.
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');

  useEffect(() => { api.get('/dashboard').then((r) => setMsg(r.data.message)).catch(() => {}); }, []);

  return (
    <main className="au-page au-dash">
      <section className="au-card">
        <h1>{msg || `Welcome, ${user.full_name}`}</h1>
        <p className="au-lead">You're logged in as {user.email}. Your skin &amp; hair dashboard will appear here.</p>
        <button className="au-btn" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>
          <LogOut size={18} aria-hidden="true" /> Log out
        </button>
      </section>
    </main>
  );
}
