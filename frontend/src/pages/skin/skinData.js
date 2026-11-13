import { Aperture, CircleDot, Droplets, Flame, Blend, Smile, Sun, Waves, Wind, Dot } from 'lucide-react';

/* ---- SkinPersona: sirf 4 skin types (koi Sensitive option nahi) ---- */
export const SKIN_TYPES = [
  { value: 'dry', label: 'Dry Skin', desc: 'Tight, dry or flaky skin.', icon: Wind },
  { value: 'oily', label: 'Oily Skin', desc: 'Shiny or oily skin, especially in the T-zone.', icon: Droplets },
  { value: 'combination', label: 'Combination Skin', desc: 'Oily T-zone with normal or dry cheeks.', icon: Blend },
  { value: 'normal', label: 'Normal Skin', desc: 'Neither too dry nor too oily.', icon: Smile },
];
export const skinTypeLabel = (v) => SKIN_TYPES.find((s) => s.value === v)?.label || 'Not selected';

/* ---- Demo concerns (backend ke baad real model output aayega) ---- */
export const DEMO_CONCERNS = [
  { key: 'acne', name: 'Acne', confidence: 87, icon: CircleDot, region: 'Cheeks & jawline' },
  { key: 'blackheads', name: 'Blackheads', confidence: 74, icon: Dot, region: 'Nose & T-zone' },
  { key: 'dark-spots', name: 'Dark Spots', confidence: 68, icon: Sun, region: 'Cheeks & forehead' },
  { key: 'pores', name: 'Enlarged Pores', confidence: 81, icon: Aperture, region: 'Nose & inner cheeks' },
  { key: 'redness', name: 'Redness', confidence: 59, icon: Flame, region: 'Cheeks & around the nose' },
  { key: 'wrinkles', name: 'Wrinkles', confidence: 42, icon: Waves, region: 'Forehead & eye area' },
];

/* Grad-CAM regions (demo heatmap blobs, % of image) */
export const HEAT_REGIONS = [
  { name: 'Forehead', x: 50, y: 20, r: 20, power: 0.55, note: 'Light texture changes and fine lines were highlighted here.' },
  { name: 'Left cheek', x: 28, y: 56, r: 22, power: 0.95, note: 'Strongest activation — linked with acne and redness.' },
  { name: 'Right cheek', x: 72, y: 56, r: 22, power: 0.8, note: 'Moderate activation — dark spots and visible pores.' },
  { name: 'Nose / T-zone', x: 50, y: 50, r: 16, power: 0.85, note: 'Blackheads and enlarged pores were detected around the nose.' },
  { name: 'Chin', x: 50, y: 82, r: 16, power: 0.5, note: 'Mild activation near the chin and jawline.' },
];

/* ---- Guidance ---- */
const ROUTINE = {
  dry: {
    summary: 'Your skin needs gentle cleansing, deep hydration and a strong moisture barrier.',
    am: ['Creamy, non-foaming cleanser', 'Hydrating serum (hyaluronic acid)', 'Rich moisturizer with ceramides', 'Broad-spectrum SPF 30+'],
    pm: ['Gentle cleanser (no hot water)', 'Hydrating or barrier-repair serum', 'Thick moisturizer / sleeping mask'],
    use: ['Hyaluronic acid', 'Ceramides', 'Glycerin', 'Squalane'],
    avoid: ['Harsh foaming cleansers', 'High-alcohol toners', 'Over-exfoliating'],
  },
  oily: {
    summary: 'Your skin needs oil control without stripping — lightweight, non-comedogenic products work best.',
    am: ['Gel or foaming cleanser', 'Niacinamide serum', 'Oil-free gel moisturizer', 'Matte, lightweight SPF 30+'],
    pm: ['Gentle gel cleanser', 'Salicylic acid (2–3 nights a week)', 'Light gel moisturizer'],
    use: ['Niacinamide', 'Salicylic acid (BHA)', 'Zinc', 'Clay (once a week)'],
    avoid: ['Heavy creams and oils', 'Skipping moisturizer', 'Harsh scrubbing'],
  },
  combination: {
    summary: 'Balance is the goal — treat the T-zone and cheeks according to what each area needs.',
    am: ['Gentle gel-to-cream cleanser', 'Niacinamide or lightweight hydrating serum', 'Light lotion moisturizer', 'Broad-spectrum SPF 30+'],
    pm: ['Gentle cleanser', 'BHA on the T-zone only, 2 nights a week', 'Richer moisturizer on dry cheeks'],
    use: ['Niacinamide', 'Hyaluronic acid', 'Light BHA (T-zone)', 'Aloe vera'],
    avoid: ['One heavy product for the whole face', 'Strong astringents', 'Over-cleansing'],
  },
  normal: {
    summary: 'Your skin is well balanced — keep it healthy with a simple routine and daily sun protection.',
    am: ['Gentle cleanser', 'Antioxidant serum (vitamin C)', 'Light moisturizer', 'Broad-spectrum SPF 30+'],
    pm: ['Gentle cleanser', 'Retinol or peptide serum (a few nights a week)', 'Moisturizer'],
    use: ['Vitamin C', 'Peptides', 'Niacinamide', 'Gentle AHA once a week'],
    avoid: ['Too many new actives at once', 'Skipping sunscreen', 'Sleeping with makeup on'],
  },
};

const CONCERN_TIPS = {
  acne: 'Use a gentle salicylic acid or benzoyl peroxide product, avoid picking, and change pillowcases often.',
  blackheads: 'A BHA (salicylic acid) 2–3 times a week helps clear pores. Avoid pore strips and squeezing.',
  'dark-spots': 'Daily SPF is essential. Vitamin C, niacinamide or azelaic acid can help fade marks gradually.',
  pores: 'Niacinamide and regular gentle exfoliation can make pores look smaller. Always remove makeup at night.',
  redness: 'Keep products minimal and fragrance-free. Soothing ingredients like centella or panthenol can help.',
  wrinkles: 'Sunscreen every morning and a retinoid at night (introduced slowly) support collagen over time.',
};

export const LIFESTYLE = [
  'Drink enough water and sleep 7–8 hours.',
  'Change pillowcases and clean your phone screen regularly.',
  'Introduce only one new product at a time and patch-test first.',
  'Be consistent — most routines take 6–8 weeks to show results.',
];

export function buildGuidance(skinType, concerns = DEMO_CONCERNS) {
  const base = ROUTINE[skinType] || ROUTINE.normal;
  const top = [...concerns].sort((a, b) => b.confidence - a.confidence);
  return { ...base, tips: top.map((c) => ({ key: c.key, name: c.name, icon: c.icon, confidence: c.confidence, tip: CONCERN_TIPS[c.key] })) };
}

export const KNOWLEDGE = [
  { q: 'How do I know my skin type?', a: 'Wash your face with a gentle cleanser and wait 1–2 hours. Tight or flaky means dry, shiny means oily, shiny only in the T-zone means combination, and comfortable means normal.' },
  { q: 'What is Grad-CAM?', a: 'Grad-CAM highlights the image regions that influenced the AI model most. Warmer colours (red/yellow) mean stronger influence.' },
  { q: 'Why is sunscreen important?', a: 'UV exposure worsens dark spots, redness and wrinkles. A broad-spectrum SPF 30+ every morning is the most effective anti-ageing step.' },
  { q: 'How often should I exfoliate?', a: 'Usually 1–3 times a week depending on your skin type. Dry skin needs less, oily skin can tolerate a little more.' },
  { q: 'When should I see a dermatologist?', a: 'If you have painful or cystic acne, a changing mole, persistent irritation or anything that worries you, consult a qualified dermatologist. DermaCare AI is not a medical diagnosis.' },
];
