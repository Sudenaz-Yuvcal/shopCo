import { useState } from "react";
import { RiHeartLine, RiHeartFill, RiCheckLine } from "react-icons/ri";
import { FiMinus, FiPlus, FiMapPin } from "react-icons/fi";
import Button from "../../components/ui/Button";
import ScarcityBadge from "../../components/product/ScarcityBadge";
import type { Product } from "../../types/product";

interface ProductInfoProps {
  product: Product;
  isFavorite: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (qty: number, size: string, color: string) => void;
  userAddress?: string;
}

const COLOR_OPTIONS = [
  { name: "Kahverengi", id: "khaki", tailwind: "bg-[#BDB76B]" },
  { name: "Yeşil", id: "green", tailwind: "bg-[#2F4F4F]" },
  { name: "Mavi", id: "denim", tailwind: "bg-[#5F9EA0]" },
];

const ProductInfo = ({
  product,
  isFavorite,
  onToggleWishlist,
  onAddToCart,
  userAddress,
}: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("khaki");
  const [quantity, setQuantity] = useState(1);

  const discount = product.oldValue
    ? Math.round(((product.oldValue - product.value) / product.oldValue) * 100)
    : null;

  return (
    <div className="lg:col-span-5 space-y-10 w-full pt-2 text-brand-black text-left">
      <div className="space-y-6">
        <ScarcityBadge />
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.85] flex-1">
            {product.name}
          </h1>
          <button
            onClick={() => onToggleWishlist(product)}
            className="p-4 bg-zinc-50 rounded-full active:scale-90 shadow-sm transition-all hover:bg-zinc-100"
          >
            {isFavorite ? (
              <RiHeartFill
                size={32}
                className="text-red-500 animate-in zoom-in"
              />
            ) : (
              <RiHeartLine
                size={32}
                className="text-zinc-300 hover:text-black"
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-6 border-b border-zinc-100 pb-8">
        <span className="text-6xl font-black italic tracking-tighter">
          ${product.value}
        </span>
        {product.oldValue && (
          <div className="flex items-center gap-3">
            <span className="text-3xl text-zinc-200 line-through font-black italic">
              ${product.oldValue}
            </span>
            <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[11px] font-black">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
          RENK SEÇENEKLERİ
        </p>
        <div className="flex gap-4">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${color.tailwind} ${
                selectedColor === color.id
                  ? "ring-2 ring-black ring-offset-4 scale-110 shadow-xl"
                  : "opacity-60"
              }`}
            >
              {selectedColor === color.id && (
                <RiCheckLine className="text-white text-xl animate-in zoom-in" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
          BEDENİNİ SEÇ
        </p>
        <div className="flex gap-3">
          {["Small", "Medium", "Large", "X-Large"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all duration-300 border ${
                selectedSize === size
                  ? "bg-black text-white border-black shadow-xl scale-105"
                  : "bg-white text-zinc-400 border-zinc-100 hover:bg-zinc-50"
              }`}
            >
              {size === "X-Large" ? "XL" : size.charAt(0)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-row gap-4 pt-4 items-stretch">
        <div className="bg-zinc-50 px-6 py-4 rounded-full flex items-center justify-between border border-zinc-100 min-w-[140px]">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-zinc-400 hover:text-black transition-colors"
          >
            <FiMinus size={22} />
          </button>
          <span className="text-xl font-black italic tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="text-zinc-400 hover:text-black transition-colors"
          >
            <FiPlus size={22} />
          </button>
        </div>

        <Button
          variant="primary"
          size="xl"
          onClick={() => onAddToCart(quantity, selectedSize, selectedColor)}
          className="flex-1 !rounded-full !py-6 !text-[12px] italic tracking-[0.2em] bg-black text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          SEPETE EKLE →
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-5 pt-4">
        <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 flex items-center gap-4">
          <FiMapPin size={24} className="text-black" />
          <div>
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
              TESLİMAT
            </p>
            <p className="text-[10px] font-black uppercase italic truncate max-w-[120px]">
              {userAddress || "HIZLI TESLİMAT"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
