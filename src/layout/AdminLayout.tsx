import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiBox3Line,
  RiUserLine,
  RiShoppingBag3Line,
  RiCouponLine,
  RiLogoutCircleLine,
  RiMenu4Fill,
} from "react-icons/ri";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "OTURUMU KAPAT?",
      text: "Mevcut oturumun sonlandırılacaktır. Emin misin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffffff",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "EVET, ÇIKIŞ YAP",
      cancelButtonText: "VAZGEÇ",
      background: "#121214",
      color: "#ffffff",
      customClass: {
        popup: "border border-white/10 rounded-[32px] font-satoshi shadow-2xl",
        title: "font-heavy italic uppercase tracking-tighter text-3xl",
        confirmButton:
          "rounded-full font-black uppercase tracking-widest px-8 py-4 text-black",
        cancelButton:
          "rounded-full font-black uppercase tracking-widest px-8 py-4",
      },
    });

    if (result.isConfirmed) {
      try {
        await supabase.auth.signOut();
        localStorage.clear();

        toast.success("GÜVENLİ ŞEKİLDE ÇIKIŞ YAPILDI", {
          style: {
            background: "#fff",
            color: "#000",
            borderRadius: "50px",
            fontSize: "10px",
            fontWeight: "900",
            fontFamily: "Satoshi, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            padding: "16px 24px",
          },
        });

     navigate("/login");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "BİR HATA OLUŞTU";
    console.error(errorMessage);
    toast.error("ÇIKIŞ YAPILIRKEN BİR HATA OLUŞTU");
  }
    }
  };

  const nav = [
    { name: "Terminal", path: "/admin", icon: RiDashboardLine },
    { name: "Ürünler", path: "/admin/products", icon: RiBox3Line },
    { name: "Kullanıcılar", path: "/admin/users", icon: RiUserLine },
    { name: "Siparişler", path: "/admin/orders", icon: RiShoppingBag3Line },
    { name: "Kuponlar", path: "/admin/coupons", icon: RiCouponLine },
  ];

  return (
    <div className="flex min-h-screen bg-admin-bg text-white font-satoshi overflow-hidden">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-admin-bg border-r border-admin-border transition-transform duration-500 lg:static lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full p-8">
          <div className="mb-16 px-4">
            <h1 className="text-3xl font-heavy italic uppercase tracking-tighter leading-none">
              Shop.Co{" "}
              <span className="text-[10px] not-italic font-black border border-white/20 px-1.5 py-0.5 rounded ml-1 bg-white text-black">
                ADMIN
              </span>
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {nav.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-5 px-6 py-4 rounded-admin transition-all duration-300 group ${
                    isActive
                      ? "bg-white text-black shadow-admin-card scale-[1.02]"
                      : "text-admin-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={22}
                    className={
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform"
                    }
                  />
                  <span className="font-bold italic uppercase tracking-tighter text-sm">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 text-admin-danger/60 font-black uppercase text-[11px] tracking-widest hover:text-admin-danger transition-all border-t border-admin-border pt-8"
          >
            <RiLogoutCircleLine size={22} /> Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 border-b border-admin-border bg-admin-bg/50 backdrop-blur-xl">
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <RiMenu4Fill size={24} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em] leading-none mb-1">
                Erişim Paneli
              </p>
              <p className="font-bold italic uppercase text-xs tracking-tight">
               Admin
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-white/10" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth bg-[#080808]">
          <div className="max-w-7xl mx-auto animate-shop-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
