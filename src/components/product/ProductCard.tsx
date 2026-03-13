import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { RiStarFill, RiStarHalfFill } from "react-icons/ri";

const ProductCard = ({
  id,
  image,
  name,
  value,
  oldValue,
  rating = 4.5,
}: Product) => {
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
    <Link
      to={`/product/${id}`}
      className="flex flex-col gap-1 md:gap-2 cursor-pointer group w-full font-satoshi"
    >
      <div className="bg-[#F0EEED] rounded-[14px] md:rounded-[20px] aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        {discount && discount > 20 && (
          <div className="absolute top-2 right-2 bg-black text-white text-[8px] md:text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-tighter">
            POPÜLER
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <h3 className="font-[1000] text-[13px] md:text-lg text-black truncate uppercase tracking-tight leading-tight group-hover:underline underline-offset-2">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="flex text-xs md:text-base">{renderStars(rating)}</div>
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
              <span className="bg-[#FF3333]/10 text-[#FF3333] px-2 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-[1000] italic">
                -{discount}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
