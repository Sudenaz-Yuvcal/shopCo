import { useState } from "react";
import { RiEqualizerLine, RiArrowDownSLine } from "react-icons/ri";
import Button from "../../components/ui/Button";
import { CUSTOMER_REVIEWS, PRODUCT_TABS } from "../../constants/Reviews";
import type { Review } from "../../types/review";
import { ReviewItem } from "../../components/product/ReviewItem";

const ProductReviews = () => {
  const [activeTab, setActiveTab] = useState<string>("Değerlendirmeler");

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-satoshi text-left">
      <div className="flex border-b border-gray-100 mb-12 text-center">
        {PRODUCT_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-6 text-sm md:text-xl font-black uppercase tracking-tighter transition-all relative group ${
              activeTab === tab
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {tab}
            <div
              className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-transform duration-300 ${
                activeTab === tab
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-30"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-[1000] uppercase italic tracking-tighter">
          Tüm Değerlendirmeler{" "}
          <span className="text-gray-400 font-medium text-lg not-italic">
            (451)
          </span>
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="!w-12 !h-12 !p-0 bg-brand-gray !border-none shadow-sm hover:scale-110 active:scale-90"
          >
            <RiEqualizerLine size={24} className="text-black" />
          </Button>
          <Button
            variant="outline"
            size="md"
            className="hidden md:flex bg-brand-gray !border-none !px-8 gap-4 hover:scale-105"
          >
            En Yeni
            <RiArrowDownSLine
              size={20}
              className="transition-transform group-hover:rotate-180"
            />
          </Button>

          <Button
            variant="primary"
            size="md"
            className="flex-1 md:flex-none !px-10 shadow-xl"
          >
            Yorum Yaz
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        {CUSTOMER_REVIEWS.map((review) => (
          <ReviewItem key={review.id} review={review as Review} />
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="w-full md:w-auto !px-20 hover:bg-black hover:text-white transition-all duration-300"
        >
          Daha Fazla Yükle
        </Button>
      </div>
    </div>
  );
};

export default ProductReviews;
