import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiStar, FiZap, FiArrowUpRight } from "react-icons/fi";
import { ALL_PRODUCTS } from "../constants/Product";
import type { Product } from "../types/product";
import { useMemo } from "react";
const NewProduct = () => {
  const newArrivals = useMemo(
    () => [...ALL_PRODUCTS].sort((a, b) => b.id - a.id),
    [],
  );

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Yeni Gelenler | SHOP.CO</title>
        <meta
          name="description"
          content="Sezonun en taze tasarımları ve hit parçaları Shop.co'da. Yeni gelenler koleksiyonuyla tarzını şimdi güncelle."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <div className="w-full bg-brand-offwhite rounded-[48px] p-10 md:p-20 mb-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border-2 border-zinc-50 shadow-sm">
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
            <h2 className="text-[250px] lg:text-[450px] font-[1000] italic uppercase leading-none text-black">
              NEW
            </h2>
          </div>

          <div className="relative z-10 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-left duration-700">
              <FiZap className="text-yellow-400" /> SEZON '26 LANSMANI
            </div>

            <h1 className="text-6xl md:text-9xl font-[1000] text-black uppercase tracking-tighter leading-[0.8] italic">
              YENİ <br />{" "}
              <span className="text-zinc-300 underline decoration-black decoration-8 underline-offset-[12px]">
                NESİL
              </span>{" "}
              <br /> STİL
            </h1>

            <p className="text-zinc-400 max-w-[450px] font-bold uppercase text-xs leading-relaxed tracking-widest italic">
              Tasarım dilimizi en baştan kurguladık. En yeni kesimler ve rafine
              detaylar{" "}
              <span className="text-black underline underline-offset-4 decoration-zinc-200">
                Shop.co Elite
              </span>{" "}
              seçkisiyle yayında.
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between mb-16 border-b-[6px] border-black pb-8">
          <h2 className="text-4xl md:text-6xl font-[1000] uppercase tracking-tighter italic leading-none text-black">
            KEŞFET <span className="text-zinc-200">({newArrivals.length})</span>
          </h2>
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.4em]">
              ELITE CURATION SERIES
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
          {newArrivals.map((product: Product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000"
            >
              <div className="relative aspect-[3/4] bg-brand-neutral rounded-[40px] overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />

                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-black text-[10px] font-[1000] px-5 py-2 rounded-2xl uppercase tracking-widest shadow-xl border border-white/20 transition-all group-hover:bg-black group-hover:text-white">
                  NEW
                </div>

                <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                    <FiArrowUpRight size={24} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm md:text-base font-[1000] uppercase tracking-tighter italic leading-none group-hover:text-zinc-500 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-[1000] text-black italic tracking-tighter">
                    ${product.value}
                  </span>
                  {product.oldValue && (
                    <span className="text-sm font-black text-zinc-300 line-through decoration-black/10 italic">
                      ${product.oldValue}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-50 flex items-center gap-2">
                  <div className="flex items-center text-black gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={12}
                        fill={
                          i < Math.floor(product.rating ?? 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic ml-2">
                    {product.rating ?? "0.0"} / 5.0
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
