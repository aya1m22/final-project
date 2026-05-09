import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="bg-bg-1 border-t border-border pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(201,169,110,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          {/* Brand Identity */}
          <div className="space-y-10">
            <Link to="/" className="font-display text-4xl italic text-gold tracking-tighter">AURA</Link>
            <p className="text-text-3 text-sm leading-relaxed max-w-xs font-light tracking-wide italic">
              Transcending the boundaries of fashion with AI-curated elegance and timeless luxury craftsmanship.
            </p>
            <div className="flex gap-8">
              {['Instagram', 'TikTok', 'Pinterest', 'Vogue'].map(s => (
                <a key={s} href="#" className="text-text-3 hover:text-gold transition-all duration-300 text-[10px] tracking-[0.2em] font-black uppercase">{s}</a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-10">
            <h4 className="text-[10px] tracking-[0.5em] text-text font-black uppercase">Collection</h4>
            <div className="space-y-6">
              {[
                { to: '/products?category=women', label: "Women's Collection" },
                { to: '/products?category=men', label: "Men's Collection" },
                { to: '/products?category=accessories', label: 'Bespoke Accessories' },
                { to: '/products?on_sale=true', label: 'Private Sale' },
                { to: '/products?new_arrivals=true', label: 'Signature New' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="block text-sm text-text-3 hover:text-gold transition-all duration-300 font-light tracking-widest">{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] tracking-[0.5em] text-text font-black uppercase">Concierge</h4>
            <div className="space-y-6">
              {['Atelier FAQ', 'Shipping & Delivery', 'Returns Policy', 'Sizing Guidance', 'Connect with AURA'].map(l => (
                <a key={l} href="#" className="block text-sm text-text-3 hover:text-gold transition-all duration-300 font-light tracking-widest">{l}</a>
              ))}
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-10">
            <h4 className="text-[10px] tracking-[0.5em] text-text font-black uppercase">The Inner Circle</h4>
            <p className="text-text-3 text-sm leading-relaxed font-light italic tracking-wide">
              Receive early access to signature drops and exclusive AI styling insights.
            </p>
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-gold text-xs font-black tracking-widest uppercase italic"
              >
                ✦ You have been enrolled.
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="AURA@LUXURY.COM"
                  className="w-full glass border border-border px-6 py-4 text-[10px] tracking-[0.3em] rounded-sm outline-none transition-all focus:border-gold/30 placeholder:text-text-3/30 uppercase font-black"
                />
                <button
                  onClick={() => { if (email) setSubmitted(true); }}
                  className="w-full py-4 text-[10px] tracking-[0.5em] font-black bg-gold text-bg transition-all duration-500 hover:scale-105 shadow-2xl shadow-gold/10 uppercase"
                >
                  Join the Circle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Legal Footer */}
        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <p className="text-text-3 text-[10px] tracking-[0.3em] font-bold uppercase">© 2025 AURA INTERNATIONAL. REFINING LUXURY.</p>
          <div className="flex gap-12">
            <a href="#" className="text-[10px] text-text-3 hover:text-text transition-all duration-300 tracking-[0.3em] font-bold uppercase">Privacy</a>
            <a href="#" className="text-[10px] text-text-3 hover:text-text transition-all duration-300 tracking-[0.3em] font-bold uppercase">Terms</a>
            <a href="#" className="text-[10px] text-text-3 hover:text-text transition-all duration-300 tracking-[0.3em] font-bold uppercase">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
