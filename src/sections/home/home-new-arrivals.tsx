import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/productService";
import ProductCard from "../../components/Product/ProductCard";
import Button from "../../components/Ui/Button";
import type { Product } from "../../types/product";

import "swiper/css";

interface RawProduct {
  id: number;
  price: number;
  images?: string[];
  name?: string;
  title?: string;
  variants?: { size: string; color: string; stock: number }[];
  [key: string]: any; 
}

const NewArrivals = () => {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["new-arrivals-home"],
    queryFn: async () => {
      const allProducts = (await getProducts()) as RawProduct[];

      return allProducts
        .map(
          (item): Product => ({
            ...item,
            id: item.id,
            name: item.title || item.name || "Yeni Ürün",
            value: item.price,
            price: item.price,
            image: item.images && item.images.length > 0 ? item.images[0] : "",
            images: item.images || [],
            rating: 4.5,
            oldValue: Math.round(item.price * 1.3),
            category: "NEW",
            brand: "SHOP.CO",
            variants: item.variants || [],
            stock:
              item.variants?.reduce(
                (acc, curr) => acc + (curr.stock || 0),
                0,
              ) || 0,
          }),
        )
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);
    },
  });

  if (loading)
    return (
      <div className="py-20 text-center font-[1000] italic text-2xl uppercase tracking-tighter opacity-30 animate-pulse text-black">
        YENİ KOLEKSİYON YÜKLENİYOR...
      </div>
    );

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 font-satoshi border-b border-zinc-100">
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
        <Link to="/newproduct" className="w-full md:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-64 !rounded-full font-[1000] italic border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 uppercase text-xs tracking-[0.2em] py-4"
          >
            Hepsini Gör
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
