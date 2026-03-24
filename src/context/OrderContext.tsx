import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  value: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: "Hazırlanıyor" | "Kargoda" | "Teslim Edildi";
}

interface OrderContextType {
  orders: Order[];
  addOrder: (cartItems: OrderItem[], totalAmount: number) => string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("shopco_orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("shopco_orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (cartItems: OrderItem[], totalAmount: number) => {
    const orderId = `#SC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      total: totalAmount,
      items: [...cartItems],
      status: "Hazırlanıyor",
    };

    setOrders((prev) => [newOrder, ...prev]);
    return orderId;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within a OrderProvider");
  return context;
};