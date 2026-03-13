import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiCloseLine, RiCoupon2Line } from "react-icons/ri";
import Button from "../ui/Button";
import { WELCOME_GIFT_DATA } from "../../constants/Gifts";

const WelcomeGift: React.FC = () => {
  const location = useLocation();
  const [showGift, setShowGift] = useState(false);

  useEffect(() => {
    if (location.state?.isNewUser) {
      setShowGift(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (!showGift) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-500">
      <style>
        {`
          @keyframes giftFrisbee {
            0% { opacity: 0; transform: scale(0.1) rotate(-720deg); }
            70% { opacity: 1; transform: scale(1.05) rotate(15deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          .gift-frisbee-active {
            animation: giftFrisbee 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}
      </style>

      <div className="absolute inset-0" onClick={() => setShowGift(false)} />

      <div className="bg-white rounded-[40px] w-full max-w-[420px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-10 gift-frisbee-active font-satoshi">
        <div className="bg-black p-10 text-center relative">
          <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-5 rotate-12 transition-transform hover:rotate-0 duration-500">
            <span className="text-3xl">🎁</span>
          </div>
          <h3 className="text-white font-[1000] uppercase italic tracking-tighter text-3xl leading-none">
            {WELCOME_GIFT_DATA.TITLE}
          </h3>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            {WELCOME_GIFT_DATA.SUBTITLE}
          </p>
          <Button
            onClick={() => setShowGift(false)}
            className="absolute top-6 right-6 !w-10 !h-10 !p-0 bg-transparent text-zinc-500 hover:text-white border-none shadow-none"
          >
            <RiCloseLine size={28} />
          </Button>
        </div>
        <div className="p-10 text-center space-y-8">
          <p className="text-gray-500 text-sm font-medium italic leading-relaxed">
            {WELCOME_GIFT_DATA.DESCRIPTION}
          </p>
          <div className="bg-zinc-50 border-2 border-dashed border-black/10 p-6 rounded-[25px] group hover:border-black transition-all cursor-pointer active:scale-95">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 group-hover:text-black transition-colors">
              <RiCoupon2Line />
              <p className="text-[10px] font-black uppercase tracking-widest text-black">
                İNDİRİM KODUN
              </p>
            </div>
            <h4 className="text-4xl font-[1000] tracking-[0.2em] text-black">
              {WELCOME_GIFT_DATA.CODE}
            </h4>
            <span className="text-[10px] font-black bg-black text-white px-3 py-1.5 rounded-full uppercase mt-4 inline-block italic tracking-widest">
              {WELCOME_GIFT_DATA.LIMIT_TEXT}
            </span>
          </div>

          <Button
            variant="primary"
            size="xl"
            onClick={() => setShowGift(false)}
            className="w-full shadow-2xl hover:scale-[1.02] italic"
          >
            {WELCOME_GIFT_DATA.BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGift;
