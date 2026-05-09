import { create } from 'zustand';
import client from '../api/client';
import { useAuthStore } from './authStore';

export interface CartItem {
  id: number;
  product: number;
  product_detail: {
    id: number;
    name: string;
    price: string;
    image_url: string;
    category_name: string;
  };
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number, size: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,

  fetchCart: async () => {
    if (!useAuthStore.getState().isAuthenticated) return;
    set({ isLoading: true });
    try {
      const response = await client.get('/orders/cart/');
      set({ items: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart', error);
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity, size, color = '') => {
    set({ isLoading: true });
    try {
      await client.post('/orders/cart/', {
        product_id: productId,
        quantity,
        size,
        color,
      });
      await get().fetchCart();
      set({ isOpen: true, isLoading: false });
    } catch (error) {
      console.error('Failed to add to cart', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await client.patch(`/orders/cart/${itemId}/`, { quantity });
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  },

  removeFromCart: async (itemId) => {
    try {
      await client.delete(`/orders/cart/${itemId}/`);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  },

  clearCart: async () => {
    try {
      await client.delete('/orders/cart/clear/');
      set({ items: [] });
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
