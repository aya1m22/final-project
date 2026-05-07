import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 transition-opacity" onClick={closeCart} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-sm tracking-widest uppercase">Your Bag ({items.length})</h2>
          <button onClick={closeCart} className="text-foreground hover:text-accent transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-foreground-muted mb-4" />
              <p className="text-foreground-secondary mb-2">Your bag is empty</p>
              <button onClick={closeCart} className="text-accent text-sm hover:underline">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-background-elevated" />
                  <div className="flex-1">
                    <p className="text-xs text-foreground-muted uppercase tracking-wider">{item.brand}</p>
                    <p className="text-sm text-foreground mt-1">{item.name}</p>
                    <p className="text-xs text-foreground-muted mt-1">Size: {item.size} | Color: {item.color}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-background-elevated transition-colors"><Minus size={14} /></button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-background-elevated transition-colors"><Plus size={14} /></button>
                      </div>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-foreground-muted hover:text-error transition-colors self-start"><X size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between text-sm"><span className="text-foreground-secondary">Subtotal</span><span className="text-foreground">${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-foreground-secondary">Shipping</span><span className="text-foreground">Free</span></div>
            <div className="flex justify-between text-base font-medium pt-4 border-t border-border"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button className="w-full btn-primary py-4">Checkout</button>
            <button onClick={closeCart} className="w-full btn-secondary py-4">Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}
