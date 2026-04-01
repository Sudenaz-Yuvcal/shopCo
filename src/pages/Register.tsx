import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/Ui/Button";
import Input from "../components/Ui/Input";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "../components/Ui/LoadingOverlay";
import CodeVerify from "../components/Verification/CodeVerify";
import { baseEmail, basePassword } from "../utils/schemas";
import {
  RiMailLine,
  RiUserLine,
  RiArrowRightSLine,
  RiSparklingLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import * as yup from "yup";


export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("AD SOYAD GEREKLİ.")
    .test("is-full-name", "AD VE SOYADINIZI TAM GİRİNİZ.", (val) =>
      val ? val.trim().includes(" ") && val.trim().length >= 5 : false,
    ),
  email: baseEmail,
  password: basePassword,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "ŞİFRELER EŞLEŞMİYOR.")
    .required("ŞİFRE TEKRARI GEREKLİ."),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "ŞARTLARI ONAYLAMALISINIZ.")
    .required(),
});


interface IRegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IRegisterForm | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IRegisterForm>({
    resolver: yupResolver(registerSchema) as unknown as Resolver<IRegisterForm>,
    mode: "onChange",
  });

  const passwordValue = watch("password", "");
  const emailValue = watch("email", "");

  const passwordStrength = useMemo(() => {
    if (!passwordValue) return 0;
    let strength = 0;
    if (passwordValue.length >= 8) strength += 33;
    if (/[A-Z]/.test(passwordValue)) strength += 33;
    if (/[0-9]/.test(passwordValue)) strength += 34;
    return strength;
  }, [passwordValue]);

  const onSubmit: SubmitHandler<IRegisterForm> = (data) => {
    setIsLoading(true);
    setFormData(data);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      toast.info("DOĞRULAMA KODU E-POSTANA GÖNDERİLDİ.", { theme: "dark" });
    }, 1500);
  };

  const handleVerificationSuccess = (_code: string) => {
    
    if (!formData) return;
    setIsLoading(true);

    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "ÜYE";

    setTimeout(() => {
      login({
        name: firstName.toUpperCase(),
        surname: lastName.toUpperCase(),
        email: formData.email.toLowerCase(),
        membership: "Elite",
      });

      localStorage.setItem("is_new_registrant", "true");
      toast.success("HOŞ GELDİN! %50 İNDİRİMİN TANIMLANDI.", {
        theme: "dark",
        icon: <RiSparklingLine className="text-yellow-400" />,
      });
      navigate("/", { state: { isNewUser: true } });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative font-satoshi overflow-hidden px-4">
      <Helmet>
        <title>Elite Üyelik | SHOP.CO</title>
      </Helmet>
      {isLoading && (
        <LoadingOverlay
          message={
            step === 1 ? "KOD GÖNDERİLİYOR..." : "HESABINIZ HAZIRLANIYOR..."
          }
        />
      )}

      <div className="max-w-[1100px] w-full grid md:grid-cols-2 bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden z-10 my-12 relative min-h-[650px]">
        <div className="relative bg-black p-12 hidden md:flex flex-col justify-between text-left">
          <div className="relative z-10">
            <RiShieldCheckLine className="text-zinc-600 mb-6" size={32} />
            <h2 className="text-5xl lg:text-7xl font-[1000] text-white leading-[0.85] uppercase tracking-tighter italic">
              TARZINI <br /> <span className="text-zinc-700">DÜNYAYA</span>{" "}
              <br /> KONUŞTUR.
            </h2>
          </div>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider italic leading-relaxed relative z-10">
            Elite üyelik ile kişiselleştirilmiş koleksiyonlar ve erken erişim
            fırsatlarını yakala.
          </p>
        </div>

        <div className="p-8 md:p-14 text-left bg-white overflow-y-auto flex flex-col justify-center">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-[1000] uppercase tracking-tighter italic">
                    ÜYE OL
                  </h1>
                  <p className="text-zinc-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-black italic">
                    MODA DÜNYAMIZA KATIL
                  </p>
                </div>
                <Link to="/login" className="flex items-center gap-1 group">
                  <span className="text-[10px] font-black uppercase border-b-2 border-black">
                    GİRİŞ YAP
                  </span>
                  <RiArrowRightSLine className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                    AD SOYAD
                  </label>
                  <div className="relative group">
                    <RiUserLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                    <Input
                      {...register("fullName")}
                      placeholder="AD SOYAD"
                      className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs uppercase ${errors.fullName ? "ring-2 ring-red-500" : ""}`}
                    />
                  </div>
                  {errors.fullName && (
                    <span className="absolute -bottom-5 left-2 text-[8px] font-black text-red-600 uppercase italic">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                    E-POSTA
                  </label>
                  <div className="relative group">
                    <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="ornek@mail.com"
                      className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs ${errors.email ? "ring-2 ring-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <span className="absolute -bottom-5 left-2 text-[8px] font-black text-red-600 uppercase italic">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="ŞİFRE"
                      className={`!bg-brand-soft !border-none !rounded-[20px] px-6 py-5 font-black text-xs tracking-widest ${errors.password ? "ring-2 ring-red-500" : ""}`}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="TEKRAR"
                      className={`!bg-brand-soft !border-none !rounded-[20px] px-6 py-5 font-black text-xs tracking-widest ${errors.confirmPassword ? "ring-2 ring-red-500" : ""}`}
                    />
                  </div>
                </div>
                {(errors.password || errors.confirmPassword) && (
                  <span className="text-[8px] font-black text-red-600 uppercase italic ml-2">
                    {errors.password?.message ||
                      errors.confirmPassword?.message}
                  </span>
                )}

                {passwordValue && (
                  <div className="px-2 space-y-2">
                    <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase italic">
                      <span>Şifre Gücü</span>
                      <span>
                        {passwordStrength < 66
                          ? "Zayıf"
                          : passwordStrength < 100
                            ? "Orta"
                            : "Güçlü"}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${passwordStrength < 66 ? "bg-red-500" : passwordStrength < 100 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 px-2 pt-2 relative">
                  <input
                    type="checkbox"
                    {...register("acceptTerms")}
                    id="acceptTerms"
                    className="mt-1 accent-black w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider italic leading-relaxed cursor-pointer"
                  >
                    <span className="text-black">Kullanım Şartları</span> ve{" "}
                    <span className="text-black">KVKK</span> onaylıyorum.
                  </label>
                  {errors.acceptTerms && (
                    <p className="absolute -bottom-4 left-2 text-red-600 text-[8px] italic font-black uppercase">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    disabled={!isValid || isLoading}
                    className={`w-full !rounded-[20px] !py-6 !text-[11px] tracking-[0.4em] italic transition-all ${!isValid || isLoading ? "opacity-30 grayscale cursor-not-allowed" : "hover:scale-[1.02] active:scale-95 shadow-xl"}`}
                  >
                    {isLoading ? "İŞLENİYOR..." : "KAYIT OL VE KEŞFET →"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <CodeVerify
              target={emailValue}
              isLoading={isLoading}
              onConfirm={handleVerificationSuccess}
              onBack={() => setStep(1)}
              onResend={() =>
                toast.info("YENİ KOD GÖNDERİLDİ!", { theme: "dark" })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
