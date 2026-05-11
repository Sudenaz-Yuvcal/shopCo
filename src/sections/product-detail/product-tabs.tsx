import { useState, useMemo } from "react";
import { RiStarFill, RiCheckLine } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from "../../components/Ui/Button";
import Input from "../../components/Ui/Input";
import type { Review, SortOption } from "../../types/review";
import type { Product } from "../../types/product";
import { SlidersHorizontal } from "lucide-react";

const DEFAULT_FAQ_DATA = [
  {
    question: "KUMAŞ VE MATERYAL KALİTESİ NEDİR?",
    answer:
      "Ürünlerimiz %100 sürdürülebilir yüksek segment pamuk liflerinden üretilmiştir. Dokusu ultra-soft olup uzun ömürlü kullanım için test edilmiştir.",
  },
  {
    question: "BAKIM VE YIKAMA TALİMATLARI",
    answer:
      "Maksimum 30 derecede, benzer renklerle ve tersten yıkamanız tavsiye edilir. Kurutma makinesi önerilmez.",
  },
];

const ProductTabs = ({ product }: { product: Product }) => {
  const [activeTab, setActiveTab] = useState("Reviews");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleReviews] = useState(6);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Samantha D.",
      rating: 5,
      date: "August 14, 2023",
      text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable.",
    },
    {
      id: 2,
      name: "Alex M.",
      rating: 4,
      date: "August 15, 2023",
      text: "The shirt is great, but I wish the sizing was a bit more consistent.",
    },
    {
      id: 3,
      name: "Sudenaz Y.",
      rating: 5,
      date: "March 30, 2026",
      text: "Elite bir parça, tam istediğim gibi!",
    },
  ]);

  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    text: "",
  });

  const activeFaqs = useMemo(() => {
    if (
      product.faqs &&
      Array.isArray(product.faqs) &&
      product.faqs.length > 0
    ) {
      return product.faqs;
    }
    return DEFAULT_FAQ_DATA;
  }, [product.faqs]);

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
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      text: newReview.text,
    };
    setReviews([reviewToAdd, ...reviews]);
    setIsModalOpen(false);
    setNewReview({ author: "", rating: 5, text: "" });
    toast.dark("Yorumunuz yayına alındı.");
  };

  return (
    <div className="mt-32 w-full scale-[0.9] origin-top">
      <div className="mt-32 w-full flex border-b border-zinc-100 mb-12">
          {["Product Details", "Reviews", "FAQs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[150px] pb-6 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab
                  ? "text-black italic"
                  : "text-zinc-300 hover:text-zinc-500"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-black animate-in fade-in" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px] text-left">
          {activeTab === "Product Details" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black italic uppercase mb-6 tracking-tight">
                Ürün Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <p className="text-zinc-500 font-medium leading-relaxed">
                  {product.description ||
                    "Bu özel tasarım parça, modern stil ile konforu birleştiriyor."}
                </p>
                <ul className="space-y-4">
                  {[
                    "%100 Premium Pamuk",
                    "Nefes Alan Doku",
                    "Dayanıklı Baskı",
                    "Modern Fit Kesim",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-bold uppercase italic"
                    >
                      <RiCheckLine className="text-green-500" size={20} />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tight">
                  Tüm Yorumlar{" "}
                  <span className="text-zinc-300 text-xl ml-2">
                    ({reviews.length})
                  </span>
                </h2>

                <div className="flex items-center gap-4">
                  <button className="p-3 bg-[#F0F0F0] rounded-full border-none cursor-pointer hover:bg-black/5">
                    <SlidersHorizontal size={18} />
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-[#F0F0F0] px-6 py-3 rounded-full text-[10px] font-black uppercase outline-none cursor-pointer"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="!bg-black !text-white !rounded-full !px-10 !py-3 !text-[11px] font-black italic uppercase"
                  >
                    Write a Review
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedReviews.slice(0, visibleReviews).map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-zinc-100 rounded-[32px] p-8 space-y-4 hover:border-black transition-all group"
                  >
                    <div className="flex text-yellow-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <RiStarFill
                          key={i}
                          className={i >= review.rating ? "text-zinc-100" : ""}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-lg uppercase italic">
                          {review.name}
                        </h4>
                        <RiCheckLine
                          className="bg-green text-white rounded-full p-0.5"
                          size={16}
                        />
                      </div>
                      <p className="text-zinc-500 text-[15px] font-medium leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>
                    <p className="text-[11px] font-black text-zinc-300 uppercase tracking-widest pt-2">
                      Posted on {review.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "FAQs" && (
            <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-500">
              {activeFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-2 border-zinc-100 rounded-[24px] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === index ? null : index)
                    }
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-black text-sm uppercase italic tracking-wider">
                      {faq.question}
                    </span>
                    {openFaqIndex === index ? (
                      <FiMinus size={20} />
                    ) : (
                      <FiPlus size={20} />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 pt-0 text-zinc-500 text-sm font-medium leading-relaxed border-t border-zinc-50 italic">
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in">
              <h2 className="text-2xl font-black italic uppercase mb-6 text-center">
                Yorum Yap
              </h2>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <Input
                  required
                  value={newReview.author}
                  onChange={(e) =>
                    setNewReview({ ...newReview, author: e.target.value })
                  }
                  placeholder="İSMİNİZ"
                  className="!rounded-2xl font-black italic"
                />
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <RiStarFill
                      key={star}
                      className={`text-2xl cursor-pointer transition-all ${
                        star <= newReview.rating
                          ? "text-yellow-400 scale-110"
                          : "text-zinc-200"
                      }`}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                    />
                  ))}
                </div>
                <textarea
                  required
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview({ ...newReview, text: e.target.value })
                  }
                  className="w-full bg-[#F0F0F0] rounded-2xl p-4 text-sm font-bold uppercase outline-none focus:ring-2 ring-black h-32"
                  placeholder="YORUMUNUZ..."
                />
                <Button
                  type="submit"
                  className="w-full !bg-black !text-white !rounded-full italic font-black"
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
