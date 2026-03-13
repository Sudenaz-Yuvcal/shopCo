import { useState, useEffect, useRef } from "react";
import { FiX, FiGift, FiZap, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from "./ui/Button";

const PRIZES = [
  { text: "KARGO BEDAVA", color: "#FFD700" },
  { text: "SUDE30 KODU", color: "#FF8C00" },
  { text: "TEKRAR DENE", color: "#FF4500" },
  { text: "3 AL 2 ÖDE", color: "#B22222" },
  { text: "KARGO BEDAVA", color: "#FFD700" },
  { text: "SUDE30 KODU", color: "#FF8C00" },
  { text: "TEKRAR DENE", color: "#FF4500" },
  { text: "3 AL 2 ÖDE", color: "#B22222" },
];

const WheelOfFortune = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [canSpin, setCanSpin] = useState(true);

  const clickAudio = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    ),
  );
  const winAudio = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
    ),
  );

  useEffect(() => {
    const checkStatus = () => {
      const lastSpin = localStorage.getItem("last_spin_time");
      if (lastSpin) {
        const now = new Date().getTime();
        const diff = now - parseInt(lastSpin);
        const tenHours = 10 * 60 * 60 * 1000;

        if (diff < tenHours) {
          setCanSpin(false);
          const remaining = tenHours - diff;
          const h = Math.floor(remaining / (1000 * 60 * 60));
          const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeLeft(`${h}s ${m}d ${s}s`);
        } else {
          setCanSpin(true);
        }
      }
    };

    const timer = setInterval(checkStatus, 1000);
    return () => clearInterval(timer);
  }, []);

  const spinWheel = () => {
    if (isSpinning || !canSpin) return;
    setWonPrize(null);
    setIsSpinning(true);

    let clickCount = 0;
    const clickInterval = setInterval(() => {
      clickAudio.current.currentTime = 0;
      clickAudio.current.volume = 0.2;
      clickAudio.current.play().catch(() => {});
      clickCount++;
      if (clickCount > 40) clearInterval(clickInterval);
    }, 100);

    const extraDegrees = Math.floor(Math.random() * 360) + 1800;
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDegree = newRotation % 360;
      const prizeIndex = Math.floor(((360 - actualDegree) % 360) / 45);
      const result = PRIZES[prizeIndex].text;

      if (result !== "TEKRAR DENE") {
        winAudio.current.play().catch(() => {});
        setWonPrize(result);
      } else {
        toast.error("TEKRAR DENE!", { theme: "dark" });
      }
      localStorage.setItem("last_spin_time", new Date().getTime().toString());
    }, 4000);
  };

  return (
    <>
      <style>
        {`
          @keyframes wheelFrisbee {
            0% { opacity: 0; transform: scale(0.1) rotate(-720deg); }
            70% { opacity: 1; transform: scale(1.1) rotate(15deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          @keyframes attentionShake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            75% { transform: rotate(-10deg); }
          }
          .wheel-frisbee-active {
            animation: wheelFrisbee 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .animate-shake {
            animation: attentionShake 0.5s ease-in-out infinite;
          }
        `}
      </style>

      <div
        onClick={() => setIsOpen(true)}
        className="ml-3 cursor-pointer group relative"
      >
        {canSpin && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 z-30">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}

        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
          <div className="bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-xl relative italic tracking-widest shadow-2xl border border-white/10 uppercase">
            {canSpin ? "Şansını Dene! 🎁" : "Kilitli 🔒"}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
          </div>
        </div>

        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full blur opacity-40 animate-pulse"></div>
        <div
          className={`relative w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-90 ${canSpin ? "group-hover:animate-shake" : "opacity-50"}`}
        >
          <FiZap
            className={`${canSpin ? "text-yellow-400" : "text-zinc-500"}`}
            size={18}
          />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 overflow-hidden">
          <Button
            className="absolute top-8 right-8 !w-12 !h-12 !p-0 bg-transparent text-white/40 hover:text-white border-none shadow-none"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={32} />
          </Button>

          <div className="relative flex flex-col items-center max-w-sm w-full wheel-frisbee-active">
            <div className="absolute -top-4 z-50 filter drop-shadow-xl">
              <div
                className="w-8 h-10 bg-white shadow-[0_0_20px_white]"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
              />
            </div>

            <div
              className="relative p-3 bg-zinc-900 rounded-full border border-white/5 shadow-2xl"
              style={{ perspective: "1200px" }}
            >
              <div
                style={{
                  transform: `rotateX(20deg) rotate(${rotation}deg)`,
                  transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
                  background: `conic-gradient(${PRIZES.map((p, i) => `${p.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(", ")})`,
                }}
                className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border-[10px] border-zinc-950 shadow-2xl relative overflow-hidden"
              >
                {PRIZES.map((p, i) => (
                  <div
                    key={i}
                    style={{ transform: `rotate(${i * 45 + 22.5}deg)` }}
                    className="absolute h-full flex items-start justify-center left-0 right-0"
                  >
                    <span className="mt-6 md:mt-10 text-[9px] md:text-[11px] font-black text-black uppercase [writing-mode:vertical-lr] rotate-180">
                      {p.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={spinWheel}
              disabled={!canSpin}
              isLoading={isSpinning}
              size="xl"
              className="mt-10 italic shadow-2xl border-2 border-white/20"
            >
              {!isSpinning && (canSpin ? "ÇEVİR" : "KİLİTLİ")}
            </Button>

            {!canSpin && !isSpinning && (
              <div className="mt-6 flex items-center gap-2 text-white/60 font-black text-sm uppercase">
                <FiClock className="animate-pulse" />
                <span>Tekrar Hak: {timeLeft}</span>
              </div>
            )}

            {wonPrize && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10002] animate-in zoom-in">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
                <div className="bg-white p-10 rounded-[40px] text-center border-[10px] border-yellow-400 max-w-[300px] w-full relative">
                  <FiGift
                    size={50}
                    className="mx-auto text-yellow-500 animate-bounce mb-4"
                  />
                  <h2 className="text-black text-3xl font-black italic">
                    TEBRİKLER!
                  </h2>
                  <p className="my-4 text-black font-black text-xl border-y-2 border-dashed border-zinc-200 py-4 uppercase leading-none">
                    {wonPrize}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setWonPrize(null)}
                    className="w-full"
                  >
                    KAPAT
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WheelOfFortune;
