import { Link } from 'react-router-dom';
import { ArrowLeft, Sprout } from 'lucide-react';

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'linear-gradient(135deg, var(--hero-from), var(--hero-to))' }}>
      <section className="glass" style={{ width: 'min(460px, 100%)', padding: '48px 36px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
        <span style={{ display: 'inline-grid', placeItems: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--soft)', color: 'var(--primary-deep)' }}><Sprout size={28} /></span>
        <p style={{ marginTop: 18, color: 'var(--primary-deep)', fontSize: 13, fontWeight: 700 }}>DermaCare AI</p>
        <h1 style={{ marginTop: 10, fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{title}</h1>
        <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 15 }}>{subtitle}</p>
        <Link to="/" className="button" style={{ marginTop: 28 }}><ArrowLeft size={16} /> Back to home</Link>
      </section>
    </main>
  );
}
