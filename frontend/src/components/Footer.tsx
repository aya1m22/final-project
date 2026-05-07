import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Heart, Star } from 'lucide-react';

const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'Women', to: '/products?category=women' },
      { label: 'Men', to: '/products?category=men' },
      { label: 'Kids', to: '/products?category=kids' },
      { label: 'Accessories', to: '/products?category=accessories' },
      { label: 'Beauty', to: '/products?category=beauty' },
      { label: 'Sale', to: '/products?category=sale' },
    ],
  },
  {
    title: 'AI Features',
    links: [
      { label: 'Style Advisor', to: '/ai-advisor' },
      { label: 'Occasion Builder', to: '/ai-advisor' },
      { label: 'Virtual Try-On', to: '/ai-advisor' },
      { label: 'Trend Forecast', to: '/ai-advisor' },
      { label: 'Color Analysis', to: '/ai-advisor' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Size Guide', to: '/support' },
      { label: 'Shipping & Returns', to: '/support' },
      { label: 'FAQ', to: '/support' },
      { label: 'Contact Us', to: '/support' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

const featuredItems = [
  {
    name: 'Court Sneaker',
    to: '/products?category=men',
    image:
      'https://images.unsplash.com/photo-1519741495232-6b3f5de3c1c9?auto=format&fit=crop&w=900&q=80',
    alt: 'Minimal white court sneaker',
  },
  {
    name: 'Silk Slip Dress',
    to: '/products?category=women',
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    alt: 'Elegant silk slip dress on model',
  },
  {
    name: 'Leather Tote',
    to: '/products?category=accessories',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    alt: 'Leather tote bag with gold hardware',
  },
  {
    name: 'Wool Coat',
    to: '/products?category=women',
    image:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80',
    alt: 'Tailored wool coat on chair',
  },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">FASHION<span>AI</span></div>
          <p className="footer-desc">
            Discover a premium shopping experience with fashion intelligence, style stories, and curated outfit inspiration.
          </p>
          <div className="footer-social">
            {[
              { icon: <Globe size={16} />, label: 'Website' },
              { icon: <Heart size={16} />, label: 'Favorites' },
              { icon: <Star size={16} />, label: 'Reviews' },
              { icon: <Mail size={16} />, label: 'Email' },
            ].map((s) => (
              <button key={s.label} className="social-btn" aria-label={s.label} type="button">
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-featured">
          <div className="footer-featured-head">
            <div>
              <div className="footer-featured-label">Featured items</div>
              <h3 className="footer-featured-title">Real products with polished detail.</h3>
            </div>
          </div>
          <div className="footer-featured-grid">
            {featuredItems.map((item) => (
              <Link key={item.name} to={item.to} className="footer-card">
                <img src={item.image} alt={item.alt} className="footer-card-img" />
                <div className="footer-card-meta">
                  <span className="footer-card-name">{item.name}</span>
                  <span className="footer-card-tag">Shop the look</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-column-group">
          {footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <div className="footer-col-title">{column.title}</div>
              {column.links.map((link) => (
                <Link key={link.label} to={link.to} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-newsletter">
          <div className="footer-col-title">Stay in the loop</div>
          <p className="footer-newsletter-copy">
            Receive weekly styling tips, new arrivals, and exclusive offers designed for modern wardrobes.
          </p>
          <form className="footer-newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email" className="footer-newsletter-input" />
            <button type="submit" className="footer-newsletter-button">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FashionAI. All rights reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
          <Link to="/terms" className="footer-bottom-link">Terms</Link>
          <Link to="/cookies" className="footer-bottom-link">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
