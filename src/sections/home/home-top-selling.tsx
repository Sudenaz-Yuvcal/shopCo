import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/productService";
import ProductCard from "../../components/Product/ProductCard";
import Button from "../../components/Ui/Button";
import type { Product } from "../../types/product";
import { slugify } from "../../utils/slugify";

import "swiper/css";

interface FAQ {
  question: string;
  answer: string;
}

interface Variant {
  size: string;
  color: string;
  stock: number;
}

interface RawProduct {
  id: number;
  price: number;
  sales?: number;
  images?: string[];
  name?: string;
  title?: string;
  category_id?: number; 
  brand?: string;
  description?: string;
  slug?: string;
  category?: {
    id: number;
    name?: string;
  };
  created_at?: string;
  faqs?: FAQ[];
  variants?: Variant[];
}
export const TopSelling = () => {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["top-selling"],
    queryFn: async () => {
      const response = await getProducts();
      const allProducts = response as RawProduct[];

      const sorted = allProducts.sort((a, b) => {
        const salesA = a.sales || 0;
        const salesB = b.sales || 0;

        if (salesB !== salesA) {
          return salesB - salesA;
        }

        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateA - dateB;
      });

      return sorted.slice(0, 4).map(
        (item): Product => ({
          id: item.id,
          title: item.title || item.name || "Popüler Ürün",
          name: item.title || item.name || "Popüler Ürün",
          slug: item.slug || slugify(item.title || item.name || ""),
          description: item.description || "Harika bir SHOP.CO ürünü.",
          category_id: item.category_id || item.category?.id || 0,
          created_at: item.created_at || new Date().toISOString(),
          faqs: item.faqs || [],
          value: item.price,
          price: item.price,
          image: item.images?.[0] || "/shopCO.png",
          images: item.images || [],
          rating: 4.8,
          oldValue: Math.round(item.price * 1.3),
          category: "Top Selling",
          brand: item.brand || "SHOP.CO", 
          variants: item.variants || [],
          stock:
            item.variants?.reduce((acc, curr) => acc + (curr.stock || 0), 0) ||
            0,
        }),
      );
    },
  });

  if (loading)
    return (
      <div className="py-20 text-center font-[1000] italic text-2xl opacity-50 uppercase tracking-tighter animate-pulse text-black">
        POPÜLER ÜRÜNLER HAZIRLANIYOR...
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 font-satoshi border-t border-zinc-100">
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
            className="w-full md:w-64 !rounded-full font-black italic border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 shadow-sm uppercase text-xs tracking-widest py-4"
          >
            Hepsini Gör
          </Button>
        </Link>
      </div>
    </section>
  );
};
export default TopSelling;
