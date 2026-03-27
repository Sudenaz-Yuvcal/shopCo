import type { UseFormRegister, FieldErrors } from "react-hook-form";
import Input from "../../components/ui/Input";
import { TURKISH_CITIES } from "../../constants/Cities";
import type { ICheckoutForm } from "../../types/checkout";

interface ShippingSectionProps {
  register: UseFormRegister<ICheckoutForm>;
  errors: FieldErrors<ICheckoutForm>;
}

const ShippingSection = ({ register, errors }: ShippingSectionProps) => (
  <section className="space-y-8 animate-in slide-in-from-left duration-500 text-left">
    <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
      <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
        01
      </span>
      <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">
        TESLİMAT ADRESİ
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        {...register("firstName")}
        placeholder="AD"
        error={errors.firstName?.message}
        className="!rounded-3xl !py-5 font-black italic uppercase"
      />

      <Input
        {...register("lastName")}
        placeholder="SOYAD"
        error={errors.lastName?.message}
        className="!rounded-3xl !py-5 font-black italic uppercase"
      />

      <Input
        {...register("email")}
        type="email"
        placeholder="E-POSTA"
        error={errors.email?.message}
        className="md:col-span-2 !rounded-3xl !py-5 font-black"
      />

      <Input
        {...register("address")}
        placeholder="ADRES DETAYI"
        error={errors.address?.message}
        className="md:col-span-2 !rounded-3xl !py-5 font-black italic uppercase"
      />

      <div className="relative">
        <Input
          {...register("city")}
          list="city-list"
          placeholder="ŞEHİR"
          error={errors.city?.message}
          className="!rounded-3xl !py-5 font-black italic uppercase"
        />
        <datalist id="city-list">
          {TURKISH_CITIES.map((city: string) => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </div>

      <Input
        {...register("zipCode")}
        placeholder="POSTA KODU"
        maxLength={5}
        error={errors.zipCode?.message}
        className="!rounded-3xl !py-5 font-black"
      />
    </div>
  </section>
);

export default ShippingSection;
