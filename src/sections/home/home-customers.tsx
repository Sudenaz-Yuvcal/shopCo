import { useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Button from "../../components/Ui/Button";
import { ReviewCard } from "../../components/Home/ReviewCard";
import { CUSTOMER_REVIEWS } from "../../constants/Reviews";
import type { Review } from "../../types/review";
import "swiper/css";
import "swiper/css/navigation";

const Customers = () => {
  const [activeCardId, setActiveCardId] = useState<number>(
    CUSTOMER_REVIEWS[0].id,
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 overflow-hidden font-satoshi relative">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-[1000] uppercase tracking-tighter leading-[0.9] italic">
          MÜŞTERİ <br className="md:hidden" /> DEĞERLENDİRMELERİ
        </h2>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            className="review-prev !w-11 !h-11 md:!w-[52px] md:!h-[52px] !p-0 border-zinc-100 shadow-sm group !rounded-full transition-all active:scale-90"
          >
            <RiArrowLeftLine
              size={24}
              className="text-black group-hover:text-white"
            />
          </Button>
          <Button
            variant="outline"
            className="review-next !w-11 !h-11 md:!w-[52px] md:!h-[52px] !p-0 border-zinc-100 shadow-sm group !rounded-full transition-all active:scale-90"
          >
            <RiArrowRightLine
              size={24}
              className="text-black group-hover:text-white"
            />
          </Button>
        </div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          navigation={{
            prevEl: ".review-prev",
            nextEl: ".review-next",
          }}
          onSlideChange={(swiper) => {
            const currentReview = CUSTOMER_REVIEWS[swiper.realIndex];
            if (currentReview) setActiveCardId(currentReview.id);
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24, centeredSlides: false },
            1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: true },
          }}
          className="!overflow-visible pb-12"
        >
          {CUSTOMER_REVIEWS.map((review: Review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <ReviewCard
                customer={review}
                isActive={activeCardId === review.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Customers;
