import { RiCoupon2Line } from "react-icons/ri";

interface GiftCouponProps {
  code: string;
  limitText: string;
}

export const GiftCoupon = ({ code, limitText }: GiftCouponProps) => {
  return (
    <div className="bg-zinc-50 border-2 border-dashed border-black/10 p-6 rounded-[25px] group hover:border-black transition-all cursor-pointer active:scale-95">
      <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 group-hover:text-black transition-colors">
        <RiCoupon2Line />
        <p className="text-[10px] font-black uppercase tracking-widest text-black">
          İNDİRİM KODUN
        </p>
      </div>
      <h4 className="text-4xl font-[1000] tracking-[0.2em] text-black">
        {code}
      </h4>
      <span className="text-[10px] font-black bg-black text-white px-3 py-1.5 rounded-full uppercase mt-4 inline-block italic tracking-widest">
        {limitText}
      </span>
    </div>
  );
};