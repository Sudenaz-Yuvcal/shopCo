import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import type { Product } from "../types/product";
import { useFavorite } from "../context/FavoriteContext";
import NewProductBanner from "../sections/new-product/new-product-banner";
import type { APIProduct } from "../types/api";

const NewProduct = () => {
  const { toggleFavorite, isInFavorites } = useFavorite();

  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=20")
      .then((res) => res.json())
      .then((data: APIProduct[]) => {
        const adaptedData: Product[] = data.map((product: APIProduct) => {
          const rawImages = Array.isArray(product.images) ? product.images : [];

          return {
            id: product.id,
            name: product.title,
            image: rawImages[0]
              ? rawImages[0].replace(/[\[\]"]/g, "").replace(/\\/g, "")
              : "",
            images: rawImages.map((img: string) =>
              img.replace(/[\[\]"]/g, "").replace(/\\/g, ""),
            ),

            price: product.price,
            value: product.price,
            oldValue: Math.round(
              product.price * (1 + (Math.random() * 0.3 + 0.1)),
            ),
            category: product.category?.name?.includes("Updated Category")
              ? "New Arrival"
              : product.category?.name || "New Arrival",
            rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
            color: "black",
            brand: "SHOP.CO",
          };
        });

        const sorted = adaptedData.sort(
          (a: Product, b: Product) => b.id - a.id,
        );

        setNewArrivals(sorted);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Veri çekme hatası:", err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Yeni Gelenler | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <NewProductBanner />

        <div className="mt-32 w-full text-xs">
          <div className="flex items-end justify-between mb-16 border-b-[6px] border-black pb-8">
            <h2 className="text-4xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-none text-black">
              KEŞFET{" "}
              <span className="text-zinc-200">
                ({loading ? "..." : newArrivals.length})
              </span>
            </h2>
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.4em]">
                ELITE CURATION SERIES
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-[40px]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
              {newArrivals &&
                newArrivals?.map((product: Product) => {
                  const isFav = isInFavorites(Number(product.id));
                  console.log(product);

                  return (
                    <div
                      key={product.id}
                      className="relative group animate-in fade-in slide-in-from-bottom-10 duration-1000"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(product);
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
                        to={`/product/${product?.id}`}
                        className="flex flex-col gap-6"
                      >
                        <div className="relative aspect-[3/4] bg-[#F0F0F0] rounded-[40px] overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-zinc-100/50">
                          <img
                            src={
                              product?.image ||
                              "https://placehold.co/400x600/F0F0F0/000000?text=SHOP.CO"
                            }
                            alt={product?.name || "product image"}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                          />
                          <div className="absolute top-6 left-6 bg-zinc-200/90 backdrop-blur-md text-zinc-900 text-[10px] font-[1000] px-5 py-2 rounded-2xl uppercase tracking-[0.2em] shadow-lg transition-all duration-500 group-hover:bg-black group-hover:text-white">
                            NEW
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
                              <span className="text-sm font-black text-zinc-300 line-through italic">
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
                              {Number(product.rating).toFixed(1)} / 5.0
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
