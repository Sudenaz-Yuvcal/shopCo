import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useFavorite } from "../context/FavoriteContext";
import DiscountBanner from "../sections/discount/discount-banner";
import DiscountHeader from "../sections/discount/discount-header";
import DiscountGrid from "../sections/discount/discount-grid";
import type { APIProduct } from "../types/api";
import { getCleanProducts } from "../utils/filterProducts";

const Discount = () => {
  const { toggleFavorite, isInFavorites } = useFavorite();

  const { data: discountProducts = [], isLoading: loading } = useQuery({
    queryKey: ["discount-products"],
    queryFn: async () => {
      const res = await axiosInstance.get<APIProduct[]>(
        "/products?offset=15&limit=30",
      );

      const cleaned = getCleanProducts(res.data);

      return cleaned
        .map((product) => {
          const hasDiscount = Math.random() > 0.3; 
          const oldPrice = hasDiscount
            ? Math.floor(product.price * 1.4)
            : undefined;

          return {
            ...product,
            oldValue: oldPrice,
            category: product.category || "İndirim",
          };
        })
        .filter((p) => p.oldValue && p.oldValue > p.price); 
    },
  });

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>İndirim Fırsatları | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <DiscountBanner />

        {loading ? (
          <div className="mt-16 flex flex-col items-center gap-4 animate-pulse">
            <div className="h-1 bg-black w-32" />
            <div className="italic font-[1000] text-2xl text-black uppercase tracking-tighter">
              FIRSATLAR YÜKLENİYOR...
            </div>
            <div className="h-1 bg-black w-32" />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <DiscountHeader count={discountProducts.length} />
            <DiscountGrid
              products={discountProducts}
              toggleFavorite={toggleFavorite}
              isInFavorites={isInFavorites}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Discount;
