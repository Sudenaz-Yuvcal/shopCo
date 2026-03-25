import { useState, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useOrder } from "../context/OrderContext";
import { Helmet } from "react-helmet-async";
import {
  FiPackage,
  FiUser,
  FiSettings,
  FiCreditCard,
  FiStar,
  FiMapPin,
  FiLock,
  FiPlus,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import AccountSidebar from "../sections/account/account-sidebar";
import OrdersSection from "../sections/account/orders-section";
import LogoutModal from "../sections/account/logout-modal";

const Account = () => {
  const { user, logout } = useUser();
  const { orders } = useOrder();
  const [activeTab, setActiveTab] = useState("siparislerim");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const totalSpent = useMemo(
    () => orders.reduce((acc, o) => acc + o.total, 0),
    [orders],
  );
  const membershipTier = totalSpent > 5000 ? "PLATINUM" : "ELITE";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-satoshi animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <FiLock size={32} className="opacity-20 text-black" />
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-zinc-400 text-sm italic">
          Erişim Kısıtlı
        </p>
        <Link
          to="/login"
          className="mt-6 px-10 py-4 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
        >
          Giriş Sayfasına Git
        </Link>
      </div>
    );

  const MENU_ITEMS = [
    { id: "profil", label: "PROFİL BİLGİLERİ", icon: <FiUser /> },
    { id: "siparislerim", label: "SİPARİŞLERİM", icon: <FiPackage /> },
    { id: "adreslerim", label: "ADRESLERİM", icon: <FiMapPin /> },
    { id: "kartlarim", label: "KAYITLI KARTLARIM", icon: <FiCreditCard /> },
    { id: "yorumlarim", label: "YORUMLARIM", icon: <FiStar /> },
    { id: "ayarlar", label: "AYARLAR", icon: <FiSettings /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-satoshi text-left min-h-screen bg-white relative">
      <Helmet>
        <title>Hesabım | SHOP.CO</title>
      </Helmet>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
            HESABIM
          </h1>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            ONLINE PORTAL
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
            ÜYELİK: <span className="text-black">{membershipTier}</span>
          </p>
          <p className="text-[9px] font-bold text-zinc-300 mt-1 uppercase tracking-widest">
            EST. 2026
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 items-start">
        <AccountSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowLogoutModal={setShowLogoutModal}
          menuItems={MENU_ITEMS}
        />

        <div className="min-w-0 w-full bg-brand-offwhite rounded-[50px] p-8 md:p-14 border border-zinc-100 shadow-inner overflow-hidden min-h-[600px] relative">
          {activeTab === "siparislerim" && <OrdersSection orders={orders} />}

          {activeTab === "profil" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-12">
              <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                PROFİL AYARLARI
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic ml-2">
                    ADINIZ SOYADINIZ
                  </label>
                  <div className="p-6 bg-white rounded-3xl font-black text-sm border border-zinc-100 shadow-sm italic uppercase">
                    {user.name} {user.surname}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic ml-2">
                    E-POSTA ADRESİ
                  </label>
                  <div className="p-6 bg-white rounded-3xl font-black text-sm border border-zinc-100 shadow-sm italic uppercase">
                    {user.email}
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                className="!rounded-full !px-12 !py-5 shadow-2xl"
              >
                BİLGİLERİ GÜNCELLE
              </Button>
            </div>
          )}

          {activeTab === "kartlarim" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-10">
              <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                ÖDEME ARAÇLARI
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-950 p-8 rounded-[40px] text-white aspect-[1.6/1] flex flex-col justify-between shadow-2xl relative group overflow-hidden border border-white/5">
                  <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                  <div className="flex justify-between items-start z-10">
                    <FiCreditCard size={32} className="text-zinc-600" />
                    <span className="text-[10px] font-black italic border border-zinc-700 px-3 py-1 rounded-full uppercase">
                      MASTERCARD
                    </span>
                  </div>
                  <div className="z-10">
                    <p className="text-[22px] font-black tracking-[0.3em] mb-6 italic">
                      **** **** **** 1905
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                          KART SAHİBİ
                        </p>
                        <p className="text-[11px] font-black uppercase italic tracking-widest">
                          {user.name} {user.surname}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                          SKT
                        </p>
                        <p className="text-[11px] font-black italic tracking-widest">
                          12/28
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="aspect-[1.6/1] border-4 border-dashed border-zinc-100 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-black transition-all group active:scale-95 bg-white">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-inner">
                    <FiPlus size={28} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">
                    YENİ KART EKLE
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
