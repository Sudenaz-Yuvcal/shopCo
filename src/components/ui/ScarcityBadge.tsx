import { useState, useEffect } from "react";
import { RiFireLine, RiFlashlightLine } from "react-icons/ri";

const ScarcityBadge = () => {
  const [viewers, setViewers] = useState(
    Math.floor(Math.random() * (22 - 8 + 1)) + 8,
  );
  const [stock] = useState(Math.floor(Math.random() * (5 - 2 + 1)) + 2);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      setViewers((prev) => Math.max(5, prev + change));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 my-8 border-y border-zinc-100 py-6 transition-all duration-500">
      <div className="flex items-center gap-3 group">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] italic text-zinc-500">
          ŞU AN <span className="text-black tabular-nums">{viewers}</span>{" "}
          KULLANICI BU ÜRÜNÜ İNCELİYOR
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-5 h-5 bg-red-50/50 rounded-full">
          <RiFireLine className="text-red-600 text-sm animate-pulse" />
        </div>
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] italic text-red-600">
          ACELE ET! SON{" "}
          <span className="underline decoration-1 underline-offset-[6px] text-red-700">
            {stock} ADET
          </span>{" "}
          KALDI
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-5 h-5 bg-zinc-50 rounded-full">
          <RiFlashlightLine className="text-zinc-400 text-sm" />
        </div>
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 leading-none">
          BUGÜN SİPARİŞ VERİLDİĞİNDE:{" "}
          <span className="text-zinc-900 italic">YARIN KARGODA</span>
        </p>
      </div>
    </div>
  );
};

export default ScarcityBadge;
