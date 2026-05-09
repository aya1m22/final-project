import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + parseFloat(i.product_detail.price) * i.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* MISSING 1: Animated Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-[70] flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ background: 'var(--color-bg-1)', borderLeft: '1px solid var(--color-border)' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-text tracking-widest uppercase">Shopping Bag</h2>
                <p className="text-[10px] text-text-3 tracking-[0.2em] mt-1">{items.length} PIECES SELECTED</p>
              </div>
              <button onClick={closeCart} className="text-text-3 hover:text-gold transition-colors p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  <p className="font-display text-lg italic">Your bag is empty</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <Link to={`/products/${item.product}`} onClick={closeCart} className="w-20 h-28 rounded-sm overflow-hidden flex-shrink-0 bg-bg-2 border border-border">
                        <img src={item.product_detail.image_url} alt={item.product_detail.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs text-text font-bold tracking-widest leading-tight uppercase truncate max-w-[160px]">{item.product_detail.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-text-3 hover:text-red transition-colors">
                               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                            </button>
                          </div>
                          <p className="text-[10px] text-text-3 tracking-widest mt-1 uppercase">{item.size} {item.color ? `· ${item.color}` : ''}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-border px-2 py-1 rounded-sm">
                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-text-3 hover:text-gold transition-colors text-sm">−</button>
                            <span className="text-[10px] font-bold text-text w-3 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-text-3 hover:text-gold transition-colors text-sm">+</button>
                          </div>
                          <p className="text-sm font-display text-gold">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-bg-2/50 backdrop-blur-md">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[10px] text-text-3 tracking-[0.2em] font-bold uppercase mb-1">Subtotal</p>
                    <p className="text-[9px] text-gold tracking-widest">Excl. shipping & taxes</p>
                  </div>
                  <p className="font-display text-2xl text-gold">${subtotal.toFixed(2)}</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 text-[11px] tracking-[0.3em] font-bold bg-gold text-bg rounded-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gold/10"
                  >
                    CONTINUE TO CHECKOUT
                  </button>
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="block w-full text-center py-3 text-[10px] tracking-[0.2em] text-text-3 hover:text-text-2 transition-colors uppercase"
                  >
                    View Bag Details
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
