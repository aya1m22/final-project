import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { open, items } = useCart();
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="nav">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/" className="logo">FashionAI</Link>
        <form onSubmit={onSearch}>
          <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." />
        </form>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/products">Products</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/orders">Orders</Link>
        <button onClick={() => open()} aria-label="Open cart">Cart</button>
        <span className="cart-badge">{items?.length || 0}</span>
        {user ? (
          <>
            <span className="small">{user.email}</span>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <CartDrawer />
    </div>
  );
}
