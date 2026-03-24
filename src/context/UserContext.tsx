import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("shopco_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("shopco_user", JSON.stringify(user));
    else localStorage.removeItem("shopco_user");
  }, [user]);

  const login = (userData: User) => setUser(userData);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shopco_user");
    localStorage.removeItem("shopco_orders");
    localStorage.removeItem("shopco_cart");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
