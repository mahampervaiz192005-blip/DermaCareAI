import { Check } from 'lucide-react';

const STEPS = ['Skin Type', 'Upload Image', 'AI Analysis', 'Results'];

/* Top progress stepper (sab flow screens par same) */
export default function FlowSteps({ current }) {
  return (
    <ol className="sk-steps" aria-label="Analysis steps">
      {STEPS.map((s, i) => (
        <li key={s} className={i < current ? 'done' : i === current ? 'cur' : ''} aria-current={i === current ? 'step' : undefined}>
          <span>{i < current ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : i + 1}</span>
          <em>{s}</em>
        </li>
      ))}
    </ol>
  );
}
