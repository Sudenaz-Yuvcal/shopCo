import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
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
  applyPromoCode: (code: string) => { success: boolean; message: string };
  isPromoApplied: boolean;
  appliedPromoCode: string;
  totals: {
    raw: number;
    subtotal: number;
    itemDiscount: number;
    promoDiscount: number;
    delivery: number;
    final: number;
  };
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

  const [appliedPromoCode, setAppliedPromoCode] = useState("");
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

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.value * item.quantity,
      0,
    );
    const raw = cart.reduce(
      (acc, item) => acc + (item.oldValue || item.value) * item.quantity,
      0,
    );

    let promoDiscount = 0;
    if (appliedPromoCode === "SUDE30") promoDiscount = subtotal * 0.3;
    if (appliedPromoCode === "HOSGELDIN50" && subtotal >= 500)
      promoDiscount = subtotal * 0.5;

    const delivery =
      subtotal - promoDiscount >= 300 || cart.length === 0 ? 0 : 15;
    const final = subtotal - promoDiscount + delivery;

    return {
      raw,
      subtotal,
      itemDiscount: raw - subtotal,
      promoDiscount,
      delivery,
      final,
    };
  }, [cart, appliedPromoCode]);

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setAppliedPromoCode("");
      return { success: true, message: "" };
    }

    if (cleanCode === "SUDE30") {
      setAppliedPromoCode("SUDE30");
      return { success: true, message: "%30 İndirim Uygulandı!" };
    }
    if (cleanCode === "HOSGELDIN50") {
      if (totals.subtotal >= 500) {
        setAppliedPromoCode("HOSGELDIN50");
        return { success: true, message: "%50 Hoş Geldin İndirimi Uygulandı!" };
      }
      return { success: false, message: "Bu kod için alt limit 500 TL'dir." };
    }
    return { success: false, message: "Geçersiz promosyon kodu." };
  };

  useEffect(() => {
    localStorage.setItem("shopco_cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode("");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        isPromoApplied: !!appliedPromoCode,
        appliedPromoCode,
        totals,
      }}
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
