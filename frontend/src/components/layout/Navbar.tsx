import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SHOP', path: '/shop' },
    { name: 'AI STYLIST', path: '/ai-stylist' },
    { name: 'COLLECTIONS', path: '/shop' },
    { name: 'ABOUT', path: '/' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-widest text-foreground hover:text-accent transition-colors">
          FASHIONAI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className={`text-xs tracking-widest transition-colors ${location.pathname === link.path ? 'text-accent' : 'text-foreground-secondary hover:text-foreground'}`}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-foreground hover:text-accent transition-colors"><Search size={20} /></button>
          <Link to="/" className="text-foreground hover:text-accent transition-colors relative"><Heart size={20} /></Link>
          <button onClick={openCart} className="text-foreground hover:text-accent transition-colors relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{itemCount}</span>
            )}
          </button>
          {user ? (
            <button onClick={logout} className="text-xs tracking-widest text-foreground-secondary hover:text-foreground transition-colors hidden md:block">LOGOUT</button>
          ) : (
            <Link to="/login" className="text-xs tracking-widest text-foreground-secondary hover:text-foreground transition-colors hidden md:block">LOGIN</Link>
          )}
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border">
          <div className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest text-foreground">{link.name}</Link>
            ))}
            {user ? <button onClick={logout} className="text-sm tracking-widest text-foreground-secondary text-left">LOGOUT</button> : <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest text-foreground-secondary">LOGIN</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}
