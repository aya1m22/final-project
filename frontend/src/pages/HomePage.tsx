import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import client from '../api/client';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

interface Product { id: number; name: string; price: string; image_url: string; category_name: string; is_new_arrival: boolean; original_price?: string; is_on_sale?: boolean; rating?: string; review_count?: number; }
interface Category { id: number; name: string; slug: string; image_url: string; product_count: number; }

const CATEGORY_IMAGES: Record<string, string> = {
  women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  men: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80',
  accessories: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

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
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80)' }} 
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg" />
        
        <div className="relative text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p 
              className="text-gold tracking-[0.6em] uppercase text-[10px] mb-8 font-bold"
              initial={{ letterSpacing: '0.2em', opacity: 0 }}
              animate={{ letterSpacing: '0.6em', opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Collection 2025
            </motion.p>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-text leading-[0.85] mb-10 font-light italic">
              The Art of<br />
              <span className="gold-text-gradient">Self Expression</span>
            </h1>
            <p className="text-text-2 text-sm sm:text-base max-w-lg mx-auto mb-14 leading-relaxed tracking-widest opacity-80 font-light">
              Transcending trends with AI-curated elegance. Experience the future of personalized luxury fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/products" className="group relative px-12 py-5 overflow-hidden">
                <span className="relative z-10 text-[10px] tracking-[0.3em] font-bold text-bg uppercase">Explore Collection</span>
                <div className="absolute inset-0 bg-gold transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              <Link to="/ai-stylist" className="group px-12 py-5 border border-gold text-gold transition-all duration-500 hover:bg-gold/5 relative overflow-hidden">
                <span className="relative z-10 text-[10px] tracking-[0.3em] font-bold uppercase">Meet Your Stylist</span>
                <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Animated Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[9px] tracking-[0.4em] text-gold/60 uppercase">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-gold/60 to-transparent relative overflow-hidden">
             <motion.div 
               className="absolute top-0 left-0 w-full h-full bg-gold"
               animate={{ y: ['-100%', '100%'] }}
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
             />
          </div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="py-4 bg-gold shadow-2xl relative z-10">
        <div className="animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8 text-[11px] tracking-[0.4em] font-black text-bg uppercase">
              <span>✦ COMPLIMENTARY WORLDWIDE SHIPPING</span>
              <span>✦ NEW ARRIVALS DROP EVERY FRIDAY</span>
              <span>✦ BESPOKE AI STYLING SESSIONS</span>
              <span>✦ LUXURY QUALITY GUARANTEE</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold tracking-[0.5em] uppercase text-[10px] mb-4 font-bold">The Edit</p>
          <h2 className="font-display text-5xl md:text-6xl text-text font-light italic">Curated Collections</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden group cursor-pointer"
            >
              <Link to={`/products?category=${cat.slug}`} className="block h-full">
                <img
                  src={CATEGORY_IMAGES[cat.slug] || cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-70" />
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-3 font-bold">{cat.product_count} PIECES</p>
                  <h3 className="font-display text-4xl text-white mb-6 italic tracking-tight">{cat.name}</h3>
                  <div className="w-12 h-px bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32 border-t border-border">
        <div className="flex items-end justify-between mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold tracking-[0.5em] uppercase text-[10px] mb-4 font-bold">Latest Drops</p>
            <h2 className="font-display text-5xl text-text font-light italic">Signature Arrivals</h2>
          </motion.div>
          <Link to="/products" className="group text-text-2 text-[10px] tracking-[0.3em] uppercase flex items-center gap-4 hover:text-gold transition-all duration-300">
            View All Pieces
            <span className="w-8 h-px bg-text-2 group-hover:bg-gold group-hover:w-16 transition-all duration-500" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-bg-2 rounded-sm" />
                <div className="h-4 bg-bg-2 w-3/4" />
                <div className="h-4 bg-bg-2 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}
      </section>

      {/* ═══ AI BANNER ═══ */}
      <section className="py-40 bg-bg-1 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,110,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-gold tracking-[0.5em] uppercase text-[10px] font-bold">The Future of Styling</p>
                <h2 className="font-display text-6xl text-text font-light italic leading-[1.1]">
                  Personalized <br />
                  <span className="gold-text-gradient">By Intellect</span>
                </h2>
              </div>
              <p className="text-text-3 text-lg leading-relaxed max-w-md font-light tracking-wide italic">
                AURA is not just an advisor; it's a deep understanding of your silhouette, your lifestyle, and your unique aesthetic fingerprint.
              </p>
              <Link to="/ai-stylist" className="inline-flex items-center gap-6 group">
                <div className="px-12 py-5 bg-gold text-bg text-[10px] tracking-[0.3em] font-bold uppercase transition-all duration-500 group-hover:scale-105 shadow-2xl shadow-gold/20">
                  Begin Styling Session
                </div>
                <div className="w-12 h-px bg-gold transition-all duration-500 group-hover:w-20" />
              </Link>
            </div>
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
              <motion.img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" 
                alt="AI Styling" 
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
              />
              <div className="absolute inset-0 glass-gold opacity-20" />
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
