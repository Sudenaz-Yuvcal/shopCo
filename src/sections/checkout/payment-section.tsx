import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  Path,
  PathValue,
} from "react-hook-form";
import { FiCreditCard } from "react-icons/fi";
import Input from "../../components/ui/Input";
import type { ICheckoutForm } from "../../types/checkout";

interface PaymentSectionProps {
  register: UseFormRegister<ICheckoutForm>;
  setValue: UseFormSetValue<ICheckoutForm>;
  errors: FieldErrors<ICheckoutForm>;
}

const PaymentSection = ({
  register,
  setValue,
  errors,
}: PaymentSectionProps) => {
  const setFormValue = (name: Path<ICheckoutForm>, value: string) => {
    setValue(name, value as PathValue<ICheckoutForm, typeof name>, {
      shouldValidate: true,
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setFormValue("cardNumber", value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2, 4);
    setFormValue("expiryDate", val.slice(0, 5));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 3);
    setFormValue("cvc", val);
  };

  return (
    <section className="space-y-8 animate-in slide-in-from-left duration-700 delay-100">
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
          {...register("cardName", { required: "Kart ismi zorunlu" })}
          placeholder="KART ÜZERİNDEKİ İSİM"
          error={errors.cardName?.message}
          className="!rounded-2xl !py-5 bg-white border-none shadow-sm font-black italic uppercase"
        />

        <div className="relative">
          <Input
            {...register("cardNumber", {
              required: "Kart numarası zorunlu",
              minLength: { value: 16, message: "16 hane girilmelidir" },
            })}
            placeholder="KART NUMARASI"
            onChange={handleCardNumberChange}
            maxLength={16}
            error={errors.cardNumber?.message}
            className="!rounded-2xl !py-5 bg-white border-none shadow-sm font-black tracking-[0.2em]"
          />
          <FiCreditCard
            className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300"
            size={24}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            {...register("expiryDate", { required: "SKT zorunlu" })}
            placeholder="AA / YY"
            onChange={handleExpiryChange}
            maxLength={5}
            error={errors.expiryDate?.message}
            className="!rounded-2xl !py-5 bg-white border-none shadow-sm text-center font-black"
          />
          <Input
            {...register("cvc", {
              required: "CVC zorunlu",
              minLength: { value: 3, message: "3 hane" },
            })}
            placeholder="CVC"
            onChange={handleCvcChange}
            maxLength={3}
            error={errors.cvc?.message}
            className="!rounded-2xl !py-5 bg-white border-none shadow-sm text-center font-black"
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
