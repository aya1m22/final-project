import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import PageTransition from '../components/layout/PageTransition';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + parseFloat(i.product_detail.price) * i.quantity, 0);
  const shipping = subtotal >= 49 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="pt-40 text-center max-w-md mx-auto px-4 min-h-[60vh] flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-full bg-bg-2 flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h1 className="font-display text-3xl text-text mb-3 italic">Your Bag is Empty</h1>
          <p className="text-text-3 text-sm mb-10 tracking-wide">Time to discover pieces curated for your aesthetic.</p>
          <Link to="/products" className="px-10 py-4 text-[11px] tracking-[0.3em] font-bold rounded-sm bg-gold text-bg transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-gold/10">
            CONTINUE BROWSING
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <p className="text-gold tracking-[0.4em] uppercase text-[10px] mb-2 font-bold">Review Selections</p>
            <h1 className="font-display text-4xl text-text font-light italic">Your Shopping Bag ({items.length})</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-6 p-6 rounded-sm bg-bg-1 border border-border shadow-sm group"
                  >
                    <Link to={`/products/${item.product}`} className="w-32 h-40 rounded-sm overflow-hidden flex-shrink-0 bg-bg-2 border border-border">
                      <img src={item.product_detail.image_url} alt={item.product_detail.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[10px] tracking-[0.2em] text-gold uppercase font-bold mb-1">{item.product_detail.category_name}</p>
                            <h3 className="text-lg text-text font-display italic leading-tight">{item.product_detail.name}</h3>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-text-3 hover:text-red transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                        <p className="text-[11px] tracking-widest text-text-3 uppercase">Size: {item.size} {item.color ? `· Color: ${item.color}` : ''}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-bg-2 border border-border px-3 py-1.5 rounded-sm">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-text-3 hover:text-gold transition-colors text-lg">−</button>
                          <span className="text-sm text-text font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-text-3 hover:text-gold transition-colors text-lg">+</button>
                        </div>
                        <p className="font-display text-xl text-gold">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="rounded-sm p-8 sticky top-28 bg-bg-1 border border-border shadow-2xl">
                <h2 className="font-display text-xl text-text mb-8 tracking-widest uppercase">Summary</h2>
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between tracking-wide"><span className="text-text-3 uppercase text-[11px]">Subtotal</span><span className="text-text font-bold">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between tracking-wide">
                    <span className="text-text-3 uppercase text-[11px]">Shipping</span>
                    <span className={shipping === 0 ? 'text-green font-bold' : 'text-text font-bold'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-gold tracking-wider opacity-80 italic">Add ${(49 - subtotal).toFixed(2)} more for complimentary shipping.</p>
                  )}
                  <div className="h-px bg-border my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-text font-bold tracking-widest uppercase text-xs">Total</span>
                    <span className="font-display text-3xl text-gold">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Link to="/checkout" className="block w-full text-center py-4 text-[11px] tracking-[0.3em] font-bold rounded-sm bg-gold text-bg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gold/20">
                    CONTINUE TO CHECKOUT
                  </Link>
                  <Link to="/products" className="block w-full text-center text-[10px] tracking-[0.2em] text-text-3 hover:text-text transition-colors uppercase pt-2">
                    ← Continue Shopping
                  </Link>
                </div>

                <div className="mt-10 pt-10 border-t border-border space-y-4">
                  <div className="flex items-center gap-4 text-text-3">
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[10px]">✨</div>
                    <p className="text-[10px] tracking-widest uppercase">Free Premium Packaging</p>
                  </div>
                  <div className="flex items-center gap-4 text-text-3">
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[10px]">🔒</div>
                    <p className="text-[10px] tracking-widest uppercase">Secure Payment Processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
