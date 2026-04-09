import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import ProductCard from "../../components/Product/ProductCard";
import Button from "../../components/Ui/Button";
import type { Product } from "../../types/product";
import type { APIProduct } from "../../types/api";

import "swiper/css";

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=4")
      .then((res) => res.json())
      .then((data: APIProduct[]) => {

        const adapted: Product[] = data.map((item: APIProduct) => ({
          id: item.id,
          name: item.title,
          image: item.images[0].replace(/[\[\]"]/g, ""), 
          price: item.price,
          value: item.price,
          oldValue: Math.round(item.price * (1 + (Math.random() * 0.3 + 0.1))),
          category: item.category?.name || "Kategori",
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
          color: "black",
          brand: "SHOP.CO",
        }));
        setProducts(adapted);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Hata:", err);
        setLoading(false);
      });
  }, []);
  if (loading)
    return (
      <div className="py-20 text-center font-bold italic">YÜKLENİYOR...</div>
    );

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
