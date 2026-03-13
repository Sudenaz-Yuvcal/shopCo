import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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

interface User {
  name: string;
  surname: string;
  email: string;
  avatar?: string;
  address?: string;
  membership: "Elite" | "Standard";
}

interface UserContextType {
  user: User | null;
  orders: Order[];
  login: (userData: User) => void;
  logout: () => void;
  addOrder: (cartItems: OrderItem[], totalAmount: number) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("shopco_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("shopco_orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) localStorage.setItem("shopco_user", JSON.stringify(user));
    else localStorage.removeItem("shopco_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("shopco_orders", JSON.stringify(orders));
  }, [orders]);

  const login = (userData: User) => setUser(userData);

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem("shopco_user");
    localStorage.removeItem("shopco_orders");
    localStorage.removeItem("shopco_cart");
  };

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
    <UserContext.Provider value={{ user, orders, login, logout, addOrder }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
