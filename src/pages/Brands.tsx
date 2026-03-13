import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const BRANDS_DATA = [
  {
    id: 1,
    name: "VERSACE",
    desc: "Barok İhtişamı & Modern Lüks",
    color: "from-yellow-600/20",
  },
  {
    id: 2,
    name: "GUCCI",
    desc: "İtalyan Zanaatkarlığı & Eklektik Stil",
    color: "from-green-600/20",
  },
  {
    id: 3,
    name: "PRADA",
    desc: "Minimalist Sofistike & Entelektüel Moda",
    color: "from-zinc-600/20",
  },
  {
    id: 4,
    name: "CALVIN KLEIN",
    desc: "İkonik Minimalizm & Saf Estetik",
    color: "from-blue-600/20",
  },
  {
    id: 5,
    name: "ZARA",
    desc: "Hızlı Moda & Küresel Trendler",
    color: "from-zinc-400/20",
  },
];

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
            <div
              key={brand.id}
              onClick={() => navigate(`/shop?brand=${brand.name}`)}
              className="group relative h-64 bg-brand-offwhite border border-zinc-100 rounded-[40px] cursor-pointer overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${brand.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />

              <div className="relative h-full z-10 p-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-black text-3xl md:text-4xl font-[1000] tracking-tighter italic leading-none transition-transform duration-500 group-hover:-translate-y-1">
                      {brand.name}
                    </h2>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] italic group-hover:text-black transition-colors">
                      {brand.desc}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-zinc-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500 transform group-hover:rotate-45 shadow-sm">
                    <FiArrowUpRight size={20} />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-zinc-300 group-hover:text-black transition-colors">
                    KOLEKSİYONU GÖR
                  </span>
                  <div className="h-1 w-0 bg-black transition-all duration-700 group-hover:w-full absolute bottom-0 left-0" />
                </div>
              </div>

              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none" />
            </div>
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
