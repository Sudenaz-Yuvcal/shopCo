import React, { useState, useMemo, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/schemas";

import Button from "../components/Ui/Button";
import Input from "../components/Ui/Input";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "../components/Ui/LoadingOverlay";
import CodeVerify from "../components/Verification/CodeVerify";
import {
  RiMailLine,
  RiUserLine,
  RiArrowRightSLine,
  RiSparklingLine,
  RiShieldCheckLine,
  RiPhoneLine,
} from "react-icons/ri";
import { supabase } from "../lib/supabase";
import {
  TermsText,
  LightingText,
  PrivacyText,
} from "../components/Registration/LegalTexts";
import { PatternFormat } from "react-number-format";

interface IRegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  lightingText: boolean;
  privacyPolicy: boolean;
  marketingConsent: boolean;
}

type ModalType = "terms" | "lighting" | "privacy" | null;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<IRegisterForm | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 5;
    if (isBottom) setIsScrolledToBottom(true);
  };

  useEffect(() => {
    setIsScrolledToBottom(false);
  }, [activeModal]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    setError,
    formState: { errors, isValid },
  } = useForm<IRegisterForm>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      marketingConsent: false,
      acceptTerms: false,
      lightingText: false,
      privacyPolicy: false,
    },
  });

  const passwordValue = watch("password", "");
  const termsVal = watch("acceptTerms");
  const lightingVal = watch("lightingText");
  const privacyVal = watch("privacyPolicy");

  const passwordStrength = useMemo(() => {
    if (!passwordValue) return 0;
    let strength = 0;
    if (passwordValue.length >= 8) strength += 33;
    if (/[A-Z]/.test(passwordValue)) strength += 33;
    if (/[0-9]/.test(passwordValue)) strength += 34;
    return strength;
  }, [passwordValue]);

  const openModal = (e: React.MouseEvent, type: ModalType) => {
    e.preventDefault();
    setActiveModal(type);
  };

  const confirmFromModal = async (type: ModalType) => {
    if (!type) return;
    const fieldMap: Record<string, keyof IRegisterForm> = {
      terms: "acceptTerms",
      lighting: "lightingText",
      privacy: "privacyPolicy",
    };
    setValue(fieldMap[type], true);
    await trigger(fieldMap[type]);
    setActiveModal(null);
  };

  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    setIsLoading(true);
    try {
      const { data: bannedUser } = await supabase
        .from("users")
        .select("is_active")
        .eq("email", data.email.trim().toLowerCase())
        .single();

      if (bannedUser && bannedUser.is_active === false) {
        toast.error("BU E-POSTA ADRESİ ENGELLENMİŞTİR. KAYIT YAPILAMAZ!", {
          theme: "dark",
          style: { border: "2px solid #ef4444" },
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            membership: "Elite",
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setError("email", {
            type: "manual",
            message: "BU E-POSTA ZATEN KAYITLI.",
          });
          return;
        }
        throw error;
      }

      setFormData(data);
      setStep(2);
      toast.info("DOĞRULAMA KODU E-POSTA ADRESİNİZE GÖNDERİLDİ.", {
        theme: "dark",
      });
    } catch (error: unknown) {
      let errorMessage = "BİR HATA OLUŞTU";
      let status: number | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        if ("status" in error) {
          status = (error as { status: number }).status;
        }
      }

      const isRateLimit = status === 429 || errorMessage.includes("429");

      toast.error(
        isRateLimit
          ? "ÇOK FAZLA DENEME. LÜTFEN BEKLEYİN."
          : errorMessage.toUpperCase(),
        {
          theme: "dark",
          className: "font-black italic text-xs uppercase",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async (code: string) => {
    if (!formData) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: code,
        type: "signup",
      });

      if (error) throw error;

      if (data.user) {
        const nameParts = formData.fullName.trim().split(" ");
        const firstName = nameParts[0].toUpperCase();
        const lastName =
          nameParts.length > 1
            ? nameParts.slice(1).join(" ").toUpperCase()
            : "ÜYE";

        const userData = {
          id: data.user.id,
          name: firstName,
          surname: lastName,
          email: formData.email.toLowerCase(),
          membership: "Elite" as const,
        };

        login(userData);
        localStorage.setItem("shopco_user", JSON.stringify(userData));

        toast.success("ELITE DÜNYASINA HOŞ GELDİN!", { theme: "dark" });
        navigate("/");
      }
    } catch (error: unknown) {
      let errorMessage = "KOD GEÇERSİZ VEYA SÜRESİ DOLMUŞ";

      if (error instanceof Error && error.message) {
        errorMessage = error.message.toUpperCase();
      }

      toast.error(errorMessage, {
        theme: "dark",
        className: "font-black italic text-xs uppercase",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative font-satoshi overflow-hidden px-4">
      <Helmet>
        <title>Elite Üyelik | SHOP.CO</title>
      </Helmet>
      {isLoading && <LoadingOverlay message="İŞLENİYOR..." />}

      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b bg-zinc-50 flex justify-between items-center">
              <h3 className="font-black italic uppercase text-sm">
                Yasal Bilgilendirme
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[10px] font-black underline"
              >
                KAPAT
              </button>
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="p-8 max-h-[50vh] overflow-y-auto text-[11px] leading-relaxed text-zinc-600 font-medium italic"
            >
              {activeModal === "terms" && <TermsText />}
              {activeModal === "lighting" && <LightingText />}
              {activeModal === "privacy" && <PrivacyText />}
            </div>
            <div className="p-6 border-t bg-zinc-50">
              <Button
                onClick={() => confirmFromModal(activeModal)}
                disabled={!isScrolledToBottom}
                className={`w-full !py-4 !text-[10px] tracking-widest uppercase italic ${!isScrolledToBottom ? "opacity-40" : ""}`}
              >
                OKUDUM, ONAYLIYORUM
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1100px] w-full grid md:grid-cols-2 bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden z-10 my-12">
        <div className="relative bg-black p-12 hidden md:flex flex-col justify-between text-left">
          <div>
            <RiShieldCheckLine className="text-zinc-600 mb-4" size={30} />
            <h2 className="text-5xl lg:text-7xl font-[1000] text-white leading-[0.85] uppercase tracking-tighter italic">
              TARZINI <br /> <span className="text-zinc-700">DÜNYAYA</span>{" "}
              <br /> KONUŞTUR.
            </h2>
          </div>
          <p className="text-zinc-500 text-sm font-bold uppercase italic flex items-center gap-2">
            <RiSparklingLine className="text-yellow-500" /> Elite üyelik ile
            ayrıcalıkları yakala.
          </p>
        </div>

        <div className="p-8 md:p-14 text-left bg-white overflow-y-auto flex flex-col justify-center">
          {step === 1 ? (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8 flex justify-between items-end">
                <h1 className="text-4xl font-[1000] uppercase italic">
                  ÜYE OL
                </h1>
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-[10px] font-black uppercase border-b-2 border-black group"
                >
                  GİRİŞ YAP{" "}
                  <RiArrowRightSLine className="group-hover:translate-x-1" />
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <RiUserLine className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <Input
                      {...register("fullName")}
                      placeholder="AD SOYAD"
                      className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs uppercase ${errors.fullName ? "ring-1 ring-red-500" : ""}`}
                    />
                  </div>
                  <div className="relative">
                    <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="E-POSTA"
                      className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs ${errors.email ? "ring-1 ring-red-500" : ""}`}
                    />
                  </div>
                  <div className="relative">
                    <RiPhoneLine className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 z-10" />
                    <PatternFormat
                      format="0### ### ## ##"
                      mask="_"
                      customInput={Input}
                      getInputRef={register("phone").ref}
                      onValueChange={(values) =>
                        setValue("phone", values.value)
                      }
                      type="tel"
                      placeholder="TELEFON (05XX...)"
                      className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs ${errors.phone ? "ring-1 ring-red-500" : ""}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="ŞİFRE"
                    className={`!bg-brand-soft !border-none !rounded-[20px] py-5 font-black text-xs ${errors.password ? "ring-1 ring-red-500" : ""}`}
                  />
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="TEKRAR"
                    className={`!bg-brand-soft !border-none !rounded-[20px] py-5 font-black text-xs ${errors.confirmPassword ? "ring-1 ring-red-500" : ""}`}
                  />
                </div>

                {passwordValue && (
                  <div className="px-2 space-y-2">
                    <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${passwordStrength < 66 ? "bg-red" : passwordStrength < 100 ? "bg-yellow-500" : "bg-green"}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  {Object.values(errors).map((err, index) => (
                    <p
                      key={index}
                      className="text-[9px] text-red-500 font-extrabold italic px-2"
                    >
                      ! {err.message}
                    </p>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-50 mt-4">
                  <div className="flex items-center gap-3 px-2">
                    <input
                      type="checkbox"
                      {...register("marketingConsent")}
                      className="accent-black w-3 h-3 cursor-pointer"
                    />
                    <label className="text-[9px] font-bold text-zinc-400 uppercase italic">
                      Kampanyalardan haberdar olmak istiyorum.
                    </label>
                  </div>
                  {[
                    {
                      id: "terms",
                      label: "Kullanım Şartlarını Onaylıyorum *",
                      val: termsVal,
                    },
                    {
                      id: "lighting",
                      label: "Aydınlatma Metnini Onaylıyorum *",
                      val: lightingVal,
                    },
                    {
                      id: "privacy",
                      label: "Gizlilik Beyanını Onaylıyorum *",
                      val: privacyVal,
                    },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-2">
                      <input
                        type="checkbox"
                        checked={item.val}
                        readOnly
                        onClick={(e) => openModal(e, item.id as ModalType)}
                        className="accent-black w-3 h-3 cursor-pointer"
                      />
                      <label
                        onClick={(e) => openModal(e, item.id as ModalType)}
                        className="text-[9px] font-bold text-black uppercase italic cursor-pointer underline decoration-zinc-300"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`w-full !rounded-[20px] !py-6 !text-[11px] tracking-[0.4em] italic ${!isValid || isLoading ? "opacity-30 grayscale" : "hover:scale-[1.02] shadow-xl"}`}
                >
                  {isLoading ? "İŞLENİYOR..." : "KAYIT OL VE KEŞFET →"}
                </Button>
              </form>
            </div>
          ) : (
            <CodeVerify
              target={formData?.email || ""}
              isLoading={isLoading}
              onConfirm={handleVerificationSuccess}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
