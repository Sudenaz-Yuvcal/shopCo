import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  RiHeartFill,
  RiShoppingBagLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <RiHeartFill size={80} className="text-zinc-100 mb-6" />
        <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-4">
          Favori Listen Boş
        </h2>
        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-8">
          Henüz hiçbir ürünü favorilerine eklemedin.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-black text-white px-10 py-4 rounded-full font-black italic uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all"
        >
          Keşfetmeye Başla
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl md:text-7xl font-[1000] mb-12 uppercase tracking-tighter italic border-b-[6px] border-black pb-8 inline-block leading-none">
        Favoriler
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group relative bg-zinc-50 rounded-[40px] overflow-hidden border border-zinc-100 hover:shadow-xl transition-all duration-500"
          >
            <div
              className="aspect-square overflow-hidden cursor-pointer bg-white"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image || undefined}
                alt={product.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
              />
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-[1000] text-2xl uppercase tracking-tighter italic leading-none mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                    {product.category}
                  </p>
                </div>
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    toast.info("Ürün listeden kaldırıldı.");
                  }}
                  className="text-red hover:scale-125 transition-transform"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-8">
                <span className="font-[1000] text-3xl tracking-tighter italic">
                  ${product.value}
                </span>
                <button
                  onClick={() => {
                    addToCart(
                      product,
                      1,
                      product.size?.[0] || "M",
                      product.color || "Black",
                    );
                    toast.success("Ürün sepete eklendi!");
                  }}
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black italic text-[10px] tracking-widest hover:bg-zinc-800 transition-all"
                >
                  <RiShoppingBagLine /> SEPETE EKLE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
