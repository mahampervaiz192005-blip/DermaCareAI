import { Link } from "react-router-dom";
import { Hourglass } from "lucide-react";

/** Un routes ke liye jo abhi implement nahi hue (dead links se bachne ke liye). */
export default function ComingSoon({ title = "This page" }) {
  return (
    <div className="dc-page">
      <div className="dc-empty">
        <span className="dc-step-icon"><Hourglass size={22} /></span>
        <h2>{title} is coming soon</h2>
        <p>We are still building this part of DermaCare AI.</p>
        <Link to="/dashboard" className="dc-btn-primary">Back to dashboard</Link>
      </div>
    </div>
  );
}
