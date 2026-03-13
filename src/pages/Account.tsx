import { useState, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { Helmet } from "react-helmet-async";
import Button from "../components/ui/Button";
import {
  FiPackage,
  FiUser,
  FiLogOut,
  FiShoppingBag,
  FiSettings,
  FiCreditCard,
  FiStar,
  FiMapPin,
  FiChevronRight,
  FiLock,
  FiPlus,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Account = () => {
  const { user, orders, logout } = useUser();
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-zinc-100 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-8 top-8 text-zinc-300 hover:text-black transition-colors"
            >
              <FiX size={24} />
            </button>

            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-8">
              <FiAlertCircle size={32} />
            </div>

            <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-4 leading-none">
              OTURUMU <br /> KAPATIYORSUN.
            </h3>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-10 leading-relaxed italic">
              Hesabından çıkış yapmak istediğine emin misin?
            </p>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={handleLogout}
                className="w-full !rounded-full !py-5 !bg-red-600 hover:!bg-red-700 italic tracking-[0.3em]"
              >
                EVET, ÇIKIŞ YAP
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                className="w-full !rounded-full !py-5 !border-zinc-100 italic tracking-[0.3em] font-black"
              >
                VAZGEÇ
              </Button>
            </div>
          </div>
        </div>
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
        <aside className="w-full space-y-3 sticky top-32 shrink-0">
          <div className="bg-black p-8 rounded-[40px] mb-8 flex items-center gap-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-[1000] text-xl italic uppercase shrink-0 border-2 border-white/20 shadow-xl group-hover:scale-110 transition-transform">
              {user.name[0]}
            </div>
            <div className="min-w-0 z-10">
              <h2 className="font-black text-md uppercase truncate text-white italic tracking-tight leading-none">
                {user.name} {user.surname}
              </h2>
              <p className="text-[9px] text-zinc-500 font-black uppercase truncate tracking-[0.2em] leading-none mt-2">
                {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full !justify-between !px-6 !py-5 !rounded-2xl !text-[11px] tracking-[0.2em] transition-all duration-500 italic ${
                  activeTab === item.id
                    ? "!bg-black !text-white shadow-2xl translate-x-3 scale-[1.02]"
                    : "!bg-zinc-50 !text-black hover:!bg-black hover:!text-white group border border-zinc-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                <FiChevronRight
                  className={`transition-all duration-300 ${activeTab === item.id ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
                />
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(true)}
              className="w-full !justify-start !px-6 !py-5 !rounded-2xl mt-8 !text-[11px] tracking-[0.2em] gap-4 !border-red-600/20 !text-red-600 hover:!bg-red-600 hover:!text-white italic"
            >
              <FiLogOut size={16} />
              OTURUMU KAPAT
            </Button>
          </div>
        </aside>

        <div className="min-w-0 w-full bg-brand-offwhite rounded-[50px] p-8 md:p-14 border border-zinc-100 shadow-inner overflow-hidden min-h-[600px] relative">
          {activeTab === "siparislerim" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                  SİPARİŞ GEÇMİŞİ ({orders.length})
                </h3>
                <FiPackage className="opacity-10" size={40} />
              </div>

              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow group"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-zinc-50 pb-6 mb-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">
                            TAKİP NO: {order.id}
                          </p>
                          <p className="font-black text-lg italic uppercase">
                            {order.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                              DURUM
                            </p>
                            <span className="bg-zinc-100 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic group-hover:bg-black group-hover:text-white transition-colors">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                              TOPLAM
                            </p>
                            <p className="font-[1000] text-2xl tracking-tighter italic">
                              ${order.total}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-zinc-50 p-4 rounded-3xl border border-transparent hover:border-zinc-200 transition-all"
                          >
                            <img
                              src={item.image}
                              className="w-14 h-14 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all shadow-md"
                              alt={item.name}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-[1000] uppercase italic truncate leading-none mb-2">
                                {item.name}
                              </h4>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                                {item.size} • {item.color} • {item.quantity}{" "}
                                ADET
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 flex flex-col items-center justify-center border-4 border-dashed border-zinc-100 rounded-[50px] opacity-30">
                  <FiShoppingBag size={60} className="mb-4" />
                  <p className="font-black text-[11px] uppercase tracking-[0.4em] italic">
                    Henüz alışveriş yapılmadı
                  </p>
                </div>
              )}
            </div>
          )}

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
