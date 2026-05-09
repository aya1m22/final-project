import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

interface Product { id: number; name: string; price: string; image_url: string; category_name: string; sizes: string[]; colors: string[]; is_new_arrival: boolean; original_price?: string; is_on_sale?: boolean; rating?: string; review_count?: number; }
interface Category { id: number; name: string; slug: string; product_count: number; }

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-created_at';
  const page = searchParams.get('page') || '1';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const onSale = searchParams.get('on_sale') === 'true';

  useEffect(() => {
    client.get('/products/categories/').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page, sort };
    if (category) params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (onSale) params.on_sale = 'true';

    client.get('/products/', { params })
      .then(r => { 
        setProducts(r.data.results || r.data); 
        setTotalCount(r.data.count || 0); 
        setNextPage(r.data.next); 
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, sort, page, minPrice, maxPrice, onSale]);

  const setFilter = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams);
    val ? p.set(key, val) : p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleLoadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPageNum = parseInt(page) + 1;
      const params = Object.fromEntries(searchParams);
      params.page = String(nextPageNum);
      const r = await client.get('/products/', { params });
      setProducts(prev => [...prev, ...(r.data.results || r.data)]);
      setNextPage(r.data.next);
      const p = new URLSearchParams(searchParams);
      p.set('page', String(nextPageNum));
      setSearchParams(p, { replace: true });
    } catch (e) { console.error(e); }
    finally { setLoadingMore(false); }
  };

  return (
    <PageTransition>
      <div className="pt-32 min-h-screen">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 text-center">
          <motion.p 
            className="text-gold tracking-[0.5em] uppercase text-[10px] mb-4 font-bold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Aura Selection
          </motion.p>
          <motion.h1 
            className="font-display text-6xl text-text font-light italic"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            {category ? categories.find(c => c.slug === category)?.name || 'Collection' : 'Ready-to-Wear'}
          </motion.h1>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-40">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0 space-y-16">
              <section>
                <h3 className="text-[10px] tracking-[0.4em] text-text font-black mb-8 uppercase">Collections</h3>
                <div className="space-y-4">
                  <button onClick={() => setFilter('category', '')} className={`block text-xs tracking-widest w-full text-left transition-all ${!category ? 'text-gold italic font-bold' : 'text-text-3 hover:text-text'}`}>ALL PIECES</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setFilter('category', c.slug)} className={`block text-xs tracking-widest w-full text-left transition-all ${category === c.slug ? 'text-gold italic font-bold' : 'text-text-3 hover:text-text'}`}>
                      {c.name.toUpperCase()} <span className="ml-2 opacity-30 text-[10px]">({c.product_count})</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* MISSING 3: Price Filter */}
              <section>
                <h3 className="text-[10px] tracking-[0.4em] text-text font-black mb-8 uppercase">Price Range</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Under $100', min: '', max: '100' },
                    { label: '$100 – $250', min: '100', max: '250' },
                    { label: '$250 – $500', min: '250', max: '500' },
                    { label: 'Over $500', min: '500', max: '' },
                  ].map(range => {
                    const isActive = minPrice === range.min && maxPrice === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          range.min ? p.set('min_price', range.min) : p.delete('min_price');
                          range.max ? p.set('max_price', range.max) : p.delete('max_price');
                          p.delete('page');
                          setSearchParams(p);
                        }}
                        className={`block text-xs tracking-widest w-full text-left transition-all ${isActive ? 'text-gold italic font-bold' : 'text-text-3 hover:text-text'}`}
                      >
                        {range.label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* MISSING 3: Sale Toggle */}
              <section>
                <button
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    onSale ? p.delete('on_sale') : p.set('on_sale', 'true');
                    p.delete('page');
                    setSearchParams(p);
                  }}
                  className={`flex items-center gap-4 text-xs tracking-widest transition-all ${onSale ? 'text-gold italic font-bold' : 'text-text-3 hover:text-text'}`}
                >
                  <div className={`w-4 h-4 border flex items-center justify-center rounded-xs transition-all ${onSale ? 'bg-gold border-gold' : 'border-border'}`}>
                    {onSale && <svg className="w-2.5 h-2.5 text-bg" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                  </div>
                  EXCLUSIVE SALE
                </button>
              </section>

              <section>
                <h3 className="text-[10px] tracking-[0.4em] text-text font-black mb-8 uppercase">Sort By</h3>
                <select 
                  value={sort} 
                  onChange={e => setFilter('sort', e.target.value)} 
                  className="w-full glass border border-border px-4 py-4 text-[10px] tracking-widest rounded-sm outline-none focus:border-gold/30 uppercase"
                >
                  <option value="-created_at">Latest Releases</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </section>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                <p className="text-[9px] tracking-[0.3em] text-text-3 font-black uppercase italic">{totalCount} Pieces Selected</p>
                {searchParams.toString() && (
                  <button onClick={() => setSearchParams({})} className="text-[9px] tracking-[0.3em] text-gold hover:text-gold-light uppercase font-black transition-colors">Reset Filters</button>
                )}
              </div>

              {loading && products.length === 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-6">
                      <div className="aspect-[3/4] bg-bg-2 rounded-sm" />
                      <div className="h-4 bg-bg-2 w-3/4" />
                      <div className="h-4 bg-bg-2 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-40 glass border border-dashed border-border rounded-sm">
                  <p className="font-display text-2xl text-text-3 italic mb-8">No pieces found matching your criteria.</p>
                  <button onClick={() => setSearchParams({})} className="text-[10px] tracking-[0.4em] text-gold hover:underline uppercase font-black">Browse All Collections</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    <AnimatePresence mode="popLayout">
                      {products.map((p, idx) => (
                        <ProductCard key={p.id} {...p} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* UPGRADE 2: Load More */}
                  {nextPage && (
                    <div className="mt-32 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-16 py-5 text-[10px] tracking-[0.5em] font-black border border-border rounded-sm text-text-2 hover:border-gold hover:text-gold transition-all duration-500 disabled:opacity-30 uppercase shadow-2xl"
                      >
                        {loadingMore ? 'Preparing Selections...' : 'Discover More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
