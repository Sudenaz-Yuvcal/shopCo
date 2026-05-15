import { FiTag, FiRotateCcw } from "react-icons/fi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import { supabase } from "../../lib/supabase";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

interface CartTotals {
  raw: number;
  subtotal: number;
  itemDiscount: number;
  promoDiscount: number;
  delivery: number;
  final: number;
}

interface OrderSummaryProps {
  totals: CartTotals;
  promoInput: string;
  setPromoInput: (val: string) => void;
  handleApplyPromo: (code?: string) => void;
  isPromoApplied: boolean;
  appliedPromoCode: string;
  showCheckout: boolean;
  setShowCheckout: (val: boolean) => void;
}

const OrderSummary = ({
  totals,
  promoInput,
  setPromoInput,
  handleApplyPromo,
  isPromoApplied,
  appliedPromoCode,
  showCheckout,
  setShowCheckout,
}: OrderSummaryProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && isPromoApplied) {
      handleApplyPromo("");
      setPromoInput("");
    }
  }, [user, isPromoApplied, handleApplyPromo, setPromoInput]);
  const onApplyClick = async () => {
    if (isPromoApplied) {
      handleApplyPromo("");
      setPromoInput("");
      return;
    }

    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    try {
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .single();

      if (error || !coupon) {
        toast.error("GEÇERSİZ KUPON KODU!", { theme: "dark" });
        return;
      }

      if (code === "HOSGELDIN50" && !user) {
        toast.warn("BU KUPON İÇİN GİRİŞ YAPMALISINIZ!", { theme: "dark" });
        return;
      }

      const minLimit = coupon.min_order_amount || coupon.min_amount || 0;

      if (totals.subtotal < minLimit) {
        toast.error(`BU KUPON İÇİN EN AZ $${minLimit} SEPET TUTARI GEREKLİ!`, {
          theme: "dark",
        });
        return;
      }

      const now = new Date();
      if (now > new Date(coupon.expiry_date)) {
        toast.error("BU KUPONUN SÜRESİ DOLMUŞ!", { theme: "dark" });
        return;
      }

      handleApplyPromo(code);
    } catch (err) {
      console.error("Promo Error:", err);
      toast.error("BİR HATA OLUŞTU!", { theme: "dark" });
    }
  };
  const handleProceedToCheckout = () => {
    if (!user) {
      toast.warn("SİPARİŞ İÇİN GİRİŞ YAPMALISINIZ!", { theme: "dark" });
      navigate("/login");
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="bg-zinc-50 rounded-[50px] p-10 space-y-10 border border-zinc-100 shadow-sm">
      <h2 className="text-3xl font-[1000] italic tracking-tighter uppercase">
        SİPARİŞ ÖZETİ
      </h2>

      <div className="space-y-6 text-[11px] font-black tracking-[0.2em] uppercase italic text-zinc-400">
        <div className="flex justify-between">
          <span>ARA TOPLAM</span>
          <span className="text-black text-lg font-black italic tracking-tighter">
            ${totals.raw}
          </span>
        </div>

        {totals.raw > totals.subtotal && (
          <div className="flex justify-between text-zinc-400">
            <span>ÜRÜN İNDİRİMİ</span>
            <span className="text-lg text-red-500 font-black">
              -${Math.round(totals.itemDiscount)}
            </span>
          </div>
        )}

        {isPromoApplied && (
          <div className="flex justify-between text-red-500 animate-pulse">
            <span>{appliedPromoCode} KODU</span>
            <span className="text-lg font-black">
              -${Math.round(totals.promoDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span>KARGO</span>
          <span
            className={`text-lg font-black ${totals.delivery === 0 ? "text-green-500" : "text-black"}`}
          >
            {totals.delivery === 0 ? "FREE" : `$${totals.delivery}`}
          </span>
        </div>

        <div className="pt-6 border-t-2 border-zinc-200 flex justify-between items-end">
          <span className="text-black text-sm">NET TOPLAM</span>
          <span className="text-black text-5xl font-black tracking-tighter italic leading-none">
            ${Math.round(totals.final)}
          </span>
        </div>
      </div>

      {!showCheckout ? (
        <div className="space-y-6 pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative group">
              <FiTag className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
              <Input
                placeholder="KUPON KODU"
                value={promoInput}
                disabled={isPromoApplied}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPromoInput(e.target.value.toUpperCase())
                }
                className={`!pl-14 !rounded-full !py-5 !bg-white !border-zinc-100 font-black italic text-xs uppercase ${isPromoApplied ? "opacity-50" : ""}`}
              />
            </div>
            <Button
              onClick={onApplyClick}
              variant={isPromoApplied ? "danger" : "primary"}
              className="!rounded-full !px-10 italic"
            >
              {isPromoApplied ? (
                <FiRotateCcw className="animate-spin-slow" />
              ) : (
                "UYGULA"
              )}
            </Button>
          </div>
          <Button
            variant="primary"
            size="xl"
            onClick={handleProceedToCheckout}
            className="w-full !py-6 !rounded-full italic tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-transform uppercase font-black"
          >
            ÖDEMEYE GEÇ →
          </Button>
        </div>
      ) : (
        <Button
          form="checkout-form"
          type="submit"
          variant="primary"
          size="xl"
          className="w-full !py-8 !rounded-full italic tracking-[0.3em] shadow-2xl bg-black hover:bg-zinc-800 transition-all uppercase font-black"
        >
          SİPARİŞİ TAMAMLA
        </Button>
      )}
    </div>
  );
};

export default OrderSummary;
