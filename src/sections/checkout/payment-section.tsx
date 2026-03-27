import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import Input from "../../components/ui/Input";
import type { ICheckoutForm } from "../../types/checkout";

interface PaymentSectionProps {
  register: UseFormRegister<ICheckoutForm>;
  errors: FieldErrors<ICheckoutForm>;
  setValue: UseFormSetValue<ICheckoutForm>;
}

const PaymentSection = ({
  register,
  errors,
  setValue,
}: PaymentSectionProps) => {
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length >= 2) {
      const month = parseInt(val.substring(0, 2));
      if (month < 1) val = "01" + val.substring(2);
      if (month > 12) val = "12" + val.substring(2);
    }

    if (val.length > 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }

    if (val.length === 5) {
      const year = parseInt(val.substring(3, 5));
      if (year < 26) val = val.substring(0, 3) + "26";
    }

    const finalValue = val.slice(0, 5);
    e.target.value = finalValue;
    setValue("expiryDate", finalValue, { shouldValidate: true });
  };

  const handleNumericChange =
    (name: keyof ICheckoutForm, length: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, length);
      e.target.value = val;
      setValue(name, val, { shouldValidate: true });
    };

  return (
    <section className="space-y-8 text-left">
      <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
        <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
          02
        </span>
        <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">
          KART DETAYLARI
        </h2>
      </div>

      <div className="bg-brand-offwhite p-8 rounded-[40px] border border-zinc-100 space-y-6">
        <Input
          {...register("cardName")}
          placeholder="KART ÜZERİNDEKİ İSİM"
          error={errors.cardName?.message}
          className="!rounded-2xl !py-5 bg-white font-black italic uppercase"
        />

        <Input
          {...register("cardNumber", {
            onChange: handleNumericChange("cardNumber", 16),
          })}
          placeholder="KART NUMARASI"
          maxLength={16}
          error={errors.cardNumber?.message}
          className="!rounded-2xl !py-5 bg-white font-black tracking-widest"
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            {...register("expiryDate", { onChange: handleExpiryChange })}
            placeholder="AA / YY"
            maxLength={5}
            error={errors.expiryDate?.message}
            className="!rounded-2xl !py-5 bg-white text-center font-black"
          />
          <Input
            {...register("cvc", {
              onChange: handleNumericChange("cvc", 3),
            })}
            placeholder="CVC"
            maxLength={3}
            error={errors.cvc?.message}
            className="!rounded-2xl !py-5 bg-white text-center font-black"
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
