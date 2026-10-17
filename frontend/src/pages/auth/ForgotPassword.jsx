import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { api, apiError } from '../../api/client.js';
import AuthLayout, { Logo } from './AuthLayout.jsx';
import { Banner, EMAIL_RE, Field } from './AuthFields.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email address.');
    setBusy(true);
    try {
      const r = await api.post('/auth/forgot-password', { email: email.trim() });
      setSent(r.data.message);
    } catch (err) {
      const r = apiError(err);
      setError(typeof r === 'string' ? r : r.message);
    }
    setBusy(false);
  }

  return (
    <AuthLayout variant="login">
      <section className="au-card" aria-labelledby="fp-title">
        <Logo />
        <h1 id="fp-title">Reset <span>Password</span></h1>
        <p className="au-lead">Enter the email you signed up with and we'll send you a link to choose a new password.</p>
        {sent ? <Banner kind="ok">{sent}</Banner> : (
          <form onSubmit={onSubmit} noValidate>
            <Banner>{error}</Banner>
            <Field id="fp-email" label="Email Address" icon={Mail} type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="au-btn" disabled={busy}>{busy ? <span className="au-spin" aria-hidden="true" /> : <>Send reset link <ArrowRight size={18} aria-hidden="true" /></>}</button>
          </form>
        )}
        <p className="au-legal"><Link to="/login" className="au-link"><ArrowLeft size={14} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px' }} /> Back to login</Link></p>
      </section>
    </AuthLayout>
  );
}
