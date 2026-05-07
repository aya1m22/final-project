import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_MAP: Record<string, { label: string; icon: any; class: string }> = {
  'pending': { label: 'Processing', icon: <Clock size={14} />, class: 'status-processing' },
  'shipped': { label: 'Shipped', icon: <Truck size={14} />, class: 'status-shipped' },
  'delivered': { label: 'Delivered', icon: <CheckCircle2 size={14} />, class: 'status-delivered' },
  'cancelled': { label: 'Cancelled', icon: <XCircle size={14} />, class: 'status-cancelled' },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/api/orders?userId=${user?.id}`)
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <main style={{ paddingTop: 'var(--nav-h)', background: 'var(--grey-100)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="orders-header page-enter">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Account</div>
          <h1 className="display" style={{ fontSize: '3rem' }}>Order <em>History</em></h1>
          <p style={{ color: 'var(--grey-400)', marginTop: 8 }}>Track and manage your recent fashion acquisitions.</p>
        </div>

        {loading ? (
          <div className="orders-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12, marginBottom: 16 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--white)', borderRadius: 12, border: '1px solid var(--grey-200)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 20, opacity: 0.3 }}>🛍️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>No orders yet</h2>
            <p style={{ color: 'var(--grey-400)', marginBottom: 32 }}>Your future favorite outfits are waiting.</p>
            <button className="btn btn-primary" onClick={() => nav('/products')}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status?.toLowerCase()] || STATUS_MAP.pending;
              return (
                <div key={order.id} className="order-card" onClick={() => nav(`/orders/${order.id}`)} role="button" tabIndex={0}>
                  <div className="order-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="order-id">Order #{order.id}</div>
                      <span className={`order-status ${status.class}`}>
                        <span className="status-dot" />
                        {status.label}
                      </span>
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="order-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <div className="order-items-preview">
                        {order.items?.slice(0, 4).map((item: any, idx: number) => (
                          <img 
                            key={idx} 
                            src={item.image || `https://picsum.photos/seed/${item.productId}/100/130`} 
                            className="order-item-thumb" 
                            alt="Product preview" 
                          />
                        ))}
                        {order.items?.length > 4 && (
                          <div className="order-item-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grey-200)', fontSize: '.7rem', fontWeight: 700 }}>
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="order-total-label">Items</div>
                        <div style={{ fontWeight: 600 }}>{order.items?.length} items</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="order-total-label">Total Amount</div>
                        <div className="order-total-val">${order.totalAmount || order.total?.toFixed(2)}</div>
                      </div>
                      <ChevronRight size={20} color="var(--grey-200)" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
