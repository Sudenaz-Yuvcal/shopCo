import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiUserLine,
  RiArrowRightSLine,
  RiSparklingLine,
} from "react-icons/ri";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (name: string, value: string) => {
    let error = "";
    const cleanValue = value.trim();

    if (name === "email") {
      if (cleanValue.includes(" ")) error = "BOŞLUK BIRAKILAMAZ.";
      else if (/[çğıöşüÇĞİÖŞÜ]/.test(cleanValue))
        error = "TÜRKÇE KARAKTER KULLANILAMAZ.";
      else if (/[A-Z]/.test(cleanValue)) error = "SADECE KÜÇÜK HARF KULLANIN.";
      else if (
        cleanValue &&
        !/@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/.test(cleanValue)
      )
        error = "GEÇERLİ BİR KURUMSAL UZANTI GİRİN.";
    } else if (name === "password") {
      if (cleanValue.length < 8) error = "EN AZ 8 KARAKTER OLMALI.";
      else if (!/[A-Z]/.test(cleanValue)) error = "BİR BÜYÜK HARF İÇERMELİ.";
      else if (!/[0-9]/.test(cleanValue)) error = "BİR SAYI İÇERMELİ.";
    } else if (name === "confirmPassword") {
      if (cleanValue !== formData.password) error = "ŞİFRELER EŞLEŞMİYOR.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim().includes(" ") &&
      formData.email.trim() !== "" &&
      formData.password !== "" &&
      formData.confirmPassword !== "" &&
      Object.values(errors).every((x) => x === "")
    );
  }, [formData, errors]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);

      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0].toUpperCase();
      const lastName = nameParts.slice(1).join(" ").toUpperCase() || "ÜYE";

      setTimeout(() => {
        login({
          name: firstName,
          surname: lastName,
          email: formData.email.toLowerCase(),
          address: "",
          membership: "Elite",
        });

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 2);
        localStorage.setItem("is_new_registrant", "true");
        localStorage.setItem("welcome_coupon_expiry", expiryDate.toISOString());

        toast.success("HOŞ GELDİN! %50 İNDİRİMİN SEPETİNDE.", {
          theme: "dark",
          icon: <RiSparklingLine className="text-yellow-400" />,
        });

        navigate("/", { state: { isNewUser: true } });
      }, 2000);
    } else {
      toast.error("LÜTFEN TÜM ALANLARI DOĞRU DOLDURUN.", { theme: "dark" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative font-satoshi overflow-hidden px-4">
      <Helmet>
        <title>Yeni Üyelik | SHOP.CO</title>
      </Helmet>

      {isLoading && <LoadingOverlay message="HESABINIZ OLUŞTURULUYOR..." />}

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-100 rounded-full blur-[100px] -ml-20 -mb-20 opacity-40" />

      <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 z-20">
        <Link
          to="/"
          className="text-3xl font-[1000] tracking-tighter text-black uppercase italic leading-none hover:opacity-60 transition-opacity"
        >
          SHOP.CO
        </Link>
      </div>

      <div className="max-w-[1100px] w-full grid md:grid-cols-2 bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden z-10 my-12 relative">
        <div className="relative bg-black p-12 hidden md:flex flex-col justify-between items-start text-left">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">
              ELITE KATILIN
            </span>
            <h2 className="text-5xl lg:text-7xl font-[1000] text-white leading-[0.85] uppercase tracking-tighter italic mt-6">
              TARZINI <br />
              <span className="text-zinc-700">DÜNYAYA</span> <br />
              KONUŞTUR.
            </h2>
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-zinc-500 text-sm font-bold leading-relaxed max-w-[280px] uppercase tracking-wider italic">
              İlk alışverişine özel sürpriz hediyeler ve VIP koleksiyonlar için
              yerini al.
            </p>
            <div className="w-16 h-[2px] bg-zinc-800" />
          </div>
        </div>

        <div className="p-8 md:p-14 lg:p-20 text-left bg-white overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-[1000] uppercase tracking-tighter text-black italic leading-none">
                ÜYE OL
              </h1>
              <p className="text-zinc-400 text-[10px] mt-4 uppercase tracking-[0.2em] font-black italic">
                MODA DÜNYAMIZA KATIL
              </p>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-2 text-black hover:opacity-50 transition-all group pb-1"
            >
              <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black">
                GİRİŞ YAP
              </span>
              <RiArrowRightSLine className="text-xl group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                AD SOYAD
              </label>
              <div className="relative group">
                <RiUserLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                <Input
                  name="fullName"
                  placeholder="ADINIZ VE SOYADINIZ"
                  onChange={handleChange}
                  className="!bg-[#F9F9F9] !border-none !rounded-[20px] pl-16 py-5 font-black text-xs uppercase tracking-[0.1em] focus:ring-2 focus:ring-black transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                E-POSTA
              </label>
              <div className="relative group">
                <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                <Input
                  name="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  onChange={handleChange}
                  className={`!bg-[#F9F9F9] !border-none !rounded-[20px] pl-16 py-5 font-black text-xs uppercase tracking-[0.1em] focus:ring-2 focus:ring-black transition-all ${errors.email ? "ring-2 ring-red-500 bg-red-50/20" : ""}`}
                  required
                />
                {errors.email && (
                  <span className="absolute -bottom-5 left-2 text-[9px] font-black text-red-600 uppercase tracking-widest">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                  ŞİFRE
                </label>
                <div className="relative group">
                  <RiLockPasswordLine className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-zinc-300 group-focus-within:text-black transition-colors" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className={`!bg-[#F9F9F9] !border-none !rounded-[20px] pl-14 py-5 font-black text-xs tracking-widest focus:ring-2 focus:ring-black transition-all ${errors.password ? "ring-2 ring-red-500 bg-red-50/20" : ""}`}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2 italic">
                  TEKRAR
                </label>
                <div className="relative group">
                  <RiLockPasswordLine className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-zinc-300 group-focus-within:text-black transition-colors" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className={`!bg-[#F9F9F9] !border-none !rounded-[20px] pl-14 py-5 font-black text-xs tracking-widest focus:ring-2 focus:ring-black transition-all ${errors.confirmPassword ? "ring-2 ring-red-500 bg-red-50/20" : ""}`}
                    required
                  />
                </div>
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block text-center mt-2">
                {errors.password || errors.confirmPassword}
              </span>
            )}

            <div className="pt-6">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                disabled={!isFormValid || isLoading}
                className={`w-full !rounded-[20px] !py-6 !text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all ${!isFormValid || isLoading ? "opacity-30 grayscale cursor-not-allowed" : "hover:scale-[1.02] hover:bg-zinc-900 active:scale-95"}`}
              >
                KAYIT OL VE KEŞFET →
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
