import React from "react";
import { RiRestartLine, RiCheckLine } from "react-icons/ri";
import Button from "../../components/Ui/Button";
import type { FilterState } from "../../types/filter";

interface CategorySidebarProps {
  tempFilters: FilterState;
  setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleApplyFilter: () => void;
  handleResetFilters: () => void;
  handleBrandToggle: (brand: string) => void;
  handleCategoryToggle: (catId: string) => void;
  BRANDS: string[];
  CATEGORIES: { id: string; name: string }[];
  AVAILABLE_SIZES: string[];
  AVAILABLE_COLORS: {
    name: string;
    id: string;
    tailwind: string;
    hex?: string;
  }[];
}

const CategorySidebar = ({
  tempFilters,
  setTempFilters,
  handleApplyFilter,
  handleResetFilters,
  handleBrandToggle,
  handleCategoryToggle,
  BRANDS,
  CATEGORIES,
  AVAILABLE_COLORS,
  AVAILABLE_SIZES,
}: CategorySidebarProps) => {
  const handleToggle = (key: "colors" | "sizes", value: string) => {
    setTempFilters((prev) => {
      const currentSelection = prev[key] || [];
      const isExist = currentSelection.includes(value);

      return {
        ...prev,
        [key]: isExist
          ? currentSelection.filter((item) => item !== value)
          : [...currentSelection, value],
      };
    });
  };

  return (
    <aside className="flex flex-col w-full sticky top-24 h-[calc(100vh-150px)] bg-white">
      <div className="flex items-center justify-between pb-6 bg-white z-10">
        <h2 className="text-xl font-[1000] italic tracking-tighter uppercase text-black">
          FİLTRELE
        </h2>
        <button
          onClick={handleResetFilters}
          className="text-zinc-400 hover:text-black transition-colors p-2"
        >
          <RiRestartLine size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar pb-24">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            KATEGORİLER
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.name}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={(tempFilters.selectedCategories || []).includes(
                    cat.name,
                  )}
                  onChange={() => handleCategoryToggle(cat.name)}
                />
                <div
                  className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                    (tempFilters.selectedCategories || []).includes(cat.name)
                      ? "bg-black border-black shadow-lg"
                      : "border-zinc-200 group-hover:border-black"
                  }`}
                >
                  {(tempFilters.selectedCategories || []).includes(cat.name) && (
                    <RiCheckLine className="text-white" size={14} />
                  )}
                </div>
                <span
                  className={`text-[11px] font-black uppercase italic tracking-wide ${
                    (tempFilters.selectedCategories || []).includes(cat.name)
                      ? "text-black"
                      : "text-zinc-400"
                  }`}
                >
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-100">
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
                  checked={(tempFilters.selectedBrands || []).includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <div
                  className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                    (tempFilters.selectedBrands || []).includes(brand)
                      ? "bg-black border-black shadow-lg"
                      : "border-zinc-200 group-hover:border-black"
                  }`}
                >
                  {(tempFilters.selectedBrands || []).includes(brand) && (
                    <RiCheckLine className="text-white" size={14} />
                  )}
                </div>
                <span
                  className={`text-[11px] font-black uppercase italic tracking-wide ${
                    (tempFilters.selectedBrands || []).includes(brand)
                      ? "text-black"
                      : "text-zinc-400"
                  }`}
                >
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            RENKLER
          </h3>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_COLORS.map((colorObj) => {
              const isSelected = (tempFilters.colors || []).includes(
                colorObj.id,
              );
              return (
                <button
                  key={colorObj.id}
                  type="button"
                  onClick={() => handleToggle("colors", colorObj.id)}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${
                    isSelected
                      ? "border-black scale-110 shadow-md"
                      : "border-transparent hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shadow-inner ${colorObj.tailwind}`}
                    style={{ backgroundColor: colorObj.id }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RiCheckLine
                        size={14}
                        className={
                          colorObj.id.toLowerCase() === "#ffffff"
                            ? "text-black"
                            : "text-white"
                        }
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            BEDEN / NUMARA
          </h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const isSelected = (tempFilters.sizes || []).includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleToggle("sizes", size)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                    isSelected
                      ? "bg-black border-black text-white shadow-md"
                      : "border-zinc-100 text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-zinc-100">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
              FİYAT
            </h3>
            <span className="text-lg font-[1000] italic tabular-nums text-black">
              ${tempFilters.price || 5000}
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={tempFilters.price || 5000}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black rounded-full"
            />
            <div className="flex justify-between text-[9px] font-black text-zinc-300 uppercase italic tracking-widest px-1">
              <span>$100</span>
              <span>$5000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pt-4 pb-2 bg-gradient-to-t from-white via-white to-transparent">
        <Button
          onClick={handleApplyFilter}
          className="w-full !rounded-full !py-5 italic font-[1000] tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          FİLTRELERİ UYGULA
        </Button>
      </div>
    </aside>
  );
};

export default CategorySidebar;
