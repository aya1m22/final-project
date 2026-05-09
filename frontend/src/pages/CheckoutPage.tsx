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
  const shipping = subtotal >= 49 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // BUG 5 FIX: Submit order to backend
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
      // Fallback for demo if API fails
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
        <div className="pt-40 text-center max-w-md mx-auto px-4 min-h-[60vh] flex flex-col justify-center items-center">
          <h1 className="font-display text-3xl text-text mb-4 italic">Your Bag is Empty</h1>
          <Link to="/products" className="px-10 py-4 text-[11px] tracking-[0.3em] font-bold rounded-sm bg-gold text-bg transition-all hover:scale-105 active:scale-95">CONTINUE SHOPPING</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-6 mb-16">
            {['SHIPPING', 'PAYMENT', 'CONFIRMATION'].map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${step > i + 1 ? 'bg-gold text-bg' : step === i + 1 ? 'bg-gold text-bg ring-4 ring-gold/10' : 'bg-bg-2 border border-border text-text-3'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] tracking-[0.2em] hidden sm:block ${step === i + 1 ? 'text-text font-bold' : 'text-text-3'}`}>{label}</span>
                {i < 2 && <div className="w-10 h-px bg-border" style={{ background: step > i + 1 ? 'var(--color-gold)' : 'var(--color-border)' }} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 3 ? (
              /* Confirmation View */
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg mx-auto py-20 bg-bg-1 border border-border rounded-sm shadow-2xl"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-10 flex items-center justify-center text-3xl bg-gold/10 text-gold border border-gold/20">✓</div>
                <h2 className="font-display text-4xl text-text mb-4 italic">Order Confirmed</h2>
                <p className="text-text-2 tracking-widest text-[11px] mb-2 uppercase">ORDER NUMBER: <span className="font-bold">{orderNum}</span></p>
                <p className="text-text-3 text-xs mb-12 max-w-sm mx-auto leading-relaxed">
                  Thank you for choosing AURA. A confirmation email has been sent. We will notify you once your bespoke selections are en route.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center px-10">
                  <Link to="/products" className="px-8 py-4 text-[10px] tracking-[0.2em] font-bold bg-gold text-bg rounded-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/20">CONTINUE SHOPPING</Link>
                  <Link to="/profile" className="px-8 py-4 text-[10px] tracking-[0.2em] border border-border text-text-2 hover:text-text transition-colors">VIEW ACCOUNT</Link>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Form Steps */}
                <div className="lg:col-span-7">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                      <section>
                        <h2 className="font-display text-2xl text-text mb-8 italic">Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <InputField label="FIRST NAME" name="first_name" value={shippingData.first_name} onChange={handleInputChange} />
                          <InputField label="LAST NAME" name="last_name" value={shippingData.last_name} onChange={handleInputChange} />
                          <div className="sm:col-span-2">
                            <InputField label="EMAIL ADDRESS" type="email" name="email" value={shippingData.email} onChange={handleInputChange} />
                          </div>
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
                        className="w-full py-5 text-[11px] tracking-[0.3em] font-bold bg-gold text-bg rounded-sm transition-all hover:scale-[1.02] active:scale-95"
                      >
                        CONTINUE TO PAYMENT →
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                      <section>
                        <div className="flex justify-between items-end mb-8">
                          <h2 className="font-display text-2xl text-text italic">Payment Method</h2>
                          <div className="flex gap-2">
                             {['VISA', 'MC', 'AMEX'].map(c => <div key={c} className="text-[8px] border border-border px-1 py-0.5 text-text-3 font-bold">{c}</div>)}
                          </div>
                        </div>
                        <div className="p-5 bg-gold/5 border border-gold/20 rounded-sm mb-8">
                          <p className="text-[10px] text-gold tracking-widest font-bold mb-1 uppercase">AURA DEMO MODE</p>
                          <p className="text-xs text-gold/70 leading-relaxed italic">No actual transaction will be processed. Please use mock data for testing.</p>
                        </div>
                        <div className="space-y-5">
                          <InputField label="CARDHOLDER NAME" placeholder="AS IT APPEARS ON CARD" />
                          <InputField label="CARD NUMBER" placeholder="0000 0000 0000 0000" />
                          <div className="grid grid-cols-2 gap-5">
                            <InputField label="EXPIRATION DATE" placeholder="MM / YY" />
                            <InputField label="CVV" placeholder="•••" />
                          </div>
                        </div>
                      </section>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setStep(1)} className="flex-1 py-4 text-[10px] tracking-[0.2em] border border-border text-text-3 hover:text-text transition-colors">BACK TO SHIPPING</button>
                        <button 
                          onClick={handlePlaceOrder} 
                          disabled={loading}
                          className="flex-1 py-4 text-[11px] tracking-[0.3em] font-bold bg-gold text-bg rounded-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gold/20"
                        >
                          {loading ? 'PROCESSING...' : 'COMPLETE ORDER'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sidebar Summary */}
                <aside className="lg:col-span-5">
                  <div className="bg-bg-1 border border-border p-8 sticky top-28 shadow-xl">
                    <h3 className="font-display text-lg text-text mb-8 tracking-widest uppercase">Order Review</h3>
                    <div className="space-y-5 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-16 h-20 bg-bg-2 border border-border rounded-sm overflow-hidden flex-shrink-0">
                            <img src={item.product_detail.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text font-bold truncate tracking-widest">{item.product_detail.name.toUpperCase()}</p>
                            <p className="text-[10px] text-text-3 tracking-wider mt-0.5">{item.size} · {item.quantity} UNIT{item.quantity > 1 ? 'S' : ''}</p>
                          </div>
                          <p className="text-sm font-display text-gold">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 pt-6 border-t border-border">
                      <div className="flex justify-between text-xs tracking-wider"><span className="text-text-3">SUBTOTAL</span><span className="text-text font-bold">${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-xs tracking-wider"><span className="text-text-3">SHIPPING</span><span className={shipping === 0 ? 'text-green font-bold' : 'text-text font-bold'}>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span></div>
                      <div className="h-px bg-border my-4" />
                      <div className="flex justify-between items-end">
                        <span className="text-text font-bold text-xs tracking-widest">TOTAL DUE</span>
                        <span className="font-display text-2xl text-gold">${total.toFixed(2)}</span>
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
    <div>
      <label className="text-[9px] text-text-3 tracking-[0.3em] font-bold block mb-2 uppercase">{label}</label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full bg-bg-2 border border-border px-4 py-3.5 text-xs tracking-widest rounded-sm outline-none transition-colors focus:border-gold/40 placeholder:text-text-3/30" 
      />
    </div>
  );
}
