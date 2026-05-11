import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Product, ProductVariant } from "../../types/product";
import {
  RiHeartLine,
  RiHeartFill,
  RiCloseLine,
  RiShoppingBagLine,
  RiCheckboxCircleFill,
  RiCheckLine,
} from "react-icons/ri";
import { useFavorite } from "../../context/FavoriteContext";
import { useCart } from "../../context/CartContext";
import { StarRating } from "./ProductStarRating";
import Button from "../Ui/Button";
import { slugify } from "../../utils/slugify";

interface ProductCardProps extends Product {
  slug: string;
  created_at: string;
  title: string;
}

const colorMap: Record<string, string> = {
  Siyah: "#000000",
  Mavi: "#31344F",
  Haki: "#4F4631",
  Beyaz: "#FFFFFF",
  Kırmızı: "#DC2626",
};

const sortSizes = (a: string, b: string) => {
  const numA = parseInt(a);
  const numB = parseInt(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
  const order = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"];
  return order.indexOf(a.toUpperCase()) - order.indexOf(b.toUpperCase());
};

const ProductCard = (product: ProductCardProps) => {
  const {
    id,
    images,
    image,
    title,
    name,
    price,
    value,
    oldValue,
    rating = 4.5,
    slug: supabaseSlug,
    created_at,
    brand,
    variants = [],
  } = product;

  const navigate = useNavigate();
  const { toggleFavorite, isInFavorites } = useFavorite();
  const { addToCart } = useCart();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const selectionRef = useRef<HTMLDivElement>(null);

  const isFavorite = isInFavorites(id);
  const displayName = title || name || "İsimsiz Ürün";
  const displayPrice = price || value || 0;

  const allAvailableColors = useMemo(
    () => Array.from(new Set(variants.map((v: ProductVariant) => v.color))),
    [variants],
  );

  const allAvailableSizes = useMemo(
    () => Array.from(new Set(variants.map((v: ProductVariant) => v.size))),
    [variants],
  );

  const checkStock = (color: string | null, size: string | null) => {
    if (!color && !size) return true;
    return variants.some(
      (v: ProductVariant) =>
        (color ? v.color === color : true) &&
        (size ? v.size === size : true) &&
        Number(v.stock) > 0,
    );
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const isSizeStillAvailable = variants.some(
      (v: ProductVariant) =>
        v.color === color && v.size === selectedSize && Number(v.stock) > 0,
    );

    if (!isSizeStillAvailable) {
      const firstAvailableVariant = variants
        .filter((v: ProductVariant) => v.color === color && Number(v.stock) > 0)
        .sort((a: ProductVariant, b: ProductVariant) =>
          sortSizes(a.size, b.size),
        )[0];

      setSelectedSize(
        firstAvailableVariant ? firstAvailableVariant.size : null,
      );
    }
  };

  useEffect(() => {
    if (isSelecting && !selectedColor && allAvailableColors.length > 0) {
      handleColorSelect(allAvailableColors[0]);
    }
  }, [isSelecting]);

  const isOutOfStock =
    variants.reduce((acc, curr) => acc + Number(curr.stock || 0), 0) <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSize && selectedColor) {
      addToCart(product, 1, selectedSize, selectedColor);
      setIsSelecting(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  useEffect(() => {
    if (isSelecting) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSelecting]);

  const isNew = created_at
    ? new Date().getTime() - new Date(created_at).getTime() <=
      3 * 24 * 60 * 60 * 1000
    : false;

  const discount =
    oldValue && oldValue > displayPrice
      ? Math.round(((oldValue - displayPrice) / oldValue) * 100)
      : 0;

  const mainImage =
    images?.[0]?.replace(/[\[\]"']/g, "") ||
    (typeof image === "string"
      ? image.replace(/[\[\]"']/g, "")
      : "/placeholder.png");

  const productPath = `/product/${supabaseSlug || slugify(displayName)}`;

  return (
    <div className="relative group w-full font-satoshi transition-all duration-300">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className="absolute top-2 right-2 z-20 p-2 bg-white rounded-full shadow-md active:scale-90"
      >
        {isFavorite ? (
          <RiHeartFill size={18} className="text-red-500" />
        ) : (
          <RiHeartLine size={18} className="text-black/40" />
        )}
      </button>

      <div
        onClick={() => !isAdded && navigate(productPath)}
        className="bg-[#F0EEED] rounded-[14px] md:rounded-[20px] aspect-square overflow-hidden relative cursor-pointer"
      >
        <img
          src={mainImage}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isNew && (
            <div className="bg-red text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">
              YENİ
            </div>
          )}
          {discount > 0 && (
            <div className="bg-black text-white text-[8px] px-2 py-0.5 rounded-full font-bold">
              %{discount}
            </div>
          )}
        </div>
        {!isOutOfStock && variants.length > 0 && !isAdded && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                setIsSelecting(true);
              }}
              className="w-full flex items-center justify-center gap-2 font-black text-[10px] md:text-[11px] uppercase italic py-2.5 text-black border-none hover:bg-black hover:text-white transition-all shadow-2xl"
            >
              <RiShoppingBagLine size={16} /> SEPETE EKLE
            </Button>
          </div>
        )}
        {isAdded && (
          <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white animate-in zoom-in">
            <RiCheckboxCircleFill size={32} className="text-green-400 mb-1" />
            <span className="font-black text-[10px] uppercase">
              Sepete Eklendi
            </span>
          </div>
        )}
      </div>

      <div
        onClick={() => navigate(productPath)}
        className="mt-2.5 space-y-1 px-1 cursor-pointer"
      >
        {brand && (
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">
            {brand}
          </span>
        )}
        <h3 className="font-bold text-[14px] md:text-base text-black truncate uppercase">
          {displayName}
        </h3>
        <StarRating rating={rating} />
        <div className="flex items-center gap-2.5">
          <span className="font-black text-base md:text-xl text-black">
            ${displayPrice}
          </span>
          {oldValue && oldValue > displayPrice && (
            <span className="text-zinc-400 line-through text-xs md:text-lg font-bold">
              ${oldValue}
            </span>
          )}
        </div>
      </div>

      {isSelecting && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsSelecting(false)}
          />
          <div
            ref={selectionRef}
            className="relative bg-white w-full md:max-w-md p-6 rounded-t-[32px] md:rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-full duration-300"
          >
            <div className="flex justify-between items-center mb-8 px-1">
              <h4 className="font-black italic text-xl uppercase">
                SEÇENEKLER
              </h4>
              <button
                onClick={() => setIsSelecting(false)}
                className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-4 px-1">
                  Beden Seç
                </p>
                <div className="flex flex-wrap gap-2.5 px-1">
                  {[...allAvailableSizes].sort(sortSizes).map((size) => {
                    const isAvailable = checkStock(selectedColor, size);
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[54px] h-[44px] font-bold rounded-2xl border-2 transition-all 
                          ${!isAvailable ? "opacity-20 cursor-not-allowed bg-zinc-100 grayscale" : ""}
                          ${selectedSize === size ? "border-black bg-black text-white shadow-lg" : "border-zinc-100 bg-zinc-50 text-zinc-500"}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-black text-zinc-400 uppercase mb-4 px-1">
                  Renk Seç
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 px-2">
                  {allAvailableColors.map((color) => {
                    const isAvailable = checkStock(color, null);
                    const hexColor = colorMap[color] || color;
                    return (
                      <button
                        key={color}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleColorSelect(color)}
                        className={`w-10 h-10 border-2 border-zinc-800 rounded-full transition-all shadow-md 
                          ${!isAvailable ? "opacity-20 grayscale cursor-not-allowed" : "hover:scale-110"}
                          ${selectedColor === color ? "ring-2 ring-offset-1 ring-black border-transparent scale-110" : "border-zinc-200"}`}
                        style={{ backgroundColor: hexColor }}
                      >
                        {selectedColor === color && (
                          <div
                            className={`w-full h-full flex items-center justify-center rounded-full ${color === "Beyaz" ? "text-black" : "text-white"}`}
                          >
                            <RiCheckLine size={20} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="primary"
                disabled={!selectedSize || !selectedColor}
                onClick={handleQuickAdd}
                className="w-full py-5 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98] !bg-black !text-white"
              >
                {!selectedSize || !selectedColor
                  ? "SEÇİM YAPIN"
                  : "SEPETE EKLE"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
