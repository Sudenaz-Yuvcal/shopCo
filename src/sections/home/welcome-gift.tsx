import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import Button from "../../components/ui/Button";
import { WELCOME_GIFT_DATA } from "../../constants/Gifts";
import { GiftCoupon } from "../../components/home/GiftCoupon";

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
        `}
      </style>

      <div className="absolute inset-0" onClick={() => setShowGift(false)} />

      <div className="bg-white rounded-[40px] w-full max-w-[420px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-10 animate-[giftFrisbee_0.8s_ease-out_forwards] font-satoshi">
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

          <GiftCoupon
            code={WELCOME_GIFT_DATA.CODE}
            limitText={WELCOME_GIFT_DATA.LIMIT_TEXT}
          />

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
