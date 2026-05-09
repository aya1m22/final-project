import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import ProductCard from '../components/ui/ProductCard';

interface Product { id: number; name: string; price: string; image_url: string; category_name: string; sizes: string[]; colors: string[]; is_new_arrival: boolean; original_price?: string; is_on_sale?: boolean; rating?: string; review_count?: number; }
interface Category { id: number; name: string; slug: string; image_url: string; product_count: number; }

const CATEGORY_IMAGES: Record<string, string> = {
  women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  men: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80',
  accessories: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          client.get('/products/', { params: { page_size: 8 } }),
          client.get('/products/categories/'),
        ]);
        setProducts((pRes.data.results || pRes.data).slice(0, 8));
        setCategories(cRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.75) 100%)' }} />
        <div className="relative text-center px-4 max-w-3xl animate-fade-in-up">
          <p className="text-gold tracking-[0.4em] uppercase text-[11px] mb-6">New Season 2025</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text leading-[0.95] mb-6 font-light italic">
            Dress the Way<br />
            <span className="text-gold">You Were Meant To</span>
          </h1>
          <p className="text-text-2 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Your AI stylist. Your style. Your rules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-8 py-3.5 text-[12px] tracking-[0.2em] font-medium rounded-sm transition-all duration-300 hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
              EXPLORE COLLECTION
            </Link>
            <Link to="/ai-stylist" className="px-8 py-3.5 text-[12px] tracking-[0.2em] rounded-sm transition-all duration-300 hover:bg-gold/10" style={{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
              MEET YOUR AI STYLIST
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* ═══ MARQUEE ANNOUNCEMENT ═══ */}
      <div className="py-3 overflow-hidden" style={{ background: 'var(--color-gold)' }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-4 whitespace-nowrap text-[12px] tracking-wider font-medium" style={{ color: 'var(--color-bg)' }}>
              <span>✦ NEW ARRIVALS EVERY FRIDAY</span>
              <span>✦ FREE SHIPPING OVER $49</span>
              <span>✦ AI STYLING NOW LIVE</span>
              <span>✦ EASY 30-DAY RETURNS</span>
              <span>✦ NEW ARRIVALS EVERY FRIDAY</span>
              <span>✦ FREE SHIPPING OVER $49</span>
              <span>✦ AI STYLING NOW LIVE</span>
              <span>✦ EASY 30-DAY RETURNS</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ SHOP BY CATEGORY ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-text font-light">Shop the Edit</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-md">
              <img
                src={CATEGORY_IMAGES[cat.slug] || cat.image_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-display text-2xl text-white mb-1">{cat.name}</h3>
                <p className="text-white/50 text-sm mb-3">{cat.product_count} pieces</p>
                <span className="text-gold text-sm tracking-wide group-hover:translate-x-2 transition-transform duration-300 inline-block">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold tracking-[0.3em] uppercase text-[11px] mb-2">Fresh Picks</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text font-light">New Arrivals</h2>
          </div>
          <Link to="/products" className="text-text-2 text-sm hover:text-gold transition-colors gold-underline hidden sm:block">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i}><div className="aspect-[3/4] rounded-md animate-shimmer" /><div className="h-3 w-3/4 mt-3 rounded animate-shimmer" /><div className="h-3 w-1/3 mt-2 rounded animate-shimmer" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.slice(0, 8).map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}
      </section>

      {/* ═══ AI STYLIST BANNER ═══ */}
      <section className="py-20" style={{ background: 'var(--color-bg-1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg overflow-hidden flex flex-col md:flex-row" style={{ border: '1px solid var(--color-gold)', background: 'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)' }}>
            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
              <p className="text-gold tracking-[0.3em] uppercase text-[11px] mb-4">AI-Powered</p>
              <h2 className="font-display text-3xl sm:text-4xl text-text font-light italic mb-4">
                Your Personal<br />AI Stylist
              </h2>
              <p className="text-text-2 text-sm leading-relaxed mb-8 max-w-md">
                Upload a photo and our AI analyzes your skin tone, body shape, and personal style to recommend outfits from our collection that are made for you.
              </p>
              <Link to="/ai-stylist" className="inline-block px-8 py-3 text-[12px] tracking-[0.2em] font-medium rounded-sm transition-all hover:opacity-90 self-start" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                TRY AI STYLING FREE
              </Link>
            </div>
            <div className="flex-1 relative min-h-[300px] md:min-h-0">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" alt="AI Stylist" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg-1/80 md:from-bg-1/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE AURA PROMISE ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $49' },
            { icon: '🔄', title: 'Easy Returns', desc: '30-day free returns' },
            { icon: '✨', title: 'AI Styled', desc: 'Personalized for you' },
            { icon: '🔒', title: 'Secure Payment', desc: '256-bit SSL encryption' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h4 className="font-display text-base text-text mb-1">{item.title}</h4>
              <p className="text-text-3 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
