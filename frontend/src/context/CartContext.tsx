import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartItem {
  id: number; name: string; brand: string; price: number;
  image: string; size: string; color: string; quantity: number;
}

interface CartContextValue {
  items: CartItem[]; isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  openCart: () => void; closeCart: () => void;
  total: number; itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const existing = current.find(item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color);
      if (existing) {
        return current.map(item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) { setItems(current => current.filter(item => item.id !== id)); return; }
    setItems(current => current.map(item => item.id === id ? { ...item, quantity } : item));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, addItem, removeItem, updateQuantity,
      openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      total, itemCount
    }}>
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
