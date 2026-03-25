import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiStar, FiArrowUpRight } from "react-icons/fi";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { ALL_PRODUCTS } from "../constants/Product";
import type { Product } from "../types/product";
import { useMemo } from "react";
import { useWishlist } from "../context/WishlistContext";
import NewProductBanner from "../sections/new-product/new-product-banner";

const NewProduct = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const newArrivals = useMemo(() => {
    return [...ALL_PRODUCTS].sort((a, b) => {
      const idA = Number(a.id);
      const idB = Number(b.id);
      return idB - idA;
    });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Yeni Gelenler | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <NewProductBanner />

        <div className="flex items-end justify-between mb-16 border-b-[6px] border-black pb-8">
          <h2 className="text-4xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-none text-black">
            KEŞFET <span className="text-zinc-200">({newArrivals.length})</span>
          </h2>
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.4em]">
              ELITE CURATION SERIES
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
          {newArrivals.map((product: Product) => {
            const isFav = isInWishlist(Number(product.id));

            return (
              <div
                key={product.id}
                className="relative group animate-in fade-in slide-in-from-bottom-10 duration-1000"
              >
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-6 right-6 z-20 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 group/heart"
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
                  className="flex flex-col gap-6"
                >
                  <div className="relative aspect-[3/4] bg-brand-neutral rounded-[40px] overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-zinc-100/50">
                    <img
                      src={product.image || undefined}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    />

                    <div className="absolute top-6 left-6 bg-zinc-200/90 backdrop-blur-md text-zinc-900 text-[10px] font-[1000] px-5 py-2 rounded-2xl uppercase tracking-[0.2em] shadow-lg border border-black/5 transition-all duration-500 group-hover:bg-black group-hover:text-white group-hover:scale-110">
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
                        {[...Array(5)].map((_, i: number) => (
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
