import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productService";
import { useFavorite } from "../context/FavoriteContext";
import DiscountBanner from "../sections/discount/discount-banner";
import DiscountHeader from "../sections/discount/discount-header";
import DiscountGrid from "../sections/discount/discount-grid";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { Product } from "../types/product";

const Discount = () => {
  const { toggleFavorite, isInFavorites } = useFavorite();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: discountProducts = [], isLoading: loading } = useQuery<
    Product[]
  >({
    queryKey: ["discount-products"],
    queryFn: async (): Promise<Product[]> => {
      const allProducts = await getProducts();

      return allProducts
        .map((product: any) => {
          const hasOldPrice = product.price * 1.4;

          return {
            ...product,
            stock: product.stock ?? 0,
            value: product.price,
            image: product.images?.[0] || "",
            rating: product.rating || 4.5,
            oldValue: Math.round(hasOldPrice),
            category: "Discounted",
          } as Product;
        })
        .filter((p) => p.oldValue && p.oldValue > p.price);
    },
  });

  const productsArray = Array.isArray(discountProducts)
    ? (discountProducts as Product[])
    : [];

  const totalPages = Math.ceil(productsArray.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const last = currentPage * itemsPerPage;
    const first = last - itemsPerPage;
    return productsArray.slice(first, last);
  }, [productsArray, currentPage]);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

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
            <DiscountHeader count={productsArray.length} />

            <DiscountGrid
              products={currentItems}
              toggleFavorite={toggleFavorite}
              isInFavorites={isInFavorites}
            />

            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-between border-t border-zinc-100 pt-8">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl hover:bg-black hover:text-white transition-all disabled:opacity-30"
                >
                  <HiChevronLeft size={20} />
                  <span className="hidden md:inline font-bold uppercase text-xs">
                    Geri
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {renderPageNumbers().map((number, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (typeof number === "number") {
                          setCurrentPage(number);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === number
                          ? "bg-black text-white"
                          : "hover:bg-zinc-100 text-zinc-400"
                      } ${number === "..." ? "cursor-default text-zinc-300" : ""}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl hover:bg-black hover:text-white transition-all disabled:opacity-30"
                >
                  <span className="hidden md:inline font-bold uppercase text-xs">
                    İleri
                  </span>
                  <HiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discount;
