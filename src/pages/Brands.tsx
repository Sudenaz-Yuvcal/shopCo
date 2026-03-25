import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { BRANDS_DATA } from "../constants/Brand";
import BrandCard from "../sections/brands/brand-card";

const Brands = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Markalar | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-20 font-satoshi text-left">
        <div className="mb-20 border-b-4 border-black pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter italic leading-[0.8] text-black">
              MARKA <br /> <span className="text-zinc-200">DİZİNİ</span>
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <span className="w-12 h-[2px] bg-black"></span>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">
                KÜRESEL MODA İKONLARI SEÇKİSİ
              </p>
            </div>
          </div>
          <div className="max-w-xs">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed italic">
              Dünyanın en prestijli moda evlerini tek bir çatı altında, Shop.co
              kürasyonuyla keşfedin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANDS_DATA.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onClick={() => navigate(`/shop?brand=${brand.name}`)}
            />
          ))}

          <div className="h-64 border-2 border-dashed border-zinc-100 rounded-[40px] flex flex-col items-center justify-center p-10 text-center opacity-40 hover:opacity-100 transition-opacity cursor-default group">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] italic text-zinc-400 group-hover:text-black transition-colors">
              YENİ MARKALAR
            </p>
            <p className="text-[9px] font-bold text-zinc-300 mt-2 uppercase tracking-widest">
              ÇOK YAKINDA SİZİNLE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
