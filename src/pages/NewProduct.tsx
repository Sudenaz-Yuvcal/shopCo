import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productService";
import ProductCard from "../components/Product/ProductCard";
import NewProductBanner from "../sections/new-product/new-product-banner";
import type { Product } from "../types/product";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { slugify } from "../utils/slugify";

const NewProduct = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: rawProducts, isLoading: loading } = useQuery({
    queryKey: ["new-arrivals-page-full"],
    queryFn: async () => {
      const allProducts = await getProducts();

      const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      const processed = allProducts.map((item: any) => {
        const dateSource = item.id
          ? new Date(Date.now() - (100 - item.id) * 3600000).toISOString()
          : new Date().toISOString();
        const productDate = new Date(dateSource).getTime();
        const isActuallyNew = now - productDate <= THREE_DAYS_IN_MS;

        return {
          ...item,
          slug: item.slug || slugify(item.title || item.name || ""),
          category_id: item.category?.id || 0,
          stock: item.stock ?? 0,
          value: item.price,
          image:
            item.images && item.images.length > 0
              ? item.images[0]
              : "/public/shopCO.png",
          rating: item.rating || 4.5,
          oldValue: Math.round(item.price * 1.3),
          category: isActuallyNew ? "NEW" : item.category?.name || "Arrival",
          brand: "SHOP.CO",
        } as Product;
      });

      return processed.sort((a, b) => b.id - a.id);
    },
  });

  const products = useMemo(() => {
    if (!rawProducts || !Array.isArray(rawProducts)) return [] as Product[];
    return rawProducts as Product[];
  }, [rawProducts]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const last = currentPage * itemsPerPage;
    const first = last - itemsPerPage;
    return products.slice(first, last);
  }, [products, currentPage]);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
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
                  <ProductCard
                    key={product.id}
                    {...product}
                    slug={
                      product.slug ||
                      slugify(product.name || product.title || "")
                    }
                  />
                ))}
              </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
