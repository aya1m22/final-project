import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import client from '../api/client';

interface Order { id: number; total_price: string; status: string; created_at: string; items: any[]; }

export default function ProfilePage() {
  const { user, logout, fetchProfile } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    client.get('/orders/').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-gold tracking-[0.3em] uppercase text-[11px] mb-2">Account</p>
            <h1 className="font-display text-3xl text-text font-light">
              Hello, {user?.first_name || user?.username}
            </h1>
          </div>
          <button onClick={logout} className="px-4 py-2 text-sm text-text-3 hover:text-red rounded-md transition-colors" style={{ border: '1px solid var(--color-border)' }}>
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="rounded-lg p-6" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-display text-lg text-text mb-4">Profile Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-text-3 tracking-wider mb-0.5">NAME</p>
                <p className="text-sm text-text">{user?.first_name} {user?.last_name}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-3 tracking-wider mb-0.5">EMAIL</p>
                <p className="text-sm text-text">{user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-3 tracking-wider mb-0.5">USERNAME</p>
                <p className="text-sm text-text">{user?.username}</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="md:col-span-2">
            <h3 className="font-display text-lg text-text mb-4">Order History</h3>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 rounded-md animate-shimmer" />)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 rounded-lg" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                <p className="text-text-2 text-sm mb-1">No orders yet</p>
                <p className="text-text-3 text-xs">Your order history will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="p-4 rounded-lg" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text">Order #{order.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-sm text-gold" style={{ background: 'var(--color-gold-dim)' }}>{order.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-3">
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="font-display text-sm text-gold">${parseFloat(order.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
