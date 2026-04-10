import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RiEqualizerLine, RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import Button from "../components/Ui/Button";
import CategorySidebar from "../sections/category/category-sidebar";
import ProductGrid from "../sections/category/category-product-grid";
import { getProducts } from "../api/productService";
import { getCleanProducts } from "../utils/filterProducts";
import type { Product } from "../types/product";
import type { FilterState } from "../types/filter";

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const searchQuery = searchParams.get("search");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const initialFilters: FilterState = {
    color: null,
    price: 1000,
    selectedCategories: [],
    size: null,
    selectedBrands: [],
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [tempFilters, setTempFilters] = useState<FilterState>({
    ...initialFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ...initialFilters,
  });

  const CATEGORY_MAP = [
    { name: "Clothes", label: "Giyim" },
    { name: "Shoes", label: "Ayakkabı" },
    { name: "Electronics", label: "Elektronik" },
    { name: "Miscellaneous", label: "Aksesuar" },
  ];

  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ["category-products"],
    queryFn: async () => {
      
      const rawData = await getProducts();
      return getCleanProducts(rawData as unknown as import("../types/api").APIProduct[]);
    },
    staleTime: 1000 * 60 * 5,
  });
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const searchMatch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const priceMatch = p.value <= appliedFilters.price;
        const brandFilterMatch =
          appliedFilters.selectedBrands.length === 0 ||
          appliedFilters.selectedBrands.includes(p.brand?.toUpperCase() || "");

        const urlCategoryMatch =
          !categoryParam ||
          p.category.toLowerCase() === categoryParam.toLowerCase();
        const sidebarCategoryMatch =
          appliedFilters.selectedCategories.length === 0 ||
          appliedFilters.selectedCategories.includes(p.category);

        return (
          searchMatch &&
          priceMatch &&
          brandFilterMatch &&
          urlCategoryMatch &&
          sidebarCategoryMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.value - b.value;
        if (sortBy === "price-high") return b.value - a.value;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [products, searchQuery, appliedFilters, sortBy, categoryParam]);

  const currentProducts = useMemo(() => {
    const lastIndex = currentPage * productsPerPage;
    const firstIndex = lastIndex - productsPerPage;
    return filteredProducts.slice(firstIndex, lastIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const resetToFirstPage = () => setCurrentPage(1);

  const handleApplyFilter = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
    resetToFirstPage();
  };

  const handleResetFilters = () => {
    setTempFilters({ ...initialFilters });
    setAppliedFilters({ ...initialFilters });
    setSearchParams({});
    resetToFirstPage();
  };

  const handleBrandToggle = (brand: string) =>
    setTempFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));

  const handleCategoryToggle = (cat: string) =>
    setTempFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((i) => i !== cat)
        : [...prev.selectedCategories, cat],
    }));

  const displayTitle =
    brandParam ||
    (searchQuery ? `"${searchQuery}"` : categoryParam) ||
    "MAĞAZA";

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{displayTitle} | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em] italic">
            <Link to="/" className="hover:text-black transition-colors">
              ANA SAYFA
            </Link>
            <span>/</span>
            <span className="text-black">MAĞAZA</span>
          </div>
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden !w-12 !h-12 !p-0 !bg-black text-white rounded-full"
          >
            <RiEqualizerLine size={20} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="hidden lg:block w-72 sticky top-24">
            <CategorySidebar
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              handleApplyFilter={handleApplyFilter}
              handleResetFilters={handleResetFilters}
              handleBrandToggle={handleBrandToggle}
              handleCategoryToggle={handleCategoryToggle}
              BRANDS={BRANDS}
              CATEGORIES={CATEGORY_MAP.map((c) => c.name)}
              COLOR_OPTIONS={[
                { name: "Siyah", id: "black", tailwind: "bg-black" },
              ]}
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 px-2">
              <h1 className="text-5xl md:text-3xl font-[1000] text-black uppercase italic tracking-tighter leading-none">
                {displayTitle}
              </h1>
              <div className="flex flex-col md:items-end gap-2">
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">
                  {loading
                    ? "ARANIYOR..."
                    : `${filteredProducts.length} TASARIM LİSTELENDİ`}
                </p>

                <div className="flex items-center gap-2 border-b-2 border-black/5 pb-1">
                  <span className="text-zinc-400 text-[10px] font-black uppercase italic">
                    Sırala:
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        resetToFirstPage();
                      }}
                      className="appearance-none bg-transparent pr-6 font-black text-[11px] uppercase italic text-black outline-none cursor-pointer"
                    >
                      <option value="popular">En Popüler</option>
                      <option value="price-low">Düşük Fiyat</option>
                      <option value="price-high">Yüksek Fiyat</option>
                    </select>
                    <RiArrowDownSLine className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-[40px]"
                  />
                ))}
              </div>
            ) : (
              <>
                <ProductGrid
                  products={currentProducts}
                  handleResetFilters={handleResetFilters}
                />

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-20 mb-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 disabled:opacity-20 hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <RiArrowDownSLine className="rotate-90" size={20} />
                    </button>

                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-12 h-12 rounded-full font-black italic transition-all duration-300 ${
                            currentPage === i + 1
                              ? "bg-black text-white scale-110 shadow-2xl"
                              : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 disabled:opacity-20 hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <RiArrowDownSLine className="-rotate-90" size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[500] flex items-end md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
              <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">
                FİLTRELER
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
              >
                <RiCloseLine size={28} />
              </button>
            </div>
            <CategorySidebar
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              handleApplyFilter={handleApplyFilter}
              handleResetFilters={handleResetFilters}
              handleBrandToggle={handleBrandToggle}
              handleCategoryToggle={handleCategoryToggle}
              BRANDS={BRANDS}
              CATEGORIES={CATEGORY_MAP.map((c) => c.name)}
              COLOR_OPTIONS={[
                { name: "Siyah", id: "black", tailwind: "bg-black" },
              ]}
            />
            <Button
              onClick={handleApplyFilter}
              className="w-full !rounded-full italic font-[1000] mt-10 !py-6 text-xl tracking-[0.2em] shadow-xl"
            >
              UYGULA
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
