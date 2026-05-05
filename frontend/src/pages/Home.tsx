import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:4000/api/products?limit=8')
      .then((r) => r.json())
      .then((b) => {
        if (!mounted) return;
        setProducts(b.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to FashionAI</h1>
        <p className="small">Discover trending looks and new arrivals</p>
      </div>

      <h3>Trending Now</h3>
      {loading ? (
        <div className="grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="card" key={i} style={{ height: 220 }} />
          ))}
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>New Arrivals</h3>
      <div className="grid">
        {products.slice(0, 6).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
