import React from "react";
import { RiStarFill } from "react-icons/ri";
import type { Review } from "../../types/review";

interface ReviewCardProps {
  customer: Review;
  isActive: boolean;
}

export const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ customer, isActive }, ref) => (
    <div
      ref={ref}
      data-id={customer.id}
      className={`min-w-[280px] md:min-w-[400px] border border-gray-100 rounded-[20px] p-6 md:p-8 space-y-4 snap-center bg-white transition-all duration-500 ${
        isActive
          ? "blur-0 opacity-100 scale-100 shadow-md"
          : "blur-[1px] opacity-40 scale-95"
      }`}
    >
      <div className="flex text-yellow-400 gap-0.5">
        {[...Array(customer.rating)].map((_, i) => (
          <RiStarFill key={i} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <h4 className="font-bold text-lg text-black">{customer.name}</h4>
        {customer.verified && (
          <span className="bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            ✓
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm md:text-base italic leading-relaxed">
        "{customer.text}"
      </p>
    </div>
  ),
);

ReviewCard.displayName = "ReviewCard";
