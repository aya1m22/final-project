import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const featuredProducts = [
  { id: 1, name: "Oversized Wool Blend Coat", brand: "Acne Studios", price: 1250.00, originalPrice: null, images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"], colors: ["#2C2C2C", "#8B7355", "#000000"], isNew: true, discount: 0, sizes: '["XS","S","M","L","XL"]' },
  { id: 4, name: "Structured Leather Handbag", brand: "Bottega Veneta", price: 3200.00, originalPrice: null, images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"], colors: ["#2C2C2C", "#8B7355", "#FFFFFF"], isNew: true, discount: 0, sizes: '[]' },
  { id: 7, name: "Silk Midi Slip Dress", brand: "Saint Laurent", price: 2290.00, originalPrice: null, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"], colors: ["#000000", "#8B0000", "#F5F5DC"], isNew: true, discount: 0, sizes: '["XS","S","M","L","XL"]' },
];

const collections = [
  { name: "The Minimalist Edit", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", size: "large" },
  { name: "Evening Essentials", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800", size: "small" },
  { name: "Streetwear Now", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800", size: "small" },
];

export default function Home() {
  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920" alt="Fashion" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-xs tracking-[0.3em] text-accent uppercase mb-6">The Future of Fashion</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6">Style, Reimagined by AI</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">Discover outfits curated by intelligent algorithms that understand your unique aesthetic.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary">Explore the Collection</Link>
            <Link to="/ai-stylist" className="btn-secondary flex items-center justify-center gap-2"><Sparkles size={16} />Meet Your AI Stylist</Link>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"><div className="w-1 h-2 bg-white/60 rounded-full" /></div>
        </motion.div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">Curated Collections</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-12">Shop by Edit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-[4/5] md:aspect-auto md:row-span-2 group overflow-hidden">
              <img src={collections[0].image} alt={collections[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-serif text-3xl text-white mb-2">{collections[0].name}</h3>
                <Link to="/shop" className="text-white text-sm tracking-widest uppercase flex items-center gap-2 hover:text-accent transition-colors">Shop Now <ArrowRight size={16} /></Link>
              </div>
            </div>
            {collections.slice(1).map((c, i) => (
              <div key={i} className="relative aspect-[16/9] group overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-2xl text-white mb-2">{c.name}</h3>
                  <Link to="/shop" className="text-white text-sm tracking-widest uppercase flex items-center gap-2 hover:text-accent transition-colors">Shop Now <ArrowRight size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">AI-Powered</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Your Personal AI Stylist</h2>
            <p className="text-foreground-secondary leading-relaxed mb-8">Upload a photo, describe an occasion, or take our style quiz. Our AI analyzes thousands of variables to create looks that are uniquely you.</p>
            <ul className="space-y-4 mb-8">
              {['Outfit recommendations in seconds', 'Complete the look suggestions', 'Trend forecasting personalized to you'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground-secondary"><div className="w-1.5 h-1.5 bg-accent rounded-full" />{f}</li>
              ))}
            </ul>
            <Link to="/ai-stylist" className="btn-primary inline-flex items-center gap-2"><Sparkles size={16} />Try the AI Stylist</Link>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] bg-background-elevated rounded-sm overflow-hidden">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800" alt="AI Stylist" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background border border-border p-6 max-w-xs">
              <p className="text-xs text-foreground-muted uppercase tracking-widest mb-2">AI Suggestion</p>
              <p className="text-sm text-foreground">"Based on your style profile, this oversized coat pairs perfectly with wide-leg trousers."</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">New Arrivals</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Trending Now</h2>
            </div>
            <Link to="/shop" className="text-sm tracking-widest uppercase text-foreground-secondary hover:text-foreground transition-colors hidden md:block">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">Join the Inner Circle</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Be the First to Know</h2>
          <p className="text-foreground-secondary mb-8">Get exclusive access to new arrivals and AI-curated style drops.</p>
          <div className="flex gap-0 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-background-elevated border border-border text-foreground px-6 py-4 text-sm focus:outline-none focus:border-accent placeholder:text-foreground-muted" />
            <button className="bg-accent text-background px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-accent-hover transition-colors">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
