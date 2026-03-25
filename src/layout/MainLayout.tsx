import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { RiCloseLine, RiArrowRightSLine } from "react-icons/ri";
import PromoModal from "../sections/home/promo-modal";
import WelcomeGift from "../sections/home/welcome-gift";
import CookieBanner from "./CookieBanner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "../components/ui/Button";
import { useUser } from "../context/UserContext";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const hideLayoutPaths = ["/register", "/password", "/login"];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen relative font-satoshi bg-white overflow-x-hidden">
       <PromoModal />
      <WelcomeGift />

      {!shouldHideLayout && (
        <Navbar
          setIsMenuOpen={setIsMenuOpen}
          showBanner={showBanner}
          setShowBanner={setShowBanner}
        />
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
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
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

      {!shouldHideLayout && <Footer />}

      <CookieBanner />
    </div>
  );
};

export default MainLayout;
