import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { RiMailLine } from "react-icons/ri";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const footerSchema = yup
  .object({
    email: yup
      .string()
      .email("Geçerli bir mail giriniz")
      .required("E-posta zorunlu"),
  })
  .required();

const Footer: React.FC = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(footerSchema),
  });

  const onFooterSubmit = () => {
    toast.success("Başarıyla abone olundu!", { theme: "dark" });
    reset();
  };

  const FOOTER_GROUPS = [
    {
      title: "KURUMSAL",
      links: ["Hakkımızda", "Kariyer", "Mağazalarımız", "Basın"],
    },
    {
      title: "DESTEK",
      links: ["Müşteri Hizmetleri", "Teslimat", "İade Koşulları", "Gizlilik"],
    },
    {
      title: "ÜYELİK",
      links: ["Hesabım", "Siparişlerim", "Ödeme Yöntemleri", "Elite Üyelik"],
    },
    {
      title: "KAYNAKLAR",
      links: ["Stil Rehberi", "Blog", "Hizmet Şartları", "Kuponlar"],
    },
  ];

  return (
    <footer className="bg-brand-gray pt-48 pb-12 relative mt-40 w-full font-satoshi text-left">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-7xl bg-black rounded-[40px] p-8 md:p-14 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-800/30 rounded-full -mr-32 -mt-32 blur-3xl" />
        <h2 className="text-white text-4xl md:text-6xl font-[1000] leading-[0.9] uppercase tracking-tighter italic lg:max-w-2xl z-10">
          EN SON TEKLİFLERİMİZDEN <br />{" "}
          <span className="text-zinc-600">HABERDAR OLUN</span>
        </h2>
        <form
          onSubmit={handleSubmit(onFooterSubmit)}
          className="w-full md:w-[420px] space-y-4 z-10"
        >
          <div className="relative group">
            <RiMailLine className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-black transition-colors" />
            <Input
              {...register("email")}
              placeholder="Email adresiniz..."
              className="pl-16 bg-white !rounded-full py-5 font-black border-none text-xs uppercase tracking-widest shadow-xl focus:ring-4 focus:ring-zinc-800/20"
            />
          </div>
          <Button
            type="submit"
            variant="white"
            size="xl"
            className="w-full !py-5 !text-[11px] tracking-[0.4em] shadow-2xl hover:scale-[1.02] italic"
          >
            ABONELİĞİ BAŞLAT
          </Button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-6 gap-12 mt-12 border-b border-black/5 pb-20">
        <div className="col-span-2 space-y-10">
          <h3 className="text-4xl font-[1000] tracking-tighter text-black uppercase italic">
            SHOP.CO
          </h3>
          <p className="text-gray-500 max-w-[320px] text-xs font-black leading-relaxed uppercase tracking-wider italic opacity-80">
            Tarzınıza uyan ve giymekten gurur duyacağınız en kaliteli parçaları
            sizin için seçiyoruz.
          </p>
          <div className="flex gap-4">
            {[FaTwitter, FaFacebookF, FaInstagram, FaGithub].map((Icon, i) => (
              <span
                key={i}
                className="w-11 h-11 bg-white border border-black/5 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl cursor-pointer hover:-translate-y-2 duration-300"
              >
                <Icon size={18} />
              </span>
            ))}
          </div>
        </div>
        {FOOTER_GROUPS.map((group) => (
          <div key={group.title} className="space-y-8">
            <h4 className="font-[1000] uppercase text-[11px] tracking-[0.3em] text-black italic">
              {group.title}
            </h4>
            <ul className="text-gray-400 space-y-5 text-[11px] font-black uppercase tracking-widest italic">
              {group.links.map((link) => (
                <li
                  key={link}
                  className="hover:text-black cursor-pointer transition-all hover:translate-x-2 duration-300"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <p className="text-gray-400 text-[10px] font-[1000] uppercase tracking-widest italic leading-none">
            Shop.co © 2026, Elite Lifestyle Platform
          </p>
        </div>
        <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 duration-500">
          {[
            "Badge-1.png",
            "Badge-2.png",
            "Badge-3.png",
            "Badge-4.png",
            "Badge-5.png",
          ].map((b, i) => (
            <div
              key={i}
              className="w-[50px] h-[32px] bg-white border border-black/10 rounded-lg flex items-center justify-center shadow-sm p-1.5"
            >
              <img
                src={`/${b}`}
                alt="Payment"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
