import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiError } from '../../api/client.js';
import AuthLayout, { Logo } from './AuthLayout.jsx';
import { Banner, EMAIL_RE, Field } from './AuthFields.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const dest = location.state?.from || '/dashboard';
  if (user) return <Navigate to={dest} replace />;   // already logged in

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const next = {};
    const email = form.email.trim();
    if (!email) next.email = 'Email address is required.';
    else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await login({ email, password: form.password, remember: form.remember });
      navigate(dest, { replace: true });
    } catch (err) {
      const r = apiError(err);
      setFormError(typeof r === 'string' ? r : r.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout variant="login">
      <section className="au-card" aria-labelledby="login-title">
        <Logo />
        <h1 id="login-title">Welcome <span>Back</span></h1>
        <p className="au-lead">Login to your account and continue your skin &amp; hair wellness journey.</p>

        <form onSubmit={onSubmit} noValidate>
          <Banner>{formError}</Banner>
          <Field id="login-email" label="Email Address" icon={Mail} type="email" autoComplete="email" placeholder="Enter your email" value={form.email} onChange={set('email')} error={errors.email} />
          <Field id="login-password" label="Password" icon={Lock} reveal autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={set('password')} error={errors.password} />

          <div className="au-row">
            <label className="au-check"><input type="checkbox" checked={form.remember} onChange={set('remember')} /> Remember me</label>
            <Link to="/forgot-password" className="au-link">Forgot password?</Link>
          </div>

          <button type="submit" className="au-btn" disabled={busy}>
            {busy ? <span className="au-spin" aria-hidden="true" /> : <>Login <ArrowRight size={18} aria-hidden="true" /></>}
            {busy && <span className="sr-only">Logging in…</span>}
          </button>
        </form>

        <p className="au-legal">By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
      </section>
    </AuthLayout>
  );
}
