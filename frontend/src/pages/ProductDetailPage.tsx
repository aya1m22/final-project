import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import ProductCard from '../components/ui/ProductCard';

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
  const addToCart = useCartStore(s => s.addToCart);
  const addToast = useToastStore(s => s.addToast);

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

  if (loading) return <div className="pt-28 flex justify-center"><div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid var(--color-border)', borderTopColor: 'var(--color-gold)' }} /></div>;
  if (!product) return <div className="pt-28 text-center text-text-2">Product not found.</div>;

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex gap-2 text-xs text-text-3">
          <Link to="/" className="hover:text-text transition-colors">Home</Link><span>/</span>
          <Link to="/products" className="hover:text-text transition-colors">Shop</Link><span>/</span>
          <span className="text-text-2">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="aspect-[3/4] rounded-md overflow-hidden" style={{ background: 'var(--color-bg-2)' }}>
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-gold tracking-[0.3em] uppercase text-[11px] mb-2">{product.category_name}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-text font-light mb-3">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{[1,2,3,4,5].map(s => <svg key={s} className={`w-4 h-4 ${s <= Math.round(parseFloat(product.rating!)) ? 'text-gold' : 'text-text-3'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                {product.review_count && <span className="text-xs text-text-3">({product.review_count} reviews)</span>}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-2xl text-gold">${parseFloat(product.price).toFixed(2)}</span>
              {product.original_price && <span className="text-text-3 line-through text-sm">${parseFloat(product.original_price).toFixed(2)}</span>}
            </div>

            <div className="h-px mb-6" style={{ background: 'var(--color-border)' }} />

            {/* Size */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <label className="text-xs tracking-wider text-text-2 mb-2 block uppercase">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 text-sm rounded-sm transition-all ${selectedSize === s ? 'text-bg' : 'text-text-2 hover:text-text'}`}
                      style={{ background: selectedSize === s ? 'var(--color-gold)' : 'transparent', border: `1px solid ${selectedSize === s ? 'var(--color-gold)' : 'var(--color-border)'}` }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="text-xs tracking-wider text-text-2 mb-2 block uppercase">Color: <span className="text-text capitalize">{selectedColor}</span></label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 text-sm rounded-sm transition-all capitalize ${selectedColor === c ? 'text-bg' : 'text-text-2 hover:text-text'}`}
                      style={{ background: selectedColor === c ? 'var(--color-gold)' : 'transparent', border: `1px solid ${selectedColor === c ? 'var(--color-gold)' : 'var(--color-border)'}` }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button onClick={handleAdd} className="w-full py-3.5 text-[13px] tracking-[0.15em] font-medium rounded-sm mb-3 transition-all hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
              ADD TO BAG
            </button>

            {/* AI Button */}
            <Link to="/ai-stylist" className="w-full py-3 text-center text-[13px] tracking-wider rounded-sm transition-all hover:bg-gold/10 block" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-2)' }}>
              ✨ Ask AI Stylist About This
            </Link>

            <div className="h-px my-6" style={{ background: 'var(--color-border)' }} />

            {/* Accordion tabs */}
            {[
              { key: 'description', label: 'Description', content: product.description },
              { key: 'shipping', label: 'Shipping & Returns', content: 'Free shipping on orders over $49. Easy 30-day returns. Items must be unworn with tags attached.' },
            ].map(tab => (
              <div key={tab.key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)} className="w-full flex justify-between items-center py-3 text-sm text-text-2 hover:text-text transition-colors">
                  <span>{tab.label}</span>
                  <span className="text-text-3">{activeTab === tab.key ? '−' : '+'}</span>
                </button>
                {activeTab === tab.key && <p className="text-sm text-text-3 pb-4 leading-relaxed">{tab.content}</p>}
              </div>
            ))}

            <p className="text-xs text-green mt-4">✓ In stock ({product.stock} available)</p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12" style={{ borderTop: '1px solid var(--color-border)' }}>
            <h2 className="font-display text-2xl text-text font-light mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
