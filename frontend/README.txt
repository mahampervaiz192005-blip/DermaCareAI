DERMACARE AI HOMEPAGE - INSTALLATION

1. Stop the Vite server with Ctrl+C if it is running.
2. Extract this ZIP.
3. Copy the included src folder into:
   D:\DERMA_CARE_AI\frontend\
4. Allow Windows to merge folders and replace these files if asked.
5. In VS Code terminal run:
   cd D:\DERMA_CARE_AI\frontend
   npm run dev
6. Open the Local URL shown in the terminal, usually http://localhost:5173/

This replaces only src files. It does not replace package.json or your project setup.
The scroll reveal animation is implemented with IntersectionObserver in src/hooks/useReveal.js.
The photos and Google Fonts are remote and require an internet connection.
Login and signup pages are visual placeholders for now; no real authentication/database is connected yet.

Updated version: hero headline now represents both skin and hair wellness, with a refreshed portrait image and refined hero styling.

---------------------------------------------------------------
UI REDESIGN (v3) — Blue glassmorphism + Soft pink e-commerce style
---------------------------------------------------------------
- Install steps wahi hain (sirf src folder replace hota hai). Koi naya npm package nahi chahiye.
- Colors / radius / shadows: src/styles/variables.css (sab CSS variables).
- Light Blue / Soft Pink toggle: navbar me; choice browser me yaad rehti hai (src/hooks/useTheme.js).
- Naye components: Dashboard.jsx (stats + SVG charts), Shop.jsx (search, tabs, products, detail card), BottomNav.jsx (mobile).
- Dashboard ka data aur products SAMPLE hain: Dashboard.jsx me `skin` object aur Shop.jsx me `PRODUCTS` array ko apne real data se replace karein.
- Routes (/, /login, /signup), links aur original text/sections waise hi hain.
