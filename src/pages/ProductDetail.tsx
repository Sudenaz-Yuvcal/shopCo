import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "../api/productService";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useFavorite } from "../context/FavoriteContext";
import { Helmet } from "react-helmet-async";
import type { Product } from "../types/product";
import ProductInfo from "../sections/product-detail/product-info";
import ProductTabs from "../sections/product-detail/product-tabs";
import ProductCard from "../components/Product/ProductCard";
import { RiCheckLine } from "react-icons/ri";
import Button from "../components/Ui/Button";
import { slugify } from "../utils/slugify";

interface LocalAPIProduct {
  id: number;
  title?: string;
  name?: string;
  price: number;
  images?: string[];
  image?: string;
  description?: string;
  category?: { name: string } | string;
  brand?: string;
  created_at?: string;
  oldValue?: number;
  rating?: number;
  faqs?: { question: string; answer: string }[];
  variants: {
    size: string;
    color: string;
    stock: number;
  }[];
}

interface ExtendedProduct extends Product {
  created_at: string;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isInFavorites } = useFavorite();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedDetails, setAddedDetails] = useState({
    qty: 1,
    size: "",
    color: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const getProductIdFromSlug = (slugStr: string | undefined): string | null => {
    if (!slugStr) return null;
    const parts = slugStr.split("-");
    const lastPart = parts[parts.length - 1];
    return isNaN(Number(lastPart)) ? slugStr : lastPart;
  };

  const actualId = getProductIdFromSlug(slug);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["product-detail", actualId],
    queryFn: async () => {
      if (!actualId) throw new Error("Ürün kimliği bulunamadı");
      const response = await getProductBySlug(actualId);
      const productData = response as unknown as LocalAPIProduct;

      if (!productData) return null;
      const adaptedProduct: ExtendedProduct = {
        id: productData.id,
        name: productData.title || productData.name || "İsimsiz Ürün",
        title: productData.title || productData.name || "İsimsiz Ürün",
        image: productData.images?.[0] || productData.image || "",
        images: productData.images || [],
        slug: slugify(productData.title || productData.name || ""),
        category_id: (productData.category as any)?.id || 0,
        value: productData.price,
        price: productData.price,
        oldValue: productData.oldValue || Math.round(productData.price * 1.3),
        description: productData.description || "Açıklama bulunamadı.",
        rating: productData.rating || 4.8,
        category:
          typeof productData.category === "object"
            ? productData.category.name
            : productData.category || "Giyim",
        faqs: productData.faqs || [],
        brand: productData.brand || "",
        created_at: productData.created_at || new Date().toISOString(),
        stock:
          productData.variants?.reduce(
            (acc: number, curr: { stock: number }) => acc + (curr.stock || 0),
            0,
          ) || 0,
        variants: productData.variants || [],
      };

      return {
        product: adaptedProduct,
        relatedProducts: [] as ExtendedProduct[],
      };
    },
    enabled: !!actualId,
  });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];
  const isFavorite = product ? isInFavorites(product.id) : false;

  const handleAddToCart = (qty: number, size: string, color: string) => {
    if (product) {
      addToCart(product, qty, size, color);
      setAddedDetails({ qty, size, color });
      setShowAddedModal(true);
    }
  };

  if (loading)
    return (
      <div className="py-40 text-center font-black italic text-4xl animate-pulse text-black">
        YÜKLENİYOR...
      </div>
    );

  if (!product)
    return (
      <div className="py-40 text-center font-black italic text-4xl text-black">
        ÜRÜN BULUNAMADI!
      </div>
    );

  return (
    <div className="bg-white min-h-screen font-satoshi">
      <Helmet>
        <title>{product.name} | SHOP.CO</title>
      </Helmet>

      {showAddedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddedModal(false)}
          />
          <div className="relative bg-white w-full max-w-[450px] rounded-[40px] p-10 shadow-2xl text-center">
            <div className="flex items-center gap-4 mb-10 border-b pb-6 justify-center border-zinc-100">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <RiCheckLine size={28} />
              </div>
              <h3 className="font-black uppercase italic text-2xl text-black">
                SEPETE EKLENDİ
              </h3>
            </div>
            <div className="flex gap-6 mb-10 text-left">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <img
                  src={product.image}
                  className="w-full h-full object-cover"
                  alt={product.name}
                />
              </div>
              <div>
                <h4 className="font-black uppercase text-lg leading-tight text-black">
                  {product.name}
                </h4>
                <p className="text-xs font-bold text-zinc-400 uppercase mt-1">
                  {addedDetails.color} / {addedDetails.size} /{" "}
                  {addedDetails.qty} ADET
                </p>
                <p className="text-xl font-black italic mt-1 text-black">
                  ${product.price * addedDetails.qty}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate("/cart")}
              className="w-full !rounded-full italic font-black bg-black text-white"
            >
              ÖDEMEYE GİT →
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProductInfo
          product={product}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onAddToCart={handleAddToCart}
          userAddress={user?.address || "Bursa, Türkiye"}
        />
      </div>

      <ProductTabs product={product} />

      <div className="max-w-7xl mx-auto px-6 mt-20 mb-20">
        <h2 className="text-4xl font-[1000] italic uppercase text-center mb-10 text-black">
          Bunları da Sevebilirsin
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} {...p} slug={p.slug || slugify(p.name)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
