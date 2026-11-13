import { Link } from "react-router-dom";
import { ScanFace, Scissors, ArrowRight, CircleCheck, Upload, Cpu, Sparkles, ShieldCheck } from "lucide-react";
import useCurrentUser from "../../hooks/useCurrentUser";

const MODULES = [
  {
    key: "skin",
    to: "/dashboard/skin",
    icon: ScanFace,
    title: "AI Skin Analysis",
    text: "Understand your skin with AI-powered image analysis, visual explanations, and personalized wellness guidance.",
    cta: "Explore Skin Care",
    image: "/images/skin-module.jpg",
    features: [
      "Facial skin analysis",
      "Acne and dark spot insights",
      "Redness and wrinkle assessment",
      "Grad-CAM visual explanations",
      "Personalized skin guidance",
    ],
  },
  {
    key: "hair",
    to: "/dashboard/hair",
    icon: Scissors,
    title: "AI Hair Analysis",
    text: "Explore hair and scalp concerns with AI-powered analysis and personalized hair wellness guidance.",
    cta: "Explore Hair Care",
    image: "/images/hair-module.jpg",
    features: [
      "Hair image analysis",
      "Hair fall assessment",
      "Hair density insights",
      "Hair health guidance",
      "Personalized recommendations",
    ],
  },
];

const STEPS = [
  { icon: Upload, title: "Upload image", text: "Add a clear photo of your skin or hair." },
  { icon: Cpu, title: "AI analysis", text: "Our model studies the image." },
  { icon: Sparkles, title: "View insights", text: "Get personalized wellness guidance." },
];

export default function ModuleSelection() {
  const { name } = useCurrentUser();

  return (
    <div className="dc-page">
      <section className="dc-welcome">
        <h1>Welcome back, {name}!</h1>
        <p>Choose your wellness journey to get started.</p>
      </section>

      <section aria-labelledby="journey-heading">
        <h2 id="journey-heading" className="dc-section-title">Your Personalized Wellness Journey</h2>
        <p className="dc-section-sub">
          Explore AI-powered insights and personalized wellness guidance for your skin and hair.
        </p>

        <div className="dc-module-grid">
          {MODULES.map(({ key, to, icon: Icon, title, text, cta, image, features }) => (
            <article key={key} className={`dc-module-card dc-module-${key}`}>
              <div className="dc-module-body">
                <span className="dc-module-icon"><Icon size={30} /></span>
                <span className="dc-ai-badge">AI-assisted</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={to} className="dc-btn-primary">
                  {cta} <ArrowRight size={16} />
                </Link>
                <ul className="dc-feature-list">
                  {features.map((f) => (
                    <li key={f}><CircleCheck size={16} /> {f}</li>
                  ))}
                </ul>
              </div>

              {/* Image na ho to gradient dikhega (onError par img hide) */}
              <div className="dc-module-visual" aria-hidden="true">
                <img src={image} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>

              {/* Poora card clickable */}
              <Link to={to} className="dc-card-overlay" aria-label={cta} tabIndex={-1} />
            </article>
          ))}
        </div>
      </section>

      <section className="dc-how" aria-labelledby="how-heading">
        <h2 id="how-heading" className="dc-section-title">How it works</h2>
        <div className="dc-steps">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="dc-step">
              <span className="dc-step-icon"><Icon size={20} /></span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
              {i < STEPS.length - 1 && <ArrowRight size={18} className="dc-step-arrow" />}
            </div>
          ))}
        </div>
      </section>

      <section className="dc-notice">
        <ShieldCheck size={20} />
        <p>
          <strong>Privacy:</strong> upload only images you are comfortable sharing.{" "}
          <strong>Note:</strong> DermaCare AI gives AI-assisted wellness insights. It is not a medical
          diagnosis and does not replace professional medical advice.
        </p>
      </section>
    </div>
  );
}
