import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { openDrawer, close, items, removeFromCart } = useCart();
  if (!openDrawer) return null;
  return (
    <div className="drawer">
      <button className="drawer-close" onClick={close}>Close</button>
      <h3>Cart</h3>
      {items.length === 0 && <div>Your cart is empty</div>}
      {items.map((it: any) => (
        <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
          <div>
            <div style={{ fontWeight: 700 }}>{it.title || `Product ${it.productId}`}</div>
            <div className="small">Qty: {it.qty}</div>
          </div>
          <div>
            <button onClick={() => removeFromCart(it.productId)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
