import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="bg-bg-1 border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="font-display text-2xl italic text-gold block">AURA</Link>
            <p className="text-text-3 text-sm leading-relaxed max-w-xs">
              Luxury fashion, styled by AI. Experience a personalized wardrobe curated specifically for your unique style and body.
            </p>
            <div className="flex gap-5">
              {['Instagram', 'TikTok', 'Pinterest'].map(s => (
                <a key={s} href="#" className="text-text-3 hover:text-gold transition-colors text-xs tracking-[0.2em]">{s.toUpperCase()}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm text-text mb-6 tracking-widest uppercase">SHOP</h4>
            <div className="space-y-3.5">
              {[
                { to: '/products?category=women', label: "Women's Collection" },
                { to: '/products?category=men', label: "Men's Essentials" },
                { to: '/products?category=accessories', label: 'Luxury Accessories' },
                { to: '/products?on_sale=true', label: 'Private Sale' },
                { to: '/products?new_arrivals=true', label: 'New Arrivals' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="block text-sm text-text-3 hover:text-gold transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-sm text-text mb-6 tracking-widest uppercase">ASSISTANCE</h4>
            <div className="space-y-3.5">
              {['FAQ', 'Shipping Information', 'Return Policy', 'Size Guide', 'Contact Us'].map(l => (
                <a key={l} href="#" className="block text-sm text-text-3 hover:text-gold transition-colors">{l}</a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-sm text-text mb-6 tracking-widest uppercase">STAY INFORMED</h4>
            <p className="text-text-3 text-sm mb-6 leading-relaxed">Subscribe to receive exclusive offers and styling tips from AURA.</p>
            {submitted ? (
              <div className="p-3 bg-gold/10 border border-gold/20 rounded">
                <p className="text-gold text-xs tracking-wide">✓ You have been added to our list.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-bg-2 border border-border px-4 py-3 text-[10px] tracking-widest rounded-sm outline-none focus:border-gold/50 transition-colors"
                  />
                  <button
                    onClick={() => { if (email) setSubmitted(true); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gold hover:text-gold-light transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <p className="text-[9px] text-text-3 tracking-wider">By subscribing, you agree to our Privacy Policy.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-3 text-[10px] tracking-widest">© 2025 AURA FASHION. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] tracking-widest text-text-3 hover:text-text transition-colors">PRIVACY POLICY</a>
            <a href="#" className="text-[10px] tracking-widest text-text-3 hover:text-text transition-colors">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
