import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <img className="product-image" src={product.images?.[0] || 'https://picsum.photos/400'} alt={product.title} />
        <h4>{product.title}</h4>
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700 }}>${product.price}</div>
      </div>
    </div>
  );
}
