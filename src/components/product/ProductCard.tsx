import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import {
  RiStarFill,
  RiStarHalfFill,
  RiHeartLine,
  RiHeartFill,
} from "react-icons/ri";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = (product: Product) => {
  const { id, image, name, value, oldValue, rating = 4.5 } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(id);

  const discount = oldValue
    ? Math.round(((oldValue - value) / oldValue) * 100)
    : null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      if (starValue <= Math.floor(rating)) {
        return <RiStarFill key={i} className="text-yellow-400" />;
      } else if (starValue - 0.5 <= rating) {
        return <RiStarHalfFill key={i} className="text-yellow-400" />;
      } else {
        return <RiStarFill key={i} className="text-gray-200" />;
      }
    });
  };

  return (
    <div className="relative group w-full font-satoshi">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
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

      <Link
        to={`/product/${id}`}
        className="flex flex-col gap-1 md:gap-2 cursor-pointer"
      >
        <div className="bg-brand-surface rounded-[14px] md:rounded-[20px] aspect-square overflow-hidden relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="lazy"
          />
          {discount && discount > 20 && (
            <div className="absolute top-2 left-2 bg-black text-white text-[8px] md:text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-tighter">
              POPÜLER
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <h3 className="font-[1000] text-[13px] md:text-lg text-black truncate uppercase tracking-tight leading-tight group-hover:underline underline-offset-2">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex text-xs md:text-base">
              {renderStars(rating)}
            </div>
            <span className="text-[10px] md:text-sm text-black font-medium">
              {rating}/<span className="text-gray-400">5</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mt-0.5">
            <span className="font-[1000] text-lg md:text-2xl text-black">
              ${value}
            </span>

            {oldValue && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-base md:text-2xl font-bold">
                  ${oldValue}
                </span>
                <span className="bg-brand-red/10 text-red px-2 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-[1000] italic">
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
