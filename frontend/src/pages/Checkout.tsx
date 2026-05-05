import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<any>({ name: '', line1: '', city: '', postalCode: '', country: '', phone: '' });
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');
  const [payment, setPayment] = useState<'cod' | 'card'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const nav = useNavigate();

  const subtotal = useMemo(() => items.reduce((s: number, it: any) => s + (it.price || 0) * it.qty, 0), [items]);
  const shipping = delivery === 'express' ? 15 : 5;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    if (items.length === 0) return alert('Cart is empty');
    if (!address.line1 || !address.city) return alert('Please provide shipping address');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i: any) => ({ productId: i.productId, qty: i.qty })),
          shippingAddress: address,
          deliveryOption: delivery,
          paymentMethod: payment,
          userId: user ? user.id : 'guest',
          card: payment === 'card' ? { number: cardNumber } : undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Order failed');
      setOrderId(body.order.id);
      clearCart();
      setStep(4);
    } catch (err: any) {
      alert(err?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 2 }}>
          {step === 0 && (
            <div>
              <h3>Shipping Address</h3>
              <div>
                <label>Name</label>
                <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
              </div>
              <div>
                <label>Address line</label>
                <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              </div>
              <div>
                <label>City</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <label>Postal code</label>
                <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
              </div>
              <div>
                <label>Country</label>
                <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setStep(1)}>Continue to delivery</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3>Delivery Options</h3>
              <div>
                <label>
                  <input type="radio" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} /> Standard (5$)
                </label>
              </div>
              <div>
                <label>
                  <input type="radio" checked={delivery === 'express'} onChange={() => setDelivery('express')} /> Express (15$)
                </label>
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setStep(0)}>Back</button>
                <button onClick={() => setStep(2)} style={{ marginLeft: 8 }}>Continue to payment</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>Payment</h3>
              <div>
                <label>
                  <input type="radio" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> Cash on Delivery
                </label>
              </div>
              <div>
                <label>
                  <input type="radio" checked={payment === 'card'} onChange={() => setPayment('card')} /> Card
                </label>
                {payment === 'card' && (
                  <div>
                    <label>Card number</label>
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setStep(1)}>Back</button>
                <button onClick={() => setStep(3)} style={{ marginLeft: 8 }}>Review order</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Review</h3>
              <div>
                {items.map((it: any) => (
                  <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
                    <div>{it.title}</div>
                    <div>{it.qty} x ${it.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8 }}>
                <div>Subtotal: ${subtotal}</div>
                <div>Shipping: ${shipping}</div>
                <div style={{ fontWeight: 700 }}>Total: ${total}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setStep(2)}>Back</button>
                <button onClick={placeOrder} style={{ marginLeft: 8 }} disabled={loading}>{loading ? 'Placing...' : 'Place order'}</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3>Order placed</h3>
              <p>Your order {orderId} was placed successfully.</p>
              <button onClick={() => nav('/orders')}>View orders</button>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div className="card">
            <h4>Summary</h4>
            <div>Items: {items.length}</div>
            <div>Subtotal: ${subtotal}</div>
            <div>Shipping: ${shipping}</div>
            <div style={{ fontWeight: 700 }}>Total: ${total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
