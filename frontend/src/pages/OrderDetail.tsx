import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, ReceiptText } from 'lucide-react';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/api/orders/${id}`)
      .then(r => r.json())
      .then(data => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 120 }}><div className="skeleton" style={{ height: 400, borderRadius: 12 }} /></div>;
  if (!order) return <div className="container" style={{ paddingTop: 120 }}>Order not found</div>;

  const currentStatusIdx = STATUS_STEPS.indexOf(order.status?.toLowerCase() || 'pending');

  return (
    <main style={{ paddingTop: 'var(--nav-h)', background: 'var(--grey-100)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingBottom: 80 }}>
        
        {/* Back Link */}
        <button onClick={() => nav('/orders')} className="section-link" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0', border: 'none' }}>
          <ChevronLeft size={16} /> Back to Orders
        </button>

        <div className="checkout-layout">
          <div>
            <div className="checkout-card page-enter">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <div className="order-id" style={{ marginBottom: 4 }}>Order #{order.id}</div>
                  <h1 className="display" style={{ fontSize: '2.5rem' }}>Details</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="order-total-label">Ordered on</div>
                  <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="order-timeline">
                {[
                  { label: 'Order Placed', date: order.createdAt, icon: <ReceiptText size={16} /> },
                  { label: 'Processing', date: order.updatedAt, icon: <Clock size={16} /> },
                  { label: 'Shipped', date: null, icon: <Truck size={16} /> },
                  { label: 'Delivered', date: null, icon: <CheckCircle2 size={16} /> },
                ].map((step, idx) => {
                  const isDone = idx <= currentStatusIdx;
                  const isCurrent = idx === currentStatusIdx;
                  return (
                    <div key={idx} className="timeline-item">
                      <div className={`timeline-dot ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                        {step.icon}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-label" style={{ color: isDone ? 'var(--black)' : 'var(--grey-400)' }}>{step.label}</div>
                        {isDone && step.date && (
                          <div className="timeline-date">
                            {new Date(step.date).toLocaleDateString()} at {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pdp-divider" />

              {/* Items List */}
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: 20, padding: '16px', background: 'var(--white)', border: '1px solid var(--grey-200)', borderRadius: 8 }}>
                    <img 
                      src={item.image || `https://picsum.photos/seed/${item.productId}/100/130`} 
                      style={{ width: 64, height: 80, borderRadius: 4, objectFit: 'cover' }} 
                      alt="Product" 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.title || `Product #${item.productId}`}</div>
                      <div className="text-small text-muted" style={{ marginTop: 4 }}>
                        Qty: {item.qty} {item.size && `· Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <div className="checkout-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <MapPin size={20} color="var(--accent)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Shipping Address</h3>
                </div>
                <div className="text-small" style={{ lineHeight: 1.8 }}>
                  <strong>{order.shippingAddress?.name || 'Customer Name'}</strong><br />
                  {order.shippingAddress?.line1}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.country}
                </div>
              </div>
              <div className="checkout-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <CreditCard size={20} color="var(--accent)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Payment Info</h3>
                </div>
                <div className="text-small" style={{ lineHeight: 1.8 }}>
                  <div style={{ textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{order.paymentMethod}</div>
                  <div className="text-muted">Status: Paid</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Summary */}
          <div className="order-summary-card">
            <div className="order-summary-title">Summary</div>
            <div className="order-summary-totals">
              <div className="order-total-row"><span>Subtotal</span><span>${(order.totalAmount - (order.shippingFee || 5)).toFixed(2)}</span></div>
              <div className="order-total-row"><span>Shipping</span><span>${(order.shippingFee || 5).toFixed(2)}</span></div>
              <div className="order-total-row total"><span>Total</span><span>${order.totalAmount?.toFixed(2)}</span></div>
            </div>
            <button className="btn btn-white full-width" style={{ marginTop: 24 }} onClick={() => window.print()}>
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
