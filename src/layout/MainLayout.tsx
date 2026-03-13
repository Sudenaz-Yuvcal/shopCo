import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import PromoModal from "../components/home/PromoModal";
import WelcomeGift from "../components/home/WelcomeGift";
import WheelOfFortune from "../components/WheelOfFortune";
import CookieBanner from "../components/ui/CookieBanner";
import type {Product} from  "../types/product";

import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import {
  RiMailLine,
  RiShoppingCart2Line,
  RiUserLine,
  RiSearchLine,
  RiArrowDownSLine,
  RiCloseLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { HiMenuAlt1 } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { ALL_PRODUCTS } from "../constants/Product";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
};

const footerSchema = yup
  .object({
    email: yup
      .string()
      .email("Geçerli bir mail giriniz")
      .required("E-posta zorunlu"),
  })
  .required();

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const hideNavbarPaths = ["/register", "/password", "/login"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const normalizedSearch = normalizeString(searchTerm);

      const filtered = ALL_PRODUCTS.filter((product: Product) => {
        const productName = normalizeString(product.name);
        const productCategory = normalizeString(product.category);
        const productBrand = normalizeString(product.brand || "");

        return (
          productName.includes(normalizedSearch) ||
          productCategory.includes(normalizedSearch) ||
          productBrand.includes(normalizedSearch)
        );
      }).slice(0, 6);

      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductClick = (productId: number) => {
    setIsSearchOpen(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  const handleSeeAll = () => {
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(footerSchema),
  });

  const onFooterSubmit = (_data: { email: string }) => {
    toast.success("Başarıyla abone olundu!", { theme: "dark" });
    reset();
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen relative">
      <PromoModal />
      <WelcomeGift />

      <div className="flex flex-col min-h-screen w-full bg-white font-satoshi overflow-x-hidden">
        {!shouldHideNavbar && (
          <header className="w-full sticky top-0 z-50 shadow-sm md:shadow-none bg-white">
            {showBanner && (
              <div className="w-full bg-black text-white py-2.5 px-4 relative">
                <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
                  <p className="text-[10px] md:text-xs font-light tracking-wide italic">
                    İlk siparişinde %20 indirim kazanmak için kayıt ol.
                    <Link
                      to="/register"
                      className="font-[1000] underline ml-2 hover:opacity-80 transition-opacity italic"
                    >
                      Hemen Kaydol
                    </Link>
                  </p>
                </div>
                <Button
                  onClick={() => setShowBanner(false)}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 !w-8 !h-8 !p-0 !bg-transparent !border-none !shadow-none text-white hover:rotate-90"
                >
                  <RiCloseLine size={18} />
                </Button>
              </div>
            )}

            <nav className="w-full h-20 border-b border-gray-100 bg-white">
              <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-10">
                <div className="flex items-center gap-4 shrink-0">
                  <Button
                    variant="white"
                    size="sm"
                    onClick={() => setIsMenuOpen(true)}
                    className="md:hidden !p-2 -ml-2 !bg-transparent !border-none !shadow-none hover:!bg-gray-50"
                  >
                    <HiMenuAlt1 size={28} className="text-black" />
                  </Button>
                  <WheelOfFortune />
                  <Link to="/" className="text-3xl font-[1000] italic">
                    SHOP.CO
                  </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 text-black font-[1000] uppercase text-[11px] tracking-widest shrink-0">
                  <div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setIsShopOpen(true)}
                    onMouseLeave={() => setIsShopOpen(false)}
                  >
                    <div className="flex items-center gap-1 hover:text-gray-400 transition-colors py-2 italic">
                      <span>Mağaza</span>
                      <RiArrowDownSLine
                        className={`transition-transform duration-300 ${isShopOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                    {isShopOpen && (
                      <div className="absolute top-full left-0 w-56 bg-white border border-black/5 shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                          {["Erkek", "Kadın", "Çocuk"].map((cat) => (
                            <Link
                              key={cat}
                              to={`/shop?category=${cat}`}
                              className="block px-4 py-3 hover:bg-black hover:text-white rounded-xl transition-all font-black text-[10px] italic uppercase tracking-tighter"
                            >
                              {cat} Giyim
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/discount"
                    className="hover:text-red-600 transition-colors italic"
                  >
                    İndirim
                  </Link>
                  <Link
                    to="/newproduct"
                    className="hover:text-gray-400 transition-colors italic"
                  >
                    Yeni Gelenler
                  </Link>
                  <Link
                    to="/brands"
                    className="hover:text-gray-400 transition-colors italic"
                  >
                    Markalar
                  </Link>
                </div>

                <div
                  className="hidden lg:block flex-1 relative max-w-md"
                  ref={searchRef}
                >
                  <div className="relative group">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSeeAll()}
                      placeholder="ZARA, GUCCI, CALVIN ARA..."
                      className="!py-3 pl-12 w-full text-[10px] bg-[#F0F0F0] border-none !rounded-full font-black tracking-widest focus:ring-2 focus:ring-black transition-all"
                    />
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg group-focus-within:opacity-100 group-focus-within:text-black transition-all" />
                    {searchTerm && (
                      <Button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 !w-6 !h-6 !p-0 !bg-transparent !border-none !shadow-none opacity-40 hover:opacity-100"
                      >
                        <RiCloseLine size={18} />
                      </Button>
                    )}
                  </div>

                  {isSearchOpen && (
                    <div className="absolute top-full left-0 w-full mt-3 bg-white border border-black/10 rounded-[30px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="p-3">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] px-3 mb-2">
                              Arama Sonuçları
                            </p>
                            {searchResults.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => handleProductClick(p.id)}
                                className="flex items-center gap-4 p-3 hover:bg-[#F9F9F9] rounded-[20px] cursor-pointer transition-all group"
                              >
                                <img
                                  src={p.image}
                                  className="w-14 h-14 bg-[#F0EEED] rounded-xl overflow-hidden shrink-0 border border-black/5"
                                  alt=""
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-[1000] text-[11px] uppercase italic truncate text-black">
                                    {p.name}
                                  </h4>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                    {p.category} | {p.brand}
                                  </p>
                                </div>
                                <p className="font-[1000] text-sm italic tracking-tighter text-black">
                                  ${p.value}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="primary"
                            size="md"
                            onClick={handleSeeAll}
                            className="w-full !p-4 !text-[10px] tracking-[0.4em] italic"
                          >
                            TÜM KOLEKSİYONU GÖR →
                          </Button>
                        </>
                      ) : (
                        <div className="p-10 text-center">
                          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                            Sonuç bulunamadı.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 md:gap-6 shrink-0">
                  <Link
                    to="/cart"
                    className="relative text-2xl hover:scale-110 transition-transform"
                  >
                    <RiShoppingCart2Line />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-5.5 h-5.5 px-1.5 rounded-full flex items-center justify-center font-[1000] animate-bounce border-2 border-white shadow-lg">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  {user ? (
                    <Link
                      to="/account"
                      className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[11px] font-black border-2 border-black/10 shadow-xl hover:scale-110 transition-all uppercase italic"
                    >
                      {user.name[0]}
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      <RiUserLine />
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </header>
        )}

        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-0 left-0 w-[85%] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <span className="text-2xl font-[1000] italic uppercase tracking-tighter">
                  SHOP.CO
                </span>
                <Button
                  variant="primary"
                  onClick={() => setIsMenuOpen(false)}
                  className="!w-10 !h-10 !p-0 shadow-lg"
                >
                  <RiCloseLine size={24} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-10 font-satoshi">
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase">
                    Reyonlar
                  </p>
                  {["Erkek", "Kadın", "Çocuk"].map((item) => (
                    <Link
                      key={item}
                      to={`/shop?category=${item}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex justify-between items-center text-4xl font-[1000] uppercase italic tracking-tighter"
                    >
                      {item} <RiArrowRightSLine className="opacity-10" />
                    </Link>
                  ))}
                </div>
                <div className="space-y-6 pt-10 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase">
                    Fırsatlar
                  </p>
                  <Link
                    to="/discount"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-4xl font-[1000] uppercase italic tracking-tighter text-red-600"
                  >
                    İNDİRİM
                  </Link>
                  <Link
                    to="/newproduct"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-4xl font-[1000] uppercase italic tracking-tighter"
                  >
                    YENİ GELENLER
                  </Link>
                  <Link
                    to="/brands"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-4xl font-[1000] uppercase italic tracking-tighter"
                  >
                    MARKALAR
                  </Link>
                </div>
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <Link
                  to={user ? "/account" : "/login"}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-black text-white py-5 rounded-full font-[1000] uppercase text-center block tracking-[0.3em] text-[11px] shadow-xl italic"
                >
                  {user ? "KONTROL PANELİ" : "GİRİŞ YAP"}
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="flex-grow flex flex-col w-full relative">
          <Outlet />
        </main>

        <footer className="bg-[#F0F0F0] pt-48 pb-12 relative mt-40 w-full font-satoshi text-left">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-7xl bg-black rounded-[40px] p-8 md:p-14 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-800/30 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-zinc-800/20 rounded-full -ml-20 -mb-20 blur-3xl" />

            <h2 className="text-white text-4xl md:text-6xl font-[1000] leading-[0.9] uppercase tracking-tighter italic lg:max-w-2xl z-10">
              EN SON TEKLİFLERİMİZDEN <br />
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
                Tarzınıza uyan ve giymekten gurur duyacağınız en kaliteli
                parçaları sizin için seçiyoruz. Sokak modasının kalbi burada
                atıyor.
              </p>
              <div className="flex gap-4">
                {[FaTwitter, FaFacebookF, FaInstagram, FaGithub].map(
                  (Icon, i) => (
                    <span
                      key={i}
                      className="w-11 h-11 bg-white border border-black/5 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl cursor-pointer hover:-translate-y-2 duration-300"
                    >
                      <Icon size={18} />
                    </span>
                  ),
                )}
              </div>
            </div>

            {[
              {
                title: "KURUMSAL",
                links: ["Hakkımızda", "Kariyer", "Mağazalarımız", "Basın"],
              },
              {
                title: "DESTEK",
                links: [
                  "Müşteri Hizmetleri",
                  "Teslimat",
                  "İade Koşulları",
                  "Gizlilik",
                ],
              },
              {
                title: "ÜYELİK",
                links: [
                  "Hesabım",
                  "Siparişlerim",
                  "Ödeme Yöntemleri",
                  "Elite Üyelik",
                ],
              },
              {
                title: "KAYNAKLAR",
                links: ["Stil Rehberi", "Blog", "Hizmet Şartları", "Kuponlar"],
              },
            ].map((group) => (
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
            <div className="space-y-1 text-center md:text-left">
              <p className="text-gray-400 text-[10px] font-[1000] uppercase tracking-widest italic leading-none">
                Shop.co © 2026, Elite Lifestyle Platform
              </p>
              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.5em]">
                BUILT WITH PRIDE
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
        <CookieBanner />
      </div>
    </div>
  );
};

export default MainLayout;
