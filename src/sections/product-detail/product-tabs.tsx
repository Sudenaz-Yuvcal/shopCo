import { useState, useMemo } from "react";
import { RiStarFill, RiCheckLine } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import type { Review, SortOption } from "../../types/review";
import type { Product } from "../../types/product";

const FAQ_DATA = [
  {
    question: "KUMAŞ VE MATERYAL KALİTESİ NEDİR?",
    answer:
      "Ürünlerimiz %100 sürdürülebilir yüksek segment pamuk liflerinden üretilmiştir. Dokusu ultra-soft olup uzun ömürlü kullanım için test edilmiştir.",
  },
  {
    question: "BAKIM VE YIKAMA TALİMATLARI",
    answer:
      "Maksimum 30 derecede, benzer renklerle ve tersten yıkamanız tavsiye edilir.",
  },
];

const ProductTabs = ({ product }: { product: Product }) => {
  const [activeTab, setActiveTab] = useState("Yorumlar & Değerlendirmeler");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(4);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Melike E.",
      rating: 3,
      date: "2025-03-31",
      text: "Kalıbı ve kumaşı harika.",
    },
    {
      id: 2,
      name: "Sudenaz Y.",
      rating: 4,
      date: "2025-07-05",
      text: "Minimalist tarzımı tamamlıyor.",
    },
  ]);

  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    text: "",
  });

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [sortBy, reviews]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewToAdd: Review = {
      id: Date.now(),
      name: newReview.author || "Anonim",
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      text: newReview.text,
    };
    setReviews([reviewToAdd, ...reviews]);
    setIsModalOpen(false);
    setNewReview({ author: "", rating: 5, text: "" });
    toast.dark("Yorumunuz yayına alındı.");
  };

  return (
    <div className="mt-32">
      <div className="flex border-b-2 border-brand-gray mb-20 overflow-x-auto scrollbar-hide">
        {["Yorumlar & Değerlendirmeler", "SSS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[220px] pb-8 pt-4 text-[11px] font-black uppercase tracking-widest-premium transition-all relative ${
              activeTab === tab
                ? "text-brand-black italic"
                : "text-zinc-300 hover:text-zinc-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-2px] left-0 w-full h-[4px] bg-brand-black animate-in slide-in-from-left" />
            )}
          </button>
        ))}
      </div>
      <div className="min-h-[500px]">
        {activeTab === "Yorumlar & Değerlendirmeler" ? (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-heavy font-integral uppercase italic tracking-tightest">
                MÜŞTERİ <span className="text-zinc-200">YORUMLARI</span>
              </h2>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-brand-gray px-8 py-3 rounded-full text-[10px] font-black uppercase outline-none focus:border-brand-black border-2 border-transparent transition-all"
                >
                  <option value="latest">YENİDEN ESKİYE</option>
                  <option value="oldest">ESKİDEN YENİYE</option>
                </select>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="!bg-brand-black !text-brand-white !rounded-full !px-10 !py-3 !text-[10px] italic"
                >
                  YORUM YAP
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedReviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review.id}
                  className="bg-brand-gray rounded-shop-lg p-10 space-y-6 group border border-transparent hover:border-brand-black transition-all"
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
                      <h4 className="font-heavy text-sm uppercase italic">
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

            {visibleReviews < sortedReviews.length && (
              <div className="text-center pt-16">
                <Button
                  variant="outline"
                  onClick={() => setVisibleReviews((p) => p + 2)}
                  className="!px-16 !py-5 !rounded-full !text-[11px] italic tracking-widest-premium"
                >
                  DAHA FAZLA YÜKLE
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-10 space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className="bg-brand-white border-2 border-brand-gray rounded-shop-md overflow-hidden"
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
                  {openFaqIndex === index ? (
                    <FiMinus size={20} />
                  ) : (
                    <FiPlus size={20} />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${openFaqIndex === index ? "max-h-96" : "max-h-0"}`}
                >
                  <p className="p-8 pt-0 text-zinc-400 text-[11px] font-bold uppercase tracking-widest-premium italic border-t border-brand-gray">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-brand-white rounded-shop-lg w-full max-w-[400px] p-10 shadow-premium animate-in zoom-in-95">
            <h2 className="text-3xl font-heavy font-integral uppercase italic tracking-tightest mb-8 text-center text-brand-black">
              DENEYİMİNİ PAYLAŞ
            </h2>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <Input
                required
                value={newReview.author}
                onChange={(e) =>
                  setNewReview({ ...newReview, author: e.target.value })
                }
                placeholder="İSMİNİZ"
                className="!rounded-2xl !py-4 font-black italic"
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
    </div>
  );
};

export default ProductTabs;
