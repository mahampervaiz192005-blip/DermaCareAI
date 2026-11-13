import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Bot, ClipboardList, History, Leaf, Microscope, ScanFace } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Disclaimer } from '../../components/ui/bits.jsx';
import skinThumb from '../../assets/skin-thumb.jpg';
import ScanArt from './ScanArt.jsx';
import { useSkinFlow, formatDateTime } from './SkinFlowContext.jsx';
import { skinTypeLabel } from './skinData.js';

const QUICK = [
  { to: '/dashboard/skin/persona', icon: ClipboardList, title: 'SkinPersona Questionnaire', text: 'Discover your skin type' },
  { to: '/history', icon: History, title: 'Recent Analysis', text: 'View your latest skin analysis results' },
  { to: '/dashboard/skin/gradcam', icon: Microscope, title: 'Grad-CAM Visualization', text: 'Understand model predictions' },
  { to: '/dashboard/skin/knowledge', icon: BookOpen, title: 'Knowledge Base', text: 'Get expert-backed guidance' },
  { to: '/assistant', icon: Bot, title: 'AI Assistant', text: 'Ask questions & get help' },
];

export default function SkinDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { latest, reset } = useSkinFlow();
  const first = (user?.full_name || 'there').split(' ')[0];
  const start = () => { reset(); navigate('/dashboard/skin/persona'); };

  return (
    <div className="sk-page">
      <header className="dsh-head">
        <h1>Welcome back, {first}! <span aria-hidden="true">👋</span></h1>
        <p>Explore your skin health and discover personalized skincare guidance.</p>
      </header>

      <div className="sk-top">
        <section className="dsh-card sk-journey" aria-labelledby="sk-journey-h">
          <div className="sk-journey-body">
            <div className="sk-journey-head">
              <span className="sk-ico-lg"><ScanFace size={30} strokeWidth={1.5} aria-hidden="true" /></span>
              <div>
                <h2 id="sk-journey-h">Your Skin Journey</h2>
                <p>Upload an image, get AI analysis and discover personalized skincare guidance.</p>
              </div>
            </div>
            <button type="button" className="dsh-btn dsh-btn-blue sk-cta" onClick={start}>Start New Skin Analysis <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
          <ScanArt className="sk-journey-art" />
        </section>

        <Link to="/dashboard/skin/knowledge" className="dsh-card sk-tipcard">
          <span className="sk-ico-lg"><Leaf size={28} strokeWidth={1.5} aria-hidden="true" /></span>
          <b>Skin Care Tips</b>
          <small>Healthy skin starts with the right care.</small>
        </Link>
      </div>

      <div className="sk-quick">
        {QUICK.map(({ to, icon: Icon, title, text }) => (
          <Link key={title} to={to} className="dsh-card sk-qcard">
            <span className="sk-qico"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
            <span className="sk-qtext"><b>{title}</b><small>{text}</small></span>
          </Link>
        ))}
      </div>

      <div className="dsh-row-between"><h3 className="dsh-h3">Latest Analysis</h3><Link to="/history" className="dsh-link">View All <ArrowRight size={14} aria-hidden="true" /></Link></div>
      <section className="dsh-card sk-latest" aria-label="Latest analysis">
        <img className="sk-latest-img" src={skinThumb} alt="" />
        <div className="sk-latest-info">
          <b>Skin Analysis</b>
          <small>{formatDateTime(latest?.date || new Date())}{latest ? ` • ${skinTypeLabel(latest.skinType)}` : ' • Sample'}</small>
        </div>
        <span className="sk-done">Completed</span>
        <Link to="/dashboard/skin/results" className="dsh-btn dsh-btn-sm sk-view">View Results <ArrowRight size={14} aria-hidden="true" /></Link>
      </section>

      <Disclaimer />
    </div>
  );
}
