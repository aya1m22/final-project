import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import PageTransition from '../components/layout/PageTransition';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + parseFloat(i.product_detail.price) * i.quantity, 0);
  const shipping = subtotal >= 49 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="pt-40 text-center max-w-2xl mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-bg-2 flex items-center justify-center mb-10 border border-border"
          >
            <svg className="w-10 h-10 text-text-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </motion.div>
          <h1 className="font-display text-4xl text-text mb-4 italic">Your bag is empty</h1>
          <p className="text-text-3 text-sm mb-12 tracking-[0.2em] uppercase max-w-xs">Time to discover pieces curated for your aesthetic.</p>
          <Link to="/products" className="px-12 py-5 text-[10px] tracking-[0.4em] font-black rounded-sm bg-gold text-bg transition-all hover:scale-105 shadow-2xl shadow-gold/20 uppercase">
            Start Shopping
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-gold tracking-[0.5em] uppercase text-[10px] mb-4 font-bold">Review Selections</p>
            <h1 className="font-display text-5xl text-text font-light italic">Your Shopping Bag</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-10">
              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-10 p-8 rounded-sm glass border border-border group"
                  >
                    <Link to={`/products/${item.product}`} className="w-40 h-52 rounded-sm overflow-hidden flex-shrink-0 bg-bg-2 border border-border relative">
                      <img src={item.product_detail.image_url} alt={item.product_detail.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold mb-2">{item.product_detail.category_name}</p>
                            <h3 className="text-2xl text-text font-display italic leading-tight group-hover:text-gold transition-colors">{item.product_detail.name}</h3>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-text-3 hover:text-red transition-all hover:scale-110 p-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                        <p className="text-[11px] tracking-[0.3em] text-text-3 uppercase font-bold italic">
                           Size: {item.size} {item.color ? `· Color: ${item.color}` : ''}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center gap-6 glass border border-white/5 px-5 py-2.5 rounded-full">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-text-3 hover:text-gold transition-colors text-xl font-light">−</button>
                          <span className="text-xs font-black text-text w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-text-3 hover:text-gold transition-colors text-xl font-light">+</button>
                        </div>
                        <p className="font-display text-3xl text-gold font-light tracking-tight">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-4">
              <div className="rounded-sm p-10 sticky top-32 glass border border-border shadow-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold opacity-50" />
                <h2 className="font-display text-2xl text-text mb-10 tracking-[0.2em] uppercase italic">Order Summary</h2>
                <div className="space-y-6 mb-10 text-sm">
                  <div className="flex justify-between tracking-[0.2em] uppercase text-[11px] font-bold">
                    <span className="text-text-3">Subtotal</span>
                    <span className="text-text">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between tracking-[0.2em] uppercase text-[11px] font-bold">
                    <span className="text-text-3">Shipping</span>
                    <span className={shipping === 0 ? 'text-green' : 'text-text'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-gold/60 tracking-widest leading-relaxed italic">
                      Add ${(49 - subtotal).toFixed(2)} more to unlock complimentary premium shipping.
                    </p>
                  )}
                  <div className="h-px bg-white/5 my-8" />
                  <div className="flex justify-between items-end">
                    <span className="text-text font-black tracking-[0.3em] uppercase text-[10px]">Grand Total</span>
                    <span className="font-display text-4xl text-gold font-light">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Link to="/checkout" className="block w-full text-center py-5 text-[10px] tracking-[0.4em] font-black rounded-sm bg-gold text-bg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gold/20 uppercase">
                    Proceed to Checkout
                  </Link>
                  <Link to="/products" className="block w-full text-center text-[10px] tracking-[0.3em] text-text-3 hover:text-text transition-all duration-500 uppercase pt-4 border-t border-white/5 mt-6">
                    ← Return to Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
