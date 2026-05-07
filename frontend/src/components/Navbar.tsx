import '../styles/navbar.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { ShoppingBag, Search, User, Heart, Menu, X, LogOut, Package, Settings, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { open, items } = useCart();
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) nav(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  const isActive = (path: string) => location.pathname === path ? 'navbar-link active' : 'navbar-link';
  const cartCount = items?.length || 0;

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="FashionAI Home">
            FASHION<span>AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav">
            <Link to="/products" className={isActive('/products')}>Shop</Link>
            <Link to="/products?category=women" className="navbar-link">Women</Link>
            <Link to="/products?category=men" className="navbar-link">Men</Link>
            <Link to="/ai-advisor" className="navbar-link">AI Stylist</Link>
          </div>

          {/* Search */}
          <form className="navbar-search-bar" onSubmit={onSearch} role="search">
            <Search size={16} color="var(--grey-400)" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search styles..."
              aria-label="Search products"
            />
          </form>

          {/* Actions */}
          <div className="navbar-actions">
            <Link to="/wishlist" className="navbar-icon-btn" aria-label="Wishlist">
              <Heart size={20} />
            </Link>

            <button
              id="cart-btn"
              className="navbar-icon-btn"
              onClick={() => open()}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="navbar-cart-badge" aria-hidden="true">{cartCount}</span>
              )}
            </button>

            {/* User */}
            <div className="navbar-user-menu" ref={userRef}>
              <button
                className="navbar-icon-btn"
                onClick={() => setUserOpen(o => !o)}
                aria-label="User menu"
                aria-expanded={userOpen}
              >
                <User size={20} />
              </button>
              {userOpen && (
                <div className="user-dropdown" role="menu">
                  {user ? (
                    <>
                      <div style={{ padding: '12px 18px 8px', borderBottom: '1px solid var(--grey-100)' }}>
                        <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{user.name || 'Account'}</div>
                        <div style={{ fontSize: '.76rem', color: 'var(--grey-400)', marginTop: 2 }}>{user.email}</div>
                      </div>
                      <Link to="/profile" className="user-dropdown-item" role="menuitem">
                        <Settings size={15} /> My Profile
                      </Link>
                      <Link to="/orders" className="user-dropdown-item" role="menuitem">
                        <Package size={15} /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="user-dropdown-item" role="menuitem">
                          <LayoutDashboard size={15} /> Admin Panel
                        </Link>
                      )}
                      <div style={{ borderTop: '1px solid var(--grey-100)', marginTop: 4, paddingTop: 4 }}>
                        <button
                          className="user-dropdown-item danger"
                          role="menuitem"
                          onClick={() => { logout(); setUserOpen(false); }}
                          style={{ width: '100%', textAlign: 'left' }}
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="user-dropdown-item" role="menuitem">Sign In</Link>
                      <Link to="/register" className="user-dropdown-item" role="menuitem">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <Link to="/products" className="mobile-menu-link">Shop All</Link>
          <Link to="/products?category=women" className="mobile-menu-link">Women</Link>
          <Link to="/products?category=men" className="mobile-menu-link">Men</Link>
          <Link to="/ai-advisor" className="mobile-menu-link">AI Stylist</Link>
          <Link to="/orders" className="mobile-menu-link">Orders</Link>
          {user ? (
            <button
              className="mobile-menu-link"
              onClick={logout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'var(--red)', fontFamily: 'var(--font-display)' }}
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="mobile-menu-link">Sign In</Link>
          )}
        </div>
      )}

      <CartDrawer />
    </>
  );
}
