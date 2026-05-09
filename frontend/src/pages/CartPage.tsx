import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + parseFloat(i.product_detail.price) * i.quantity, 0);
  const shipping = subtotal >= 49 ? 0 : 5.99;

  if (items.length === 0) {
    return (
      <div className="pt-28 text-center max-w-md mx-auto px-4">
        <svg className="w-16 h-16 mx-auto mb-4 text-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <h1 className="font-display text-2xl text-text mb-2">Your bag is empty</h1>
        <p className="text-text-3 text-sm mb-6">Time to find something beautiful.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 text-sm rounded-md" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl text-text font-light mb-8">Your Bag <span className="text-text-3 text-lg">({items.length})</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 rounded-lg animate-fade-in" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                <Link to={`/products/${item.product}`} className="w-24 h-28 rounded overflow-hidden flex-shrink-0">
                  <img src={item.product_detail.image_url} alt={item.product_detail.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-text">{item.product_detail.name}</p>
                    <p className="text-xs text-text-3 mt-0.5">{item.size}{item.color ? ` / ${item.color}` : ''}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center text-text-3 hover:text-text rounded transition-colors" style={{ border: '1px solid var(--color-border)' }}>−</button>
                      <span className="text-sm text-text w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-text-3 hover:text-text rounded transition-colors" style={{ border: '1px solid var(--color-border)' }}>+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-gold">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-text-3 hover:text-red transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 self-start rounded-lg p-6" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-display text-lg text-text mb-4">Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="text-text-2">Subtotal</span><span className="text-text">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-2">Shipping</span><span className={shipping === 0 ? 'text-green' : 'text-text'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            <div className="flex justify-between pt-4 mb-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <span className="text-text font-medium">Total</span>
              <span className="font-display text-xl text-gold">${(subtotal + shipping).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="block w-full text-center py-3 text-[13px] tracking-[0.15em] font-medium rounded-md transition-all hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
              CHECKOUT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
