import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/Product/ProductCard";
import NewProductBanner from "../sections/new-product/new-product-banner";
import type { APIProduct } from "../types/api";
import { getCleanProducts } from "../utils/filterProducts";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const NewProduct = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["new-arrivals-page-full"],
    queryFn: async () => {
      const res = await axiosInstance.get<APIProduct[]>(
        "/products?offset=0&limit=100",
      );
      const cleaned = getCleanProducts(res.data);
      const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      const processed = (cleaned as any[])
        .map((product) => {
          const dateSource =
            product.creationAt || product.createdAt || new Date();
          const productDate = new Date(dateSource).getTime();
          const isActuallyNew = now - productDate <= THREE_DAYS_IN_MS;

          return {
            ...product,
            oldValue: Math.round(product.price * 1.3),
            category: isActuallyNew ? "NEW" : "Arrival",
          };
        })
        .sort((a, b) => b.id - a.id);

      const realNewOnes = processed.filter((p) => p.category === "NEW");

      return realNewOnes.length > 0 ? realNewOnes : processed;
    },
  });

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const last = currentPage * itemsPerPage;
    const first = last - itemsPerPage;
    return products.slice(first, last);
  }, [products, currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, "...", currentPage, "...", totalPages);
    }
    return pages;
  };

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
                ({loading ? "..." : products.length})
              </span>
            </h2>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
                {currentItems.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-20 flex items-center justify-between border-t border-zinc-100 pt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl hover:bg-black hover:text-white transition-all disabled:opacity-30"
                  >
                    <HiChevronLeft size={20} />{" "}
                    <span className="hidden md:inline font-bold uppercase text-xs">
                      Geri
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    {renderPageNumbers().map((number, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof number === "number" && setCurrentPage(number)
                        }
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl hover:bg-black hover:text-white transition-all disabled:opacity-30"
                  >
                    <span className="hidden md:inline font-bold uppercase text-xs">
                      İleri
                    </span>{" "}
                    <HiChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
