import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { api, apiError } from '../../api/client.js';
import AuthLayout, { Logo } from './AuthLayout.jsx';
import { Banner, Field } from './AuthFields.jsx';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError('Use 8+ characters with at least one letter and one number.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login', { replace: true });
    } catch (err) {
      const r = apiError(err);
      setError(typeof r === 'string' ? r : r.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout variant="login">
      <section className="au-card" aria-labelledby="rp-title">
        <Logo />
        <h1 id="rp-title">New <span>Password</span></h1>
        <p className="au-lead">Choose a new password for your DermaCare AI account.</p>
        {!token ? (
          <><Banner>This reset link is invalid or incomplete.</Banner><p className="au-legal"><Link to="/forgot-password" className="au-link">Request a new link</Link></p></>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <Banner>{error}</Banner>
            <Field id="rp-pass" label="New Password" icon={Lock} reveal autoComplete="new-password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Field id="rp-confirm" label="Confirm Password" icon={Lock} reveal autoComplete="new-password" placeholder="Confirm your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button type="submit" className="au-btn" disabled={busy}>{busy ? <span className="au-spin" aria-hidden="true" /> : <>Update password <ArrowRight size={18} aria-hidden="true" /></>}</button>
          </form>
        )}
      </section>
    </AuthLayout>
  );
}
