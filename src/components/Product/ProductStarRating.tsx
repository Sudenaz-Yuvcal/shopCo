import { RiStarFill, RiStarHalfFill } from "react-icons/ri";

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <div className="flex text-xs md:text-base">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          if (starValue <= Math.floor(rating)) {
            return <RiStarFill key={i} className="text-yellow-400" />;
          } else if (starValue - 0.5 <= rating) {
            return <RiStarHalfFill key={i} className="text-yellow-400" />;
          } else {
            return <RiStarFill key={i} className="text-gray-200" />;
          }
        })}
      </div>
      <span className="text-[10px] md:text-sm text-black font-medium">
        {rating}/<span className="text-gray-400">5</span>
      </span>
    </div>
  );
};
