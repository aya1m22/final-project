import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const NAV_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/products', label: 'SHOP' },
  { to: '/products?category=women', label: 'WOMEN' },
  { to: '/products?category=men', label: 'MEN' },
  { to: '/ai-stylist', label: 'AI STYLIST', accent: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items, openCart, fetchCart } = useCartStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { fetchCart(); }, [isAuthenticated]);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl italic tracking-wide text-gold">
            AURA
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[13px] tracking-[0.15em] gold-underline transition-colors duration-200
                  ${l.accent ? 'text-gold' : 'text-text-2 hover:text-text'}`}
              >
                {l.label}
                {l.accent && <span className="ml-1">✦</span>}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            {/* Cart */}
            <button onClick={openCart} className="relative text-text-2 hover:text-text transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-text-2 hover:text-text transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                  <p className="px-4 py-1.5 text-xs text-text-2">{user?.first_name || user?.username}</p>
                  <div style={{ borderTop: '1px solid var(--color-border)' }} className="my-1" />
                  <Link to="/profile" className="block px-4 py-1.5 text-sm text-text-2 hover:text-text hover:bg-bg-3/50 transition-colors">Profile</Link>
                  <Link to="/cart" className="block px-4 py-1.5 text-sm text-text-2 hover:text-text hover:bg-bg-3/50 transition-colors">My Cart</Link>
                  <div style={{ borderTop: '1px solid var(--color-border)' }} className="my-1" />
                  <button onClick={logout} className="w-full text-left px-4 py-1.5 text-sm text-red hover:bg-bg-3/50 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-[13px] tracking-wider text-text-2 hover:text-gold transition-colors">
                SIGN IN
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-text-2">
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M3.75 9h16.5M3.75 15h16.5" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute top-16 right-0 w-64 h-[calc(100vh-64px)] p-6 flex flex-col gap-4"
            style={{ background: 'var(--color-bg-1)', borderLeft: '1px solid var(--color-border)' }}
            onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={`text-sm tracking-widest ${l.accent ? 'text-gold' : 'text-text-2 hover:text-text'} transition-colors`}>
                {l.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)' }} className="my-2" />
            {!isAuthenticated && (
              <Link to="/login" className="text-sm tracking-widest text-gold">SIGN IN</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
