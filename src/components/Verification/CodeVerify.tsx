import React, { useState, useRef, useEffect } from "react";
import Button from "../Ui/Button";

interface CodeVerifyProps {
  target: string;
  onConfirm: (code: string) => void;
  onResend?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const CodeVerify: React.FC<CodeVerifyProps> = ({
  target,
  onConfirm,
  onResend,
  onBack,
  isLoading,
}) => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResendClick = () => {
    if (!canResend || !onResend) return;
    setCanResend(false);
    setTimeLeft(59);
    onResend();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && code.join("").length === 6) {
      onConfirm(code.join(""));
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-black">
          GÜVENLİK KODU
        </h2>
        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic leading-relaxed">
          KOD ŞURAYA GÖNDERİLDİ: <br />
          <span className="text-black border-b-2 border-black/10">
            {target}
          </span>
        </p>
      </div>

      <div className="flex justify-center gap-3 md:gap-4">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-16 md:w-16 md:h-20 border-4 border-black rounded-[20px] text-center text-3xl font-[1000] focus:bg-black focus:text-white transition-all outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-none translate-y-0 focus:-translate-y-1"
          />
        ))}
      </div>

      <div className="w-full max-w-sm space-y-6">
        <Button
          variant="primary"
          size="xl"
          className="w-full !rounded-full italic font-[1000] tracking-[0.3em] !py-8 shadow-2xl disabled:opacity-20"
          onClick={() => onConfirm(code.join(""))}
          disabled={code.join("").length < 6 || isLoading}
        >
          {isLoading ? "DOĞRULANIYOR..." : "DEVAM ET →"}
        </Button>

        <div className="flex flex-col items-center gap-4 pt-2">
          <button
            onClick={handleResendClick}
            type="button"
            disabled={!canResend}
            className={`text-[10px] font-black uppercase tracking-widest italic border-b transition-colors ${
              canResend
                ? "text-black border-black hover:opacity-70"
                : "text-zinc-300 border-transparent cursor-not-allowed"
            }`}
          >
            {canResend
              ? "KODU TEKRAR GÖNDER"
              : `YENİ KOD İÇİN BEKLEYİN (${timeLeft}S)`}
          </button>

          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-red-500 transition-colors italic"
            >
              ← BİLGİLERİ DÜZENLE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeVerify;
