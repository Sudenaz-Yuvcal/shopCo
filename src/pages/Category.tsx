import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { ALL_PRODUCTS } from "../constants/Product";
import type { Product } from "../types/product";
import {
  RiEqualizerLine,
  RiCheckLine,
  RiRestartLine,
  RiCloseLine,
} from "react-icons/ri";
import Button from "../components/ui/Button";

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const searchQuery = searchParams.get("search");

  const initialFilters = {
    color: null as string | null,
    price: 500,
    selectedCategories: [] as string[],
    size: null as string | null,
    selectedBrands: [] as string[],
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({ ...initialFilters });
  const [appliedFilters, setAppliedFilters] = useState({ ...initialFilters });

  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];
  const CATEGORIES = ["T-shirts", "Shorts", "Jeans"];

  const COLOR_OPTIONS = [
    { name: "Kahverengi", id: "khaki", tailwind: "bg-khaki" },
    { name: "Yeşil", id: "green", tailwind: "bg-green" },
    { name: "Mavi", id: "denim", tailwind: "bg-denim" },
  ];
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const categoryMatch =
        !categoryParam ||
        p.category.toLowerCase() === categoryParam.toLowerCase();
      const urlBrandMatch =
        !brandParam || p.brand?.toUpperCase() === brandParam.toUpperCase();
      const searchMatch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

      const brandFilterMatch =
        appliedFilters.selectedBrands.length === 0 ||
        appliedFilters.selectedBrands.includes(p.brand?.toUpperCase() || "");

      const categoryFilterMatch =
        appliedFilters.selectedCategories.length === 0 ||
        appliedFilters.selectedCategories.some((cat) =>
          p.name.toLowerCase().includes(cat.toLowerCase().replace(/s$/, "")),
        );
      const priceMatch = p.value <= appliedFilters.price;

      const colorMatch =
        !appliedFilters.color || p.color === appliedFilters.color;

      const sizeMatch =
        !appliedFilters.size ||
        (p.size && p.size.includes(appliedFilters.size));

      return (
        categoryMatch &&
        urlBrandMatch &&
        searchMatch &&
        brandFilterMatch &&
        categoryFilterMatch &&
        priceMatch &&
        colorMatch &&
        sizeMatch
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

  const handleCategoryToggle = (cat: string) => {
    setTempFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }));
  };

  const handleBrandToggle = (brand: string) => {
    setTempFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

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
          <aside className="hidden md:flex flex-col w-[300px] shrink-0 sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide border-2 border-zinc-100 rounded-[40px] p-8 space-y-10 bg-brand-offwhite shadow-sm">
            <div className="flex items-center justify-between sticky top-0 bg-brand-offwhite pb-2 z-10">
              <h2 className="text-xl font-[1000] italic tracking-tighter uppercase">
                FİLTRELE
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-zinc-400 hover:text-black transition-colors"
              >
                <RiRestartLine size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                MARKALAR
              </h3>
              <div className="space-y-3">
                {BRANDS.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={tempFilters.selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${tempFilters.selectedBrands.includes(brand) ? "bg-black border-black shadow-lg" : "border-zinc-200 group-hover:border-black"}`}
                    >
                      {tempFilters.selectedBrands.includes(brand) && (
                        <RiCheckLine className="text-white" size={14} />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-black uppercase italic tracking-wide transition-colors ${tempFilters.selectedBrands.includes(brand) ? "text-black" : "text-zinc-400"}`}
                    >
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                KATEGORİLER
              </h3>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={tempFilters.selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${tempFilters.selectedCategories.includes(cat) ? "bg-black border-black shadow-lg" : "border-zinc-200 group-hover:border-black"}`}
                    >
                      {tempFilters.selectedCategories.includes(cat) && (
                        <RiCheckLine className="text-white" size={14} />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-black uppercase italic tracking-wide transition-colors ${tempFilters.selectedCategories.includes(cat) ? "text-black" : "text-zinc-400"}`}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-100">
              <div className="flex justify-between items-end">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                  FİYAT LİMİTİ
                </h3>
                <span className="text-lg font-[1000] italic tabular-nums">
                  ${tempFilters.price}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={tempFilters.price}
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black rounded-full"
              />
            </div>
            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                RENK
              </h3>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() =>
                      setTempFilters((prev) => ({
                        ...prev,
                        color: prev.color === color.id ? null : color.id,
                      }))
                    }
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 shadow-sm ${color.tailwind} ${
                      tempFilters.color === color.id
                        ? "border-black ring-2 ring-zinc-200 scale-110"
                        : "border-transparent opacity-80"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="sticky bottom-0 bg-brand-offwhite pt-4 pb-2 z-10">
              <Button
                onClick={handleApplyFilter}
                variant="primary"
                size="xl"
                className="w-full !rounded-full !py-5 italic tracking-[0.3em] shadow-2xl"
              >
                UYGULA
              </Button>
            </div>
          </aside>
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-in fade-in duration-1000">
                {filteredProducts.map((p: Product) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            ) : (
              <div className="w-full py-40 flex flex-col items-center justify-center border-4 border-dashed border-zinc-50 rounded-[60px] opacity-40">
                <RiEqualizerLine size={60} className="text-zinc-200 mb-6" />
                <p className="font-black uppercase text-[11px] tracking-[0.4em] italic text-zinc-400 text-center leading-relaxed">
                  KRİTERLERE UYGUN
                  <br />
                  BİR TASARIM BULUNAMADI
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-8 text-[10px] font-black underline uppercase tracking-widest hover:text-black"
                >
                  Sıfırla
                </button>
              </div>
            )}
          </div>
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
            <div className="space-y-10 pb-10 text-left">
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
        </div>
      )}
    </div>
  );
};

export default Category;
