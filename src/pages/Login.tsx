import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { getEmailError, getPasswordError } from "../utils/validation";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiArrowRightSLine,
  RiShieldCheckLine,
} from "react-icons/ri";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailError = useMemo(() => getEmailError(email), [email]);
  const passwordError = useMemo(() => getPasswordError(password), [password]);

  const isFormValid = useMemo(() => {
    return email && password && !emailError && !passwordError;
  }, [email, password, emailError, passwordError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);

      localStorage.removeItem("is_new_registrant");
      localStorage.removeItem("welcome_coupon_expiry");

      setTimeout(() => {
        login({
          name: email.split("@")[0].toUpperCase(),
          surname: "ÜYE",
          email: email,
          membership: "Standard",
        });

        toast.success("OTURUM AÇILDI, HESABIN YÜKLENİYOR...", {
          theme: "dark",
        });
        navigate("/account");
      }, 1500);
    } else {
      toast.error("LÜTFEN BİLGİLERİ KONTROL EDİN.", { theme: "dark" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative font-satoshi overflow-hidden px-4">
      <Helmet>
        <title>Giriş Yap | SHOP.CO</title>
      </Helmet>

      {isLoading && <LoadingOverlay message="KİMLİK DOĞRULANIYOR..." />}

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
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <RiShieldCheckLine className="text-zinc-500" size={20} />
              <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">
                SECURE ACCESS
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-[1000] text-white leading-[0.85] uppercase tracking-tighter italic">
              STİLİNE <br />
              <span className="text-zinc-700 underline decoration-zinc-800 underline-offset-8">
                GERİ DÖN.
              </span>
            </h2>
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-zinc-500 text-sm font-bold leading-relaxed max-w-[280px] uppercase tracking-wider italic">
              Kürate edilmiş koleksiyonlar ve Elite üyelik ayrıcalıkları seni
              bekliyor.
            </p>
            <div className="w-16 h-[2px] bg-zinc-800" />
          </div>
        </div>

        <div className="p-8 md:p-16 lg:p-24 text-left bg-white">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-[1000] uppercase tracking-tighter text-black italic leading-none">
                GİRİŞ YAP
              </h1>
              <p className="text-zinc-400 text-[10px] mt-4 uppercase tracking-[0.2em] font-black italic">
                MODA DÜNYANA ADIM AT
              </p>
            </div>
            <Link
              to="/register"
              className="flex items-center gap-2 text-black hover:opacity-50 transition-all group pb-1"
            >
              <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black">
                KAYIT OL
              </span>
              <RiArrowRightSLine className="text-xl group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">
                E-POSTA (MAİL)
              </label>
              <div className="relative group">
                <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="ornek@gmail.com"
                  className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs uppercase tracking-[0.1em] focus:ring-2 focus:ring-black transition-all ${emailError ? "ring-2 ring-red-500 bg-red-50/30" : ""}`}
                  required
                />
                {emailError && (
                  <span className="absolute -bottom-6 left-2 text-[9px] font-black text-red-600 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                    {emailError}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  GÜVENLİK (ŞİFRE)
                </label>
                <Link
                  to="/password"
                  className="text-[9px] text-zinc-300 hover:text-black transition-colors font-black uppercase tracking-widest italic"
                >
                  ŞİFREMİ UNUTTUM
                </Link>
              </div>
              <div className="relative group">
                <RiLockPasswordLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-zinc-300 group-focus-within:text-black transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`!bg-brand-soft !border-none !rounded-[20px] pl-16 py-5 font-black text-xs tracking-widest focus:ring-2 focus:ring-black transition-all ${passwordError ? "ring-2 ring-red-500 bg-red-50/30" : ""}`}
                  required
                />
                {passwordError && (
                  <span className="absolute -bottom-6 left-2 text-[9px] font-black text-red-600 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                    {passwordError}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                disabled={!isFormValid || isLoading}
                className={`w-full !rounded-[20px] !py-6 !text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all ${
                  !isFormValid || isLoading
                    ? "opacity-30 grayscale cursor-not-allowed"
                    : "hover:scale-[1.02] hover:bg-zinc-900 active:scale-95"
                }`}
              >
                GİRİŞ YAP VE KEŞFET →
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
