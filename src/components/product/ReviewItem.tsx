import { RiStarFill } from "react-icons/ri";
import Button from "../ui/Button";
import type { Review } from "../../types/review";

export const ReviewItem = ({ review }: { review: Review }) => (
  <div className="border border-gray-100 rounded-[20px] p-6 md:p-8 space-y-4 hover:shadow-xl hover:border-black/5 transition-all duration-500 bg-white group">
    <div className="flex justify-between items-start">
      <div className="flex text-yellow-400 text-lg md:text-xl gap-0.5">
        {[...Array(5)].map((_, i) => (
          <RiStarFill
            key={i}
            className={
              i < Math.floor(review.rating) ? "fill-current" : "text-gray-200"
            }
          />
        ))}
      </div>
      <Button
        variant="white"
        className="!w-8 !h-8 !p-0 !bg-transparent !border-none !shadow-none text-gray-300 hover:text-black transition-colors"
      >
        <span className="text-2xl leading-none -mt-2">···</span>
      </Button>
    </div>

    <div className="flex items-center gap-2">
      <h4 className="font-[1000] text-lg uppercase italic tracking-tighter">
        {review.name}
      </h4>
      {review.verified && (
        <span
          className="bg-green-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
          title="Doğrulanmış Müşteri"
        >
          ✓
        </span>
      )}
    </div>

    <p className="text-gray-500 text-sm md:text-base leading-relaxed italic font-medium">
      "{review.text}"
    </p>

    <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest pt-2">
      POSTED ON {review.date}
    </p>
  </div>
);
