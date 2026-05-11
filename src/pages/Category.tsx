import { useState, useMemo, useEffect } from "react";
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
import type { APIProduct } from "../types/api";
import { BRANDS } from "../constants/Brand";
import {
  CATEGORY_OPTIONS,
  COLOR_PALETTE,
  AVAILABLE_SIZES,
} from "../constants/Style";

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const searchQuery = searchParams.get("search");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const initialFilters: FilterState = {
    colors: [],
    price: 5000,
    selectedCategories: [],
    sizes: [],
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

  useEffect(() => {
    if (brandParam) {
      const brandValue = brandParam.toUpperCase();
      setAppliedFilters((prev) => ({
        ...prev,
        selectedBrands: [brandValue],
      }));
      setTempFilters((prev) => ({
        ...prev,
        selectedBrands: [brandValue],
      }));
    }
  }, [brandParam]);

  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ["category-products"],
    queryFn: async () => {
      const rawData = await getProducts();
      return getCleanProducts(rawData as unknown as APIProduct[]);
    },
    staleTime: 1000 * 60 * 5,
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const searchMatch =
          !searchQuery ||
          (p.name || p.title)
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        const productPrice = Number(p.price || p.value || 0);
        const priceMatch = productPrice <= appliedFilters.price;

        const brandFilterMatch = (() => {
          const activeBrands = [...appliedFilters.selectedBrands];
          if (brandParam) activeBrands.push(brandParam);

          if (activeBrands.length === 0) return true;

          return activeBrands.some(
            (b) => b.toLowerCase() === p.brand?.toLowerCase(),
          );
        })();

        const urlCategoryMatch =
          !categoryParam ||
          p.category?.toLowerCase() === categoryParam.toLowerCase();

        const sidebarCategoryMatch =
          appliedFilters.selectedCategories.length === 0 ||
          appliedFilters.selectedCategories.some((catId) => {
            return String(p.category_id) === String(catId);
          });

        const colorMatch =
          appliedFilters.colors.length === 0 ||
          (p.variants ?? []).some(
            (v) =>
              v.color &&
              appliedFilters.colors.includes(v.color) &&
              Number(v.stock || 0) > 0,
          );

        const sizeMatch =
          appliedFilters.sizes.length === 0 ||
          (p.variants ?? []).some(
            (v) =>
              v.size &&
              appliedFilters.sizes.includes(v.size) &&
              Number(v.stock || 0) > 0,
          );

        const isAnyVariantInStock = (p.variants ?? []).some(
          (v) => Number(v.stock || 0) > 0,
        );

        return (
          searchMatch &&
          priceMatch &&
          brandFilterMatch &&
          urlCategoryMatch &&
          sidebarCategoryMatch &&
          colorMatch &&
          sizeMatch &&
          isAnyVariantInStock
        );
      })
      .sort((a, b) => {
        const priceA = a.price || a.value || 0;
        const priceB = b.price || b.value || 0;
        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [products, searchQuery, appliedFilters, sortBy, categoryParam]);

  const currentProducts = useMemo(() => {
    const lastIndex = currentPage * productsPerPage;
    const firstIndex = lastIndex - productsPerPage;
    return filteredProducts.slice(firstIndex, lastIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleApplyFilter = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempFilters({ ...initialFilters });
    setAppliedFilters({ ...initialFilters });
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleBrandToggle = (brand: string) =>
    setTempFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));

  const handleCategoryToggle = (catId: string) =>
    setTempFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(catId)
        ? prev.selectedCategories.filter((i) => i !== catId)
        : [...prev.selectedCategories, catId],
    }));

  const displayTitle = useMemo(() => {
    if (brandParam) return brandParam.toUpperCase();
    if (searchQuery) return `"${searchQuery}"`;

    if (categoryParam) {
      const foundCategory = CATEGORY_OPTIONS.find(
        (c) => String(c.id) === String(categoryParam),
      );
      return foundCategory ? foundCategory.name : categoryParam;
    }

    return "MAĞAZA";
  }, [brandParam, searchQuery, categoryParam]);

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
              CATEGORIES={CATEGORY_OPTIONS}
              AVAILABLE_COLORS={COLOR_PALETTE}
              AVAILABLE_SIZES={AVAILABLE_SIZES}
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 px-2">
              <h1 className="text-5xl md:text-3xl font-[1000] text-black uppercase italic tracking-tighter leading-none">
                {displayTitle}
              </h1>
              <div className="flex flex-col md:items-end gap-2">
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">
                  {filteredProducts.length} TASARIM LİSTELENDİ
                </p>
                <div className="flex items-center gap-2 border-b-2 border-black/5 pb-1">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-transparent pr-6 font-black text-[11px] uppercase italic text-black outline-none cursor-pointer"
                  >
                    <option value="popular">En Popüler</option>
                    <option value="price-low">Düşük Fiyat</option>
                    <option value="price-high">Yüksek Fiyat</option>
                  </select>
                  <RiArrowDownSLine className="pointer-events-none text-black" />
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
              <ProductGrid
                products={currentProducts}
                handleResetFilters={handleResetFilters}
              />
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 rounded-full font-black text-[11px] transition-all ${
                      currentPage === i + 1
                        ? "bg-black text-white shadow-lg scale-110"
                        : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
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
          <div className="relative w-full bg-white rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
              <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">
                FİLTRELER
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center"
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
              CATEGORIES={CATEGORY_OPTIONS}
              AVAILABLE_COLORS={COLOR_PALETTE}
              AVAILABLE_SIZES={AVAILABLE_SIZES}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
