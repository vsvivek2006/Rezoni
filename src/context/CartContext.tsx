'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  device?: string;
  color?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rezoni_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (i): i is CartItem =>
              Boolean(i) &&
              typeof i === 'object' &&
              Boolean(i.id) &&
              typeof i.price === 'number' &&
              !isNaN(i.price)
          );
          setCart(validItems);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('rezoni_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      const existing = currentList.find((i) => i && i.id === item.id);
      if (existing) {
        return currentList.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
        );
      }
      return [...currentList, { ...item, quantity: item.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => (Array.isArray(prev) ? prev.filter((i) => i && i.id !== id) : []));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev
        .map((i) => {
          if (!i) return null;
          if (i.id === id) {
            const newQty = (i.quantity || 1) + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const safeCart = Array.isArray(cart) ? cart : [];
  const totalCount = safeCart.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  const totalPrice = safeCart.reduce(
    (sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
