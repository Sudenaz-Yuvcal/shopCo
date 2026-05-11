import { useState, useEffect, useRef } from "react";
import { FiX, FiClock, FiAward, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from "../../components/Ui/Button";
import { PrizeOverlay } from "../../components/Home/PrizeOverlay";

interface Prize {
  text: string;
  color: string;
}

const PRIZES: Prize[] = [
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canSpin, setCanSpin] = useState<boolean>(true);

  const [showCloseIcon, setShowCloseIcon] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const clickAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setShowCloseIcon(true);
    }, 5000);

    clickAudio.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    );
    winAudio.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
    );

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
          setTimeLeft(`${h}s ${m}dk ${s}sn`);
        } else {
          setCanSpin(true);
        }
      }
    };
    const timer = setInterval(checkStatus, 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, []);

  const spinWheel = () => {
    if (isSpinning || !canSpin) return;
    setWonPrize(null);
    setIsSpinning(true);

    let clickCount = 0;
    const clickInterval = setInterval(() => {
      if (clickAudio.current) {
        clickAudio.current.currentTime = 0;
        clickAudio.current.volume = 0.2;
        clickAudio.current.play().catch(() => {});
      }
      clickCount++;
      if (clickCount > 40) clearInterval(clickInterval);
    }, 100);

    const extraDegrees = Math.floor(Math.random() * 360) + 2520;
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDegree = newRotation % 360;
      const prizeIndex = Math.floor(((360 - actualDegree) % 360) / 45);
      const result = PRIZES[prizeIndex].text;

      if (result !== "TEKRAR DENE") {
        winAudio.current?.play().catch(() => {});
        setWonPrize(result);
      } else {
        toast.error("şansın kapalıydı, tekrar dene!", { theme: "dark" });
      }
      localStorage.setItem("last_spin_time", new Date().getTime().toString());
    }, 4000);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          @keyframes mesh { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes wheelFrisbee { 
            0% { opacity: 0; transform: scale(0.3) rotate(-720deg) translateY(100px); } 
            100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); } 
          }
          @keyframes superBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-25px); }
          }
          @keyframes shadowPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.6); opacity: 0.05; }
          }
          @keyframes textPulse {
            0%, 100% { transform: scale(1) rotate(-3deg); }
            50% { transform: scale(1.5) rotate(0deg); }
          }
          .bg-mesh { 
            background: linear-gradient(-45deg, #000, #111, #0a0a0a, #000); 
            background-size: 400% 400%; 
            animation: mesh 15s ease infinite; 
          }
          .animate-super-bounce { animation: superBounce 1.8s ease-in-out infinite; }
          .animate-shadow-pulse { animation: shadowPulse 1.8s ease-in-out infinite; }
          .animate-text-pulse { animation: textPulse 1.5s ease-in-out infinite; }
          .wheel-entrance { animation: wheelFrisbee 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        `}
      </style>

      <div className="fixed bottom-28 right-8 z-[9998] flex flex-col items-center animate-super-bounce">
        {showCloseIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute -top-4 -right-2 bg-black text-white rounded-full p-1.5 z-[9999] shadow-lg hover:bg-red transition-colors border-2 border-white/20 active:scale-90"
          >
            <FiX size={14} />
          </button>
        )}

        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer group flex flex-col items-center"
        >
          <div className="absolute bottom-full mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-110 pointer-events-none">
            <div className="bg-black text-white text-[11px] font-[1000] px-5 py-2.5 rounded-2xl border-2 border-yellow-400 italic uppercase shadow-2xl whitespace-nowrap">
              {canSpin ? "🎁 ŞANSINI DENE!" : `🔒 ${timeLeft}`}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[10px] border-transparent border-t-yellow-400"></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-3 bg-black rounded-[100%] blur-md animate-shadow-pulse"></div>
            <div className="absolute -inset-6 bg-yellow-400 rounded-full blur-[40px] opacity-20 group-hover:opacity-60 transition-opacity animate-pulse"></div>
            <div
              className={`relative w-16 h-16 bg-black border-4 border-yellow-400 rounded-full flex items-center justify-center shadow-xl transition-all ${canSpin ? "hover:rotate-[360deg]" : "opacity-50 grayscale"}`}
            >
              <FiZap
                className={canSpin ? "text-yellow-400" : "text-zinc-500"}
                size={34}
              />
              {canSpin && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
                </span>
              )}
            </div>
          </div>
          <div className="mt-5 bg-yellow-400 px-4 py-1.5 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-text-pulse transition-transform">
            <span className="text-[11px] font-black italic text-black uppercase block">
              HEDİYENİ AL!
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl z-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />

          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-6 right-6 text-white/50 hover:text-white transition-all z-[100] p-2 hover:bg-white/10 rounded-full"
          >
            <FiX size={40} />
          </button>

          <div className="relative w-full max-w-6xl bg-zinc-900/50 border border-white/10 rounded-[40px] p-6 md:p-12 flex flex-col md:flex-row items-center gap-16 overflow-hidden shadow-2xl z-10">
            <div className="flex-1 space-y-8 text-center md:text-left z-10 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full border border-yellow-400/20">
                <FiAward />
                <span className="text-xs font-black tracking-widest uppercase italic">
                  Günlük Şans Festivali
                </span>
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl md:text-8xl font-[1000] text-white italic tracking-tighter leading-none uppercase">
                  ŞANSINI <br />{" "}
                  <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                    DÖNDÜR!
                  </span>
                </h2>
                <p className="text-zinc-400 text-sm md:text-lg font-medium max-w-md leading-relaxed">
                  Çarka tıkla ve sürprizini yakala!
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                <Button
                  onClick={spinWheel}
                  disabled={!canSpin}
                  isLoading={isSpinning}
                  className="!py-8 !px-16 !text-2xl font-black italic !rounded-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 uppercase transition-all"
                >
                  {canSpin ? "ŞİMDİ ÇEVİR" : "KİLİTLİ"}
                </Button>
                {!canSpin && (
                  <div className="flex items-center gap-4 text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                    <FiClock
                      className="text-yellow-400 animate-pulse"
                      size={24}
                    />
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        Yeni Hakka Kalan
                      </p>
                      <p className="text-white font-mono text-lg font-bold">
                        {timeLeft}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex-1 flex justify-center items-center py-10 order-1 md:order-2 wheel-entrance">
              <div className="absolute w-[120%] h-[120%] bg-yellow-500/10 blur-[150px] rounded-full" />
              <div className="relative z-10 group/wheel">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-[60] drop-shadow-2xl scale-125">
                  <div
                    className="w-10 h-14 bg-white shadow-[0_0_40px_rgba(255,255,255,0.8)]"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
                  />
                </div>
                <div
                  onClick={spinWheel}
                  className={`p-4 md:p-8 bg-zinc-950 rounded-full border-[12px] border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,1)] relative ${canSpin && !isSpinning ? "cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-300" : "cursor-default"}`}
                >
                  <div
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
                      background: `conic-gradient(${PRIZES.map((p, i) => `${p.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(", ")})`,
                    }}
                    className="w-[280px] h-[280px] md:w-[460px] md:h-[460px] rounded-full border-[10px] border-black/50 relative overflow-hidden ring-1 ring-white/10"
                  >
                    {PRIZES.map((p, i) => (
                      <div
                        key={i}
                        style={{ transform: `rotate(${i * 45 + 22.5}deg)` }}
                        className="absolute h-full flex items-start justify-center left-0 right-0"
                      >
                        <span className="mt-8 md:mt-16 text-[10px] md:text-sm font-[1000] text-black uppercase [writing-mode:vertical-lr] rotate-180 tracking-tighter">
                          {p.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full border-8 border-black shadow-3xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,1)] animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {wonPrize && (
        <PrizeOverlay wonPrize={wonPrize} onClose={() => setWonPrize(null)} />
      )}
    </>
  );
};

export default WheelOfFortune;
