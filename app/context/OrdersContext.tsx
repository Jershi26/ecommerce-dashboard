"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { CartItem } from "./cartcontext"; // ensure correct path

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
  id: string; // use UUID instead of number for uniqueness
  items: CartItem[];
  address: Address;
  total: number;
  delivery: number;
  discount: number;
  date: string;
  status: OrderStatus; // ✅ always required
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
    // Ensure status defaults to "Processing"
    setOrders((prev) => [...prev, { ...order, status: order.status ?? "Processing" }]);
  };

  const clearOrders = () => setOrders([]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within an OrdersProvider");
  return context;
};
