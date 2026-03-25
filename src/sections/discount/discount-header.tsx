interface DiscountHeaderProps {
  count: number;
}

const DiscountHeader = ({ count }: DiscountHeaderProps) => (
  <div className="flex items-end justify-between mb-12 border-b-[6px] border-black pb-8">
    <h2 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-none">
      İNDİRİMLİ <span className="text-zinc-300">ÜRÜNLER</span>
    </h2>
    <span className="text-[11px] font-black uppercase text-red-600 tracking-[0.2em] italic bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
      {count} TASARIM LİSTELENDİ
    </span>
  </div>
);

export default DiscountHeader;
