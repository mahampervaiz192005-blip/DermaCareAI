import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play, ShieldCheck, Flower2, ScanFace, Waves, Layers, BookOpen, MessageCircle, Upload, Cpu, FileText, Eye, UserCheck, History, Quote } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import useReveal from '../hooks/useReveal.js';
import portrait from '../assets/hero-portrait.jpg';   // reference design se crop ki hui hero image
import skinThumb from '../assets/skin-thumb.jpg';
import hairThumb from '../assets/hair-thumb.jpg';
import './Home.css';

/* ---------- DATA (text yahan se badlen, JSX ko chhedne ki zaroorat nahi) ---------- */
const SKIN = ['Acne', 'Dark Spots', 'Redness', 'Wrinkles','Blackheads','Pores'];
const HAIR = ['Hair Fall', 'Density', 'Hair Health'];
const BADGES = [['AI Analysis', Cpu], ['Grad-CAM Explainability', Layers], ['RAG Knowledge', BookOpen], ['AI Assistant', MessageCircle]];
const FEATURES = [
  { icon: ScanFace, tone: 't1', title: 'AI Skin Analysis', text: 'Upload a facial image for AI-assisted analysis of acne, blackheads, dark spots, enlarged pores, redness and wrinkles.' },
  { icon: Waves, tone: 't2', title: 'AI Hair Analysis', text: 'Upload a suitable hair image for image-based hair fall analysis and relevant wellness guidance.' },
  { icon: Layers, tone: 't3', title: 'Grad-CAM Explainability', text: 'Heatmaps show which image regions influenced supported skin model predictions.' },
  { icon: BookOpen, tone: 't4', title: 'RAG Knowledge Base', text: 'Relevant information is retrieved from a curated skin and hair wellness knowledge base.' },
  { icon: MessageCircle, tone: 't5', title: 'DermaCare AI Assistant', text: 'A text assistant that can use your profile, results and retrieved knowledge for follow-up questions.' },
];
const STEPS = [
  { icon: Upload, title: 'Create Profile & Upload', text: 'Register, fill the questionnaire and upload a suitable facial or hair image.' },
  { icon: Cpu, title: 'AI Analysis', text: 'Models analyze the supported skin and hair concerns.' },
  { icon: FileText, title: 'Explore Insights', text: 'View results and Grad-CAM explanations for supported skin predictions.' },
  { icon: MessageCircle, title: 'Get Guidance', text: 'Ask follow-up questions in the AI Assistant and review your history.' },
];
const WHY = [
  { icon: Layers, title: 'Unified skin & hair support' },
  { icon: ScanFace, title: 'Multi-label facial skin concern analysis' },
  { icon: Eye, title: 'Visual explanations for supported predictions' },
  { icon: UserCheck, title: 'Guidance informed by your context' },
  { icon: BookOpen, title: 'RAG-based knowledge retrieval' },
  { icon: History, title: 'Analysis & conversation history' },
];

/* ---------- Platform preview mockups (sirf illustration, real result nahi) ---------- */
function Frame({ title, children }) {
  return (
    <div className="dx-mock">
      <aside aria-hidden="true"><i /><i /><i /><i /></aside>
      <div className="dx-mock-body"><h4>{title}</h4>{children}</div>
    </div>
  );
}
const List = ({ items }) => <ul className="mk-list">{items.map((c) => <li key={c}>{c}<span>sample</span></li>)}</ul>;
const SLIDES = [
  { name: 'Dashboard', node: <Frame title="Dashboard"><div className="mk-tiles"><b>Skin</b><b>Hair</b><b>Chat</b></div><div className="mk-box">Recent analyses appear here</div></Frame> },
  { name: 'Skin Analysis', node: <Frame title="Skin Analysis Result"><img className="mk-img" src={skinThumb} alt="Illustrative skin image" /><List items={SKIN.slice(0, 3)} /></Frame> },
  { name: 'Grad-CAM', node: <Frame title="Grad-CAM Visualization"><div className="mk-imgwrap"><img className="mk-img" src={skinThumb} alt="Illustrative skin image with heatmap layout" /><span className="mk-heat" /></div><p className="mk-note">Heatmap layout preview</p></Frame> },
  { name: 'Hair Analysis', node: <Frame title="Hair Analysis Result"><img className="mk-img" src={hairThumb} alt="Illustrative hair image" /><List items={HAIR} /></Frame> },
  { name: 'AI Assistant', node: <Frame title="AI Assistant Chat"><div className="mk-chat"><p className="u">How can I understand my results?</p><p className="a">Sample reply layout: explanation and wellness info appear here.</p></div></Frame> },
];

function Platform() {
  const track = useRef(null);
  const [i, setI] = useState(0);
  const step = () => (track.current?.firstElementChild?.offsetWidth || 280) + 18;
  const scrollToIndex = (n) => track.current?.scrollTo({ left: n * step(), behavior: 'smooth' });
  const onScroll = () => setI(Math.min(SLIDES.length - 1, Math.round(track.current.scrollLeft / step())));
  return (
    <section className="dx-dark" id="platform">
      <div className="container dx-platform">
        <div className="reveal">
          <span className="eyebrow">Inside the platform</span>
          <h2>A Smarter Way to Explore <em>Your Wellness.</em></h2>
          <p>Illustrative mockups with sample layouts — not real analysis results. They will be replaced with real screenshots.</p>
          <a href="#features" className="button dx-ghost">Explore Full Features</a>
        </div>
        <div className="dx-gallery">
          <div className="dx-gallery-row">
            <button className="dx-arrow" onClick={() => scrollToIndex(i - 1)} aria-label="Previous preview"><ChevronLeft size={20} /></button>
            <div className="dx-track" ref={track} onScroll={onScroll}>
              {SLIDES.map((s) => <div className="dx-slide" key={s.name}><span className="dx-tag">{s.name} · Demo</span>{s.node}</div>)}
            </div>
            <button className="dx-arrow" onClick={() => scrollToIndex(i + 1)} aria-label="Next preview"><ChevronRight size={20} /></button>
          </div>
          <div className="dx-dots">{SLIDES.map((s, n) => <button key={s.name} className={n === i ? 'on' : ''} onClick={() => scrollToIndex(n)} aria-label={`Show ${s.name}`} />)}</div>
        </div>
      </div>
    </section>
  );
}

export default function Welcome() {
  useReveal();
  return (
    <div className="dc-home" id="top">
      <Navbar />
      <main>
        {/* ============ 1. HERO ============ */}
        <section className="dx-hero">
          <div className="container dx-hero-grid">
            <div className="dx-hero-copy">
              <h1>Your Skin &amp; Hair Wellness, <em>Powered by AI.</em></h1>
              <p className="dx-lede">Discover AI-powered skin and hair insights, understand your analysis results, and explore personalized wellness guidance — all in one intelligent platform.</p>
              <ul className="dx-badges">{BADGES.map(([t, Icon]) => <li key={t}><Icon size={15} />{t}</li>)}</ul>
              <div className="dx-actions">
                <Link to="/signup" className="button">Start Your Free Analysis <ArrowRight size={17} /></Link>
                <a href="#how" className="button dx-ghost"><Play size={16} /> Explore How It Works</a>
              </div>
              <p className="dx-note"><ShieldCheck size={16} /> Educational wellness insights — not a medical diagnosis.</p>
            </div>

            <div className="dx-portrait">
              <img src={portrait} alt="Decorative AI beauty-tech portrait (illustration, not an analysed image)" />
              <span className="dx-scan" aria-hidden="true" />
            </div>

            <div className="dx-cards">
              <div className="dx-card"><img src={skinThumb} alt="" /><div><strong>Skin Analysis</strong><ul>{SKIN.map((s) => <li key={s}>{s}</li>)}</ul></div><span className="dx-heat" aria-hidden="true" /></div>
              <div className="dx-card dx-card2"><img src={hairThumb} alt="" /><div><strong>Hair Analysis</strong><ul>{HAIR.map((s) => <li key={s}>{s}</li>)}</ul></div><span className="dx-heat" aria-hidden="true" /></div>
              <p className="dx-caption">Illustrative visuals — not analysis results.</p>
            </div>
          </div>
        </section>

        {/* ============ 2. FEATURES ============ */}
        <section className="section-pad" id="features">
          <div className="container">
            <div className="dx-head dx-head-row reveal">
              <div><span className="eyebrow">Key features</span><h2>Intelligent Care for <em>Skin &amp; Hair.</em></h2><p>Understand your concerns through AI-powered analysis and personalized, knowledge-based wellness support.</p></div>
              <p className="dx-script" aria-hidden="true">Smarter Analysis<br />Personalized Guidance<br />Healthier You ♡</p>
            </div>
            <div className="dx-features">
              {FEATURES.map(({ icon: Icon, tone, title, text }, n) => (
                <article key={title} className="dx-fcard reveal" style={{ transitionDelay: `${n * 70}ms` }}>
                  <span className={`dx-ico ${tone}`}><Icon size={24} /></span><h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 3. HOW IT WORKS ============ */}
        <section className="dx-how section-pad" id="how">
          <div className="container dx-how-grid">
            <div className="reveal"><span className="eyebrow">Simple steps</span><h2>How <em>DermaCare AI</em> Works</h2><p>Your journey to better skin &amp; hair understanding, in four easy steps.</p><Link to="/signup" className="button">Get Started</Link></div>
            <ol className="dx-steps">
              {STEPS.map(({ icon: Icon, title, text }, n) => (
                <li key={title} className="reveal" style={{ transitionDelay: `${n * 90}ms` }}>
                  <span className="dx-stepico"><Icon size={26} /><b>{n + 1}</b></span><h3>{title}</h3><p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ 4. PLATFORM PREVIEW ============ */}
        <Platform />

        {/* ============ 5. WHY CHOOSE US (About) ============ */}
        <section className="section-pad" id="about">
          <div className="container">
            <div className="dx-head reveal"><span className="eyebrow">Why choose DermaCare AI</span><h2>More Than Analysis. <em>A More Informed Experience.</em></h2></div>
            <div className="dx-why">
              {WHY.map(({ icon: Icon, title }) => <div key={title} className="dx-wcard reveal"><span className="dx-ico t1"><Icon size={20} /></span><p>{title}</p></div>)}
            </div>
          </div>
        </section>

        {/* ============ 6. FEEDBACK (placeholder) ============ */}
        <section className="dx-feedback">
          <div className="container">
            <div className="dx-head reveal"><span className="eyebrow">Feedback</span><h2>What Our Users <em>Say</em></h2><p>Placeholder cards — real feedback from your FYP user testing can be added here later.</p></div>
            <div className="dx-fb-grid">
              {[1, 2, 3].map((n) => <div key={n} className="dx-fb reveal"><Quote size={20} /><p>Sample feedback card — replace with a real, consented user comment.</p><span>User {n} · placeholder</span></div>)}
            </div>
          </div>
        </section>

        {/* ============ 7. FINAL CTA ============ */}
        <section className="dx-cta">
          <div className="container dx-cta-inner reveal">
            <Flower2 size={46} strokeWidth={1.4} />
            <div><h2>Ready to Understand Your Skin &amp; Hair Better?</h2><p>Explore your insights and discover personalized wellness guidance with DermaCare AI.</p></div>
            <Link to="/signup" className="button">Get Started <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>

      {/* ============ 8. FOOTER (id=contact) ============ */}
      <footer className="dx-footer" id="contact">
        <div className="container dx-foot-row">
          <Link to="/" className="brand"><span className="brand-mark"><Flower2 size={22} /></span><b>DermaCare AI</b></Link>
          <nav aria-label="Footer"><a href="#top">Home</a><a href="#features">Features</a><a href="#how">How It Works</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
          <span>© {new Date().getFullYear()} DermaCare AI · Privacy Policy · Responsible AI</span>
        </div>
        <p className="container dx-disclaimer">DermaCare AI provides AI-assisted skin and hair wellness information for educational purposes. It does not provide medical diagnoses, prescribe medicines, or replace advice from a qualified healthcare professional.</p>
      </footer>
    </div>
  );
}
