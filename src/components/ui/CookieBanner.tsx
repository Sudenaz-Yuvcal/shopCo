import React, { useState, useEffect } from "react";
import Button from "./Button";
import {
  RiCloseLine,
  RiSettings3Line,
  RiShieldCheckLine,
} from "react-icons/ri";

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("CookieConsent");

    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (type: "all" | "reject" | "settings") => {
    if (type === "settings") {
      console.log("Ayarlar açılıyor...");
    } else {
      localStorage.setItem("CookieConsent", type);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[10000] animate-in slide-in-from-bottom-full duration-700">
      <div className="bg-black text-white border-t border-white/10 px-6 py-8 md:py-5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 flex-1">
            <div className="hidden lg:flex w-12 h-12 bg-white/5 border border-white/10 items-center justify-center shrink-0 rotate-3 hover:rotate-0 transition-transform">
              <RiShieldCheckLine className="text-white text-2xl" />
            </div>
            <p className="text-[10px] md:text-[11px] font-medium leading-relaxed tracking-[0.05em] uppercase italic text-zinc-400 text-center md:text-left">
              Online mağazamızın kullanımını iyileştirmek için birinci ve üçüncü
              taraf çerezlerini kullanıyoruz. Reddetmenizin alışveriş
              deneyiminizi etkileyebileceğini unutmayın.
              <a
                href="/cookie-policy"
                className="text-white underline ml-2 font-black hover:text-zinc-300 transition-colors"
              >
                Çerez Politikası
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 shrink-0 w-full md:w-auto">
            <Button
              variant="white"
              onClick={() => handleAction("settings")}
              className="!bg-transparent !border-none !shadow-none !px-0 !py-2 !text-zinc-500 hover:!text-white !w-auto gap-2 !text-[9px]"
            >
              <RiSettings3Line size={16} className="animate-spin" />
              <span className="tracking-[0.2em]">AYARLAR</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleAction("reject")}
              className="!bg-transparent !border-white/20 !text-white hover:!bg-white hover:!text-black !rounded-none !px-6 !py-3 !text-[10px] tracking-widest"
            >
              REDDET
            </Button>

            <Button
              variant="white"
              onClick={() => handleAction("all")}
              className="!px-10 !py-3 !rounded-none shadow-2xl hover:!bg-zinc-200 !text-[10px] tracking-widest"
            >
              KABUL ET
            </Button>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
