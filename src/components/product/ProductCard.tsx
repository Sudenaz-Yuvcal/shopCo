import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useFavorite } from "../../context/FavoriteContext";
import { StarRating } from "./ProductStarRating";

interface ProductCardProps extends Product {
  slug?: string;
  created_at?: string;
  title?: string;
}

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

  const totalStock = variants.reduce((acc: number, curr: { stock: number }) => {
    return acc + Number(curr.stock || 0);
  }, 0);

  const isOutOfStock = totalStock <= 0;

  const displayName = title || name || "İsimsiz Ürün";
  const displayPrice = price || value || 0;

  const { toggleFavorite, isInFavorites } = useFavorite();
  const isFavorite = isInFavorites(id);

  const generateUrlSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const productPath = supabaseSlug
    ? `/shopCo/${supabaseSlug}`
    : `/shopCo/${generateUrlSlug(displayName)}-${id}`;

  const getCleanImage = (): string | undefined => {
    const target = images && images.length > 0 ? images[0] : image;
    if (typeof target === "string") {
      return target.replace(/[\[\]"']/g, "");
    }
    return target;
  };

  const mainImage = getCleanImage();

  const isNew = created_at
    ? new Date().getTime() - new Date(created_at).getTime() <=
      3 * 24 * 60 * 60 * 1000
    : id % 5 === 0;

  const discount = oldValue
    ? Math.round(((oldValue - displayPrice) / oldValue) * 100)
    : 30;

  return (
    <div
      className={`relative group w-full font-satoshi transition-all duration-300 ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className="absolute top-3 right-3 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90"
      >
        {isFavorite ? (
          <RiHeartFill size={18} className="text-red-500 animate-in zoom-in" />
        ) : (
          <RiHeartLine
            size={18}
            className="text-black/40 hover:text-black transition-colors"
          />
        )}
      </button>

      <Link to={productPath} className="block">
        <div
          className={`bg-[#F0EEED] rounded-[14px] md:rounded-[20px] aspect-square overflow-hidden relative ${
            isOutOfStock ? "grayscale" : ""
          }`}
        >
          <img
            src={mainImage}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="eager"
          />

          {isOutOfStock ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
              <div className="bg-black text-white text-[10px] md:text-xs px-4 py-2 rounded-full font-[1000] tracking-widest uppercase">
                Tükendi
              </div>
            </div>
          ) : (
            <>
              {isNew && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-bold z-10">
                  YENİ
                </div>
              )}
              {!isNew && discount > 20 && (
                <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-3 py-1 rounded-full font-bold z-10">
                  POPÜLER
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-2">
          {brand && (
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">
              {brand}
            </span>
          )}

          <h3
            className={`font-[1000] text-[13px] md:text-lg text-black truncate uppercase tracking-tight leading-tight group-hover:underline underline-offset-2 ${
              isOutOfStock ? "text-zinc-400" : ""
            }`}
          >
            {displayName}
          </h3>

          <StarRating rating={rating} />

          <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mt-0.5">
            <span
              className={`font-[1000] text-lg md:text-2xl ${
                isOutOfStock ? "text-zinc-400" : "text-black"
              }`}
            >
              ${displayPrice}
            </span>
            {oldValue && !isOutOfStock && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-base md:text-2xl font-bold">
                  ${oldValue}
                </span>
                <span className="bg-red-500/10 text-red-500 px-2 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-[1000] italic">
                  -{discount}%
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
