import { useState } from 'react';
import { Search, SlidersHorizontal, Heart, Star, ShoppingBag, ChevronDown, Check } from 'lucide-react';
import './Shop.css';

/* Sample products — apne real products se replace karein.
   **word** wali jagah description me highlight hoti hai. */
const PRODUCTS = [
  { id: 1, name: 'Skinhydra Masque', price: 40, rating: 4.5, kind: 'jar', tags: ['Cruelty-free', 'Anti-aging'], cats: ['Popular', 'Natural'], desc: 'Enrich your skin with the essence of **Rose** and **Chamomile**. A soothing layer that calms the skin and gives it a soft glow. Best used as a sleeping mask.', benefits: 'Deep overnight hydration, calmer-looking skin, a softer and smoother feel by morning.' },
  { id: 2, name: 'Petal Facial Mist', price: 26, rating: 4.7, kind: 'bottle', tags: ['Vegan', 'Alcohol-free'], cats: ['Popular', 'Vegan'], desc: 'A light mist of **Rose** water and **Aloe** to refresh the skin any time of day, over or under makeup.', benefits: 'Instant freshness, a light hydration boost, easy to carry and reapply.' },
  { id: 3, name: 'Chamomile Calm Cream', price: 34, rating: 4.4, kind: 'tube', tags: ['Dermatologist-tested', 'Fragrance-free'], cats: ['Natural', 'Dermatologist-tested'], desc: 'A gentle daily moisturiser with **Chamomile** and **Oat** that supports a comfortable, balanced-looking skin barrier.', benefits: 'Everyday comfort, suited to sensitive-feeling skin, light non-greasy finish.' },
  { id: 4, name: 'Oat Scalp Tonic', price: 28, rating: 4.3, kind: 'bottle', tags: ['Vegan', 'Hair care'], cats: ['Vegan', 'Natural'], desc: 'A cooling scalp tonic with **Oat** and **Green tea** for a fresher, more comfortable scalp routine.', benefits: 'Fresh-feeling scalp, lightweight, fits easily into a wash-day routine.' },
  { id: 5, name: 'Silk Strand Oil', price: 32, rating: 4.6, kind: 'jar', tags: ['Cruelty-free', 'Hair care'], cats: ['Popular'], desc: 'A featherlight oil with **Argan** and **Camellia** to add shine and softness to the lengths and ends.', benefits: 'Adds shine, helps reduce the look of frizz, non-sticky finish.' },
  { id: 6, name: 'Barrier Care Lotion', price: 29, rating: 4.5, kind: 'tube', tags: ['Dermatologist-tested'], cats: ['Dermatologist-tested', 'Popular'], desc: 'A simple, fragrance-free lotion with **Ceramides** and **Glycerin** for everyday body and face comfort.', benefits: 'Long-lasting moisture, minimal ingredient list, suitable for daily use.' },
];
const TABS = ['Popular', 'Vegan', 'Natural', 'Dermatologist-tested'];

// Simple illustrated product shapes (image ki jagah, kisi file ki zaroorat nahi)
function Art({ kind }) {
  return (
    <svg viewBox="0 0 120 120" className="art" aria-hidden="true">
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="rgba(0,0,0,.08)" />
      {kind === 'jar' && (<><rect x="26" y="52" width="68" height="52" rx="14" fill="#fff" /><rect x="22" y="36" width="76" height="22" rx="10" fill="var(--primary)" /><rect x="40" y="70" width="40" height="16" rx="8" fill="var(--soft)" /></>)}
      {kind === 'bottle' && (<><rect x="50" y="14" width="20" height="16" rx="5" fill="var(--cta)" /><rect x="54" y="28" width="12" height="10" fill="var(--primary)" /><rect x="34" y="36" width="52" height="68" rx="16" fill="#fff" /><rect x="44" y="58" width="32" height="24" rx="8" fill="var(--soft)" /></>)}
      {kind === 'tube' && (<><path d="M40 24h40l6 78H34z" fill="#fff" /><rect x="38" y="14" width="44" height="14" rx="6" fill="var(--primary)" /><rect x="46" y="54" width="28" height="22" rx="8" fill="var(--soft)" /></>)}
    </svg>
  );
}

const Highlighted = ({ text }) => text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));

export default function Shop({ wishlist, toggleWish, bagCount, addToBag }) {
  const [tab, setTab] = useState('Popular');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(1);
  const [openMore, setOpenMore] = useState(false);
  const [added, setAdded] = useState(false);

  const list = PRODUCTS.filter((p) => p.cats.includes(tab) && p.name.toLowerCase().includes(query.trim().toLowerCase()));
  const sel = PRODUCTS.find((p) => p.id === selectedId);

  const handleAdd = () => { addToBag(); setAdded(true); setTimeout(() => setAdded(false), 1600); };

  return (
    <section className="shop-section section-pad" id="shop">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">Curated for your routine</span>
            <h2>Care picks for <em>skin and hair.</em></h2>
          </div>
          <p>Gentle, thoughtfully chosen products. Prices and items shown are samples.</p>
        </div>

        <div className="shop-grid reveal">
          <div className="shop-left">
            <label className="search glass">
              <span className="search-icon"><Search size={18} /></span>
              <input type="search" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
              <SlidersHorizontal size={19} aria-hidden="true" />
            </label>

            <div className="tabs" role="tablist" aria-label="Product categories">
              {TABS.map((t) => (<button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>))}
            </div>

            <div className="product-list">
              {list.length === 0 && <p className="empty">No products match your search. Try another category or clear the search box.</p>}
              {list.map((p) => (
                <article key={p.id} className={`product ${p.id === selectedId ? 'is-selected' : ''}`}>
                  <button className="product-img" onClick={() => setSelectedId(p.id)} aria-label={`View ${p.name}`}><Art kind={p.kind} /></button>
                  <button className={`wish ${wishlist.includes(p.id) ? 'on' : ''}`} aria-label={wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wishlist.includes(p.id)} onClick={() => toggleWish(p.id)}><Heart size={17} /></button>
                  <div className="product-meta"><span>{p.name}</span><strong>${p.price}</strong></div>
                </article>
              ))}
            </div>
          </div>

          <aside className="detail glass" aria-live="polite">
            <div className="detail-hero">
              <Art kind={sel.kind} />
              <span className="best-seller" aria-hidden="true">
                <svg viewBox="0 0 100 100"><defs><path id="circ" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs><text><textPath href="#circ">BEST SELLER • BEST SELLER •</textPath></text></svg>
              </span>
            </div>
            <div className="detail-body">
              <div className="detail-row"><h3>{sel.name}</h3><span className="rating"><Star size={15} fill="currentColor" />{sel.rating}</span></div>
              <p className="price">${sel.price}</p>
              <p className="desc"><Highlighted text={sel.desc} /></p>
              <div className="tags">{sel.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <button className="more" aria-expanded={openMore} onClick={() => setOpenMore(!openMore)}>Other benefits <ChevronDown size={17} className={openMore ? 'flip' : ''} /></button>
              {openMore && <p className="more-text">{sel.benefits}</p>}
            </div>
            <div className="buy-bar">
              <button className={`wish-lg ${wishlist.includes(sel.id) ? 'on' : ''}`} aria-label="Toggle wishlist" aria-pressed={wishlist.includes(sel.id)} onClick={() => toggleWish(sel.id)}><Heart size={20} /></button>
              <button className="button add" onClick={handleAdd}>{added ? <><Check size={18} /> Added to bag</> : <>Add to bag <ShoppingBag size={18} /></>}</button>
            </div>
            {bagCount > 0 && <p className="bag-note">{bagCount} {bagCount === 1 ? 'item' : 'items'} in your bag</p>}
          </aside>
        </div>
      </div>
    </section>
  );
}
