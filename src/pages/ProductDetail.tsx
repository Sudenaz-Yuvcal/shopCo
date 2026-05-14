import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, getProducts } from "../api/productService";
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
  category?: { id: number; name: string } | null;
  brand?: string;
  created_at?: string;
  oldValue?: number;
  rating?: number;
  faqs?: { question: string; answer: string }[];
  variants?: {
    size: string;
    color: string;
    stock: number;
  }[];
  slug?: string;
}

interface ExtendedProduct extends Product {
  created_at: string;
  brand: string;
  category_id: number;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isInFavorites } = useFavorite();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [showAddedModal, setShowAddedModal] = useState<boolean>(false);
  const [addedDetails, setAddedDetails] = useState({
    qty: 1,
    size: "",
    color: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const adaptProduct = (p: LocalAPIProduct): ExtendedProduct => {
    const name = p.name ?? p.title ?? "İsimsiz Ürün";

    return {
      id: p.id,
      name: name,
      title: name,
      image: p.images?.[0] ?? p.image ?? "",
      images: p.images ?? [],
      slug: p.slug ?? slugify(name),
      price: p.price,
      value: p.price,
      oldValue: p.oldValue ?? Math.round(p.price * 1.3),
      description: p.description ?? "Açıklama bulunamadı.",
      rating: Number(p.rating ?? 4.8),
      category: p.category?.name ?? "Giyim",
      category_id: p.category?.id ?? 0,
      brand: p.brand ?? "",
      created_at: p.created_at ?? new Date().toISOString(),
      faqs: p.faqs ?? [],
      variants: (p.variants ?? []).map((v) => ({
        size: v.size,
        color: v.color,
        stock: Number(v.stock ?? 0),
      })),

      stock: (p.variants ?? []).reduce(
        (acc, curr) => acc + Number(curr.stock ?? 0),
        0,
      ),
    };
  };

  const { data: product, isLoading: productLoading } =
    useQuery<ExtendedProduct | null>({
      queryKey: ["product-detail", slug],
      queryFn: async () => {
        if (!slug) throw new Error("Slug bulunamadı");
        const res = (await getProductBySlug(
          slug,
        )) as unknown as LocalAPIProduct;
        return res ? adaptProduct(res) : null;
      },
      enabled: !!slug,
    });

  const { data: relatedProducts = [], isLoading: _relatedLoading } = useQuery<
    ExtendedProduct[]
  >({
    queryKey: ["related-products", product?.category_id],
    queryFn: async () => {
      if (!product) return [];
      const all = (await getProducts()) as unknown as LocalAPIProduct[];
      return all
        .filter(
          (p) => p.category?.id === product.category_id && p.id !== product.id,
        )
        .slice(0, 4)
        .map(adaptProduct);
    },
    enabled: !!product,
  });

  const handleAddToCart = (qty: number, size: string, color: string) => {
    if (product) {
      addToCart(product, qty, size, color);
      setAddedDetails({ qty, size, color });
      setShowAddedModal(true);
    }
  };

  if (productLoading)
    return (
      <div className="py-40 text-center font-black italic text-4xl animate-pulse">
        YÜKLENİYOR...
      </div>
    );
  if (!product)
    return (
      <div className="py-40 text-center font-black italic text-4xl">
        ÜRÜN BULUNAMADI!
      </div>
    );

  return (
    <div className="bg-white min-h-screen font-satoshi">
      <Helmet>
        <title>{product.name} | SHOP.CO</title>
      </Helmet>

      {showAddedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddedModal(false)}
          />
          <div className="relative bg-white w-full max-w-[450px] rounded-[40px] p-10 shadow-2xl text-center">
            <div className="flex items-center gap-4 mb-10 border-b pb-6 justify-center border-zinc-100">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <RiCheckLine size={28} />
              </div>
              <h3 className="font-black uppercase italic text-2xl">
                SEPETE EKLENDİ
              </h3>
            </div>
            <div className="flex gap-6 mb-10 text-left">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-50">
                <img
                  src={product.image}
                  className="w-full h-full object-cover"
                  alt={product.name}
                />
              </div>
              <div>
                <h4 className="font-black uppercase text-lg leading-tight">
                  {product.name}
                </h4>
                <p className="text-xs font-bold text-zinc-400 uppercase mt-1">
                  {addedDetails.color} / {addedDetails.size} /{" "}
                  {addedDetails.qty} ADET
                </p>
                <p className="text-xl font-black italic mt-1">
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
          isFavorite={isInFavorites(product.id)}
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
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
