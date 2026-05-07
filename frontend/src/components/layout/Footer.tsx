import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const footerLinks = {
    shop: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'],
    company: ['About', 'AI Stylist', 'Careers', 'Press', 'Contact'],
    help: ['FAQ', 'Shipping', 'Returns', 'Size Guide', 'Track Order'],
  };

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="font-serif text-2xl tracking-widest text-foreground">FASHIONAI</Link>
            <p className="mt-4 text-foreground-muted text-sm leading-relaxed max-w-sm">
              AI-powered fashion discovery. We combine cutting-edge artificial intelligence with curated style to bring you a shopping experience that's uniquely yours.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-foreground-muted hover:text-accent transition-colors"><Icon size={20} /></a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs tracking-widest text-foreground-secondary uppercase mb-6">{title}</h4>
              <ul className="space-y-3">
                {links.map(name => (
                  <li key={name}><Link to="/" className="text-sm text-foreground-muted hover:text-foreground transition-colors">{name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-border">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs tracking-widest text-accent uppercase mb-2">Join the Inner Circle</p>
            <h3 className="font-serif text-3xl text-foreground mb-4">Be the First to Know</h3>
            <p className="text-foreground-muted text-sm mb-8">Get exclusive access to new arrivals and AI-curated style drops.</p>
            <div className="flex gap-0 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 bg-background-elevated border border-border text-foreground px-6 py-4 text-sm focus:outline-none focus:border-accent placeholder:text-foreground-muted" />
              <button className="bg-accent text-background px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-accent-hover transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground-muted">© 2026 FASHIONAI. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(link => (
              <Link key={link} to="/" className="text-xs text-foreground-muted hover:text-foreground transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
