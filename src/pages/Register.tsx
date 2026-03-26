import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/schemas";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {
  RiMailLine,
  RiUserLine,
  RiArrowRightSLine,
  RiSparklingLine,
  RiShieldCheckLine,
} from "react-icons/ri";

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
    const nameParts = data.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "ÜYE";

    setTimeout(() => {
      login({
        name: firstName.toUpperCase(),
        surname: lastName.toUpperCase(),
        email: data.email.toLowerCase(),
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
      {isLoading && <LoadingOverlay message="HESABINIZ HAZIRLANIYOR..." />}

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-60" />

      <div className="max-w-[1100px] w-full grid md:grid-cols-2 bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden z-10 my-12 relative">
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

        <div className="p-8 md:p-14 text-left bg-white overflow-y-auto">
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
            <div className="space-y-2">
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
                {errors.fullName && (
                  <span className="absolute -bottom-5 left-2 text-[8px] font-black text-red-600 uppercase">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                E-POSTA
              </label>
              <div className="relative group">
                <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="ornek@mail.com"
                  onChange={(e) => {
                    e.target.value = e.target.value.toLowerCase();
                    register("email").onChange(e);
                  }}
                  className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs ${errors.email ? "ring-2 ring-red-500" : ""}`}
                />
                {errors.email && (
                  <span className="absolute -bottom-5 left-2 text-[8px] font-black text-red-600 uppercase">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                  ŞİFRE
                </label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`!bg-brand-soft !border-none !rounded-[20px] pl-6 py-5 font-black text-xs tracking-widest ${errors.password ? "ring-2 ring-red-500" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                  TEKRAR
                </label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className={`!bg-brand-soft !border-none !rounded-[20px] pl-6 py-5 font-black text-xs tracking-widest ${errors.confirmPassword ? "ring-2 ring-red-500" : ""}`}
                />
              </div>
            </div>

            {(errors.password || errors.confirmPassword) && (
              <span className="text-[8px] font-black text-red-600 uppercase ml-2">
                {errors.password?.message || errors.confirmPassword?.message}
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

            <div className="flex items-start gap-3 px-2 pt-2">
              <input
                type="checkbox"
                {...register("acceptTerms")}
                id="acceptTerms"
                className="mt-1 accent-black w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="acceptTerms"
                className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider leading-relaxed cursor-pointer"
              >
                <span className="text-black">Kullanım Şartları</span> ve{" "}
                <span className="text-black">KVKK</span> onaylıyorum.
                {errors.acceptTerms && (
                  <p className="text-red-600 text-[8px] mt-1 italic">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                disabled={!isValid || isLoading}
                className={`w-full !rounded-[20px] !py-6 !text-[11px] tracking-[0.4em] italic transition-all ${
                  !isValid || isLoading
                    ? "opacity-30 grayscale cursor-not-allowed"
                    : "hover:scale-[1.02] active:scale-95 shadow-xl"
                }`}
              >
                {isLoading ? "İŞLENİYOR..." : "KAYIT OL VE KEŞFET →"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
