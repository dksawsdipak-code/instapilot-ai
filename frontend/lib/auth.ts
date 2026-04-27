'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  signup: (email: string, full_name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  isAuthenticated: () => boolean;
  getAuthHeader: () => { Authorization?: string };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      
      setUser: (user: User) => set({ user }),
      setTokens: (accessToken: string, refreshToken: string) => 
        set({ accessToken, refreshToken }),
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      signup: async (email: string, full_name: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, full_name, password }),
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Signup failed');
          }
          
          const data = await response.json();
          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Login failed');
          }
          
          const data = await response.json();
          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },
      
      isAuthenticated: () => {
        const { accessToken } = get();
        return !!accessToken;
      },
      
      getAuthHeader: () => {
        const { accessToken } = get();
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      },
    }),
    {
      name: 'auth-storage',
      // Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
