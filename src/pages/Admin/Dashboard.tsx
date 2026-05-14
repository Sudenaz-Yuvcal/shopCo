import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  RiMoneyDollarCircleLine,
  RiShoppingBag3Line,
  RiUser6Line,
  RiInboxArchiveLine,
  RiArrowRightUpLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  users: number;
  orders: number;
  revenue: number;
  products: number;
}

export default function Dashboard() {
  const navigate = useNavigate(); 
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const ADMIN_EMAIL = "admin@shop.co";

      try {
        const [uRes, oRes, pRes, rRes] = await Promise.all([
          supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .neq("email", ADMIN_EMAIL)
            .neq("membership_tier", "admin"),
          supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .neq("email", ADMIN_EMAIL),
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase
            .from("orders")
            .select("total_amount")
            .neq("email", ADMIN_EMAIL),
        ]);

        const totalRevenue =
          rRes.data?.reduce((acc, curr) => {
            const price =
              typeof curr.total_amount === "string"
                ? parseFloat(curr.total_amount)
                : curr.total_amount || 0;
            return acc + price;
          }, 0) || 0;

        setStats({
          users: uRes.count || 0,
          orders: oRes.count || 0,
          products: pRes.count || 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-1 bg-zinc-900 overflow-hidden rounded-full mb-4">
          <div className="h-full bg-white w-1/3 animate-[loading_1.5s_infinite_linear]" />
        </div>
        <p className="font-heavy italic text-xs tracking-[0.5em] uppercase text-zinc-500">
          Terminal Senkronize Ediliyor...
        </p>
      </div>
    );

  const dashboardCards = [
    {
      label: "Toplam Kazanç",
      val: `$${stats.revenue.toLocaleString("en-US")}`,
      icon: <RiMoneyDollarCircleLine size={24} />,
      color: "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20",
      trend: "+12.5%",
      path: "/admin/revenue",
    },
    {
      label: "Siparişler",
      val: stats.orders,
      icon: <RiShoppingBag3Line size={24} />,
      color: "bg-white/5 text-white border-white/10",
      trend: "Sistem Aktif",
      path: "/admin/orders",
    },
    {
      label: "Kullanıcılar",
      val: stats.users,
      icon: <RiUser6Line size={24} />,
      color: "bg-white/5 text-white border-white/10",
      trend: "Yeni Kayıtlar",
      path: "/admin/users",
    },
    {
      label: "Envanter",
      val: stats.products,
      icon: <RiInboxArchiveLine size={24} />,
      color: "bg-white text-black border-transparent",
      trend: "Stok Durumu",
      path: "/admin/products",
    },
  ];

  return (
    <div className="space-y-16 animate-shop-fade-in pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-white"></span>

        </div>
        <h1 className="text-5xl font-heavy italic uppercase tracking-tighter leading-none">
          Terminal
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((s, i) => (
          <div
            key={i}
            onClick={() => s.path && navigate(s.path)}
            className={`group border-2 p-8 rounded-[32px] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col justify-between min-h-[220px] ${s.color}`}
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-current/10 rounded-2xl">{s.icon}</div>
              <RiArrowRightUpLine
                className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                size={24}
              />
            </div>

            <div>
              <p className="font-bold uppercase text-[10px] tracking-[0.2em] mb-1 opacity-60">
                {s.label}
              </p>
              <h2 className="text-5xl font-heavy italic tracking-tighter leading-none">
                {s.val}
              </h2>
            </div>

            <div className="text-[9px] font-black uppercase tracking-widest pt-4 border-t border-current/10 mt-4 opacity-50">
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
