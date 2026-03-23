import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ALL_PRODUCTS } from "../constants/Product";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { Helmet } from "react-helmet-async";
import type { Product } from "../types/product";
import ScarcityBadge from "../components/ui/ScarcityBadge";
import Input from "../components/ui/Input";
import type { Review, SortOption } from "../types/review";
import {
  RiStarFill,
  RiCheckLine,
  RiZoomInLine,
  RiTimeLine,
  RiArrowRightUpLine,
} from "react-icons/ri";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import { FiMapPin, FiPlus, FiMinus } from "react-icons/fi";

const FAQ_DATA = [
  {
    question: "KUMAŞ VE MATERYAL KALİTESİ NEDİR?",
    answer:
      "Ürünlerimiz %100 sürdürülebilir yüksek segment pamuk liflerinden üretilmiştir. Dokusu ultra-soft olup uzun ömürlü kullanım için test edilmiştir.",
  },
  {
    question: "BAKIM VE YIKAMA TALİMATLARI",
    answer:
      "Maksimum 30 derecede, benzer renklerle ve tersten yıkamanız ürün ömrünü uzatır. Tamburlu kurutma önerilmez.",
  },
  {
    question: "İADE VE DEĞİŞİM KOŞULLARI",
    answer:
      "Teslimat tarihinden itibaren 14 gün içerisinde jiletli ambalajı bozulmamış ürünlerde ücretsiz iade hakkınız mevcuttur.",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const product = ALL_PRODUCTS.find((p: Product) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("khaki");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Yorumlar & Değerlendirmeler");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: "50% 50%" });
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    text: "",
  });

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Melike E.",
      rating: 3,
      date: "2025-03-31",
      text: "Kalıbı ve kumaşı beklediğimden çok daha kaliteli geldi.",
    },
    {
      id: 2,
      name: "Sudenaz Y.",
      rating: 4,
      date: "2025-07-05",
      text: "Minimalist tarzımı tamamlayan en iyi parça oldu.",
    },
    {
      id: 3,
      name: "Ava H.",
      rating: 5,
      date: "2026-04-26",
      text: "Dikiş detayları ve kesimi kusursuz. Tavsiye ederim.",
    },
  ]);

  const COLOR_OPTIONS = [
    { name: "Kahverengi", id: "khaki", tailwind: "bg-khaki" },
    { name: "Yeşil", id: "green", tailwind: "bg-green" },
    { name: "Mavi", id: "denim", tailwind: "bg-denim" },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (product) setMainImage(product.image);
  }, [id, product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomActive) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [sortBy, reviews]);

  if (!product)
    return (
      <div className="p-32 text-center font-heavy uppercase italic tracking-widest text-zinc-200">
        TASARIM BULUNAMADI
      </div>
    );

  const discount = product.oldValue
    ? Math.round(((product.oldValue - product.value) / product.oldValue) * 100)
    : null;

  return (
    <div className="bg-white min-h-screen font-satoshi">
      <Helmet>
        <title>{product.name} | SHOP.CO</title>
      </Helmet>

      {showAddedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm animate-in fade-in duration-500"
            onClick={() => setShowAddedModal(false)}
          />
          <div className="relative bg-white w-full max-w-[450px] rounded-shop-lg p-10 shadow-premium animate-frisbee-in text-center text-brand-black">
            <div className="flex items-center gap-4 mb-10 border-b-2 border-brand-gray pb-6 justify-center">
              <div className="w-12 h-12 bg-brand-black text-brand-white rounded-full flex items-center justify-center">
                <RiCheckLine size={28} />
              </div>
              <h3 className="font-heavy font-integral uppercase italic tracking-tightest text-2xl">
                SEPETE EKLENDİ
              </h3>
            </div>
            <div className="flex gap-6 mb-10 group text-left">
              <div className="w-28 h-28 shrink-0 rounded-shop-md overflow-hidden border border-brand-gray shadow-inner">
                <img
                  src={product.image}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <h4 className="font-heavy font-integral text-lg uppercase italic tracking-tight leading-none">
                  {product.name}
                </h4>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {selectedSize} • {quantity} ADET
                </p>
                <p className="text-xl font-heavy italic">
                  ${product.value * quantity}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate("/cart")}
                className="w-full !rounded-full !py-6 !text-[11px] tracking-widest-premium italic shadow-2xl"
              >
                ÖDEMEYE GİT →
              </Button>
              <button
                onClick={() => setShowAddedModal(false)}
                className="w-full text-[10px] font-black uppercase tracking-widest-premium text-zinc-300 hover:text-brand-black transition-colors py-2"
              >
                ALIŞVERİŞE DEVAM ET
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-brand-white rounded-shop-lg w-full max-w-[400px] p-10 shadow-premium animate-in zoom-in-95 text-brand-black">
            <h2 className="text-3xl font-heavy font-integral uppercase italic tracking-tightest mb-8 text-center">
              DENEYİMİNİ PAYLAŞ
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setReviews([
                  {
                    id: Date.now(),
                    name: newReview.author || user?.name || "Anonim",
                    rating: newReview.rating,
                    date: new Date().toISOString().split("T")[0],
                    text: newReview.text,
                  },
                  ...reviews,
                ]);
                setIsModalOpen(false);
                toast.dark("Yorumunuz yayına alındı.");
              }}
              className="space-y-6"
            >
              <Input
                required
                value={newReview.author}
                onChange={(e) =>
                  setNewReview({ ...newReview, author: e.target.value })
                }
                placeholder="İSMİNİZ"
                className="!rounded-2xl !py-4 font-black italic border-brand-gray"
              />
              <div className="flex justify-center gap-2 text-2xl text-brand-black">
                {[1, 2, 3, 4, 5].map((s) => (
                  <RiStarFill
                    key={s}
                    className={`cursor-pointer transition-all ${s > newReview.rating ? "opacity-10 text-zinc-300" : "scale-110"}`}
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                  />
                ))}
              </div>
              <textarea
                required
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
                rows={4}
                className="w-full bg-brand-gray border-2 border-brand-gray rounded-shop-md p-6 text-sm font-bold uppercase placeholder:text-zinc-300 outline-none focus:border-brand-black transition-all font-satoshi italic"
                placeholder="ÜRÜN HAKKINDAKİ GÖRÜŞLERİN..."
              />
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full !rounded-full italic tracking-[0.2em]"
              >
                YAYINLA
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div className="flex items-center gap-3 text-zinc-300 text-[10px] font-black uppercase tracking-widest-premium mb-12 italic">
          <Link to="/" className="hover:text-brand-black">
            ANA SAYFA
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-black">
            MAĞAZA
          </Link>
          <span>/</span>
          <span className="text-brand-black underline underline-offset-8 decoration-brand-black/20">
            {product.category}
          </span>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 mb-24 items-start">
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-5 w-full">
            <div className="flex md:flex-col gap-4 order-2 md:order-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(product.image)}
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-shop-md overflow-hidden cursor-pointer transition-all duration-500 border-2 ${mainImage === product.image ? "border-brand-black scale-95 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"}`}
                >
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                    alt="Angle"
                  />
                </div>
              ))}
            </div>
            <div
              className={`flex-1 relative aspect-[4/5] bg-brand-gray rounded-shop-lg overflow-hidden order-1 md:order-2 group select-none shadow-sm ${isZoomActive ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              onClick={() => setIsZoomActive(!isZoomActive)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomActive(false)}
            >
              <img
                src={mainImage}
                className={`w-full h-full object-cover transition-all duration-700 ${isZoomActive ? "opacity-0 scale-110" : "opacity-100"}`}
                alt={product.name}
              />
              {isZoomActive && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${mainImage})`,
                    backgroundSize: "250%",
                    backgroundPosition: zoomStyle.backgroundPosition,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}
              {!isZoomActive && (
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  <RiZoomInLine size={20} className="text-brand-black" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10 w-full pt-2 text-brand-black">
            <div className="space-y-6">
              <ScarcityBadge />
              <h1 className="text-5xl md:text-6xl font-heavy font-integral uppercase italic tracking-tightest leading-[0.85]">
                {product.name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex text-brand-black text-lg gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <RiStarFill
                    key={i}
                    className={
                      i >= Math.floor(product.rating || 0) ? "opacity-10" : ""
                    }
                  />
                ))}
              </div>
              <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                {product.rating}/5.0 • {reviews.length} GÖRÜŞ
              </span>
            </div>
            <div className="flex items-baseline gap-6 border-b border-brand-gray pb-8">
              <span className="text-6xl font-heavy italic leading-none">
                ${product.value}
              </span>
              {product.oldValue && (
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-zinc-200 line-through font-heavy italic">
                    ${product.oldValue}
                  </span>
                  <span className="bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full text-[11px] font-heavy">
                    -{discount}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-zinc-400 text-sm font-medium uppercase leading-relaxed tracking-wider italic border-l-4 border-brand-black pl-8">
              Modern kesim, rafine doku. Shop.co premium koleksiyonunun en
              ikonik parçasıyla tarzını mühürle.
            </p>

            <div className="space-y-5">
              <p className="text-[10px] font-heavy uppercase tracking-widest-premium text-zinc-400 italic">
                RENK SEÇENEKLERİ
              </p>
              <div className="flex gap-4">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110  ${color.tailwind} bg-brand-denim ${selectedColor === color.id ? "ring-2 ring-brand-black ring-offset-4 scale-110 shadow-2xl" : "opacity-60"}`}
                    title={color.name}
                  >
                    {selectedColor === color.id && (
                      <RiCheckLine className="text-brand-white text-xl animate-in zoom-in" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-[10px] font-heavy uppercase tracking-widest-premium text-zinc-400 italic">
                BEDENİNİ SEÇ
              </p>
              <div className="flex flex-row gap-2 w-full">
                {["Small", "Medium", "Large", "X-Large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-3.5 rounded-full text-[11px] font-black uppercase tracking-tight transition-all duration-300 border ${selectedSize === size ? "bg-brand-black text-brand-white border-brand-black shadow-xl scale-105" : "bg-brand-white text-zinc-400 border-zinc-200 hover:bg-zinc-100 hover:text-brand-black"}`}
                  >
                    {size === "Small"
                      ? "S"
                      : size === "Medium"
                        ? "M"
                        : size === "Large"
                          ? "L"
                          : "XL"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-4 pt-4 items-stretch">
              <div className="bg-brand-gray px-6 py-4 rounded-full flex items-center justify-between border border-brand-gray min-w-[140px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-400 hover:text-brand-black transition-colors"
                >
                  <FiMinus size={22} />
                </button>
                <span className="text-xl font-heavy italic tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-zinc-400 hover:text-brand-black transition-colors"
                >
                  <FiPlus size={22} />
                </button>
              </div>
              <Button
                variant="primary"
                size="xl"
                onClick={() => {
                  addToCart(product, quantity, selectedSize, selectedColor);
                  setShowAddedModal(true);
                }}
                className="flex-1 !rounded-full !py-6 !text-[12px] tracking-widest-premium italic shadow-2xl hover:scale-[1.02] active:scale-95 transition-all bg-brand-black text-brand-white"
              >
                SEPETE EKLE →
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-4">
              <div className="bg-brand-gray p-5 rounded-shop-md border border-brand-gray flex items-center gap-4 group hover:bg-brand-white transition-colors">
                <FiMapPin
                  className="text-brand-black group-hover:animate-bounce"
                  size={24}
                />
                <div>
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                    TESLİMAT
                  </p>
                  <p className="text-[10px] font-black text-brand-black uppercase italic truncate max-w-[120px]">
                    {user?.address || "HIZLI TESLİMAT"}
                  </p>
                </div>
              </div>
              <div className="bg-brand-gray p-5 rounded-shop-md border border-brand-gray flex items-center gap-4 group hover:bg-brand-white transition-colors">
                <RiTimeLine
                  className="text-green-600 group-hover:rotate-12 transition-transform"
                  size={24}
                />
                <div>
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                    SÜRE
                  </p>
                  <p className="text-[10px] font-black text-green-600 uppercase italic tracking-widest">
                    MAX. 10 GÜN
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <div className="flex border-b-2 border-brand-gray mb-20 overflow-x-auto scrollbar-hide">
            {["Yorumlar & Değerlendirmeler", "SSS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[220px] pb-8 pt-4 text-[11px] font-black uppercase tracking-widest-premium transition-all relative ${activeTab === tab ? "text-brand-black italic" : "text-zinc-300 hover:text-zinc-500"}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-2px] left-0 w-full h-[4px] bg-brand-black animate-in slide-in-from-left" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[500px]">
            {activeTab === "Yorumlar & Değerlendirmeler" && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 text-brand-black">
                  <h2 className="text-4xl md:text-5xl font-heavy font-integral uppercase italic tracking-tightest">
                    MÜŞTERİ <span className="text-zinc-200">YORUMLARI</span>
                  </h2>
                  <div className="flex items-center gap-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-brand-gray px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-brand-black transition-all"
                    >
                      <option value="latest">YENİDEN ESKİYE</option>
                      <option value="oldest">ESKİDEN YENİYE</option>
                    </select>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="!bg-brand-black !text-brand-white !rounded-full !px-10 !py-3 !text-[10px] italic shadow-xl"
                    >
                      YORUM YAP
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-black">
                  {sortedReviews.slice(0, visibleReviews).map((review) => (
                    <div
                      key={review.id}
                      className="bg-brand-gray rounded-shop-lg p-10 space-y-6 border border-brand-gray hover:border-brand-black transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex text-brand-black gap-0.5 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <RiStarFill
                              key={i}
                              className={i >= review.rating ? "opacity-10" : ""}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                          {review.date}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heavy text-sm uppercase italic tracking-tight">
                            {review.name}
                          </h4>
                          <RiCheckLine
                            className="bg-green-500 text-brand-white rounded-full p-0.5"
                            size={14}
                          />
                        </div>
                        <p className="text-zinc-500 text-sm font-bold uppercase italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                          "{review.text}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {visibleReviews < reviews.length && (
                  <div className="text-center pt-16">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleReviews((p) => p + 2)}
                      className="!px-16 !py-5 !rounded-full !text-[11px] italic tracking-widest-premium hover:bg-brand-black hover:text-brand-white transition-all border-brand-gray"
                    >
                      DAHA FAZLA YÜKLE
                    </Button>
                  </div>
                )}
              </div>
            )}
            {activeTab === "SSS" && (
              <div className="max-w-3xl mx-auto py-10 space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-brand-white border-2 border-brand-gray rounded-shop-md overflow-hidden transition-all hover:border-brand-gray"
                  >
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? null : index)
                      }
                      className="w-full flex justify-between items-center p-8 text-left group"
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest-premium italic text-zinc-400 group-hover:text-brand-black transition-colors">
                        {faq.question}
                      </span>
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <FiPlus
                          size={20}
                          className={`absolute transition-all duration-500 text-brand-black ${openFaqIndex === index ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
                        />
                        <FiMinus
                          size={20}
                          className={`absolute transition-all duration-500 text-brand-black ${openFaqIndex === index ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
                        />
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${openFaqIndex === index ? "max-h-96" : "max-h-0"}`}
                    >
                      <p className="p-8 pt-0 text-zinc-400 text-[11px] font-bold uppercase tracking-widest-premium leading-relaxed italic border-t border-brand-gray">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-40 mb-20 text-brand-black">
          <div className="flex items-end justify-between mb-20 border-b-[6px] border-brand-black pb-8">
            <h2 className="text-4xl md:text-6xl font-heavy font-integral uppercase italic tracking-tightest leading-none">
              BUNLARI DA <span className="text-zinc-200">SEVEBİLİRSİN</span>
            </h2>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-zinc-300 hover:text-brand-black transition-all group"
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
            {ALL_PRODUCTS.filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
