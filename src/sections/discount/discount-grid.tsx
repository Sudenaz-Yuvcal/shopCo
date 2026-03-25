import { Link } from "react-router-dom";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import type { Product } from "../../types/product";

interface DiscountGridProps {
  products: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
}

const DiscountGrid = ({
  products,
  toggleWishlist,
  isInWishlist,
}: DiscountGridProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
    {products.map((product) => {
      const originalPrice = product.oldValue ?? 0;
      const currentPrice = product.value;
      const isFav = isInWishlist(product.id);
      const discountPercentage =
        originalPrice > 0
          ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
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
            className="absolute top-6 right-6 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg active:scale-90"
          >
            {isFav ? (
              <RiHeartFill size={20} className="text-red-500" />
            ) : (
              <RiHeartLine size={20} className="text-black/40" />
            )}
          </button>

          <Link to={`/product/${product.id}`} className="flex flex-col gap-5">
            <div className="relative aspect-[3/4] bg-brand-neutral rounded-[40px] overflow-hidden border border-zinc-100 shadow-sm transition-transform duration-700 group-hover:shadow-2xl">
              <img
                src={product.image || undefined}
                alt={product.name}
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="bg-red-600 text-red text-[11px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest transform -rotate-2">
                  -{discountPercentage}%
                </div>
              </div>
            </div>

            <div className="space-y-2 px-2">
              <h3 className="text-sm md:text-base font-[1000] uppercase tracking-tighter truncate italic group-hover:text-red-600">
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
            </div>
          </Link>
        </div>
      );
    })}
  </div>
);

export default DiscountGrid;
