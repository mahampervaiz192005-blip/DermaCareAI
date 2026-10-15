# DermaCare AI – Code Guide (kahan kya hai)

| File | Kaam |
|---|---|
| `src/main.jsx` | App start karta hai, React Router lagata hai |
| `src/App.jsx` | Routes: `/` Home, `/login`, `/signup`, baqi placeholder pages |
| `src/pages/Welcome.jsx` | **Poora homepage**. Upar DATA arrays (SKIN, HAIR, FEATURES, STEPS, WHY, SLIDES) = text badalne ki jagah. Neeche sections: Hero, Features, How It Works, Platform (carousel), Why Choose, Feedback, CTA, Footer |
| `src/pages/Home.css` | Homepage ki saari styling (`dx-` prefix). Hero, cards, carousel, responsive media queries |
| `src/components/Navbar.jsx/.css` | Transparent navbar, scroll par solid, active link, mobile hamburger menu |
| `src/hooks/useReveal.js` | Scroll par `.reveal` elements fade-up karta hai |
| `src/assets/hero-portrait.jpg` | Reference design se crop ki hui hero ladki ki image |
| `src/assets/skin-thumb.jpg, hair-thumb.jpg` | Hero cards / mockups ki chhoti images (illustration) |
| `src/styles/variables.css, global.css` | Colors/fonts variables aur base styles |
| `Shop.jsx, Dashboard.jsx, BottomNav.jsx` | Purane components – ab homepage par use nahi hote, delete kar sakte hain |

Real vs demo: Navbar, scrolling, carousel, mobile menu = **kaam karte hain**. AI analysis, Grad-CAM, RAG, chat, login = **abhi backend nahi**, mockup/placeholder.
