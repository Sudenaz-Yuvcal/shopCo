import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ALL_PRODUCTS } from "../constants/Product";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useWishlist } from "../context/WishlistContext";
import { Helmet } from "react-helmet-async";
import type { Product } from "../types/product";

// Bileşenleri doğru yollardan import ettiğinden emin ol
import ProductInfo from "../sections/product-detail/product-info";
import ProductTabs from "../sections/product-detail/product-tabs";
import ProductCard from "../components/product/ProductCard";

import { RiCheckLine, RiArrowRightUpLine } from "react-icons/ri";
import Button from "../components/ui/Button";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useUser();

  const product = ALL_PRODUCTS.find((p: Product) => p.id === Number(id));
  const isFavorite = isInWishlist(Number(id));

  // Modal ve Ürün Detay Stateleri
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedDetails, setAddedDetails] = useState({ qty: 1, size: "" });

  // Sayfa değiştiğinde en üste çık
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product)
    return (
      <div className="p-32 text-center font-black uppercase italic tracking-widest text-zinc-200">
        TASARIM BULUNAMADI
      </div>
    );

  // Sepete ekle butonuna basıldığında çalışacak fonksiyon
  const handleAddToCart = (qty: number, size: string, color: string) => {
    addToCart(product, qty, size, color);
    setAddedDetails({ qty, size });
    setShowAddedModal(true); // Modal burada tetikleniyor
  };

  // Önerilen ürünler: Şu anki ürün hariç aynı kategoridekileri veya rastgele 4 ürünü getir
  const relatedProducts = ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(
    0,
    4,
  );

  return (
    <div className="bg-white min-h-screen font-satoshi">
      <Helmet>
        <title>{product.name} | SHOP.CO</title>
      </Helmet>

      {/* --- SEPETE EKLENDİ MODALI --- */}
      {showAddedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500"
            onClick={() => setShowAddedModal(false)}
          />
          <div className="relative bg-white w-full max-w-[450px] rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
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
                  ${product.value * addedDetails.qty}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate("/cart")}
                className="w-full !rounded-full !py-6 !text-[11px] tracking-widest italic shadow-xl"
              >
                ÖDEMEYE GİT →
              </Button>
              <button
                onClick={() => setShowAddedModal(false)}
                className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-black transition-colors py-2"
              >
                ALIŞVERİŞE DEVAM ET
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        {/* Breadcrumb */}
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

        {/* Üst Kısım: Görsel ve Bilgi */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 mb-32 items-start">
          <div className="lg:col-span-7 w-full rounded-[40px] overflow-hidden bg-zinc-50 border border-zinc-100">
            <img
              src={product.image}
              className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-1000"
              alt={product.name}
            />
          </div>

          <ProductInfo
            product={product}
            isFavorite={isFavorite}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            userAddress={user?.address}
          />
        </div>

        {/* Orta Kısım: Yorumlar ve SSS */}
        <ProductTabs product={product} />

        {/* Alt Kısım: Önerilen Ürünler (Burası Geri Geldi!) */}
        <div className="mt-40 mb-20">
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
    </div>
  );
};

export default ProductDetail;
