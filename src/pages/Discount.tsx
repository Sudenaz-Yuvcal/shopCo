import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiPercent, FiTrendingDown, FiClock } from "react-icons/fi";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { ALL_PRODUCTS } from "../constants/Product";
import type { Product } from "../types/product";
import { useWishlist } from "../context/WishlistContext";
const Discount = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const discountProducts = ALL_PRODUCTS.filter(
    (product: Product) => product.oldValue && product.oldValue > product.value,
  );

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>İndirim Fırsatları | SHOP.CO</title>
        <meta
          name="description"
          content="Shop.co indirim sayfasında kürate edilmiş tasarımlarda büyük fırsatları yakalayın!"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <div className="w-full bg-zinc-950 rounded-[48px] p-10 md:p-20 mb-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-800/20 rounded-full blur-[100px] -ml-20 -mb-20" />

          <div className="relative z-10 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] animate-pulse shadow-xl shadow-red-600/20">
              <FiPercent size={14} /> FIRSAT GÜNLERİ BAŞLADI
            </div>

            <h1 className="text-5xl md:text-8xl font-[1000] text-red uppercase tracking-tighter leading-[0.85] italic">
              BÜYÜK <br /> SEZON <span className="text-red-600">İNDİRİMİ</span>
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
              <p className="text-zinc-400 max-w-[380px] font-bold uppercase text-xs tracking-widest leading-relaxed italic">
                Sınırlı süreliğine seçili koleksiyonlarda<br></br>
                <span className="text-red underline underline-offset-4 decoration-red-600">
                  %50'ye varan
                </span>
                indirimleri keşfet
              </p>
              <div className="flex items-center gap-3 text-red-500 font-black text-[10px] tracking-widest uppercase bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <FiClock className="animate-spin-slow" /> STOKLARLA SINIRLI
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-20 bottom-0 opacity-[0.03] select-none pointer-events-none">
            <span className="text-[300px] font-[1000] italic leading-none text-white uppercase tracking-tighter">
              SALE
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mb-12 border-b-[6px] border-black pb-8">
          <h2 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-none">
            İNDİRİMLİ <span className="text-zinc-300">ÜRÜNLER</span>
          </h2>
          <span className="text-[11px] font-black uppercase text-red-600 tracking-[0.2em] italic bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
            {discountProducts.length} TASARIM LİSTELENDİ
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          {discountProducts.map((product) => {
            const originalPrice = product.oldValue ?? 0;
            const currentPrice = product.value;
            const isFav = isInWishlist(product.id);

            const discountPercentage =
              originalPrice > 0
                ? Math.round(
                    ((originalPrice - currentPrice) / originalPrice) * 100,
                  )
                : 0;

            return (
              <div
                key={product.id}
                className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-6 right-6 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 group/heart"
                >
                  {isFav ? (
                    <RiHeartFill
                      size={20}
                      className="text-red-500 animate-in zoom-in"
                    />
                  ) : (
                    <RiHeartLine
                      size={20}
                      className="text-black/40 group-hover/heart:text-black transition-colors"
                    />
                  )}
                </button>

                <Link
                  to={`/product/${product.id}`}
                  className="flex flex-col gap-5"
                >
                  <div className="relative aspect-[3/4] bg-brand-neutral rounded-[40px] overflow-hidden border border-zinc-100 shadow-sm transition-transform duration-700 group-hover:shadow-2xl">
                    <img
                      src={product.image || undefined}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />

                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <div className="bg-red-600 text-red text-[11px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-2xl transform -rotate-2">
                        -{discountPercentage}%
                      </div>
                      <div className="bg-black/80 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.2em] shadow-lg flex items-center gap-1">
                        <FiTrendingDown className="text-red-500" /> EN DÜŞÜK
                        FİYAT
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 px-2">
                    <h3 className="text-sm md:text-base font-[1000] uppercase tracking-tighter truncate italic group-hover:text-red-600 transition-colors duration-300">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-[1000] text-black italic tracking-tighter">
                        ${product.value}
                      </span>
                      <span className="text-sm font-black text-zinc-300 line-through decoration-red-600/30 italic">
                        ${product.oldValue}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 border-t border-zinc-50 pt-3">
                      <div className="flex items-center text-yellow-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(product.rating)
                                ? "opacity-100"
                                : "opacity-20"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                        {product.rating}/5.0
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Discount;
