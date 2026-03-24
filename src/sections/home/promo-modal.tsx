import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine, RiThunderstormsFill } from "react-icons/ri";
import Button from "../../components/ui/Button";
import { PROMO_CAMPAIGN } from "../../constants/Promo";
import { CountdownUnit } from "../../components/home/CountdownUnit";

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(PROMO_CAMPAIGN.CLOSE_DELAY);
  const [countdown, setCountdown] = useState<CountdownTime>(
    PROMO_CAMPAIGN.INITIAL_SECONDS as CountdownTime,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const mainTimer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });

      setCountdown((prev: CountdownTime): CountdownTime => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(mainTimer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-10 font-satoshi">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-1000"
        onClick={() => canClose && setIsOpen(false)}
      />

      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-[40px] overflow-hidden shadow-[0_0_120px_rgba(255,0,0,0.2)] flex flex-col items-center justify-center text-center p-8 border border-white/10 animate-in zoom-in duration-500">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <Button
          onClick={() => canClose && setIsOpen(false)}
          disabled={!canClose}
          className={`absolute top-6 right-6 md:top-10 md:right-10 !w-12 !h-12 !p-0 z-20 shadow-2xl transition-all duration-500 ${
            canClose
              ? "!bg-white !text-black hover:rotate-90 scale-100"
              : "!bg-white/5 !text-white/20 scale-90 cursor-not-allowed"
          }`}
        >
          {canClose ? (
            <RiCloseLine size={28} />
          ) : (
            <span className="font-black text-sm tabular-nums">{timeLeft}</span>
          )}
        </Button>

        <div className="relative z-10 space-y-8 max-w-3xl w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-red-500 animate-bounce">
              <RiThunderstormsFill size={24} />
              <span className="font-black uppercase tracking-[0.5em] text-[10px]">
                SINIRLI SÜRE
              </span>
            </div>

            <div className="flex gap-4 sm:gap-8">
              <CountdownUnit label="SAAT" value={countdown.hours} />
              <CountdownUnit label="DAKİKA" value={countdown.minutes} />
              <CountdownUnit label="SANİYE" value={countdown.seconds} />
            </div>
          </div>

          <h2 className="text-5xl md:text-9xl font-[1000] text-white leading-[0.85] uppercase italic tracking-[-0.05em]">
            {PROMO_CAMPAIGN.TITLE_PART_1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-white to-blue-600">
              {PROMO_CAMPAIGN.TITLE_PART_2}
            </span>
          </h2>

          <p className="text-zinc-400 text-xs md:text-xl font-medium uppercase tracking-[0.3em] italic leading-relaxed">
            {PROMO_CAMPAIGN.DISCOUNT_TEXT} <br />
            <span className="text-white font-[1000] underline underline-offset-8 decoration-red-600">
              {PROMO_CAMPAIGN.ACTION_TEXT}
            </span>
          </p>
        </div>

        <Button
          variant="white"
          size="xl"
          onClick={() => {
            setIsOpen(false);
            navigate("/discount");
          }}
          className="mt-8 shadow-2xl shadow-white/20 hover:scale-110 italic"
        >
          KEŞFET →
        </Button>
      </div>
    </div>
  );
};

export default PromoModal;
