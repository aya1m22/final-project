import React, { useState } from 'react';
import ProductCard from '../components/product/ProductCard';

const allProducts = [
  { id: 1, name: "Oversized Wool Blend Coat", brand: "Acne Studios", price: 1250.00, originalPrice: null, category: "Outerwear", images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"], colors: ["#2C2C2C", "#8B7355", "#000000"], isNew: true, discount: 0, sizes: '["XS","S","M","L","XL"]' },
  { id: 2, name: "Slim Fit Cotton T-Shirt", brand: "Maison Margiela", price: 295.00, originalPrice: null, category: "Tops", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"], colors: ["#FFFFFF", "#000000", "#F5F5DC"], isNew: false, discount: 0, sizes: '["XS","S","M","L","XL","XXL"]' },
  { id: 3, name: "Leather Chelsea Boots", brand: "Saint Laurent", price: 1195.00, originalPrice: 1495.00, category: "Shoes", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800"], colors: ["#000000", "#8B4513"], isNew: false, discount: 20, sizes: '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"]' },
  { id: 4, name: "Structured Leather Handbag", brand: "Bottega Veneta", price: 3200.00, originalPrice: null, category: "Accessories", images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"], colors: ["#2C2C2C", "#8B7355", "#FFFFFF"], isNew: true, discount: 0, sizes: '[]' },
  { id: 5, name: "Wide Leg Tailored Trousers", brand: "The Row", price: 890.00, originalPrice: null, category: "Bottoms", images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"], colors: ["#000000", "#F5F5DC", "#8B7355"], isNew: true, discount: 0, sizes: '["24","25","26","27","28","29","30"]' },
  { id: 6, name: "Cashmere Turtleneck Sweater", brand: "Loro Piana", price: 1650.00, originalPrice: null, category: "Tops", images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"], colors: ["#F5F5DC", "#8B7355", "#2C2C2C", "#FFFFFF"], isNew: false, discount: 0, sizes: '["XS","S","M","L","XL"]' },
  { id: 7, name: "Silk Midi Slip Dress", brand: "Saint Laurent", price: 2290.00, originalPrice: null, category: "Dresses", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"], colors: ["#000000", "#8B0000", "#F5F5DC"], isNew: true, discount: 0, sizes: '["XS","S","M","L","XL"]' },
  { id: 8, name: "Leather Aviator Jacket", brand: "Acne Studios", price: 2450.00, originalPrice: 2800.00, category: "Outerwear", images: ["https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=800"], colors: ["#8B4513", "#000000"], isNew: false, discount: 12, sizes: '["XS","S","M","L","XL"]' },
  { id: 9, name: "Gold Chain Necklace", brand: "Missoma", price: 185.00, originalPrice: null, category: "Accessories", images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"], colors: ["#C9A96E"], isNew: true, discount: 0, sizes: '[]' },
  { id: 10, name: "Canvas High-Top Sneakers", brand: "Converse", price: 85.00, originalPrice: null, category: "Shoes", images: ["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800"], colors: ["#FFFFFF", "#000000", "#DC2626"], isNew: false, discount: 0, sizes: '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12"]' },
];

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filtered = allProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">Shop</h1>
          <p className="text-foreground-secondary">Discover our curated collection of premium fashion.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-xs tracking-widest uppercase transition-all ${selectedCategory === cat ? 'bg-foreground text-background' : 'border border-border text-foreground-secondary hover:border-foreground hover:text-foreground'}`}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-foreground-muted uppercase tracking-widest">Sort by</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-background-elevated border border-border text-foreground text-sm px-4 py-2 focus:outline-none focus:border-accent">
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <p className="text-sm text-foreground-muted mb-8">Showing {sorted.length} of {allProducts.length} items</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-24">
            <p className="text-foreground-secondary text-lg">No products found.</p>
            <button onClick={() => setSelectedCategory('All')} className="text-accent mt-4 hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
