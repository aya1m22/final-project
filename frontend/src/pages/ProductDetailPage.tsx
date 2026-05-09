import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

interface Product {
  id: number; name: string; description: string; price: string; image_url: string;
  category: number; category_name: string; sizes: string[]; colors: string[];
  stock: number; is_featured: boolean; is_new_arrival: boolean;
  original_price?: string; is_on_sale?: boolean; rating?: string; review_count?: number;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>('details');
  const [activeThumb, setActiveThumb] = useState(0);

  const addToCart = useCartStore(s => s.addToCart);
  const addToast = useToastStore(s => s.addToast);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(Number(id));

  useEffect(() => {
    setLoading(true);
    client.get(`/products/${id}/`).then(r => {
      setProduct(r.data);
      setSelectedSize(r.data.sizes?.[0] || '');
      setSelectedColor(r.data.colors?.[0] || '');
      return client.get('/products/', { params: { category: r.data.category_name?.toLowerCase(), page_size: 4 } });
    }).then(r => {
      setRelated((r.data.results || r.data).filter((p: any) => p.id !== Number(id)).slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, 1, selectedSize, selectedColor);
      addToast('Piece added to bag', 'success');
    } catch { addToast('Authentication required', 'error'); }
  };

  if (loading) return <div className="pt-40 flex justify-center"><div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="pt-40 text-center font-display italic text-3xl opacity-40">Piece not found.</div>;

  return (
    <PageTransition>
      <div className="pt-40 pb-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* MISSING 8: Product Gallery */}
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-bg-2 border border-border relative">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeThumb}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                    style={{ objectPosition: activeThumb === 1 ? 'top' : activeThumb === 2 ? 'bottom' : 'center' }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/5" />
              </div>
              <div className="flex gap-4">
                {[product.image_url, product.image_url, product.image_url].map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveThumb(i)}
                    className={`w-28 h-36 rounded-sm overflow-hidden border-2 transition-all duration-500 ${activeThumb === i ? 'border-gold' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" style={{ objectPosition: i === 1 ? 'top' : i === 2 ? 'bottom' : 'center' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-5 py-4">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <p className="text-gold tracking-[0.6em] uppercase text-[10px] font-bold italic">{product.category_name}</p>
                  <h1 className="font-display text-6xl text-text font-light italic leading-[0.9] tracking-tight">{product.name}</h1>
                </div>
                <button 
                  onClick={() => { toggle(product.id); addToast(isWishlisted ? 'Removed' : 'Saved', 'info'); }}
                  className={`w-14 h-14 rounded-full border border-border flex items-center justify-center transition-all duration-500 hover:scale-110 shadow-2xl ${isWishlisted ? 'bg-gold border-gold text-bg' : 'text-text-3 hover:text-gold hover:border-gold/30'}`}
                >
                  <svg className={`w-6 h-6 ${isWishlisted ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-6 mb-12">
                <span className="font-display text-4xl text-gold font-bold">${parseFloat(product.price).toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-text-3 line-through text-xl opacity-30 italic">${parseFloat(product.original_price).toFixed(2)}</span>
                )}
                {product.is_on_sale && (
                  <span className="bg-red text-white text-[9px] px-3 py-1 tracking-[0.4em] font-black uppercase shadow-xl">Exclusive Sale</span>
                )}
              </div>

              <div className="h-px bg-white/5 mb-12" />

              <div className="space-y-12 mb-16">
                {/* Size Selection */}
                {product.sizes.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center uppercase tracking-widest text-[10px] font-bold">
                      <label className="text-text">Select Silhouette</label>
                      <button className="text-gold/60 border-b border-gold/20 pb-1">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.sizes.map(s => (
                        <button 
                          key={s} 
                          onClick={() => setSelectedSize(s)} 
                          className={`w-14 h-14 text-xs tracking-widest transition-all duration-500 rounded-sm border ${selectedSize === s ? 'bg-gold border-gold text-bg font-black scale-105' : 'border-border text-text-3 hover:border-gold/30'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="space-y-6">
                    <label className="text-[10px] tracking-[0.4em] text-text uppercase font-bold">Aesthetic: <span className="text-gold italic ml-2">{selectedColor}</span></label>
                    <div className="flex flex-wrap gap-5">
                      {product.colors.map(c => (
                        <button 
                          key={c} 
                          onClick={() => setSelectedColor(c)} 
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-500 p-1 flex items-center justify-center ${selectedColor === c ? 'border-gold' : 'border-transparent'}`}
                        >
                          <div className="w-full h-full rounded-full border border-white/10" style={{ background: c.toLowerCase() === 'white' ? '#fff' : c.toLowerCase() === 'black' ? '#000' : c }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-16">
                <button 
                  onClick={handleAdd} 
                  className="w-full py-6 text-[11px] tracking-[0.5em] font-black bg-gold text-bg transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-3xl shadow-gold/20 uppercase"
                >
                  Acquire Piece
                </button>

                {/* BUG 3: AI Button */}
                <Link
                  to={`/ai-stylist?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                  className="w-full flex items-center justify-center gap-4 py-5 text-[10px] tracking-[0.4em] glass border border-gold/20 text-gold transition-all duration-500 hover:border-gold hover:bg-gold/5 uppercase font-black"
                >
                  <span className="text-lg">✦</span>
                  Consult AURA Stylist
                </Link>
              </div>

              <div className="border-t border-white/5">
                {[
                  { key: 'details', label: 'Artistry & Origin', content: product.description },
                  { key: 'shipping', label: 'Delivery & Return', content: 'Complimentary premium shipping on orders exceeding $49. 30-day effortless returns in original condition.' },
                  { key: 'composition', label: 'Bespoke Details', content: `Mastercrafted Item ID: ${product.id}. Composition: 100% Sourced Italian Material.` },
                ].map(tab => (
                  <div key={tab.key} className="border-b border-white/5">
                    <button 
                      onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)} 
                      className="w-full flex justify-between items-center py-6 text-[10px] tracking-[0.4em] font-black text-text hover:text-gold transition-all uppercase"
                    >
                      <span>{tab.label}</span>
                      <span className="text-xl font-light">{activeTab === tab.key ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence>
                      {activeTab === tab.key && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-text-3 pb-8 leading-relaxed italic font-light tracking-wide">{tab.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Selections */}
          {related.length > 0 && (
            <div className="mt-40 pt-40 border-t border-white/5">
              <div className="flex flex-col items-center text-center mb-24">
                 <p className="text-gold tracking-[0.5em] uppercase text-[10px] mb-6 font-bold">Curated Complement</p>
                 <h2 className="font-display text-6xl text-text font-light italic">You May Also Admire</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                {related.map(p => <ProductCard key={p.id} {...p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
