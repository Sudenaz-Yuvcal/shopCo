import { FiCreditCard } from "react-icons/fi";
import Input from "../ui/Input";

interface CheckoutFormProps {
  register: any;
  errors: any;
  handleSubmit: any;
  onCheckoutSubmit: any;
  setValue: any;
  showCityList: boolean;
  setShowCityList: (val: boolean) => void;
  filteredCities: string[];
  errorStyle: (err: any) => any;
}

const CheckoutForm = ({
  register,
  errors,
  handleSubmit,
  onCheckoutSubmit,
  setValue,
  showCityList,
  setShowCityList,
  filteredCities,
  errorStyle,
}: CheckoutFormProps) => (
  <form
    id="checkout-form"
    onSubmit={handleSubmit(onCheckoutSubmit)}
    className="space-y-12 animate-in slide-in-from-left duration-700"
  >
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
        <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
          01
        </span>
        <h2 className="text-2xl font-heavy uppercase italic tracking-tighter">
          TESLİMAT BİLGİLERİ
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register("firstName", { required: true })}
          placeholder="AD"
          style={errorStyle(errors.firstName)}
          className="!rounded-3xl !py-5 font-black italic"
        />
        <Input
          {...register("lastName", { required: true })}
          placeholder="SOYAD"
          style={errorStyle(errors.lastName)}
          className="!rounded-3xl !py-5 font-black italic"
        />
        <Input
          {...register("email", { required: true })}
          placeholder="E-POSTA"
          style={errorStyle(errors.email)}
          className="md:col-span-2 !rounded-3xl !py-5 font-black italic"
        />
        <Input
          {...register("address", { required: true })}
          placeholder="ADRES"
          style={errorStyle(errors.address)}
          className="md:col-span-2 !rounded-3xl !py-5 font-black italic"
        />
        <div className="relative">
          <Input
            {...register("city", { required: true })}
            placeholder="ŞEHİR"
            style={errorStyle(errors.city)}
            onFocus={() => setShowCityList(true)}
            className="!rounded-3xl !py-5 font-black italic"
          />
          {showCityList && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-100 rounded-[30px] shadow-2xl z-50 max-h-60 overflow-y-auto p-4">
              {filteredCities.map((city) => (
                <div
                  key={city}
                  onClick={() => {
                    setValue("city", city, { shouldValidate: true });
                    setShowCityList(false);
                  }}
                  className="p-4 hover:bg-black hover:text-white rounded-2xl cursor-pointer text-[11px] font-black italic uppercase tracking-widest"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
        <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
          02
        </span>
        <h2 className="text-2xl font-heavy uppercase italic tracking-tighter">
          ÖDEME DETAYLARI
        </h2>
      </div>
      <div className="space-y-6">
        <Input
          {...register("cardName", { required: true })}
          placeholder="KART SAHİBİ"
          style={errorStyle(errors.cardName)}
          className="!rounded-3xl !py-5 font-black italic"
        />
        <div className="relative">
          <Input
            {...register("cardNumber", { required: true, minLength: 16 })}
            maxLength={16}
            placeholder="KART NUMARASI"
            style={errorStyle(errors.cardNumber)}
            className="!rounded-3xl !py-5 font-black italic"
          />
          <FiCreditCard
            className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300"
            size={24}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Input
            {...register("expiryDate", { required: true })}
            placeholder="AA/YY"
            style={errorStyle(errors.expiryDate)}
            className="!rounded-3xl !py-5 text-center font-black italic"
          />
          <Input
            {...register("cvc", { required: true })}
            placeholder="CVC"
            style={errorStyle(errors.cvc)}
            className="!rounded-3xl !py-5 text-center font-black italic"
          />
        </div>
      </div>
    </div>
  </form>
);

export default CheckoutForm;
