import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Check, MapPin, Truck, CreditCard, ClipboardList, PartyPopper } from 'lucide-react';

const STEPS = [
  { label: 'Address', icon: <MapPin size={13} /> },
  { label: 'Delivery', icon: <Truck size={13} /> },
  { label: 'Payment', icon: <CreditCard size={13} /> },
  { label: 'Review', icon: <ClipboardList size={13} /> },
];

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ name: '', line1: '', city: '', postalCode: '', country: '', phone: '' });
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');
  const [payment, setPayment] = useState<'cod' | 'card'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const subtotal = useMemo(() => items.reduce((s: number, it: any) => s + (it.price || 0) * it.qty, 0), [items]);
  const shipping = delivery === 'express' ? 15 : 5;
  const total = subtotal + shipping;

  const setAddr = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(a => ({ ...a, [k]: e.target.value }));

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i: any) => ({ productId: i.productId, qty: i.qty })),
          shippingAddress: address, deliveryOption: delivery,
          paymentMethod: payment, userId: user?.id || 'guest',
          card: payment === 'card' ? { number: cardNumber } : undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Order failed');
      setOrderId(body.order?.id || Math.floor(Math.random() * 10000));
      clearCart();
      setStep(4);
    } catch (err: any) {
      alert(err?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const OrderSummary = () => (
    <div className="order-summary-card">
      <div className="order-summary-title">Order Summary</div>
      {items.map((it: any) => (
        <div key={it.productId} className="order-summary-item">
          <img
            src={it.image || `https://picsum.photos/seed/${it.productId}/100/130`}
            alt={it.title}
            className="order-summary-img"
          />
          <div className="order-summary-info">
            <div className="order-summary-name">{it.title || `Product #${it.productId}`}</div>
            <div className="order-summary-meta">Qty: {it.qty}{it.size ? ` · ${it.size}` : ''}</div>
          </div>
          <div className="order-summary-price">${((it.price || 0) * it.qty).toFixed(2)}</div>
        </div>
      ))}
      <div className="order-summary-totals">
        <div className="order-total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="order-total-row"><span>Shipping ({delivery})</span><span>${shipping.toFixed(2)}</span></div>
        <div className="order-total-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
      <div style={{ marginTop: 20, fontSize: '.74rem', color: 'rgba(248,246,242,.35)', lineHeight: 1.6 }}>
        🔒 Secured checkout · Free returns · SSL encrypted
      </div>
    </div>
  );

  if (step === 4) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--grey-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ background: 'var(--white)', borderRadius: 16, padding: '60px 48px', maxWidth: 520, width: '100%', textAlign: 'center', border: '1px solid var(--grey-200)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 24, animation: 'bounce 0.6s ease infinite alternate' }}>🎉</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, marginBottom: 12 }}>
            Order Placed!
          </h1>
          <p style={{ color: 'var(--grey-400)', fontSize: '.95rem', lineHeight: 1.7, marginBottom: 8 }}>
            Thank you for your order. We're preparing your items with care.
          </p>
          <div style={{ background: 'var(--grey-100)', borderRadius: 8, padding: '16px 24px', margin: '24px 0', display: 'inline-block' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--grey-400)', marginBottom: 4 }}>Order Number</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>#{orderId}</div>
          </div>
          <p style={{ fontSize: '.84rem', color: 'var(--grey-400)', marginBottom: 32 }}>
            A confirmation email will be sent to {user?.email || 'your email'}.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => nav('/orders')}>Track My Order</button>
            <button className="btn btn-ghost" onClick={() => nav('/products')}>Continue Shopping</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: 'var(--nav-h)', background: 'var(--grey-100)', minHeight: '100vh' }}>
      <div className="container">
        <div className="checkout-layout">
          <div>
            {/* Header */}
            <div style={{ marginBottom: 8, paddingTop: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Checkout</h1>
            </div>

            {/* Steps */}
            <div className="checkout-steps" role="tablist">
              {STEPS.map((s, i) => (
                <button
                  key={s.label}
                  className={`checkout-step${step === i ? ' active' : ''}${step > i ? ' done' : ''}`}
                  onClick={() => step > i && setStep(i)}
                  role="tab"
                  aria-selected={step === i}
                  style={{ background: 'none', border: 'none', cursor: step > i ? 'pointer' : 'default', fontFamily: 'var(--font-body)' }}
                >
                  <div className="step-num">
                    {step > i ? <Check size={13} /> : i + 1}
                  </div>
                  <span className="step-label">{s.label}</span>
                </button>
              ))}
            </div>

            {/* ── STEP 0: Address ── */}
            {step === 0 && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">Shipping Address</h2>
                <div className="form-grid single" style={{ gap: 16 }}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input id="name" className="form-input" placeholder="Jane Doe" value={address.name} onChange={setAddr('name')} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="phone">Phone</label>
                      <input id="phone" className="form-input" placeholder="+1 555 000 0000" value={address.phone} onChange={setAddr('phone')} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="line1">Street Address</label>
                    <input id="line1" className="form-input" placeholder="123 Fashion Street" value={address.line1} onChange={setAddr('line1')} required />
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label" htmlFor="city">City</label>
                      <input id="city" className="form-input" placeholder="Beirut" value={address.city} onChange={setAddr('city')} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="postal">Postal Code</label>
                      <input id="postal" className="form-input" placeholder="1107 2020" value={address.postalCode} onChange={setAddr('postalCode')} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="country">Country</label>
                    <input id="country" className="form-input" placeholder="Lebanon" value={address.country} onChange={setAddr('country')} required />
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '16px 40px' }}
                    onClick={() => {
                      if (!address.line1 || !address.city) { alert('Please fill in required fields.'); return; }
                      setStep(1);
                    }}
                  >
                    Continue to Delivery →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Delivery ── */}
            {step === 1 && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">Delivery Options</h2>
                <div className="delivery-options">
                  {[
                    { id: 'standard', name: 'Standard Delivery', eta: '3-5 business days', price: '$5.00' },
                    { id: 'express', name: 'Express Delivery', eta: '1-2 business days', price: '$15.00' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      className={`delivery-option${delivery === opt.id ? ' selected' : ''}`}
                      onClick={() => setDelivery(opt.id as any)}
                      role="radio"
                      aria-checked={delivery === opt.id}
                    >
                      <div className="delivery-option-radio" />
                      <div className="delivery-option-info">
                        <div className="delivery-option-name">{opt.name}</div>
                        <div className="delivery-option-eta">{opt.eta}</div>
                      </div>
                      <div className="delivery-option-price">{opt.price}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" style={{ padding: '14px 32px' }} onClick={() => setStep(2)}>Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">Payment Method</h2>
                <div className="payment-options">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
                    { id: 'card', name: 'Credit Card', icon: '💳' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      className={`payment-option${payment === opt.id ? ' selected' : ''}`}
                      onClick={() => setPayment(opt.id as any)}
                      role="radio"
                      aria-checked={payment === opt.id}
                    >
                      <span className="payment-option-icon">{opt.icon}</span>
                      <span className="payment-option-name">{opt.name}</span>
                    </div>
                  ))}
                </div>
                {payment === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-field">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" placeholder="4242 4242 4242 4242" value={cardNumber} onChange={e => setCardNumber(e.target.value)} maxLength={19} />
                    </div>
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="form-label">Expiry</label>
                        <input className="form-input" placeholder="MM / YY" />
                      </div>
                      <div className="form-field">
                        <label className="form-label">CVC</label>
                        <input className="form-input" placeholder="123" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" style={{ padding: '14px 32px' }} onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review ── */}
            {step === 3 && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">Review Your Order</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'Shipping to', value: `${address.name}, ${address.line1}, ${address.city}` },
                    { label: 'Delivery', value: delivery === 'express' ? 'Express (1-2 days)' : 'Standard (3-5 days)' },
                    { label: 'Payment', value: payment === 'cod' ? 'Cash on Delivery' : 'Credit Card' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--grey-100)', fontSize: '.88rem' }}>
                      <span style={{ color: 'var(--grey-400)', fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button
                    id="place-order-btn"
                    className="btn btn-accent"
                    style={{ flex: 1, padding: '16px' }}
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
