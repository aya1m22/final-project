import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import ProductCard from '../components/ui/ProductCard';

interface Product { id: number; name: string; price: string; image_url: string; category_name: string; sizes: string[]; colors: string[]; is_new_arrival: boolean; original_price?: string; is_on_sale?: boolean; rating?: string; review_count?: number; }
interface Category { id: number; name: string; slug: string; product_count: number; }

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const cat = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-created_at';
  const page = searchParams.get('page') || '1';

  useEffect(() => { client.get('/products/categories/').then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page };
    if (cat) params.category = cat;
    if (sort) params.sort = sort;
    if (search) params.search = search;
    client.get('/products/', { params })
      .then(r => { setProducts(r.data.results || r.data); setTotalCount(r.data.count || 0); setNextPage(r.data.next); setPrevPage(r.data.previous); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, sort, page, search]);

  const setFilter = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams);
    val ? p.set(key, val) : p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const goPage = (dir: 'next' | 'prev') => {
    const p = new URLSearchParams(searchParams);
    p.set('page', String(dir === 'next' ? parseInt(page) + 1 : Math.max(1, parseInt(page) - 1)));
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-gold tracking-[0.3em] uppercase text-[11px] mb-2">The Collection</p>
        <h1 className="font-display text-3xl sm:text-4xl text-text font-light">
          {cat ? categories.find(c => c.slug === cat)?.name || 'Products' : 'All Products'}
        </h1>
        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); setFilter('search', search); }} className="max-w-sm mx-auto mt-6">
          <div className="relative">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full px-4 py-2.5 pl-10 text-sm rounded-md outline-none transition-colors" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </form>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-52 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-display text-base text-text mb-3">Category</h3>
                <div className="space-y-1.5">
                  <button onClick={() => setFilter('category', '')} className={`block text-sm w-full text-left py-1 transition-colors ${!cat ? 'text-gold' : 'text-text-2 hover:text-text'}`}>All</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setFilter('category', c.slug)} className={`block text-sm w-full text-left py-1 transition-colors ${cat === c.slug ? 'text-gold' : 'text-text-2 hover:text-text'}`}>
                      {c.name} <span className="text-text-3">({c.product_count})</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Sort */}
              <div className="mb-8">
                <h3 className="font-display text-base text-text mb-3">Sort By</h3>
                <select value={sort} onChange={e => setFilter('sort', e.target.value)} className="w-full px-3 py-2 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  <option value="-created_at">Newest</option>
                  <option value="price">Price: Low → High</option>
                  <option value="-price">Price: High → Low</option>
                  <option value="name">A → Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-text-3 text-xs mb-6">{totalCount} items</p>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i}><div className="aspect-[3/4] rounded-md animate-shimmer" /><div className="h-3 w-3/4 mt-3 rounded animate-shimmer" /></div>)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20"><p className="text-text-2">No products found.</p><p className="text-text-3 text-xs mt-1">Try adjusting your filters.</p></div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
                  {products.map(p => <ProductCard key={p.id} {...p} />)}
                </div>
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button onClick={() => goPage('prev')} disabled={!prevPage} className="px-5 py-2 text-sm rounded-md transition-colors disabled:opacity-30 text-text-2 hover:text-gold" style={{ border: '1px solid var(--color-border)' }}>← Previous</button>
                  <span className="text-sm text-text-3">Page {page}</span>
                  <button onClick={() => goPage('next')} disabled={!nextPage} className="px-5 py-2 text-sm rounded-md transition-colors disabled:opacity-30 text-text-2 hover:text-gold" style={{ border: '1px solid var(--color-border)' }}>Next →</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
