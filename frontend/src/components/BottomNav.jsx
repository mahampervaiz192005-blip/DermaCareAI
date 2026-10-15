import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import './BottomNav.css';

// Mobile par neeche dikhne wali app-style navigation (Home, Cart, Wishlist, Profile).
export default function BottomNav({ bagCount = 0, wishCount = 0 }) {
  return (
    <nav className="bottom-nav glass" aria-label="Quick navigation">
      <a href="#top"><Home size={21} /><span>Home</span></a>
      <a href="#shop"><span className="bn-icon"><ShoppingBag size={21} />{bagCount > 0 && <b>{bagCount}</b>}</span><span>Cart</span></a>
      <a href="#shop"><span className="bn-icon"><Heart size={21} />{wishCount > 0 && <b>{wishCount}</b>}</span><span>Wishlist</span></a>
      <Link to="/login"><User size={21} /><span>Profile</span></Link>
    </nav>
  );
}
