"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useOrders, Address as OrderAddress } from "./OrdersContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  qty?: number;
  offer?: number;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem, qtyChange?: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  placeOrder: (address: Address) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { addOrder } = useOrders();

  // ✅ Updated addToCart to support increasing/decreasing quantity
  const addToCart = (item: CartItem, qtyChange: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = (existing.qty || 1) + qtyChange;
        if (newQty <= 0) return prev.filter((i) => i.id !== item.id);
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: newQty } : i
        );
      }
      if (qtyChange > 0) return [...prev, { ...item, qty: qtyChange }];
      return prev;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (address: Address) => {
    if (cart.length === 0) return;
    const order = {
      id: Date.now(),
      items: cart,
      address,
      total: cart.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0),
      delivery: 50,
      discount: 0,
      date: new Date().toISOString(),
    };
    addOrder(order);
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, placeOrder, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
