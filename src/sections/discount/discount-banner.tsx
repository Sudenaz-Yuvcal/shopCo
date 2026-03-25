import { FiPercent, FiClock } from "react-icons/fi";

const DiscountBanner = () => (
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
          Sınırlı süreliğine seçili koleksiyonlarda
          <br />
          <span className="text-red underline underline-offset-4 decoration-red-600">
            %50'ye varan
          </span>{" "}
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
);

export default DiscountBanner;
