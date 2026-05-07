import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, X, ChevronDown } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

const CATEGORIES = ['All', 'Women', 'Men', 'Kids', 'Accessories', 'Beauty'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#f5f5f5' },
  { name: 'Beige', hex: '#c8a96e' }, { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Red', hex: '#e63946' }, { name: 'Green', hex: '#2d6a4f' },
];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated', value: 'rating' },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Products() {
  const query = useQuery();
  const nav = useNavigate();
  const q = query.get('q') || '';
  const catParam = query.get('category') || '';
  const sortParam = query.get('sort') || 'newest';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: catParam || 'All',
    sizes: [] as string[],
    colors: [] as string[],
    minPrice: 0,
    maxPrice: 500,
    sort: sortParam,
  });

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    params.set('sort', filters.sort);
    params.set('minPrice', String(filters.minPrice));
    params.set('maxPrice', String(filters.maxPrice));

    fetch(`http://localhost:4000/api/products?${params}`)
      .then(r => r.json())
      .then(b => { setProducts(b.items || []); setTotal(b.total || (b.items || []).length); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleSize = (s: string) =>
    setFilters(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }));

  const toggleColor = (c: string) =>
    setFilters(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c] }));

  const placeholders = Array.from({ length: 12 }, (_, i) => ({
    id: i + 100,
    title: ['Silk Midi Dress', 'Wool Coat', 'Linen Shirt', 'Leather Bag', 'Knit Cardigan', 'Wide-Leg Trousers', 'Satin Blouse', 'Denim Jacket', 'Trench Coat', 'Maxi Skirt', 'Blazer Set', 'Cashmere Sweater'][i],
    price: [89, 240, 65, 180, 72, 95, 78, 120, 195, 110, 165, 220][i],
    brand: ['Zara', 'COS', 'H&M', 'Mango', 'Arket', 'Weekday', 'Massimo', 'Levi\'s', 'Totême', 'Ganni', 'Sandro', 'Acne'][i],
    rating: 3.8 + Math.random() * 1.2,
    reviewCount: Math.floor(Math.random() * 300) + 10,
  }));

  const displayProducts = products.length > 0 ? products : (loading ? [] : placeholders);

  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--grey-100)' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--grey-200)', padding: '32px 40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav className="plp-breadcrumb" aria-label="Breadcrumb">
            <span onClick={() => nav('/')} style={{ cursor: 'pointer' }}>Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-cur">
              {q ? `Search: "${q}"` : filters.category !== 'All' ? filters.category : 'All Products'}
            </span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 24 }}>
            <div>
              <h1 className="display" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1 }}>
                {q ? <>Results for <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>"{q}"</em></> : filters.category !== 'All' ? filters.category : 'All Products'}
              </h1>
              {!loading && <p style={{ fontSize: '.82rem', color: 'var(--grey-400)', marginTop: 6 }}>{total || displayProducts.length} items</p>}
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`pill${filters.category === c ? ' active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, category: c }))}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div className="plp-layout">

          {/* Filter Sidebar */}
          <aside className={`filter-sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Filters">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>Filters</h2>
              <button className="hidden-mobile" onClick={() => setFilters(f => ({ ...f, sizes: [], colors: [], minPrice: 0, maxPrice: 500 }))} style={{ fontSize: '.75rem', color: 'var(--grey-400)', cursor: 'pointer' }}>
                Clear all
              </button>
            </div>

            {/* Sort */}
            <div className="filter-section">
              <div className="filter-title">Sort By</div>
              <select
                className="sort-select"
                style={{ width: '100%' }}
                value={filters.sort}
                onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Price */}
            <div className="filter-section">
              <div className="filter-title">Price Range</div>
              <div className="price-range">
                <input
                  type="range" min={0} max={500}
                  value={filters.maxPrice}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                  aria-label="Maximum price"
                />
                <div className="price-labels">
                  <span>${filters.minPrice}</span>
                  <span>${filters.maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="filter-section">
              <div className="filter-title">Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    style={{
                      width: 44, height: 44, border: `1.5px solid ${filters.sizes.includes(s) ? 'var(--black)' : 'var(--grey-200)'}`,
                      borderRadius: 4, fontSize: '.8rem', fontWeight: 500, cursor: 'pointer',
                      background: filters.sizes.includes(s) ? 'var(--black)' : 'var(--white)',
                      color: filters.sizes.includes(s) ? 'var(--white)' : 'var(--black)',
                      transition: 'all .2s',
                    }}
                    aria-pressed={filters.sizes.includes(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="filter-section">
              <div className="filter-title">Color</div>
              <div className="filter-color-grid">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    className={`color-swatch${filters.colors.includes(c.name) ? ' active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => toggleColor(c.name)}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            {/* Toolbar */}
            <div className="plp-toolbar">
              <span className="plp-count">
                {loading ? 'Loading…' : `${displayProducts.length} products`}
              </span>
              <div className="plp-sort" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  className="btn btn-ghost btn-sm hidden-mobile"
                  style={{ gap: 6 }}
                  onClick={() => setSidebarOpen(o => !o)}
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <div className="view-toggle">
                  <button className={`view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view">
                    <Grid size={15} />
                  </button>
                  <button className={`view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} aria-label="List view">
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={`product-grid${viewMode === 'list' ? ' list-view' : ''}`}>
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : displayProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--grey-400)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 8 }}>No results found</h3>
                <p style={{ fontSize: '.9rem' }}>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={`product-grid${viewMode === 'list' ? ' list-view' : ''}`}>
                {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
