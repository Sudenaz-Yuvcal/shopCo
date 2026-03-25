import { FiZap } from "react-icons/fi";

const NewProductBanner = () => (
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

      <h1 className="text-6xl md:text-8xl font-[1000] text-black uppercase tracking-tighter leading-[0.8] italic">
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
);

export default NewProductBanner;
