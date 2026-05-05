import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((r) => r.json())
      .then((b) => {
        if (!mounted) return;
        setProduct(b);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!product) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: '0 0 420px' }}>
          <img src={product.images?.[0] || 'https://picsum.photos/420'} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2>{product.title}</h2>
          <div style={{ fontWeight: 700 }}>${product.price}</div>
          <p className="small">{product.description}</p>

          <div style={{ marginTop: 12 }}>
            <label>Quantity</label>
            <div>
              <button onClick={() => setQty((s) => Math.max(1, s - 1))}>-</button>
              <span style={{ padding: '0 8px' }}>{qty}</span>
              <button onClick={() => setQty((s) => s + 1)}>+</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => {
                addToCart({ productId: product.id, qty, title: product.title, price: product.price });
                alert('Added to cart');
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
