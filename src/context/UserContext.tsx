import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id?: string;
  name: string;
  surname: string;
  email: string;
  avatar?: string;
  address?: string;
  membership: "Elite" | "Standard";
  role?: "admin" | "user";
  created_at?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const saved = localStorage.getItem("shopco_user");
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (error) {
        console.error("User data parse error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("shopco_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopco_user");
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("shopco_user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("shopco_orders");
    localStorage.removeItem("shopco_cart");
    localStorage.removeItem("shopco_user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
