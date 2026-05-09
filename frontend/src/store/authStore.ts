import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import client from '../api/client';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await client.post('/auth/login/', credentials);
          const { access, refresh, user } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await client.post('/auth/register/', data);
          const { access, refresh, user } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        if (!get().isAuthenticated) return;
        try {
          const response = await client.get('/auth/profile/');
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to fetch profile', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      // We only persist the user state, tokens are in localStorage directly
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
