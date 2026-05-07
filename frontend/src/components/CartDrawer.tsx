import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { openDrawer, close, items, removeFromCart, updateQuantity } = useCart();
  const nav = useNavigate();

  if (!openDrawer) return null;

  const subtotal = items.reduce((sum: number, it: any) => sum + (it.price || 0) * it.qty, 0);
  const shipping = items.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    close();
    nav('/checkout');
  };

  return (
    <>
      <div className="cart-drawer-overlay" onClick={close} aria-hidden="true" />
      <aside className="cart-drawer" role="dialog" aria-label="Shopping cart" aria-modal="true">
        {/* Header */}
        <div className="cart-drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="cart-drawer-title">Your Cart</span>
            {items.length > 0 && (
              <span className="cart-drawer-count">{items.length}</span>
            )}
          </div>
          <button className="cart-drawer-close" onClick={close} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} className="cart-empty-icon" strokeWidth={1} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                  Your cart is empty
                </div>
                <div className="cart-empty-text">
                  Discover curated looks and add your favorites to cart.
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { close(); nav('/products'); }}
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((it: any) => (
              <div key={it.productId} className="cart-item">
                <img
                  src={it.image || `https://picsum.photos/seed/${it.productId}/200/250`}
                  alt={it.title}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  {it.brand && <div className="cart-item-brand">{it.brand}</div>}
                  <div className="cart-item-name">{it.title || `Product #${it.productId}`}</div>
                  {(it.size || it.color) && (
                    <div className="cart-item-meta">
                      {it.size && `Size: ${it.size}`}
                      {it.size && it.color && ' · '}
                      {it.color && it.color}
                    </div>
                  )}
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">${((it.price || 0) * it.qty).toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div className="cart-item-qty">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(it.productId, Math.max(1, it.qty - 1))}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cart-qty-val">{it.qty}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(it.productId, it.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        className="cart-remove"
                        onClick={() => removeFromCart(it.productId)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-shipping">
              <span>Estimated Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              id="checkout-btn"
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            <div style={{ marginTop: 12, textAlign: 'center', fontSize: '.75rem', color: 'var(--grey-400)' }}>
              Free returns · Secure checkout
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
