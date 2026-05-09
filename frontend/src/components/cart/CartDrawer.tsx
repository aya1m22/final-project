import { Link } from 'react-router-dom';
import { useCartStore, CartItem } from '../../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.product_detail.price) * item.quantity, 0);
  const shipping = subtotal >= 49 ? 0 : 5.99;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-300"
        style={{
          background: 'var(--color-bg-1)',
          borderLeft: '1px solid var(--color-border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="font-display text-xl text-text">Your Bag <span className="text-text-2 text-base">({items.length})</span></h2>
          <button onClick={closeCart} className="text-text-2 hover:text-text transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-12 h-12 text-text-3 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-text-2 text-sm mb-1">Your bag is empty</p>
              <p className="text-text-3 text-xs">Add something beautiful to get started.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} onUpdate={updateQuantity} onRemove={removeFromCart} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-text-2">Subtotal</span>
              <span className="text-text">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-text-2">Shipping</span>
              <span className={shipping === 0 ? 'text-green' : 'text-text'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-text-3 mb-4">Free shipping on orders over $49 — you're ${(49 - subtotal).toFixed(2)} away!</p>
            )}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3 text-sm tracking-wider font-medium rounded-md transition-colors"
              style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}
            >
              CHECKOUT →
            </Link>
            <button onClick={closeCart} className="w-full text-center text-sm text-text-2 hover:text-text mt-3 transition-colors">
              ← Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CartItemRow({ item, onUpdate, onRemove }: { item: CartItem; onUpdate: (id: number, qty: number) => void; onRemove: (id: number) => void }) {
  const { product_detail, quantity, size, color } = item;
  return (
    <div className="flex gap-4 animate-fade-in">
      <Link to={`/products/${item.product}`} className="w-20 h-24 rounded overflow-hidden flex-shrink-0" style={{ background: 'var(--color-bg-2)' }}>
        <img src={product_detail.image_url} alt={product_detail.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-sm text-text leading-tight truncate">{product_detail.name}</p>
          <p className="text-[11px] text-text-3 mt-0.5">
            {size}{color ? ` / ${color}` : ''}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdate(item.id, Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center text-text-3 hover:text-text rounded transition-colors" style={{ border: '1px solid var(--color-border)' }}>−</button>
            <span className="text-sm text-text w-5 text-center">{quantity}</span>
            <button onClick={() => onUpdate(item.id, quantity + 1)} className="w-6 h-6 flex items-center justify-center text-text-3 hover:text-text rounded transition-colors" style={{ border: '1px solid var(--color-border)' }}>+</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-display text-gold">${(parseFloat(product_detail.price) * quantity).toFixed(2)}</span>
            <button onClick={() => onRemove(item.id)} className="text-text-3 hover:text-red transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
