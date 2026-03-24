import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";

export interface CartItem extends Omit<Product, "size"> {
  size: string;
  quantity: number;
  color: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    size: string,
    color: string,
  ) => void;
  removeFromCart: (id: number, size: string, color: string) => void;
  updateQuantity: (
    id: number,
    size: string,
    color: string,
    delta: number,
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart =
      typeof window !== "undefined"
        ? localStorage.getItem("shopco_cart")
        : null;
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("shopco_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity: number,
    size: string,
    color: string,
  ) => {
    setCart((prev) => {
      const index = prev.findIndex(
        (item) =>
          item.id === product.id && item.size === size && item.color === color,
      );
      if (index > -1) {
        return prev.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prev, { ...product, quantity, size, color }];
    });
  };

  const removeFromCart = (id: number, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color),
      ),
    );
  };

  const updateQuantity = (
    id: number,
    size: string,
    color: string,
    delta: number,
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
