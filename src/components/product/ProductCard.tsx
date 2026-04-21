import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useFavorite } from "../../context/FavoriteContext";
import { StarRating } from "./ProductStarRating";
import { handleImageError } from "../../utils/imageHandlers";

interface ProductCardProps extends Product {
  slug?: string;
}

const ProductCard = (product: ProductCardProps) => {
  const {
    id,
    images,
    image,
    name,
    value,
    oldValue,
    rating = 4.5,
    slug,
    category,
  } = product;

  const { toggleFavorite, isInFavorites } = useFavorite();
  const isFavorite = isInFavorites(id);

  const getCleanImage = () => {
    let target = images && images.length > 0 ? images[0] : image;
    if (typeof target === "string") {
      return target.replace(/[\[\]"']/g, "");
    }
    return target;
  };

  const mainImage = getCleanImage();

  const discount = oldValue
    ? Math.round(((oldValue - value) / oldValue) * 100)
    : null;

  const productPath = slug ? `/product/${slug}` : `/product/${id}`;

  return (
    <div className="relative group w-full font-satoshi">
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
        <div className="bg-brand-surface rounded-[14px] md:rounded-[20px] aspect-square overflow-hidden relative">
          <img
            src={mainImage}
            onError={handleImageError}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="eager"
          />

          {category === "NEW" ? (
            <div className="absolute top-2 left-2 bg-red text-white text-[8px] md:text-[10px] px-3 py-1 rounded-full font-[1000] uppercase tracking-tighter italic shadow-sm z-10">
              YENİ
            </div>
          ) : (
            discount &&
            discount > 20 && (
              <div className="absolute top-2 left-2 bg-black text-white text-[8px] md:text-[10px] px-3 py-1 rounded-full font-[1000] uppercase tracking-tighter shadow-sm z-10">
                POPÜLER
              </div>
            )
          )}
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <h3 className="font-[1000] text-[13px] md:text-lg text-black truncate uppercase tracking-tight leading-tight group-hover:underline underline-offset-2">
            {name}
          </h3>
          <StarRating rating={rating} />
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
