import { useRef, useState, useEffect } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import Button from "../../components/ui/Button";
import { ReviewCard } from "../../components/home/ReviewCard";
import { CUSTOMER_REVIEWS } from "../../constants/Reviews";

const Customers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCardId, setActiveCardId] = useState<number>(1);

  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"));
            if (!isNaN(id)) setActiveCardId(id);
          }
        });
      },
      {
        root: scrollRef.current,
        rootMargin: "0px -45% 0px -45%",
        threshold: 0,
      },
    );
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 340 : scrollLeft + 340;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 overflow-hidden font-satoshi">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-[32px] md:text-[38px] font-[900] uppercase tracking-tighter leading-none">
          MÜŞTERİ <br className="md:hidden" /> DEĞERLENDİRMELERİ
        </h2>
        <div className="flex gap-2">
          {(
            [
              { dir: "left", Icon: RiArrowLeftLine },
              { dir: "right", Icon: RiArrowRightLine },
            ] as const
          ).map(({ dir, Icon }) => (
            <Button
              key={dir}
              variant="outline"
              onClick={() => scroll(dir)}
              className="!w-11 !h-11 md:!w-[52px] md:!h-[52px] !p-0 border-gray-100 shadow-sm group"
            >
              <Icon
                size={24}
                className="text-black group-hover:text-white transition-colors"
              />
            </Button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-0 pb-6"
      >
        {CUSTOMER_REVIEWS.map((customer, index) => (
          <ReviewCard
            key={customer.id}
            customer={customer}
            isActive={activeCardId === customer.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Customers;
