"use client";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
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

  // ✅ Add / update cart
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

  // ✅ Place order
  const placeOrder = (address: OrderAddress) => {
    if (cart.length === 0) return;

    const total = cart.reduce(
      (sum, i) =>
        sum +
        (i.price - (i.offer ? (i.price * i.offer) / 100 : 0)) * (i.qty || 1),
      0
    );

    const order = {
      id: crypto.randomUUID(),
      items: cart,
      address,
      total,
      delivery: 50,
      discount: 0,
      date: new Date().toISOString(),
      status: "Processing" as const, // ✅ always included
    };

    addOrder(order);
    setCart([]);
  };

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, clearCart, placeOrder, setCart }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
