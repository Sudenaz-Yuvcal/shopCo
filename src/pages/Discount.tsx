import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useFavorite } from "../context/FavoriteContext";
import DiscountBanner from "../sections/discount/discount-banner";
import DiscountHeader from "../sections/discount/discount-header";
import DiscountGrid from "../sections/discount/discount-grid";
import type { Product } from "../types/product";
import type { APIProduct } from "../types/api";

const Discount = () => {
  const { toggleFavorite, isInFavorites } = useFavorite();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

  useEffect(() => {
    setLoading(true);
    fetch("https:api.escuelajs.co/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        const cleanData = data.filter(
          (p: APIProduct) =>
            p.title.length < 50 &&
            !p.title.includes("_") &&
            p.images &&
            p.images.length > 0,
        );

        const adapted: Product[] = cleanData.map((p: APIProduct) => {
          let cleanImage = p.images[0];
          if (
            cleanImage &&
            (cleanImage.startsWith("[") || cleanImage.startsWith('"'))
          ) {
            cleanImage = cleanImage.replace(/[\[\]"]/g, "");
          }

          const hasDiscount = Math.random() > 0.5;
          const originalPrice = p.price;
          const oldPrice = hasDiscount ? Math.floor(originalPrice * 1.4) : null;

          return {
            id: p.id,
            name: p.title,
            image:
              cleanImage ||
              "https://placehold.co/600x800/F3F3F3/000000?text=SHOP.CO",
            value: originalPrice,
            price: originalPrice,
            oldValue: oldPrice,
            category: p.category?.name || "İndirim",
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
            brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
            color: "black",
          };
        });

        setProducts(adapted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const discountProducts = useMemo(() => {
    return products.filter((p) => p.oldValue && p.oldValue > p.value);
  }, [products]);

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>İndirim Fırsatları | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <DiscountBanner />

        {loading ? (
          <div className="mt-8 flex justify-center italic font-black text-zinc-400">
            FIRSATLAR YÜKLENİYOR...
          </div>
        ) : (
          <>
            <DiscountHeader count={discountProducts.length} />
            <DiscountGrid
              products={discountProducts}
              toggleFavorite={toggleFavorite}
              isInFavorites={isInFavorites}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Discount;
