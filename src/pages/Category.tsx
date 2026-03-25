import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import { ALL_PRODUCTS } from "../constants/Product";
import { RiEqualizerLine, RiCloseLine } from "react-icons/ri";
import Button from "../components/ui/Button";
import CategorySidebar from "../sections/category/category-sidebar";
import ProductGrid from "../sections/category/product-grid";
import type { Product } from "../types/product";

interface FilterState {
  color: string | null;
  price: number;
  selectedCategories: string[];
  size: string | null;
  selectedBrands: string[];
}

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const searchQuery = searchParams.get("search");

  const initialFilters: FilterState = {
    color: null,
    price: 500,
    selectedCategories: [],
    size: null,
    selectedBrands: [],
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>({
    ...initialFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ...initialFilters,
  });

  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];
  const CATEGORIES = ["T-shirts", "Shorts", "Jeans"];
  const COLOR_OPTIONS = [
    { name: "Kahverengi", id: "khaki", tailwind: "bg-khaki" },
    { name: "Yeşil", id: "green", tailwind: "bg-green" },
    { name: "Mavi", id: "denim", tailwind: "bg-denim" },
  ];

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p: Product) => {
      const categoryMatch =
        !categoryParam ||
        p.category.toLowerCase() === categoryParam.toLowerCase();

      const urlBrandMatch =
        !brandParam || p.brand?.toUpperCase() === brandParam.toUpperCase();

      const searchMatch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());

      const brandFilterMatch =
        appliedFilters.selectedBrands.length === 0 ||
        appliedFilters.selectedBrands.includes(p.brand?.toUpperCase() || "");

      const priceMatch = p.value <= appliedFilters.price;

      const colorMatch =
        !appliedFilters.color || p.color === appliedFilters.color;

      return (
        categoryMatch &&
        urlBrandMatch &&
        searchMatch &&
        brandFilterMatch &&
        priceMatch &&
        colorMatch
      );
    });
  }, [categoryParam, brandParam, searchQuery, appliedFilters]);

  const handleApplyFilter = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setTempFilters({ ...initialFilters });
    setAppliedFilters({ ...initialFilters });
    setSearchParams({});
  };

  const handleCategoryToggle = (cat: string) =>
    setTempFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }));

  const handleBrandToggle = (brand: string) =>
    setTempFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));

  const displayTitle =
    brandParam ||
    (searchQuery ? `"${searchQuery}"` : categoryParam) ||
    "MAĞAZA";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryParam, brandParam, searchQuery]);

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{displayTitle} | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-[6px] border-black pb-8 mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-4 italic">
              <Link to="/" className="hover:text-black">
                ANA SAYFA
              </Link>
              <span>/</span>
              <span className="text-black">MAĞAZA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
              {displayTitle}
            </h1>
            <p className="text-[11px] font-black text-zinc-400 mt-4 uppercase tracking-[0.3em] italic">
              {filteredProducts.length} TASARIM LİSTELENDİ
            </p>
          </div>
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden !w-12 !h-12 !p-0 !bg-black text-white"
          >
            <RiEqualizerLine size={20} />
          </Button>
        </div>

        <div className="flex gap-16 items-start">
          <CategorySidebar
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
            handleApplyFilter={handleApplyFilter}
            handleResetFilters={handleResetFilters}
            handleBrandToggle={handleBrandToggle}
            handleCategoryToggle={handleCategoryToggle}
            BRANDS={BRANDS}
            CATEGORIES={CATEGORIES}
            COLOR_OPTIONS={COLOR_OPTIONS}
          />

          <ProductGrid
            products={filteredProducts}
            handleResetFilters={handleResetFilters}
          />
        </div>
      </div>
      {isFilterOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:hidden animate-in fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-4">
              <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter">
                FİLTRELER
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <Button
              onClick={handleApplyFilter}
              variant="primary"
              size="xl"
              className="w-full !rounded-full italic tracking-[0.3em]"
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
