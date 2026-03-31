import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import ProductCard from "../../components/Product/ProductCard";
import Button from "../../components/Ui/Button";
import { ALL_PRODUCTS } from "../../constants/Product";

import "swiper/css";

const NewArrivals = () => {
  const newProducts = ALL_PRODUCTS.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto ">
      <h2 className="text-[32px] md:text-[52px] font-[1000] text-center mb-10 md:mb-14 uppercase tracking-[-0.05em] text-black leading-none italic">
        YENİ GELENLER
      </h2>

      <div className="lg:hidden -mr-4">
        <Swiper
          slidesPerView={2.1}
          spaceBetween={16}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper !overflow-visible"
        >
          {newProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-8">
        {newProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="flex justify-center mt-12 md:mt-16">
        <Link to="/shop" className="w-full md:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-64 !rounded-full font-bold italic border-zinc-200 hover:bg-black hover:text-white transition-all duration-300"
          >
            Hepsini Gör
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
