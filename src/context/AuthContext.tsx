'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Order, UserReview } from '@/lib/db';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'register' | 'login';
  openAuthModal: (mode?: 'register' | 'login') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  orders: Order[];
  reviews: UserReview[];
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'rezoni_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
  }, []);

  const openAuthModal = (mode: 'register' | 'login' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Registration failed' };
      }
      setUser(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'An unexpected error occurred' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Login failed' };
      }
      setUser(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const refreshUser = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success && data.order) {
        setUser((prev) => {
          if (!prev) return null;
          const updated = { ...prev, orders: [data.order, ...(prev.orders || []).filter((o) => o.id !== data.order.id)] };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        orders: user?.orders || [],
        reviews: user?.reviews || [],
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
