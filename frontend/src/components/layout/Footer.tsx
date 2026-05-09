import { Link } from 'react-router-dom';

const SHOP_LINKS = [
  { to: '/products?category=women', label: 'Women' },
  { to: '/products?category=men', label: 'Men' },
  { to: '/products?category=accessories', label: 'Accessories' },
  { to: '/products', label: 'New Arrivals' },
];

const COMPANY_LINKS = [
  { to: '#', label: 'About' },
  { to: '#', label: 'Careers' },
  { to: '#', label: 'Sustainability' },
  { to: '#', label: 'Press' },
];

const HELP_LINKS = [
  { to: '#', label: 'FAQ' },
  { to: '#', label: 'Shipping' },
  { to: '#', label: 'Returns' },
  { to: '#', label: 'Size Guide' },
  { to: '#', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-bg-1)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-2xl italic text-gold">AURA</Link>
            <p className="text-text-2 text-sm mt-3 leading-relaxed">
              AI-powered luxury fashion.<br />Your personal stylist, available 24/7.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-5">
              {['Instagram', 'TikTok', 'Pinterest'].map((name) => (
                <a key={name} href="#" className="text-text-3 hover:text-gold transition-colors text-xs tracking-wider">
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg text-text mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-text-2 hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-lg text-text mb-4">Help</h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-text-2 hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg text-text mb-4">Stay in Touch</h4>
            <p className="text-sm text-text-2 mb-4">Subscribe for exclusive offers and style updates.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm rounded-l-md outline-none"
                style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRight: 'none' }}
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-r-md transition-colors"
                style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--color-border)' }} className="py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-3">© 2025 AURA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-text-3 hover:text-text-2 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-text-3 hover:text-text-2 transition-colors">Terms</a>
            <a href="#" className="text-xs text-text-3 hover:text-text-2 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
