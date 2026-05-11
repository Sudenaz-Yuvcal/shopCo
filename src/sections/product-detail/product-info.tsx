import { useEffect, useState, useMemo } from "react";
import {
  RiHeartLine,
  RiHeartFill,
  RiCheckLine,
  RiStarFill,
} from "react-icons/ri";
import { FiMinus, FiPlus } from "react-icons/fi";
import Button from "../../components/Ui/Button";
import type { Product } from "../../types/product";

interface ProductInfoProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (qty: number, size: string, color: string) => void;
  userAddress?: string;
}

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

const colorMap: Record<string, string> = {
  Siyah: "bg-black",
  Mavi: "bg-[#31344F]",
  Haki: "bg-[#4F4631]",
  Beyaz: "bg-white border-zinc-200",
  Kırmızı: "bg-red",
};

const ProductInfo = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  userAddress,
}: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const sortSizes = (a: string, b: string) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    const indexA = SIZE_ORDER.indexOf(a.toUpperCase());
    const indexB = SIZE_ORDER.indexOf(b.toUpperCase());
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    return a.localeCompare(b);
  };

  const availableColors = useMemo(() => {
    return Array.from(new Set(product.variants?.map((v) => v.color) || []));
  }, [product.variants]);

  const availableSizes = useMemo(() => {
    const sizes = Array.from(
      new Set(product.variants?.map((v) => v.size) || []),
    );
    return sizes.sort(sortSizes);
  }, [product.variants]);

  useEffect(() => {
    if (!selectedColor) return;

    const isCurrentSizeAvailable = product.variants?.some(
      (v) =>
        v.color === selectedColor && v.size === selectedSize && v.stock > 0,
    );

    if (!isCurrentSizeAvailable) {
      const bestVariant = product.variants
        ?.filter((v) => v.color === selectedColor && v.stock > 0)
        .sort((a, b) => sortSizes(a.size, b.size))[0];

      if (bestVariant) {
        setSelectedSize(bestVariant.size);
      } else {
        setSelectedSize(availableSizes[0] || "");
      }
    }
  }, [selectedColor]);

  useEffect(() => {
    setActiveImg(0);
    if (availableColors.length > 0 && !selectedColor) {
      const firstColor = availableColors[0];
      setSelectedColor(firstColor);

      const firstInStock = product.variants
        ?.filter((v) => v.color === firstColor && v.stock > 0)
        .sort((a, b) => sortSizes(a.size, b.size))[0];

      setSelectedSize(
        firstInStock ? firstInStock.size : availableSizes[0] || "",
      );
    }
  }, [product]);

  const currentVariant = product.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );
  const currentStock = currentVariant ? currentVariant.stock : 0;

  useEffect(() => {
    const maxAllowed = Math.min(currentStock, 10);
    if (quantity > maxAllowed && maxAllowed > 0) {
      setQuantity(maxAllowed);
    } else if (currentStock === 0) {
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, currentStock]);

  const discount = product.oldValue
    ? Math.round(((product.oldValue - product.price) / product.oldValue) * 100)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto items-start font-satoshi">
      <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 h-auto lg:h-[530px]">
        <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-28 shrink-0 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
          {product?.images?.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`aspect-square rounded-2xl overflow-hidden border-2 bg-[#F0F0F0] transition-all shrink-0 w-24 lg:w-full ${
                activeImg === i
                  ? "border-black ring-black"
                  : "border-transparent opacity-60"
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </button>
          ))}
        </div>
        <div className="w-full h-full rounded-[40px] overflow-hidden border border-zinc-400 bg-[#F0F0F0] group">
          <img
            src={product?.images?.[activeImg] || product?.image || ""}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
          />
        </div>
      </div>

      <div className="lg:col-span-5 text-left space-y-6">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-4xl font-[1000] uppercase tracking-tighter leading-[0.85] flex-1">
            {product.name}
          </h1>
          <button
            onClick={() => onToggleFavorite(product)}
            className="p-3 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"
          >
            {isFavorite ? (
              <RiHeartFill size={28} className="text-red-500" />
            ) : (
              <RiHeartLine size={28} className="text-zinc-300" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <RiStarFill
                key={i}
                size={18}
                className={
                  i < Math.round(product.rating || 0)
                    ? "text-yellow-400"
                    : "text-zinc-200"
                }
              />
            ))}
          </div>
          <span className="text-sm font-bold ml-1">{product.rating}/5</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-4xl font-black italic tracking-tighter">
            ${product.price}
          </span>
          {product.oldValue && (
            <div className="flex items-center gap-2">
              <span className="text-3xl text-zinc-200 line-through font-black italic">
                ${product.oldValue}
              </span>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black">
                -{discount}%
              </span>
            </div>
          )}
        </div>

        <p className="text-zinc-400 text-[13px] font-medium leading-relaxed max-w-sm">
          {product.description}
        </p>
        <div className="h-px bg-zinc-100 w-full" />

        <div className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic">
            RENK SEÇENEKLERİ
          </p>
          <div className="flex gap-3">
            {availableColors.map((colorName) => (
              <button
                key={colorName}
                onClick={() => setSelectedColor(colorName)}
                className={`w-11 h-11 rounded-full flex items-center border-2 border-zinc-800 justify-center transition-all ${colorMap[colorName] || "bg-zinc-300"} ${
                  selectedColor === colorName
                    ? "ring-2 ring-black ring-offset-4"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {selectedColor === colorName && (
                  <RiCheckLine
                    className={
                      colorName === "Beyaz" ? "text-black" : "text-white"
                    }
                    size={20}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-zinc-100 w-full" />

        <div className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic">
            BEDENİNİ SEÇ
          </p>
          <div className="flex gap-2">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              const hasStock = product.variants?.some(
                (v) =>
                  v.color === selectedColor && v.size === size && v.stock > 0,
              );

              return (
                <button
                  key={size}
                  disabled={!hasStock}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase transition-all ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-[#F0F0F0] text-zinc-400"
                  } ${!hasStock ? "opacity-20 cursor-not-allowed line-through" : "hover:bg-zinc-200"}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-3 h-14">
            <div className="bg-[#F0F0F0] px-6 rounded-full flex items-center justify-between min-w-[140px]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={currentStock <= 0}
                className="text-zinc-500 hover:text-black disabled:opacity-30"
              >
                <FiMinus size={22} />
              </button>
              <span className="text-xl font-black italic">
                {currentStock > 0 ? quantity : 0}
              </span>
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(prev + 1, currentStock, 10))
                }
                disabled={
                  quantity >= currentStock ||
                  quantity >= 10 ||
                  currentStock <= 0
                }
                className={`transition-colors ${quantity >= currentStock || quantity >= 10 || currentStock <= 0 ? "text-zinc-200 cursor-not-allowed" : "text-zinc-500 hover:text-black"}`}
              >
                <FiPlus size={22} />
              </button>
            </div>
            <Button
              onClick={() => onAddToCart(quantity, selectedSize, selectedColor)}
              disabled={currentStock <= 0 || quantity > currentStock}
              className={`flex-1 !rounded-full italic font-black transition-all duration-300 ${
                currentStock <= 0 || quantity > currentStock
                  ? "!bg-zinc-100 !text-zinc-400 cursor-not-allowed"
                  : "!bg-black !text-white active:scale-95"
              }`}
            >
              {currentStock > 0
                ? quantity > currentStock
                  ? "YETERSİZ STOK"
                  : "SEPETE EKLE →"
                : "STOKTA YOK"}
            </Button>
          </div>
        </div>

        {userAddress && (
          <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] italic">
            TESLİMAT: <span className="text-black">{userAddress}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
