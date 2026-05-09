import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/products', label: 'SHOP' },
  { to: '/products?category=women', label: 'WOMEN' },
  { to: '/products?category=men', label: 'MEN' },
  { to: '/ai-stylist', label: 'AI STYLIST✦', accent: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { openCart, items } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 backdrop-blur-md bg-bg/80' : 'py-6 bg-transparent'
      }`}
      style={{ borderBottom: scrolled ? '1px solid var(--color-border)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl italic text-gold tracking-wider hover:opacity-80 transition-opacity">
          AURA
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13px] tracking-[0.15em] transition-colors duration-200 relative group
                ${l.accent ? 'text-gold' : 
                  location.pathname === l.to || (l.to !== '/' && location.pathname + location.search === l.to)
                  ? 'text-text' : 'text-text-2 hover:text-text'}
              `}
            >
              {l.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 
                ${location.pathname === l.to || (l.to !== '/' && location.pathname + location.search === l.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} 
              />
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5 text-text-2">
          <button className="hover:text-gold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          
          <Link to={isAuthenticated ? "/profile" : "/login"} className="hover:text-gold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></Link>
          </Link>

          <button onClick={openCart} className="hover:text-gold transition-colors relative group">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
