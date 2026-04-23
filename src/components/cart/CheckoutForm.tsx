import { FiCreditCard } from "react-icons/fi";
import Input from "../Ui/Input";
import {
  useForm,
  type Path,
  type PathValue,
  type FieldErrors,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ICheckoutForm } from "../../types/checkout";
import { useState, type ChangeEvent, useEffect } from "react";
import { baseEmail } from "../../utils/schemas";

export const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("AD GEREKLİ."),
  lastName: yup.string().required("SOYAD GEREKLİ."),
  email: baseEmail,
  address: yup
    .string()
    .required("ADRES GEREKLİ.")
    .min(10, "DETAYLI ADRES GİRİN."),
  city: yup.string().required("ŞEHİR SEÇİN."),
  phone: yup
    .string()
    .required("TELEFON GEREKLİ.")
    .matches(/^\+90\s\d{10}$/, "GEÇERLİ BİR NUMARA GİRİN."),
  cardName: yup.string().required("KART İSMİ GEREKLİ."),
  cardNumber: yup
    .string()
    .required("KART NO GEREKLİ.")
    .length(16, "16 HANE OLMALI."),
  expiryDate: yup
    .string()
    .required("SKT GEREKLİ.")
    .matches(/^(0[1-9]|1[0-2])\/(2[6-9]|3[0-6])$/, "GEÇERLİ TARİH (AA/YY)"),
  cvc: yup.string().required("CVC GEREKLİ.").length(3, "3 HANE."),
});

interface CheckoutFormProps {
  onCheckoutSubmit: (data: ICheckoutForm) => void;
  filteredCities: string[];
}

const CheckoutForm = ({
  onCheckoutSubmit,
  filteredCities,
}: CheckoutFormProps) => {
  const [showCityList, setShowCityList] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICheckoutForm>({
    resolver: yupResolver(checkoutSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setValue("phone", "+90 " as PathValue<ICheckoutForm, "phone">);
  }, [setValue]);

  const errorStyle = (hasError: unknown) =>
    hasError ? { borderColor: "red" } : {};

  const updateValue = <T extends Path<ICheckoutForm>>(
    fieldName: T,
    value: PathValue<ICheckoutForm, T>,
  ) => {
    setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;
    if (!inputVal.startsWith("+90 ")) {
      inputVal = "+90 " + inputVal.replace(/^\+90\s?/, "");
    }
    const numbersOnly = inputVal.slice(4).replace(/\D/g, "").slice(0, 10);
    const finalValue = "+90 " + numbersOnly;
    updateValue("phone", finalValue as PathValue<ICheckoutForm, "phone">);
  };

  const handleNameChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof ICheckoutForm,
  ) => {
    const val = e.target.value.replace(/[0-9]/g, "").replace(/\s\s+/g, " ");
    updateValue(fieldName, val as PathValue<ICheckoutForm, typeof fieldName>);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .replace(/\s/g, "")
      .replace(/[ğĞüÜşŞİıöÖçÇ]/g, "");
    updateValue(
      "email",
      val.toLowerCase() as PathValue<ICheckoutForm, "email">,
    );
  };

  const handleNumberOnlyChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof ICheckoutForm,
    maxLen: number,
  ) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, maxLen);
    updateValue(fieldName, val as PathValue<ICheckoutForm, typeof fieldName>);
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2, 4);
    updateValue(
      "expiryDate",
      val.substring(0, 5) as PathValue<ICheckoutForm, "expiryDate">,
    );
  };

  const onInvalid = (formErrors: FieldErrors<ICheckoutForm>) => {
    console.warn("Form Validasyon Hataları:", formErrors);
  };

  return (
    <form
      id="checkout-form"
      onSubmit={handleSubmit(onCheckoutSubmit, onInvalid)}
      className="space-y-12 font-satoshi"
    >
      <div className="space-y-10">
        <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
          <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
            01
          </span>
          <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">
            TESLİMAT BİLGİLERİ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register("firstName")}
            placeholder="AD"
            style={errorStyle(errors.firstName)}
            onChange={(e) => handleNameChange(e, "firstName")}
            className="!rounded-3xl !py-5 font-black italic uppercase"
          />
          <Input
            {...register("lastName")}
            placeholder="SOYAD"
            style={errorStyle(errors.lastName)}
            onChange={(e) => handleNameChange(e, "lastName")}
            className="!rounded-3xl !py-5 font-black italic uppercase"
          />

          <div className="md:col-span-2">
            <Input
              {...register("email")}
              placeholder="E-POSTA"
              style={errorStyle(errors.email)}
              onChange={handleEmailChange}
              className="!rounded-3xl !py-5 font-black"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] ml-4 mt-1 font-bold italic uppercase">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Input
              {...register("phone")}
              onChange={handlePhoneChange}
              placeholder="+90 5XX XXX XX XX"
              style={errorStyle(errors.phone)}
              className="!rounded-3xl !py-5 font-black italic tracking-widest"
            />
            {errors.phone && (
              <p className="text-red-500 text-[10px] ml-4 mt-1 font-bold italic uppercase">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Input
              {...register("address")}
              placeholder="ADRES"
              style={errorStyle(errors.address)}
              className="!rounded-3xl !py-5 font-black italic uppercase"
            />
            {errors.address && (
              <p className="text-red-500 text-[10px] ml-4 mt-1 font-bold italic uppercase">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              {...register("city")}
              placeholder="ŞEHİR SEÇİN"
              onFocus={() => setShowCityList(true)}
              style={errorStyle(errors.city)}
              className="!rounded-3xl !py-5 font-black italic uppercase cursor-pointer"
              readOnly
            />
            {showCityList && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-100 rounded-[30px] shadow-2xl z-50 max-h-60 overflow-y-auto p-4 scrollbar-hide">
                {filteredCities.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      updateValue(
                        "city",
                        city as PathValue<ICheckoutForm, "city">,
                      );
                      setShowCityList(false);
                    }}
                    className="p-4 hover:bg-black hover:text-white rounded-2xl cursor-pointer uppercase text-[11px] font-black transition-colors"
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
          <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">
            ÖDEME DETAYLARI
          </h2>
        </div>
        <div className="space-y-6">
          <Input
            {...register("cardName")}
            placeholder="KART SAHİBİ"
            style={errorStyle(errors.cardName)}
            onChange={(e) => handleNameChange(e, "cardName")}
            className="!rounded-3xl !py-5 font-black italic uppercase"
          />
          <div className="relative">
            <Input
              {...register("cardNumber")}
              placeholder="KART NUMARASI"
              style={errorStyle(errors.cardNumber)}
              onChange={(e) => handleNumberOnlyChange(e, "cardNumber", 16)}
              className="!rounded-3xl !py-5 font-black tracking-[0.2em]"
            />
            <FiCreditCard
              className="absolute right-6 top-1/2 -translate-y-1/2 text-black"
              size={24}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input
              {...register("expiryDate")}
              placeholder="AA/YY"
              style={errorStyle(errors.expiryDate)}
              onChange={handleExpiryChange}
              className="!rounded-3xl !py-5 text-center font-black"
            />
            <Input
              {...register("cvc")}
              placeholder="CVC"
              style={errorStyle(errors.cvc)}
              onChange={(e) => handleNumberOnlyChange(e, "cvc", 3)}
              className="!rounded-3xl !py-5 text-center font-black"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
