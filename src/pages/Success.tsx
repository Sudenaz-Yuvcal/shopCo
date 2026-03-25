import { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
    window.scrollTo(0, 0);
  }, [clearCart]);

  const orderId = useMemo(
    () => `SHOPCO-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 font-satoshi">
      <Helmet>
        <title>Sipariş Onaylandı | SHOP.CO</title>
      </Helmet>

      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-black rounded-[30px] flex items-center justify-center shadow-2xl">
            <FiCheckCircle className="text-white text-4xl" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-[1000] uppercase tracking-tighter italic text-black leading-none">
            SİPARİŞİN <span className="text-zinc-400">ALINDI!</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase italic tracking-widest">
            HAZIRLIKLARA BAŞLADIK.
          </p>
        </div>

        <div className="bg-zinc-50 p-8 rounded-[40px] border border-zinc-100 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] italic">
              TAKİP NUMARASI
            </p>
            <span className="text-2xl font-[1000] text-black uppercase tracking-tight italic">
              {orderId}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              onClick={() => navigate("/shop")}
              className="w-full !rounded-2xl !py-5 !text-[10px] tracking-[0.3em] font-black italic shadow-xl"
            >
              KEŞFETMEYE DEVAM ET
            </Button>

            <Button
              variant="white"
              onClick={() => navigate("/account")}
              className="w-full !bg-white !border-2 !border-zinc-100 !rounded-2xl !py-5 !text-[10px] tracking-[0.3em] font-black italic"
            >
              SİPARİŞİ TAKİP ET
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
