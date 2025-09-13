"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { CartItem } from "./cartcontext"; // Ensure CartItem is exported from cartcontext

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Out for Delivery" | "Delivered";

export interface Order {
  id: number;
  items: CartItem[];
  address: Address;
  total: number;
  delivery: number;
  discount: number;
  date: string;
  status?: OrderStatus; // New field for tracking
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    // Default new order status: Processing
    setOrders((prev) => [...prev, { ...order, status: "Processing" }]);
  };

  const clearOrders = () => setOrders([]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

// Custom hook to use OrdersContext
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context)
    throw new Error("useOrders must be used within an OrdersProvider");
  return context;
};
