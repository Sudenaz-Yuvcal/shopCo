import { createContext, useContext, useState, type ReactNode } from "react";

interface PromoContextType {
  appliedPromoCode: string;
  applyPromoCode: (
    code: string,
    subtotal: number,
  ) => { success: boolean; message: string };
  isPromoApplied: boolean;
  resetPromo: () => void;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const PromoProvider = ({ children }: { children: ReactNode }) => {
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  const applyPromoCode = (code: string, subtotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setAppliedPromoCode("");
      return { success: true, message: "" };
    }

    if (cleanCode === "SUDE30") {
      setAppliedPromoCode("SUDE30");
      return { success: true, message: "%30 İndirim Uygulandı!" };
    }

    if (cleanCode === "HOSGELDIN50") {
      if (subtotal >= 500) {
        setAppliedPromoCode("HOSGELDIN50");
        return { success: true, message: "%50 İndirim Uygulandı!" };
      }
      return { success: false, message: "Bu kod için alt limit 500 TL'dir." };
    }

    return { success: false, message: "Geçersiz kod." };
  };

  const resetPromo = () => setAppliedPromoCode("");

  return (
    <PromoContext.Provider
      value={{
        appliedPromoCode,
        applyPromoCode,
        isPromoApplied: !!appliedPromoCode,
        resetPromo,
      }}
    >
      {children}
    </PromoContext.Provider>
  );
};

export const usePromo = () => {
  const context = useContext(PromoContext);
  if (!context) throw new Error("usePromo must be used within a PromoProvider");
  return context;
};
