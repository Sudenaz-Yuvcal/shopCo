import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFavorite } from "../context/FavoriteContext";
import ProductInfo from "../sections/product-detail/product-info";
import type { Product } from "../types/product";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isInFavorites } = useFavorite();

  useEffect(() => {
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const adaptedProduct: Product = {
          id: data.id,
          name: data.title,
          image: data.images[0].replace(/[\[\]"]/g, ""),
          images: data.images.map((img: string) => img.replace(/[\[\]"]/g, "")),
          value: data.price,
          price: data.price,

          oldValue: Math.round(data.price * (1 + (Math.random() * 0.3 + 0.1))),

          description: data.description,

          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),

          category: data.category?.name || "Shop.co Özel",
          color: "black",
        };
        setProduct(adaptedProduct);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ürün yüklenirken hata oluştu:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (qty: number, size: string, color: string) => {
    console.log(
      `Sepete Eklendi: ${product?.name} - ${qty} adet - Beden: ${size} - Renk: ${color}`,
    );
    alert("Ürün sepete eklendi!");
  };

  if (loading)
    return (
      <div className="py-20 text-center font-[1000] italic">
        SHOP.CO...
      </div>
    );
  if (!product)
    return (
      <div className="py-20 text-center font-[1000] italic">
        ÜRÜN BULUNAMADI!
      </div>
    );

  return (
    <div className="bg-white min-h-screen pt-10 md:pt-20">
      <ProductInfo
        product={product}
        isFavorite={isInFavorites(product.id)}
        onToggleFavorite={toggleFavorite}
        onAddToCart={handleAddToCart}
        userAddress="Bursa, Türkiye"
      />
    </div>
  );
};

export default ProductDetailPage;
