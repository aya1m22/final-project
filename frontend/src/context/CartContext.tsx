import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type CartItem = { productId: number; qty: number; title?: string; price?: number };

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (item: CartItem) => {
    // simple local merge
    setItems((s) => {
      const found = s.find((it) => it.productId === item.productId);
      if (found) return s.map((it) => (it.productId === item.productId ? { ...it, qty: it.qty + item.qty } : it));
      return [...s, item];
    });
  };

  const removeFromCart = (productId: number) => setItems((s) => s.filter((i) => i.productId !== productId));
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ open: () => setOpenDrawer(true), close: () => setOpenDrawer(false), openDrawer, items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
