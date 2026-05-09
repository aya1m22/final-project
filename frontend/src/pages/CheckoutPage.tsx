import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderNum] = useState(`AURA-${Date.now().toString().slice(-6)}`);

  const subtotal = items.reduce((s, i) => s + parseFloat(i.product_detail.price) * i.quantity, 0);
  const shipping = subtotal >= 49 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    clearCart();
    setStep(3);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-28 text-center max-w-md mx-auto px-4">
        <h1 className="font-display text-2xl text-text mb-2">Your bag is empty</h1>
        <p className="text-text-3 text-sm mb-6">Add some items before checking out.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 text-sm rounded-md" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['Shipping', 'Payment', 'Confirm'].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? 'text-bg' : step === i + 1 ? 'text-bg' : 'text-text-3'}`}
                style={{ background: step >= i + 1 ? 'var(--color-gold)' : 'var(--color-bg-3)', border: `1px solid ${step >= i + 1 ? 'var(--color-gold)' : 'var(--color-border)'}` }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${step === i + 1 ? 'text-gold' : 'text-text-3'}`}>{label}</span>
              {i < 2 && <div className="w-12 h-px" style={{ background: step > i + 1 ? 'var(--color-gold)' : 'var(--color-border)' }} />}
            </div>
          ))}
        </div>

        {step === 3 ? (
          /* Confirmation */
          <div className="text-center max-w-md mx-auto py-10 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl" style={{ background: 'rgba(76,175,128,0.15)', color: 'var(--color-green)' }}>✓</div>
            <h2 className="font-display text-3xl text-text mb-2">Order Placed!</h2>
            <p className="text-text-2 text-sm mb-1">Order #{orderNum}</p>
            <p className="text-text-3 text-xs mb-8">We'll email you when it ships.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/products" className="px-6 py-2.5 text-sm rounded-md transition-all hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>Continue Shopping</Link>
              <Link to="/profile" className="px-6 py-2.5 text-sm rounded-md transition-colors text-text-2 hover:text-text" style={{ border: '1px solid var(--color-border)' }}>View Orders</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form Area */}
            <div className="lg:col-span-3">
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="font-display text-xl text-text mb-6">Shipping Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="FIRST NAME" />
                      <InputField label="LAST NAME" />
                    </div>
                    <InputField label="EMAIL" type="email" />
                    <InputField label="PHONE" type="tel" />
                    <InputField label="ADDRESS" />
                    <div className="grid grid-cols-3 gap-4">
                      <InputField label="CITY" />
                      <InputField label="STATE" />
                      <InputField label="ZIP CODE" />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="mt-8 w-full py-3 text-[13px] tracking-[0.15em] font-medium rounded-md transition-all hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                    CONTINUE TO PAYMENT →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="font-display text-xl text-text mb-4">Payment</h2>
                  <div className="p-4 rounded-md mb-6 text-sm text-text-2" style={{ background: 'var(--color-gold-dim)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    🎓 This is a demo — no real payment is processed.
                  </div>
                  <div className="space-y-4">
                    <InputField label="CARD NUMBER" placeholder="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="EXPIRY" placeholder="MM/YY" />
                      <InputField label="CVV" placeholder="123" />
                    </div>
                    <InputField label="NAME ON CARD" />
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 text-sm rounded-md text-text-2 hover:text-text transition-colors" style={{ border: '1px solid var(--color-border)' }}>← Back</button>
                    <button onClick={handlePlaceOrder} className="flex-1 py-3 text-[13px] tracking-[0.15em] font-medium rounded-md transition-all hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>PLACE ORDER</button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 rounded-lg p-6" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                <h3 className="font-display text-lg text-text mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.product_detail.image_url} alt="" className="w-14 h-18 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text truncate">{item.product_detail.name}</p>
                        <p className="text-xs text-text-3">{item.size} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-text-2">${(parseFloat(item.product_detail.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)' }} className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-text-2">Subtotal</span><span className="text-text">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-text-2">Shipping</span><span className={shipping === 0 ? 'text-green' : 'text-text'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-sm font-medium pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <span className="text-text">Total</span><span className="text-gold font-display text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', placeholder = '' }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] text-text-3 tracking-wider block mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-4 py-2.5 text-sm rounded-md outline-none transition-colors focus:border-gold/40" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
    </div>
  );
}
