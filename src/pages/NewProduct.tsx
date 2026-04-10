import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/Product/ProductCard";
import NewProductBanner from "../sections/new-product/new-product-banner";
import type { APIProduct } from "../types/api";
import { getCleanProducts } from "../utils/filterProducts";

const NewProduct = () => {
  const { data: newArrivals = [], isLoading: loading } = useQuery({
    queryKey: ["new-arrivals-page"],
    queryFn: async () => {
      const res = await axiosInstance.get<APIProduct[]>(
        "/products?offset=20&limit=20",
      );

      const cleaned = getCleanProducts(res.data);

      return cleaned
        .map((product) => ({
          ...product,
          oldValue: Math.round(product.price * 1.3),
          category: product.category || "New Arrival",
        }))
        .sort((a, b) => b.id - a.id);
    },
  });

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Yeni Gelenler | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <NewProductBanner />

        <div className="mt-32 w-full">
          <div className="flex items-end justify-between mb-16 border-b-[6px] border-black pb-8">
            <h2 className="text-4xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-none text-black">
              KEŞFET{" "}
              <span className="text-zinc-200">
                ({loading ? "..." : newArrivals.length})
              </span>
            </h2>
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.4em]">
                ELITE CURATION SERIES
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-[40px]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
