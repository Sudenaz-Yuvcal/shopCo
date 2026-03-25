import { RiRestartLine, RiCheckLine } from "react-icons/ri";
import Button from "../../components/ui/Button";
import type { FilterState } from "../../types/filter";
interface ColorOption {
  name: string;
  id: string;
  tailwind: string;
}
interface CategorySidebarProps {
  tempFilters: FilterState;
  setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleApplyFilter: () => void;
  handleResetFilters: () => void;
  handleBrandToggle: (brand: string) => void;
  handleCategoryToggle: (cat: string) => void;
  BRANDS: string[];
  CATEGORIES: string[];
  COLOR_OPTIONS: ColorOption[];
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
  COLOR_OPTIONS,
}: CategorySidebarProps) => (
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
              className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                tempFilters.selectedBrands.includes(brand)
                  ? "bg-black border-black shadow-lg"
                  : "border-zinc-200 group-hover:border-black"
              }`}
            >
              {tempFilters.selectedBrands.includes(brand) && (
                <RiCheckLine className="text-white" size={14} />
              )}
            </div>
            <span
              className={`text-[11px] font-black uppercase italic tracking-wide transition-colors ${
                tempFilters.selectedBrands.includes(brand)
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
              className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                tempFilters.selectedCategories.includes(cat)
                  ? "bg-black border-black shadow-lg"
                  : "border-zinc-200 group-hover:border-black"
              }`}
            >
              {tempFilters.selectedCategories.includes(cat) && (
                <RiCheckLine className="text-white" size={14} />
              )}
            </div>
            <span
              className={`text-[11px] font-black uppercase italic tracking-wide transition-colors ${
                tempFilters.selectedCategories.includes(cat)
                  ? "text-black"
                  : "text-zinc-400"
              }`}
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 shadow-sm ${
              color.tailwind
            } ${
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
);

export default CategorySidebar;
