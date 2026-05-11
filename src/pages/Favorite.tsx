import { useFavorite } from "../context/FavoriteContext";
import { RiHeartFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/Product/ProductCard";

const Favorite = () => {
  const { favorites } = useFavorite();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-satoshi">
        <div className="relative mb-8">
          <RiHeartFill size={100} className="text-zinc-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-1 bg-zinc-200 rotate-45 absolute" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-[1000] italic uppercase tracking-tighter mb-4 text-center">
          Favori Listen Boş
        </h2>
        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-10 text-center max-w-xs leading-loose">
          Henüz hiçbir ürünü kalbine eklemedin. Tarzına uygun parçaları
          keşfetmeye ne dersin?
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-black text-white px-12 py-5 rounded-full font-black italic uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          Keşfetmeye Başla
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-satoshi">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b-[6px] border-black pb-10">
        <div>
          <h1 className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter italic leading-[0.8]">
            Favoriler
          </h1>
          <p className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.3em] mt-4 ml-1">
            Seçtiğin En İyi Parçalar ({favorites.length} ÜRÜN)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {favorites.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            slug={product.slug || ""}
            created_at={product.created_at || new Date().toISOString()}
            title={product.name || product.title || "İsimsiz Ürün"}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorite;
