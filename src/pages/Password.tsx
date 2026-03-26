import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recoverySchema } from "../utils/schemas";
import {
  RiMailSendLine,
  RiPhoneLine,
  RiShieldKeyholeLine,
  RiErrorWarningLine,
  RiArrowLeftSLine,
} from "react-icons/ri";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface RecoveryFormInput {
  method: "email" | "phone";
  inputValue: string;
}

const Password: React.FC = () => {
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RecoveryFormInput>({
    resolver: yupResolver(
      recoverySchema,
    ) as unknown as Resolver<RecoveryFormInput>,
    mode: "onChange",
    defaultValues: {
      method: "email",
      inputValue: "",
    },
  });

  const currentMethod = watch("method");

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const onSubmit: SubmitHandler<RecoveryFormInput> = (data) => {
    toast.info(`BAĞLANTI GÖNDERİLDİ: ${data.inputValue}`, { theme: "dark" });
    setCooldown(60);
    setTimeout(() => navigate("/login"), 3500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative font-satoshi overflow-hidden px-4">
      <Helmet>
        <title>Güvenli Kurtarma | SHOP.CO</title>
      </Helmet>

      <div className="absolute top-10 left-10 z-20">
        <Link
          to="/"
          className="text-3xl font-[1000] tracking-tighter text-black uppercase italic hover:opacity-50 transition-all"
        >
          SHOP.CO
        </Link>
      </div>

      <div className="max-w-[1000px] w-full grid md:grid-cols-2 bg-white rounded-[48px] shadow-[0_40px_120px_rgba(0,0,0,0.08)] border border-zinc-50 overflow-hidden z-10 relative">
        <div className="bg-zinc-950 p-12 hidden md:flex flex-col justify-between items-start text-left relative overflow-hidden">
          <RiShieldKeyholeLine className="absolute -right-16 -bottom-16 text-[300px] text-white/[0.02] -rotate-12 select-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-1 bg-zinc-800" />
            <h2 className="text-6xl font-[1000] text-white uppercase italic leading-[0.85] tracking-tighter">
              GÜVENLİ <br />{" "}
              <span className="text-zinc-800 underline decoration-zinc-900 underline-offset-8">
                ERİŞİM
              </span>
            </h2>
          </div>
          <p className="text-zinc-600 text-sm font-bold leading-relaxed max-w-[220px] relative z-10">
            Hesabınızı kurtarmak için kayıtlı doğrulama yöntemini seçiniz.
          </p>
        </div>

        <div className="p-8 md:p-16 lg:p-20 text-left bg-white">
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none">
                DOĞRULA
              </h1>
              <p className="text-zinc-300 text-[9px] mt-4 uppercase tracking-[0.3em] font-black italic">
                HESABINI YENİDEN AKTİF ET
              </p>
            </div>
            <Link to="/login" className="flex items-center gap-1 group">
              <RiArrowLeftSLine className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-black transition-all">
                GERİ
              </span>
            </Link>
          </div>

          <div className="flex bg-zinc-50 p-1.5 rounded-2xl mb-10 border border-zinc-100 relative">
            {(["email", "phone"] as const).map((m) => (
              <Button
                key={m}
                variant={currentMethod === m ? "primary" : "white"}
                onClick={() => {
                  setValue("method", m);
                  setValue("inputValue", "");
                }}
                className={`flex-1 !py-4 !rounded-xl !text-[10px] !border-none tracking-widest italic transition-all duration-500 ${
                  currentMethod === m
                    ? "shadow-2xl scale-[1.02] z-10"
                    : "!bg-transparent !text-zinc-400 opacity-60"
                }`}
              >
                {m === "email" ? "E-POSTA" : "TELEFON"}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-2 italic">
                {currentMethod === "email"
                  ? "KİMLİK (E-POSTA)"
                  : "İLETİŞİM (TELEFON)"}
              </label>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20">
                  {currentMethod === "email" ? (
                    <RiMailSendLine
                      size={20}
                      className={
                        errors.inputValue
                          ? "text-red-500"
                          : "text-zinc-300 group-focus-within:text-black"
                      }
                    />
                  ) : (
                    <>
                      <RiPhoneLine
                        size={20}
                        className={
                          errors.inputValue
                            ? "text-red-500"
                            : "text-zinc-300 group-focus-within:text-black"
                        }
                      />
                      <span className="text-xs font-[1000] text-zinc-400">
                        +90
                      </span>
                    </>
                  )}
                </div>

                <Input
                  {...register("inputValue")}
                  onChange={(e) => {
                    let val = e.target.value;

                    if (currentMethod === "email")
                      val = val.toLowerCase().replace(/\s/g, "");
                    if (currentMethod === "phone")
                      val = val.replace(/\D/g, "").slice(0, 10);
                    e.target.value = val;
                    register("inputValue").onChange(e);
                  }}
                  placeholder={
                    currentMethod === "email"
                      ? "ornek@mail.com"
                      : "5XX XXX XX XX"
                  }
                  className={`!bg-brand-soft !border-none !rounded-[24px] ${currentMethod === "phone" ? "pl-24" : "pl-16"} py-6 font-black text-sm focus:ring-2 focus:ring-black ${errors.inputValue ? "ring-2 ring-red-500 !bg-red-50/20" : ""}`}
                />

                {errors.inputValue && (
                  <div className="absolute -bottom-7 left-2 flex items-center gap-1.5 text-red-600 animate-in slide-in-from-top-1">
                    <RiErrorWarningLine size={14} />
                    <span className="text-[9px] font-black uppercase tracking-tighter italic">
                      {errors.inputValue.message}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                size="xl"
                disabled={cooldown > 0 || !isValid}
                className={`w-full !rounded-[24px] !py-6 !text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all ${
                  cooldown > 0 || !isValid
                    ? "opacity-30 grayscale cursor-not-allowed"
                    : "hover:scale-[1.02] hover:bg-zinc-900 active:scale-95"
                }`}
              >
                {cooldown > 0 ? `${cooldown} S BEKLEYİN` : "KODU GÖNDER →"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
