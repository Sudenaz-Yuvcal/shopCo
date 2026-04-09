import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isInFavorites } = useFavorite();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedDetails, setAddedDetails] = useState({ qty: 1, size: "" });

  const isFavorite = product ? isInFavorites(product.id) : false;

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data: APIProduct) => {
        const adapted: Product = {
          id: data.id,
          name: data.title,
          image:
            data.images?.[0]?.replace(/[\[\]"]/g, "").replace(/\\/g, "") ?? "",
          images: Array.isArray(data.images)
            ? data.images.map((img: string) =>
                img.replace(/[\[\]"]/g, "").replace(/\\/g, ""),
              )
            : [],
          value: data.price,
          price: data.price,
          oldValue: Math.round(data.price * (1 + (Math.random() * 0.3 + 0.1))),
          description: data.description,
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
          category: data.category?.name?.includes("Updated")
            ? " Kategori"
            : data.category?.name || "Kategori",
          color: "black",
        };
        setProduct(adapted);

        return fetch(
          `https://api.escuelajs.co/api/v1/products/?categoryId=${data.category.id}&offset=0&limit=5`,
        );
      })
      .then((res) => res.json())
      .then((relatedData: APIProduct[]) => {
        const adaptedRelated: Product[] = relatedData
          .filter((p: APIProduct) => p.id !== Number(id))
          .slice(0, 4)
          .map((p: APIProduct) => {
            const imagesArray = p.images ?? [];
            const cleanedImages = imagesArray.length
              ? imagesArray.map((img: string) =>
                  img.replace(/[\[\]"]/g, "").replace(/\\/g, ""),
                )
              : [];

            return {
              id: p.id,
              name: p.title,
              image: cleanedImages[0] ?? "",
              images: cleanedImages,
              price: p.price,
              value: p.price,
              rating: 4.5,
              category: p.category?.name?.includes("Updated")
                ? "Kategori"
                : p.category?.name || "Kategori",
            };
          });

        setRelatedProducts(adaptedRelated);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Yükleme hatası:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="p-32 text-center font-black italic animate-pulse text-black">
        YÜKLENİYOR...
      </div>
    );
  if (!product)
    return (
      <div className="p-32 text-center font-black text-black">
        TASARIM BULUNAMADI
      </div>
    );

  const handleAddToCart = (qty: number, size: string, color: string) => {
    if (product) {
      addToCart(product, qty, size, color);
      setAddedDetails({ qty, size });
      setShowAddedModal(true);
    }
  };

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
            <div className="flex items-center gap-4 mb-10 border-b border-zinc-100 pb-6 justify-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <RiCheckLine size={28} />
              </div>
              <h3 className="font-black uppercase italic tracking-tighter text-2xl text-black">
                SEPETE EKLENDİ
              </h3>
            </div>
            <div className="flex gap-6 mb-10 text-left">
              <div className="w-28 h-28 shrink-0 rounded-3xl overflow-hidden border border-zinc-100">
                <img
                  src={product.image}
                  className="w-full h-full object-cover"
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <h4 className="font-black text-lg uppercase italic text-black leading-none">
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
                className="w-full !rounded-full !py-6 italic shadow-xl"
              >
                ÖDEMEYE GİT →
              </Button>
              <button
                onClick={() => setShowAddedModal(false)}
                className="w-full text-[10px] font-black uppercase text-zinc-300 hover:text-black py-2"
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
          userAddress={user?.address}
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
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
