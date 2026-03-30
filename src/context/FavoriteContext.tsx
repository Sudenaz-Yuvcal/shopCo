import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";

interface FavoriteContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isInFavorites: (id: number) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shopco_favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInFavorites = (id: number) =>
    favorites.some((item) => item.id === id);

  useEffect(() => {
    localStorage.setItem("shopco_favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteContext.Provider
      value={{
        favorites, 
        toggleFavorite, 
        isInFavorites, 
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite, FavoriteProvider içinde kullanılmalıdır!");
  }
  return context;
};
