import React, { useState, useRef, useEffect } from "react";
import Button from "../Ui/Button";

interface CodeVerifyProps {
  target?: string;
  onConfirm: (code: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const CodeVerify: React.FC<CodeVerifyProps> = ({
  target,
  onConfirm,
  onBack,
  isLoading,
}) => {
  const codeLength = 8;
  const [code, setCode] = useState<string[]>(new Array(codeLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const lastChar = value.substring(value.length - 1);
    const newCode = [...code];
    newCode[index] = lastChar;
    setCode(newCode);

    if (lastChar !== "" && index < codeLength - 1) {
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
    if (e.key === "Enter" && code.join("").length === codeLength) {
      onConfirm(code.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, codeLength)
      .split("");
    const newCode = [...code];
    data.forEach((char, idx) => {
      if (!isNaN(Number(char))) {
        newCode[idx] = char;
      }
    });
    setCode(newCode);
    const nextIndex = Math.min(data.length, codeLength - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-black">
          GÜVENLİK KODU
        </h2>
        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic leading-relaxed">
          8 HANELİ KOD ŞURAYA GÖNDERİLDİ: <br />
          <span className="text-black border-b-2 border-black/10">
            {target}
          </span>
        </p>
      </div>

      <div className="flex justify-center gap-1 md:gap-1.5">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onPaste={handlePaste}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-8 h-12 md:w-11 md:h-16 border-[3px] border-black rounded-[12px] text-center text-lg md:text-2xl font-[1000] focus:bg-black focus:text-white transition-all outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-none translate-y-0 focus:-translate-y-1"
          />
        ))}
      </div>

      <div className="w-full max-w-sm space-y-6">
        <Button
          variant="primary"
          className={`w-full !rounded-[24px] italic font-[1000] tracking-[0.3em] !py-8 shadow-2xl transition-all ${
            code.join("").length < codeLength || isLoading
              ? "opacity-30 grayscale cursor-not-allowed"
              : "hover:scale-[1.02]"
          }`}
          onClick={() => onConfirm(code.join(""))}
          disabled={isLoading || code.join("").length < codeLength}
        >
          {isLoading ? "DOĞRULANIYOR..." : "KODU ONAYLA →"}
        </Button>

        <div className="flex flex-col items-center gap-4 pt-2">
          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors italic"
            >
              ← BİLGİLERİ GÜNCELLE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeVerify;
