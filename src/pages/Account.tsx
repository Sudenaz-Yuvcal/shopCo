import { useState, useMemo, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useOrder } from "../context/OrderContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  FiPackage,
  FiUser,
  FiSettings,
  FiCreditCard,
  FiStar,
  FiMapPin,
  FiPlus,
  FiCheck,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../components/Ui/Button";
import AccountSidebar from "../sections/account/account-sidebar";
import LogoutModal from "../sections/account/account-logout-modal";
import { supabase } from "../lib/supabase";
import type { Order, OrderItem } from "../types/order";

interface SavedCard {
  id: string;
  lastFour: string;
  holder: string;
  expiry: string;
  type: string;
}

interface SavedAddress {
  id: string;
  title: string;
  details: string;
  city: string;
}

const MENU_ITEMS = [
  { id: "profil", label: "PROFİL BİLGİLERİ", icon: <FiUser /> },
  { id: "siparislerim", label: "SİPARİŞLERİM", icon: <FiPackage /> },
  { id: "adreslerim", label: "ADRESLERİM", icon: <FiMapPin /> },
  { id: "kartlarim", label: "KAYITLI KARTLARIM", icon: <FiCreditCard /> },
  { id: "yorumlarim", label: "YORUMLARIM", icon: <FiStar /> },
  { id: "ayarlar", label: "AYARLAR", icon: <FiSettings /> },
];

const Account = () => {
  const { user, logout, login } = useUser();
  const { orders } = useOrder();
  const [activeTab, setActiveTab] = useState("siparislerim");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [cards, setCards] = useState<SavedCard[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  const [showCardModal, setShowCardModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [newCard, setNewCard] = useState({
    number: "",
    holder: "",
    expiry: "",
  });
  const [newAddr, setNewAddr] = useState({ title: "", details: "", city: "" });
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      const savedCards = localStorage.getItem(`cards_${user.id}`);
      const savedAddrs = localStorage.getItem(`addresses_${user.id}`);
      if (savedCards) setCards(JSON.parse(savedCards));
      if (savedAddrs) setAddresses(JSON.parse(savedAddrs));
    }
  }, [user?.id]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchUserOrders = async () => {
    if (!user?.email) return;

    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUserOrders(data);
    }
    setLoadingOrders(false);
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user?.email]);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          name: profileData.name,
          email: profileData.email,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        login({
          ...user,
          name: data.name,
          email: data.email,
        });
        toast.success("BİLGİLERİNİZ BAŞARIYLA GÜNCELLENDİ", { theme: "dark" });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Bilinmeyen hata";
      console.error("Güncelleme hatası:", errorMessage);
      toast.error("GÜNCELLEME BAŞARISIZ OLDU", {
        theme: "dark",
        className: "font-black italic text-[10px] tracking-widest",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cardObj: SavedCard = {
      id: Date.now().toString(),
      lastFour: newCard.number.slice(-4),
      holder: newCard.holder.toUpperCase(),
      expiry: newCard.expiry,
      type: "MASTERCARD",
    };
    const updated = [...cards, cardObj];
    setCards(updated);
    localStorage.setItem(`cards_${user?.id}`, JSON.stringify(updated));
    setShowCardModal(false);
    setNewCard({ number: "", holder: "", expiry: "" });
    toast.success("KARTINIZ KAYDEDİLDİ");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const addrObj: SavedAddress = {
      id: Date.now().toString(),
      ...newAddr,
    };
    const updated = [...addresses, addrObj];
    setAddresses(updated);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(updated));
    setShowAddressModal(false);
    setNewAddr({ title: "", details: "", city: "" });
    toast.success("ADRES REHBERE EKLENDİ");
  };

  const totalSpent = useMemo(
    () => orders.reduce((acc, o) => acc + o.total, 0),
    [orders],
  );
  const membershipTier = totalSpent > 5000 ? "PLATINUM" : "ELITE";

  if (!user)
    return (
      <div className="text-center py-20 font-[1000] italic uppercase">
        Erişim Reddedildi
      </div>
    );

  return (
    <div className="w-full px-6 py-16 font-satoshi text-left min-h-screen relative">
      <Helmet>
        <title>Hesabım | SHOP.CO</title>
      </Helmet>
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            logout();
            navigate("/");
          }}
        />
      )}
      {showCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
          <form
            onSubmit={handleAddCard}
            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-[1000] italic uppercase">
                YENİ KART
              </h4>
              <FiX
                className="cursor-pointer"
                onClick={() => setShowCardModal(false)}
              />
            </div>
            <input
              required
              placeholder="KART NUMARASI"
              className="w-full p-5 bg-zinc-50 rounded-2xl border-none font-black italic text-sm"
              maxLength={16}
              value={newCard.number}
              onChange={(e) =>
                setNewCard({ ...newCard, number: e.target.value })
              }
            />
            <div className="flex gap-4">
              <input
                required
                placeholder="AD SOYAD"
                className="w-1/2 p-5 bg-zinc-50 rounded-2xl border-none font-black italic text-sm uppercase"
                value={newCard.holder}
                onChange={(e) =>
                  setNewCard({ ...newCard, holder: e.target.value })
                }
              />
              <input
                required
                placeholder="AA/YY"
                className="w-1/2 p-5 bg-zinc-50 rounded-2xl border-none font-black italic text-sm"
                maxLength={5}
                value={newCard.expiry}
                onChange={(e) =>
                  setNewCard({ ...newCard, expiry: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full !rounded-full"
            >
              KARTI TANIMLA
            </Button>
          </form>
        </div>
      )}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
          <form
            onSubmit={handleAddAddress}
            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-[1000] italic uppercase">
                YENİ ADRES
              </h4>
              <FiX
                className="cursor-pointer"
                onClick={() => setShowAddressModal(false)}
              />
            </div>
            <input
              required
              placeholder="ADRES BAŞLIĞI"
              className="w-full p-5 bg-zinc-50 rounded-2xl border-none font-black italic text-sm uppercase"
              value={newAddr.title}
              onChange={(e) =>
                setNewAddr({ ...newAddr, title: e.target.value })
              }
            />
            <textarea
              required
              placeholder="ADRES DETAYI"
              className="w-full p-5 bg-zinc-50 rounded-2xl border-none font-black italic text-sm uppercase h-32 resize-none"
              value={newAddr.details}
              onChange={(e) =>
                setNewAddr({ ...newAddr, details: e.target.value })
              }
            />
            <input
              required
              placeholder="ŞEHİR"
              className="w-full p-5 bg-zinc-50 rounded-2xl border-none font-black italic text-sm uppercase"
              value={newAddr.city}
              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full !rounded-full"
            >
              ADRESİ KAYDET
            </Button>
          </form>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
            HESABIM
          </h1>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />{" "}
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
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">
        <AccountSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowLogoutModal={setShowLogoutModal}
          menuItems={MENU_ITEMS}
        />
        <div className="flex flex-col lg:flex-row gap-8 w-full px-4">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-10"></div>
          </aside>
          <div className="min-w-0 flex-[3] bg-brand-offwhite rounded-[50px] p-8 md:p-14 border border-zinc-100 shadow-inner overflow-hidden min-h-[600px] relative">
            {" "}
            {activeTab === "profil" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12">
                <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                  PROFİL AYARLARI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic ml-2">
                      TAM ADINIZ
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full p-6 bg-white rounded-3xl font-black text-sm border border-zinc-100 italic focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic ml-2">
                      E-POSTA ADRESİ
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-6 bg-white rounded-3xl font-black text-sm border border-zinc-100 italic focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="!rounded-full !px-12 !py-5 shadow-2xl flex items-center gap-3"
                >
                  {isUpdating ? (
                    "İŞLENİYOR..."
                  ) : (
                    <>
                      <FiCheck /> BİLGİLERİ GÜNCELLE
                    </>
                  )}
                </Button>
              </div>
            )}
            {activeTab === "adreslerim" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
                <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                  ADRESLERİM
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm relative group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <FiMapPin className="text-black" size={24} />
                        <button
                          onClick={() => {
                            const updated = addresses.filter(
                              (a) => a.id !== addr.id,
                            );
                            setAddresses(updated);
                            localStorage.setItem(
                              `addresses_${user?.id}`,
                              JSON.stringify(updated),
                            );
                          }}
                          className="text-zinc-300 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <h5 className="font-black italic uppercase text-sm mb-2">
                        {addr.title}
                      </h5>
                      <p className="text-zinc-400 text-[11px] font-bold leading-relaxed uppercase">
                        {addr.details} / {addr.city}
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="aspect-video border-4 border-dashed border-zinc-100 rounded-[40px] flex flex-col items-center justify-center gap-3 hover:border-black transition-all bg-white"
                  >
                    <FiPlus size={32} />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">
                      YENİ ADRES EKLE
                    </span>
                  </button>
                </div>
              </div>
            )}
            {activeTab === "kartlarim" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
                <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                  ÖDEME ARAÇLARI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-zinc-950 p-8 rounded-[40px] text-white aspect-[1.6/1] flex flex-col justify-between shadow-2xl relative overflow-hidden group"
                    >
                      <button
                        onClick={() => {
                          const updated = cards.filter((c) => c.id !== card.id);
                          setCards(updated);
                          localStorage.setItem(
                            `cards_${user?.id}`,
                            JSON.stringify(updated),
                          );
                        }}
                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-20 text-white/40 hover:text-red"
                      >
                        <FiTrash2 />
                      </button>
                      <div className="flex justify-between items-start z-10">
                        <FiCreditCard size={32} className="text-zinc-600" />
                        <span className="text-[10px] font-black italic border border-zinc-700 px-3 py-1 rounded-full">
                          {card.type}
                        </span>
                      </div>
                      <div className="z-10">
                        <p className="text-[22px] font-black tracking-[0.3em] mb-6 italic">
                          **** **** **** {card.lastFour}
                        </p>
                        <div className="flex justify-between items-end text-[11px]">
                          <div>
                            <p className="text-[8px] text-zinc-500 mb-1 uppercase">
                              KART SAHİBİ
                            </p>
                            <p className="font-black italic uppercase">
                              {card.holder}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] text-zinc-500 mb-1">SKT</p>
                            <p className="font-black italic">{card.expiry}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowCardModal(true)}
                    className="aspect-[1.6/1] border-4 border-dashed border-zinc-100 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-black transition-all bg-white group"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <FiPlus size={28} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">
                      YENİ KART EKLE
                    </span>
                  </button>
                </div>
              </div>
            )}
            {activeTab === "siparislerim" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                    SİPARİŞ GEÇMİŞİ
                  </h3>
                  <button
                    onClick={fetchUserOrders}
                    className="text-[10px] font-black uppercase underline decoration-2 underline-offset-4"
                  >
                    LİSTEYİ GÜNCELLE
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-20 text-center font-black italic animate-pulse">
                    YÜKLENİYOR...
                  </div>
                ) : userOrders.length > 0 ? (
                  <div className="space-y-6">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-4 border-b border-zinc-100">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                              Sipariş No
                            </p>
                            <p className="font-black italic">
                              #ORD-{order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-left md:text-right">
                              Durum
                            </p>
                            <span
                              className={`inline-block px-3 py-1 text-[10px] font-black uppercase italic mt-1 ${order.status === "returned" ? "bg-red text-white" : "bg-black text-white"}`}
                            >
                              {order.status || "Alındı"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items?.map((item: OrderItem, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-zinc-100 border border-black overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-black uppercase">
                                  {item.name}
                                </p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">
                                  {item.quantity} ADET • {item.size} •{" "}
                                  {item.color}
                                </p>
                              </div>
                              <p className="font-black italic text-sm">
                                ${item.price}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase">
                              Tarih
                            </p>
                            <p className="text-[11px] font-bold uppercase">
                              {new Date(order.created_at).toLocaleDateString(
                                "tr-TR",
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-400 uppercase">
                              Toplam
                            </p>
                            <p className="text-xl font-[1000] italic leading-none">
                              ${order.total_amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 border-4 border-dashed border-zinc-100 rounded-[40px] text-center">
                    <FiPackage
                      className="mx-auto mb-4 text-zinc-200"
                      size={48}
                    />
                    <p className="font-black italic text-zinc-300 uppercase tracking-widest">
                      Henüz bir siparişin yok.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
