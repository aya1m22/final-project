import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const userId = user ? user.id : 'guest';
    fetch(`http://localhost:4000/api/orders?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((b) => setOrders(b.orders || []))
      .catch(() => setOrders([]));
  }, [user]);

  return (
    <div className="container">
      <h2>Your Orders</h2>
      {orders.length === 0 && <div>No orders found</div>}
      {orders.map((o) => (
        <div key={o.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Order #{o.id}</div>
            <div>{o.createdAt}</div>
          </div>
          <div>Status: {o.status}</div>
          <div>Total: ${o.total}</div>
          <div style={{ marginTop: 8 }}>
            <Link to={`/orders/${o.id}`}>View</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
