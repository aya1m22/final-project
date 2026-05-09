import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [activeTab, setActiveTab] = useState<string | null>('description');
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
      return client.get('/products/', { params: { category: r.data.category_name?.toLowerCase() } });
    }).then(r => {
      setRelated((r.data.results || r.data).filter((p: any) => p.id !== Number(id)).slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, 1, selectedSize, selectedColor);
      addToast('Added to bag!', 'success');
    } catch { addToast('Please sign in first', 'error'); }
  };

  if (loading) return <div className="pt-40 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-border border-t-gold animate-spin" /></div>;
  if (!product) return <div className="pt-40 text-center text-text-3 font-display italic text-2xl">Piece not found.</div>;

  return (
    <PageTransition>
      <div className="pt-24 pb-32">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex gap-3 text-[10px] tracking-[0.2em] text-text-3 uppercase">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-2">{product.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* MISSING 8: Product Gallery */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 order-2 md:order-1">
                {[product.image_url, product.image_url, product.image_url].map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveThumb(i)}
                    className={`w-20 h-24 rounded-sm overflow-hidden border transition-all ${activeThumb === i ? 'border-gold' : 'border-border opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" style={{ objectPosition: i === 1 ? 'top' : i === 2 ? 'bottom' : 'center' }} />
                  </button>
                ))}
              </div>
              <div className="flex-1 aspect-[3/4] rounded-sm overflow-hidden bg-bg-2 order-1 md:order-2">
                <motion.img 
                  key={activeThumb}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                  style={{ objectPosition: activeThumb === 1 ? 'top' : activeThumb === 2 ? 'bottom' : 'center' }}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-5 py-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gold tracking-[0.4em] uppercase text-[10px] mb-2 font-bold">{product.category_name}</p>
                  <h1 className="font-display text-4xl text-text font-light italic leading-tight">{product.name}</h1>
                </div>
                <button 
                  onClick={() => toggle(product.id)}
                  className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${isWishlisted ? 'bg-gold border-gold text-bg' : 'text-text-3 hover:text-gold hover:border-gold'}`}
                >
                  <svg className={`w-5 h-5 ${isWishlisted ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-3xl text-gold">${parseFloat(product.price).toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-text-3 line-through text-lg opacity-60">${parseFloat(product.original_price).toFixed(2)}</span>
                )}
                {product.is_on_sale && (
                  <span className="bg-red text-white text-[9px] px-2 py-1 tracking-widest font-bold rounded-xs">SALE</span>
                )}
              </div>

              <div className="h-px bg-border mb-8" />

              {/* Options */}
              <div className="space-y-8 mb-10">
                {product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] tracking-[0.2em] text-text uppercase font-bold">Select Size</label>
                      <button className="text-[9px] tracking-[0.1em] text-text-3 border-b border-border pb-0.5 hover:text-gold transition-colors">SIZE GUIDE</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(s => (
                        <button 
                          key={s} 
                          onClick={() => setSelectedSize(s)} 
                          className={`w-12 h-12 text-xs tracking-widest transition-all rounded-sm border ${selectedSize === s ? 'bg-gold border-gold text-bg font-bold' : 'border-border text-text-3 hover:border-gold/50'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors.length > 0 && (
                  <div>
                    <label className="text-[10px] tracking-[0.2em] text-text uppercase font-bold mb-4 block">Color: <span className="text-text-2 font-normal ml-1">{selectedColor}</span></label>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(c => (
                        <button 
                          key={c} 
                          onClick={() => setSelectedColor(c)} 
                          className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${selectedColor === c ? 'border-gold' : 'border-transparent'}`}
                        >
                          <div className="w-full h-full rounded-full border border-black/10" style={{ background: c.toLowerCase() === 'white' ? '#fff' : c.toLowerCase() === 'black' ? '#000' : c }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-10">
                <button 
                  onClick={handleAdd} 
                  className="w-full py-5 text-[11px] tracking-[0.3em] font-bold bg-gold text-bg rounded-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gold/10"
                >
                  ADD TO SHOPPING BAG
                </button>

                {/* BUG 3 FIX: Ask AI Button */}
                <Link
                  to={`/ai-stylist?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                  className="w-full flex items-center justify-center gap-3 py-4 text-[10px] tracking-[0.2em] rounded-sm border border-border text-text-2 hover:border-gold/50 hover:text-gold transition-all"
                >
                  <span className="text-gold text-sm">✦</span>
                  ASK AURA IF THIS SUITS YOU
                </Link>
              </div>

              {/* Details Accordion */}
              <div className="border-t border-border">
                {[
                  { key: 'description', label: 'THE DESCRIPTION', content: product.description },
                  { key: 'shipping', label: 'SHIPPING & RETURNS', content: 'Enjoy complimentary express shipping on all orders over $49. Returns are accepted within 30 days of delivery in original condition.' },
                  { key: 'details', label: 'PRODUCT DETAILS', content: `Composition: 100% Premium Material. Item ID: ${product.id}. Made in Italy.` },
                ].map(tab => (
                  <div key={tab.key} className="border-b border-border">
                    <button 
                      onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)} 
                      className="w-full flex justify-between items-center py-5 text-[10px] tracking-[0.2em] font-bold text-text hover:text-gold transition-colors"
                    >
                      <span>{tab.label}</span>
                      <span className="text-lg font-light">{activeTab === tab.key ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence>
                      {activeTab === tab.key && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-text-3 pb-6 leading-relaxed italic">{tab.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Section */}
          {related.length > 0 && (
            <div className="mt-32 pt-20 border-t border-border">
              <h2 className="font-display text-4xl text-text font-light italic mb-12">You May Also Admire</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {related.map(p => <ProductCard key={p.id} {...p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
