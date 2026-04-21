import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useFavorite } from "../context/FavoriteContext";
import { Helmet } from "react-helmet-async";
import type { Product } from "../types/product";
import ProductInfo from "../sections/product-detail/product-info";
import ProductTabs from "../sections/product-detail/product-tabs";
import ProductCard from "../components/Product/ProductCard";
import { RiCheckLine, RiArrowRightUpLine } from "react-icons/ri";
import Button from "../components/Ui/Button";
import type { APIProduct } from "../types/api";
import { getCleanProducts, cleanImageUrl } from "../utils/filterProducts";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isInFavorites } = useFavorite();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedDetails, setAddedDetails] = useState({ qty: 1, size: "" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: async () => {
      const res = await axiosInstance.get<APIProduct>(`/products/${slug}`);
      const productData = res.data;

      const cleanedImages = (productData.images || [])
        .map((img) => {
          const rawUrl = Array.isArray(img) ? img[0] : img;
          return cleanImageUrl(rawUrl);
        })
        .filter((url) => url && url.startsWith("http"));

      const fullDescription = String(productData.description || ""); 
      const descriptionParts = fullDescription.split("|||");
      const pureDescription = descriptionParts[0]?.trim();
      const hiddenFaqsString = descriptionParts[1]?.trim();

      let parsedFaqs: { question: string; answer: string }[] = [];
      if (hiddenFaqsString) {
        try {
          parsedFaqs = JSON.parse(hiddenFaqsString) as {
            question: string;
            answer: string;
          }[];
        } catch (error) {
          console.error("FAQ parse hatası:", error);
          parsedFaqs = [];
        }
      }

      const adaptedProduct: Product = {
        id: productData.id,
        name: productData.title,
        image: cleanedImages[0] || "https://placehold.co/600x800?text=SHOP.CO",
        images: cleanedImages,
        value: productData.price,
        price: productData.price,
        oldValue: Math.round(productData.price * 1.3),
        description: pureDescription || "Açıklama bulunamadı.",
        rating: 4.8,
        category: productData.category?.name || "Shop.co Özel",
        color: "black",
        faqs: parsedFaqs,
      };

      let relatedItems: Product[] = [];
      try {
        const categoryId = productData.category?.id;
        const relatedRes = await axiosInstance.get<APIProduct[]>(
          `/products/?categoryId=${categoryId}&offset=0&limit=10`,
        );
        relatedItems = getCleanProducts(relatedRes.data);

        if (relatedItems.length <= 1) {
          const fallbackRes = await axiosInstance.get<APIProduct[]>(
            `/products/?offset=10&limit=10`,
          );
          relatedItems = getCleanProducts(fallbackRes.data);
        }
      } catch (err) {
        console.error("Related products fetch error:", err);
      }

      const finalRelated = relatedItems
        .filter((p) => p.id !== productData.id)
        .slice(0, 4)
        .map((p) => ({
          ...p,
          image:
            p.image ||
            p.images?.[0] ||
            "https://placehold.co/600x800?text=SHOP.CO",
        }));

      return { product: adaptedProduct, relatedProducts: finalRelated };
    },
    enabled: !!slug,
  });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];
  const isFavorite = product ? isInFavorites(product.id) : false;

  const handleAddToCart = (qty: number, size: string, color: string) => {
    if (product) {
      addToCart(product, qty, size, color);
      setAddedDetails({ qty, size });
      setShowAddedModal(true);
    }
  };

  if (loading) {
    return (
      <div className="py-40 text-center font-[1000] italic text-4xl animate-pulse tracking-tighter uppercase text-black">
        ÜRÜN YÜKLENİYOR...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-40 text-center font-[1000] italic text-4xl uppercase tracking-tighter text-black">
        TASARIM BULUNAMADI!
      </div>
    );
  }

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
          <div className="relative bg-white w-full max-w-[450px] rounded-[40px] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-10 border-b border-zinc-100 pb-6 justify-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <RiCheckLine size={28} />
              </div>
              <h3 className="font-black uppercase italic tracking-tighter text-2xl text-black">
                SEPETE EKLENDİ
              </h3>
            </div>
            <div className="flex gap-6 mb-10 text-left">
              <div className="w-28 h-28 shrink-0 rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50">
                <img
                  src={product.image}
                  className="w-full h-full object-cover"
                  alt={product.name}
                />
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <h4 className="font-black text-lg uppercase italic text-black leading-tight">
                  {product.name}
                </h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {addedDetails.size} • {addedDetails.qty} ADET
                </p>
                <p className="text-xl font-black italic text-black">
                  ${product.price * addedDetails.qty}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate("/cart")}
                className="w-full !rounded-full !py-6 italic shadow-xl font-black uppercase"
              >
                ÖDEMEYE GİT →
              </Button>
              <button
                onClick={() => setShowAddedModal(false)}
                className="w-full text-[10px] font-black uppercase text-zinc-300 hover:text-black py-2 transition-colors"
              >
                ALIŞVERİŞE DEVAM ET
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div className="flex items-center gap-3 text-zinc-300 text-[10px] font-black uppercase mb-12 italic">
          <Link to="/" className="hover:text-black transition-colors">
            ANA SAYFA
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">
            MAĞAZA
          </Link>
          <span>/</span>
          <span className="text-black underline underline-offset-8 decoration-black/10">
            {product.category}
          </span>
        </div>

        <ProductInfo
          product={product}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onAddToCart={handleAddToCart}
          userAddress={user?.address || "Bursa, Türkiye"}
        />
      </div>

      <ProductTabs product={product} />

      <div className="max-w-7xl mx-auto px-6 mt-40 mb-20">
        <div className="flex items-end justify-between mb-20 border-b-[6px] border-black pb-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-black">
            BUNLARI DA <span className="text-zinc-200">SEVEBİLİRSİN</span>
          </h2>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-zinc-300 hover:text-black transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              TÜMÜNÜ GÖR
            </span>
            <RiArrowRightUpLine
              size={20}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((p) => <ProductCard key={p.id} {...p} />)
          ) : (
            <div className="col-span-full py-10 border-2 border-dashed border-zinc-100 rounded-3xl text-center">
              <p className="text-zinc-400 font-black italic uppercase text-[10px]">
                Henüz benzer bir tasarım bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
