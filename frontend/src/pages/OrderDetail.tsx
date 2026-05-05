import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/api/orders/${id}`)
      .then((r) => r.json())
      .then((b) => setOrder(b))
      .catch(() => setOrder(null));
  }, [id]);

  if (!order) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Order #{order.id}</h2>
      <div>Status: {order.status}</div>
      <div>Created: {order.createdAt}</div>
      <h3>Items</h3>
      {order.items.map((it: any) => (
        <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
          <div>Product #{it.productId}</div>
          <div>Qty: {it.qty}</div>
        </div>
      ))}
      <div style={{ marginTop: 12 }}>Subtotal: ${order.subtotal}</div>
      <div>Shipping: ${order.shipping}</div>
      <div style={{ fontWeight: 700 }}>Total: ${order.total}</div>
    </div>
  );
}
