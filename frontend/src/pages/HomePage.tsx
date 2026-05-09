import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../api/client';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

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
    <PageTransition>
      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg" />
        
        <motion.div 
          className="relative text-center px-4 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p 
            className="text-gold tracking-[0.5em] uppercase text-[10px] mb-8 font-medium"
            initial={{ opacity: 0, tracking: '0.2em' }}
            animate={{ opacity: 1, tracking: '0.5em' }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Spring / Summer 2025
          </motion.p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text leading-[0.95] mb-8 font-light italic">
            Dress the Way<br />
            <span className="text-gold">You Were Meant To</span>
          </h1>
          <p className="text-text-2 text-sm sm:text-base max-w-md mx-auto mb-12 leading-relaxed tracking-wide">
            Your personal AI stylist is here. Discover pieces curated specifically for your unique silhouette.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/products" className="w-full sm:w-auto px-10 py-4 text-[11px] tracking-[0.25em] font-medium rounded-sm bg-gold text-bg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gold/10">
              EXPLORE COLLECTION
            </Link>
            <Link to="/ai-stylist" className="w-full sm:w-auto px-10 py-4 text-[11px] tracking-[0.25em] rounded-sm border border-gold text-gold transition-all hover:bg-gold/5 active:scale-95">
              MEET YOUR STYLIST
            </Link>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="py-3.5 bg-gold overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5 text-[11px] tracking-[0.3em] font-bold text-bg">
              <span>✦ COMPLIMENTARY SHIPPING OVER $49</span>
              <span>✦ NEW ARRIVALS EVERY FRIDAY</span>
              <span>✦ EXPERIENCE AI STYLING</span>
              <span>✦ 30-DAY LUXURY GUARANTEE</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold tracking-[0.3em] uppercase text-[10px] mb-2">Curated Edits</p>
          <h2 className="font-display text-4xl text-text font-light italic">Shop the Collection</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/products?category=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-sm block">
                <img
                  src={CATEGORY_IMAGES[cat.slug] || cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">{cat.product_count} PIECES</p>
                  <h3 className="font-display text-3xl text-white mb-4 italic">{cat.name}</h3>
                  <span className="text-white text-[10px] tracking-[0.2em] uppercase border-b border-white/30 pb-1 group-hover:border-gold group-hover:text-gold transition-colors">
                    Explore Now →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold tracking-[0.3em] uppercase text-[10px] mb-2">Fresh Arrivals</p>
            <h2 className="font-display text-4xl text-text font-light italic">The Latest Additions</h2>
          </motion.div>
          <Link to="/products" className="text-text-2 text-[10px] tracking-[0.2em] hover:text-gold transition-colors uppercase border-b border-border pb-1">
            View Collection →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-bg-2 rounded-sm mb-4" /><div className="h-4 bg-bg-2 w-3/4 mb-2" /><div className="h-4 bg-bg-2 w-1/4" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}
      </section>

      {/* ═══ AI BANNER ═══ */}
      <section className="py-24 bg-bg-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="relative rounded-sm overflow-hidden flex flex-col md:flex-row border border-gold/20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-1 p-10 sm:p-16 flex flex-col justify-center relative z-10 bg-bg-1">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(201,169,110,0.08),transparent_50%)]" />
              <p className="text-gold tracking-[0.4em] uppercase text-[10px] mb-6 font-medium">Elevate Your Experience</p>
              <h2 className="font-display text-4xl sm:text-5xl text-text font-light italic mb-6 leading-tight">
                Artificial Intelligence,<br />Personalized Elegance
              </h2>
              <p className="text-text-3 text-sm leading-relaxed mb-10 max-w-md">
                Our proprietary AI analyzes your aesthetic preferences and body type to recommend a wardrobe that feels like it was designed specifically for you.
              </p>
              <Link to="/ai-stylist" className="inline-block px-10 py-4 text-[11px] tracking-[0.25em] bg-gold text-bg rounded-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/20 self-start uppercase">
                Start Styling Session
              </Link>
            </div>
            <div className="flex-1 relative min-h-[400px] md:min-h-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" alt="AI Styling" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg-1 via-transparent to-transparent hidden md:block" />
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
