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
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const cat = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-created_at';
  const page = searchParams.get('page') || '1';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const onSale = searchParams.get('on_sale') === 'true';

  useEffect(() => { client.get('/products/categories/').then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page, sort };
    if (cat) params.category = cat;
    if (search) params.search = search;
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
  }, [cat, sort, page, search, minPrice, maxPrice, onSale]);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.p 
            className="text-gold tracking-[0.4em] uppercase text-[10px] mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            The AURA Edit
          </motion.p>
          <motion.h1 
            className="font-display text-4xl sm:text-5xl text-text font-light italic"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            {cat ? categories.find(c => c.slug === cat)?.name || 'Collection' : 'All Pieces'}
          </motion.h1>
          
          <form onSubmit={(e) => { e.preventDefault(); setFilter('search', search); }} className="max-w-md mx-auto mt-8 relative">
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search our collection..." 
              className="w-full bg-bg-2 border border-border px-10 py-3 text-xs tracking-widest rounded-sm outline-none focus:border-gold/50 transition-colors"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            {search && (
              <button type="button" onClick={() => { setSearch(''); setFilter('search', ''); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-3 hover:text-text">✕</button>
            )}
          </form>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-28 space-y-12">
                {/* Categories */}
                <section>
                  <h3 className="font-display text-sm tracking-widest text-text mb-5 uppercase">Categories</h3>
                  <div className="space-y-2">
                    <button onClick={() => setFilter('category', '')} className={`block text-xs tracking-widest w-full text-left py-1.5 transition-colors ${!cat ? 'text-gold' : 'text-text-3 hover:text-text'}`}>ALL COLLECTIONS</button>
                    {categories.map(c => (
                      <button key={c.id} onClick={() => setFilter('category', c.slug)} className={`block text-xs tracking-widest w-full text-left py-1.5 transition-colors ${cat === c.slug ? 'text-gold' : 'text-text-3 hover:text-text'}`}>
                        {c.name.toUpperCase()} <span className="ml-1 text-[10px] opacity-40">({c.product_count})</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Price Range */}
                <section>
                  <h3 className="font-display text-sm tracking-widest text-text mb-5 uppercase">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Under $50', min: '', max: '50' },
                      { label: '$50 – $100', min: '50', max: '100' },
                      { label: '$100 – $200', min: '100', max: '200' },
                      { label: 'Over $200', min: '200', max: '' },
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
                          className={`block text-xs tracking-widest w-full text-left py-1.5 transition-colors ${isActive ? 'text-gold font-bold' : 'text-text-3 hover:text-text'}`}
                        >
                          {range.label.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Sort & Sale */}
                <section className="space-y-6">
                  <div>
                    <h3 className="font-display text-sm tracking-widest text-text mb-4 uppercase">Sort By</h3>
                    <select 
                      value={sort} 
                      onChange={e => setFilter('sort', e.target.value)} 
                      className="w-full bg-bg-2 border border-border px-3 py-2.5 text-[10px] tracking-widest rounded-sm outline-none focus:border-gold/50"
                    >
                      <option value="-created_at">NEWEST FIRST</option>
                      <option value="price">PRICE: LOW TO HIGH</option>
                      <option value="-price">PRICE: HIGH TO LOW</option>
                      <option value="name">ALPHABETICAL (A-Z)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      onSale ? p.delete('on_sale') : p.set('on_sale', 'true');
                      p.delete('page');
                      setSearchParams(p);
                    }}
                    className={`flex items-center gap-3 text-xs tracking-widest transition-colors ${onSale ? 'text-gold font-bold' : 'text-text-3 hover:text-text'}`}
                  >
                    <div className={`w-4 h-4 rounded-sm border transition-colors flex items-center justify-center ${onSale ? 'bg-gold border-gold' : 'border-border'}`}>
                      {onSale && <svg className="w-2.5 h-2.5 text-bg" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                    </div>
                    PRIVATE SALE
                  </button>
                </section>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <p className="text-[10px] tracking-[0.2em] text-text-3 uppercase">{totalCount} Pieces Found</p>
                {searchParams.toString() && (
                  <button onClick={() => setSearchParams({})} className="text-[10px] tracking-[0.2em] text-gold hover:text-gold-light uppercase">Clear All Filters</button>
                )}
              </div>

              {loading && products.length === 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-bg-2 rounded-sm mb-4" /><div className="h-4 bg-bg-2 w-3/4 mb-2" /><div className="h-4 bg-bg-2 w-1/4" /></div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-border rounded-sm">
                  <p className="font-display text-xl text-text-3 italic mb-4">No pieces found matching your criteria.</p>
                  <button onClick={() => setSearchParams({})} className="text-xs tracking-widest text-gold hover:underline">RESET FILTERS</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {products.map((p, idx) => (
                        <motion.div
                          key={p.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                          <ProductCard {...p} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Load More */}
                  {nextPage && (
                    <div className="mt-20 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-12 py-4 text-[11px] tracking-[0.3em] font-medium border border-border rounded-sm text-text-2 hover:border-gold hover:text-gold transition-all disabled:opacity-50"
                      >
                        {loadingMore ? 'PREPARING...' : 'DISCOVER MORE'}
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
