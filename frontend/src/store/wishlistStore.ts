import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: number[];  // product IDs
  toggle: (id: number) => void;
  has: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) => set(state => ({
        items: state.items.includes(id)
          ? state.items.filter(i => i !== id)
          : [...state.items, id]
      })),
      has: (id) => get().items.includes(id),
    }),
    { name: 'aura-wishlist' }
  )
);
