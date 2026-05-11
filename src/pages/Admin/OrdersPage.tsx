import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import {
  RiSearchLine,
  RiTruckLine,
  RiMapPinUserLine,
  RiTimeLine,
  RiInformationLine,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import type { Order, OrderItem} from "../../types/order";

const statusLabels = {
  pending: "Bekliyor",
  processing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
  returned: "İade Oluşturuldu",
};
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Hepsi");
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Siparişler çekilemedi: " + error.message);
      return;
    }

    if (data) setOrders(data as Order[]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      toast.success(`DURUM GÜNCELLENDİ: ${status.toUpperCase()}`);
      fetchOrders();
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const name = `${order.first_name} ${order.last_name}`.toLowerCase();
      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "Hepsi" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const statusOptions = [
    {
      label: "Alındı",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      label: "Hazırlanıyor",
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    {
      label: "Yola Çıktı",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      label: "Teslim Edildi",
      color: "bg-greenn text-grreen border-grreenn",
    },
    {
      label: "İade Oluşturuldu",
      color: "bg-redd text-red border-rredd",
    },
  ];

  return (
    <div className="space-y-12 animate-shop-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <p className="text-admin-muted text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Logistics Center
          </p>
          <h1 className="text-6xl font-heavy italic uppercase tracking-tighter leading-none">
            Siparişler
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center bg-admin-card p-2 rounded-[32px] border border-admin-border">
          <div className="relative">
            <RiSearchLine className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="REF VEYA MÜŞTERİ..."
              className="pl-14 pr-6 py-4 bg-transparent font-bold uppercase text-[11px] outline-none w-64 text-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
          <select
            className="bg-white text-black px-8 py-4 rounded-[24px] font-black uppercase text-[10px] tracking-widest cursor-pointer outline-none"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Hepsi">TÜM DURUMLAR</option>
            {statusOptions.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="group bg-admin-card border border-admin-border rounded-[40px] p-10 transition-all hover:border-white/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] -mr-16 -mt-16 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-admin-muted text-[10px] font-black uppercase tracking-widest">
                  <RiInformationLine size={14} /> REF NO
                </div>
                <div>
                  <p className="text-2xl font-heavy italic uppercase tracking-tighter">
                    #ORD-{order.id.slice(0, 8)}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500 mt-2 flex items-center gap-2">
                    <RiTimeLine />{" "}
                    {new Date(order.created_at).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-admin-muted text-[10px] font-black uppercase tracking-widest">
                  <RiMapPinUserLine size={14} /> MÜŞTERİ
                </div>
                <div>
                  <p className="text-xl font-heavy italic uppercase tracking-tighter">
                    {order.first_name} {order.last_name}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                    {order.city} / {order.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-admin-muted text-[10px] font-black uppercase tracking-widest">
                  TOPLAM TUTAR
                </div>
                <p className="text-4xl font-heavy italic tracking-tighter leading-none">
                  ${order.total_amount}
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-admin-muted text-[10px] font-black uppercase tracking-widest">
                  LOJİSTİK DURUMU
                </div>
                <select
                  value={statusLabels[order.status]}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest outline-none border transition-all cursor-pointer ${
                    statusOptions.find((o) => o.label === order.status)
                      ?.color || "bg-white/5 text-white border-white/10"
                  }`}
                >
                  {statusOptions.map((opt) => (
                    <option
                      key={opt.label}
                      value={opt.label}
                      className="bg-[#0a0a0a] text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5">
              <p className="text-admin-muted text-[9px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <RiTruckLine /> PAKET İÇERİĞİ ({order.items?.length || 0})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {order.items?.map((item: OrderItem, idx: number) => (
                  <div
                    key={item.id || idx} 
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-[24px] border border-transparent hover:border-white/10 transition-all"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-zinc-500 text-[10px] font-medium">
                        {item.quantity} ADET × {item.price}₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-zinc-600">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-zinc-800 rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {order.address}
                </p>
              </div>
              <span className="text-[9px] font-black italic tracking-[0.4em] opacity-20">
                SHOP.CO AUTOMATED LOGISTICS
              </span>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-4xl font-heavy italic uppercase text-zinc-800 tracking-tighter">
              KAYIT BULUNAMADI
            </p>
            <p className="text-xs font-black uppercase text-zinc-900 tracking-[0.5em] mt-4">
              System is empty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
