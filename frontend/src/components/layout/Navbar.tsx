import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { isAuthenticated } = useAuthStore();
  const { openCart, items } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-4 glass shadow-2xl' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl italic text-gold tracking-widest relative group">
          AURA
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => {
            const isActive = location.pathname === l.to || (l.to !== '/' && location.pathname + location.search === l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[11px] tracking-[0.25em] transition-all duration-300 relative group
                  ${l.accent ? 'text-gold font-bold' : isActive ? 'text-text' : 'text-text-3 hover:text-text'}
                `}
              >
                {l.label}
                <motion.span 
                  className="absolute -bottom-2 left-0 h-px bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
                {!isActive && (
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-gold/40 transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <Link to={isAuthenticated ? "/profile" : "/login"} className="text-text-2 hover:text-gold transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <button onClick={openCart} className="text-text-2 hover:text-gold transition-colors p-2 relative group">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <AnimatePresence>
              {items.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 w-3.5 h-3.5 bg-gold text-bg text-[8px] font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {items.length}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </nav>
  );
}
