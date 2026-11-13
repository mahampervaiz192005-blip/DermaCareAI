import { AlertTriangle, Inbox } from 'lucide-react';

export const Skeleton = ({ h = 16, w = '100%', r = 10, style }) => <span className="dsh-skel" style={{ height: h, width: w, borderRadius: r, ...style }} aria-hidden="true" />;

export function EmptyState({ icon: Icon = Inbox, title, text, children }) {
  return (
    <div className="dsh-empty">
      <span className="dsh-empty-ico"><Icon size={30} aria-hidden="true" /></span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="dsh-empty dsh-empty-err" role="alert">
      <span className="dsh-empty-ico"><AlertTriangle size={30} aria-hidden="true" /></span>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button className="dsh-btn dsh-btn-ghost" onClick={onRetry}>Try again</button>}
    </div>
  );
}

const LABELS = { pending: 'Queued', processing: 'Processing', completed: 'Completed', failed: 'Failed' };
export const StatusBadge = ({ status }) => <span className={`dsh-badge dsh-badge-${status}`}>{LABELS[status] || status}</span>;
export const statusLabel = (s) => LABELS[s] || s;

export const Disclaimer = ({ children }) => (
  <p className="dsh-disclaimer">{children || 'DermaCare AI provides AI-assisted wellness insights. It is not a medical diagnosis and does not replace professional medical advice.'}</p>
);
