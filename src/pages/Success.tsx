import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiShoppingBag } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const orderId = useMemo(
    () => `SHOPCO-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      <Helmet>
        <title>Sipariş Onaylandı | SHOP.CO</title>
      </Helmet>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-100 rounded-full blur-[100px] -ml-20 -mb-20 opacity-40" />

      <div className="max-w-xl w-full text-center space-y-10 md:space-y-12 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative flex justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-950 rounded-[40px] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-bounce duration-[2000ms]">
            <FiCheckCircle className="text-white text-5xl md:text-6xl" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
            <FiPackage className="text-zinc-300" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-zinc-100 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
            ÖDEME ONAYLANDI
          </div>
          <h1 className="text-4xl md:text-6xl font-[1000] uppercase tracking-tighter italic text-black leading-none">
            SİPARİŞİN <br />{" "}
            <span className="text-zinc-300 underline decoration-black decoration-8 underline-offset-[10px]">
              ALINDI!
            </span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-bold uppercase italic tracking-wide max-w-sm mx-auto pt-4">
            Harika bir seçim yaptın. Tarzını güncelleyecek parçalar için
            hazırlıklara hemen başlıyoruz.
          </p>
        </div>

        <div className="bg-brand-offwhite p-8 rounded-[48px] border border-zinc-100 space-y-6 shadow-sm group hover:border-black transition-all duration-500">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] italic">
              Takip Numarası
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-[1000] text-black uppercase tracking-tighter italic">
                {orderId}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200/50 flex flex-col md:flex-row gap-4">
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate("/shop")}
              className="flex-1 !rounded-full !py-6 !text-[11px] tracking-[0.3em] italic shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              KEŞFETMEYE DEVAM ET
            </Button>
            <Button
              variant="white"
              size="xl"
              onClick={() => navigate("/account")}
              className="flex-1 !bg-white !border-2 !border-zinc-100 !rounded-full !py-6 !text-[11px] tracking-[0.3em] italic hover:border-black transition-all"
            >
              SİPARİŞİ TAKİP ET
            </Button>
          </div>
        </div>

        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] flex items-center justify-center gap-2 italic">
          <FiShoppingBag /> GÜVENLİ ALIŞVERİŞ İÇİN SHOP.CO'YU SEÇTİĞİNİZ İÇİN
          TEŞEKKÜRLER.
        </p>
      </div>
    </div>
  );
};

export default Success;
