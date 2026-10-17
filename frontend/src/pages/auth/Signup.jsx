import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Smile, User, Waves } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiError } from '../../api/client.js';
import AuthLayout, { Logo } from './AuthLayout.jsx';
import { Banner, EMAIL_RE, Field } from './AuthFields.jsx';

const INTERESTS = [{ id: 'skin', label: 'Skin Care', icon: Smile }, { id: 'hair', label: 'Hair Care', icon: Waves }];

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', interests: [] });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (id) => setForm({ ...form, interests: form.interests.includes(id) ? form.interests.filter((i) => i !== id) : [...form.interests, id] });

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const next = {};
    const name = form.full_name.trim();
    const email = form.email.trim();
    if (name.length < 2) next.full_name = 'Enter your full name.';
    if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) next.password = 'Use 8+ characters with at least one letter and one number.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await signup({ full_name: name, email, password: form.password, interests: form.interests });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const r = apiError(err);
      if (typeof r === 'string') setFormError(r);
      else { setFormError(r.message); setErrors(r.fields); }
      setBusy(false);
    }
  }

  return (
    <AuthLayout variant="signup">
      <section className="au-card" aria-labelledby="signup-title">
        <Logo />
        <h1 id="signup-title">Create Your <span>Account</span></h1>
        <p className="au-lead">Start your journey to healthier skin and hair with the power of AI.</p>

        <form onSubmit={onSubmit} noValidate>
          <Banner>{formError}</Banner>
          <Field id="su-name" label="Full Name" icon={User} autoComplete="name" placeholder="Enter your full name" value={form.full_name} onChange={set('full_name')} error={errors.full_name} />
          <Field id="su-email" label="Email Address" icon={Mail} type="email" autoComplete="email" placeholder="Enter your email" value={form.email} onChange={set('email')} error={errors.email} />
          <Field id="su-pass" label="Password" icon={Lock} reveal autoComplete="new-password" placeholder="Create a strong password" value={form.password} onChange={set('password')} error={errors.password} />
          <Field id="su-confirm" label="Confirm Password" icon={Lock} reveal autoComplete="new-password" placeholder="Confirm your password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

          <fieldset className="au-interests">
            <legend>What are you interested in?</legend>
            <div>
              {INTERESTS.map(({ id, label, icon: Icon }) => (
                <label key={id} className={`au-chip ${form.interests.includes(id) ? 'on' : ''}`}>
                  <input type="checkbox" checked={form.interests.includes(id)} onChange={() => toggle(id)} />
                  <Icon size={22} aria-hidden="true" /> {label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="au-btn" disabled={busy}>
            {busy ? <span className="au-spin" aria-hidden="true" /> : <>Create Account <ArrowRight size={18} aria-hidden="true" /></>}
            {busy && <span className="sr-only">Creating account…</span>}
          </button>
        </form>

        <p className="au-legal">By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
      </section>
    </AuthLayout>
  );
}
