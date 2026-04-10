import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import ProductCard from "../../components/Product/ProductCard";
import Button from "../../components/Ui/Button";
import type { APIProduct } from "../../types/api";
import { getCleanProducts } from "../../utils/filterProducts";

import "swiper/css";

const TopSelling = () => {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["top-selling"],
    queryFn: async () => {
      const res = await axiosInstance.get<APIProduct[]>(
        "/products?offset=10&limit=20",
      );

      const cleaned = getCleanProducts(res.data);

      return cleaned
        .map((item) => ({
          ...item,
          oldValue: Math.round(item.price * 1.3),
          category: item.category || "Top Selling",
          brand: "SHOP.CO",
        }))
        .slice(0, 4); 
    },
  });

  if (loading)
    return (
      <div className="py-20 text-center font-[1000] italic text-2xl opacity-50 uppercase tracking-tighter animate-pulse">
        Popüler Ürünler Hazırlanıyor...
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 font-satoshi">
      <h2 className="text-[32px] md:text-[52px] font-[1000] text-center mb-10 md:mb-14 uppercase tracking-[-0.05em] text-black leading-none italic">
        EN ÇOK SATANLAR
      </h2>

      <div className="lg:hidden -mr-4">
        <Swiper
          slidesPerView={2.1}
          spaceBetween={16}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper !overflow-visible"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="flex justify-center mt-12 md:mt-16">
        <Link to="/shop" className="w-full md:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-64 !rounded-full font-black italic border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 shadow-sm uppercase text-xs tracking-widest"
          >
            Hepsini Gör
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default TopSelling;
