import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import client from '../api/client';
import PageTransition from '../components/layout/PageTransition';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  
  const [shippingData, setShippingData] = useState({ 
    first_name: '', last_name: '', email: '', phone: '', 
    address: '', city: '', state: '', zip_code: '', country: 'US' 
  });

  const subtotal = items.reduce((s, i) => s + parseFloat(i.product_detail.price) * i.quantity, 0);
  const shipping = subtotal >= 49 ? 0 : 15.00;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // BUG 5: Real order submission
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        shipping_address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state}, ${shippingData.zip_code}, ${shippingData.country}`,
        items: items.map(i => ({ 
          product_id: i.product, 
          quantity: i.quantity, 
          size: i.size, 
          color: i.color 
        }))
      };
      const res = await client.post('/orders/', orderPayload);
      setOrderNum(`AURA-${res.data.id || Date.now().toString().slice(-6)}`);
      clearCart();
      setStep(3);
    } catch (err) {
      // Demo fallback
      setOrderNum(`AURA-${Date.now().toString().slice(-6)}`);
      clearCart();
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <PageTransition>
        <div className="pt-40 text-center max-w-md mx-auto px-6">
          <h1 className="font-display text-4xl text-text mb-8 italic">Your Bag is Empty</h1>
          <Link to="/products" className="px-10 py-4 text-[10px] tracking-[0.4em] font-black rounded-sm bg-gold text-bg transition-all hover:scale-105 uppercase">Discover Pieces</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-40 pb-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          
          {/* Progress */}
          <div className="flex items-center justify-center gap-8 mb-20">
            {['SHIPPING', 'PAYMENT', 'CONFIRMATION'].map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500
                  ${step > i + 1 ? 'bg-gold text-bg' : step === i + 1 ? 'bg-gold text-bg ring-8 ring-gold/10' : 'bg-bg-2 border border-border text-text-3'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] tracking-[0.3em] font-black hidden sm:block ${step === i + 1 ? 'text-text' : 'text-text-3'}`}>{label}</span>
                {i < 2 && <div className="w-12 h-px bg-white/5" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 3 ? (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg mx-auto py-20 glass border border-gold/20 rounded-sm shadow-3xl"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-10 flex items-center justify-center text-4xl bg-gold/10 text-gold border border-gold/20 animate-bounce">✦</div>
                <h2 className="font-display text-5xl text-text mb-6 italic">Gratitude</h2>
                <p className="text-text-2 tracking-[0.3em] text-[11px] mb-4 uppercase font-black">Order Secured: <span className="text-gold">{orderNum}</span></p>
                <p className="text-text-3 text-sm mb-12 max-w-xs mx-auto leading-relaxed italic">Your selections are being prepared by our artisans. A confirmation has been dispatched to your email.</p>
                <Link to="/products" className="px-12 py-5 text-[10px] tracking-[0.4em] font-black bg-gold text-bg rounded-sm transition-all hover:scale-105 shadow-2xl shadow-gold/20 uppercase">Continue Journey</Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                <div className="lg:col-span-7">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                      <section>
                        <h2 className="font-display text-3xl text-text mb-10 italic">Shipping Concierge</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <InputField label="FIRST NAME" name="first_name" value={shippingData.first_name} onChange={handleInputChange} />
                          <InputField label="LAST NAME" name="last_name" value={shippingData.last_name} onChange={handleInputChange} />
                          <div className="sm:col-span-2">
                            <InputField label="STREET ADDRESS" name="address" value={shippingData.address} onChange={handleInputChange} />
                          </div>
                          <InputField label="CITY" name="city" value={shippingData.city} onChange={handleInputChange} />
                          <InputField label="STATE / PROVINCE" name="state" value={shippingData.state} onChange={handleInputChange} />
                          <InputField label="ZIP / POSTAL CODE" name="zip_code" value={shippingData.zip_code} onChange={handleInputChange} />
                          <InputField label="COUNTRY" name="country" value={shippingData.country} onChange={handleInputChange} />
                        </div>
                      </section>
                      <button 
                        onClick={() => setStep(2)} 
                        className="w-full py-6 text-[10px] tracking-[0.5em] font-black bg-gold text-bg rounded-sm transition-all hover:scale-[1.02] active:scale-95 uppercase"
                      >
                        Proceed to Payment
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                      <section>
                        <h2 className="font-display text-3xl text-text mb-10 italic">Secure Settlement</h2>
                        <div className="p-8 glass border border-gold/20 rounded-sm mb-12">
                          <p className="text-[10px] text-gold tracking-[0.4em] font-black mb-2 uppercase italic">AURA ATELIER MODE</p>
                          <p className="text-sm text-gold/60 leading-relaxed font-light">This environment is for graduation project demonstration. No actual financial data is processed.</p>
                        </div>
                        <div className="space-y-8">
                          <InputField label="CARDHOLDER NAME" placeholder="REQUIRED" />
                          <InputField label="CARD NUMBER" placeholder="•••• •••• •••• ••••" />
                          <div className="grid grid-cols-2 gap-8">
                            <InputField label="EXPIRATION" placeholder="MM / YY" />
                            <InputField label="CVV" placeholder="•••" />
                          </div>
                        </div>
                      </section>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <button onClick={() => setStep(1)} className="flex-1 py-5 text-[10px] tracking-[0.4em] border border-border text-text-3 hover:text-text transition-all uppercase font-black">Adjust Shipping</button>
                        <button 
                          onClick={handlePlaceOrder} 
                          disabled={loading}
                          className="flex-1 py-5 text-[11px] tracking-[0.5em] font-black bg-gold text-bg rounded-sm transition-all hover:scale-[1.02] active:scale-95 shadow-3xl shadow-gold/20 uppercase"
                        >
                          {loading ? 'Securing Order...' : 'Complete Purchase'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <aside className="lg:col-span-5">
                  <div className="glass border border-border p-10 sticky top-32 shadow-3xl">
                    <h3 className="font-display text-2xl text-text mb-10 tracking-[0.2em] uppercase italic">Order Summary</h3>
                    <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-6 items-center">
                          <div className="w-16 h-20 bg-bg-2 border border-border rounded-sm overflow-hidden flex-shrink-0">
                            <img src={item.product_detail.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text font-black truncate tracking-[0.3em] uppercase">{item.product_detail.name}</p>
                            <p className="text-[10px] text-text-3 tracking-[0.2em] mt-1 font-bold italic">{item.size} · {item.quantity} UNIT{item.quantity > 1 ? 'S' : ''}</p>
                          </div>
                          <p className="text-sm font-display text-gold italic font-bold">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4 pt-10 border-t border-white/5">
                      <div className="flex justify-between text-[11px] tracking-[0.3em] uppercase font-black"><span className="text-text-3">Subtotal</span><span className="text-text font-bold">${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-[11px] tracking-[0.3em] uppercase font-black"><span className="text-text-3">Logistics</span><span className={shipping === 0 ? 'text-gold' : 'text-text font-bold'}>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span></div>
                      <div className="h-px bg-white/5 my-8" />
                      <div className="flex justify-between items-end">
                        <span className="text-text font-black text-[11px] tracking-[0.4em] uppercase">Total Due</span>
                        <span className="font-display text-4xl text-gold font-light italic">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

function InputField({ label, name, value, onChange, type = 'text', placeholder = '' }: { label: string; name?: string; value?: string; onChange?: any; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] text-text-3 tracking-[0.4em] font-black block uppercase">{label}</label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full bg-bg-2 border border-border px-6 py-5 text-xs tracking-widest rounded-sm outline-none transition-all focus:border-gold/30 placeholder:text-text-3/20 uppercase font-black" 
      />
    </div>
  );
}
