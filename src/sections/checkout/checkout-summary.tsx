import { FiLock } from "react-icons/fi";
import Button from "../../components/ui/Button";
import type { CartItem } from "../../types/cart";

interface CheckoutSummaryProps {
  cart: CartItem[];
  totals: {
    final: number;
    subtotal: number;
    delivery: number;
  };
}

const CheckoutSummary = ({ cart, totals }: CheckoutSummaryProps) => {
  const {
    final: finalPrice,
    subtotal: totalPrice,
    delivery: deliveryFee,
  } = totals;

  return (
    <div className="border-2 border-black rounded-[50px] p-10 bg-white sticky top-32 space-y-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-500">
      <h2 className="text-3xl font-[1000] uppercase tracking-tighter italic border-b-4 border-black pb-6">
        ÖZET
      </h2>
      <div className="max-h-[300px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="flex justify-between items-center group"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                <img
                  src={item.image}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-black text-xs uppercase italic leading-none mb-1">
                  {item.name}
                </p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">
                  {item.size} | {item.quantity} ADET
                </p>
              </div>
            </div>
            <span className="font-black italic text-sm">
              ${item.value * item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6 border-t-2 border-zinc-100 text-[11px] font-black uppercase tracking-widest text-zinc-400 italic">
        <div className="flex justify-between">
          <span>ARA TOPLAM</span>
          <span className="text-black text-sm">${totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>KARGO</span>
          <span className="text-black text-sm">
            {deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}
          </span>
        </div>
        <div className="pt-6 flex justify-between items-end border-t-2 border-black">
          <span className="text-black text-sm">TOPLAM</span>
          <span className="text-black text-5xl font-[1000] tracking-tighter italic leading-none">
            ${finalPrice}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="xl"
        className="w-full !py-8 !rounded-full italic tracking-[0.3em] shadow-2xl hover:bg-zinc-900 transition-all"
      >
        ÖDEMEYİ TAMAMLA <FiLock className="ml-2 inline" />
      </Button>
    </div>
  );
};

export default CheckoutSummary;
