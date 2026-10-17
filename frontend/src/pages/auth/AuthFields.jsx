import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/* Icon + label + input + (optional) show/hide + inline error */
export function Field({ id, label, icon: Icon, error, type = 'text', reveal = false, ...rest }) {
  const [show, setShow] = useState(false);
  const inputType = reveal ? (show ? 'text' : 'password') : type;
  return (
    <div className="au-group">
      <label htmlFor={id}>{label}</label>
      <div className={`au-field ${error ? 'has-error' : ''}`}>
        {Icon && <Icon className="au-ico" size={18} aria-hidden="true" />}
        <input id={id} type={inputType} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
        {reveal && (
          <button type="button" className="au-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="au-err" id={`${id}-err`}>{error}</p>}
    </div>
  );
}

export function Banner({ kind = 'error', children }) {
  if (!children) return null;
  return <p className={`au-banner au-banner-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</p>;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
