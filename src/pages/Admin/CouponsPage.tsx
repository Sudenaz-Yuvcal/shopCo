import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  RiTicket2Line,
  RiAddLine,
  RiDeleteBin6Line,
  RiTimeLine,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  max_limit: number;
  used_count: number;
  expiry_date: string;
  min_order_amount: number;
  created_at: string;
}
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_percent: 10,
    max_limit: 100,
    expiry_date: "",
    min_order_amount: 0,
  });

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Kuponlar yüklenirken hata oluştu");
      return;
    }

    if (data) setCoupons(data as Coupon[]);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("coupons").insert([
        {
          code: newCoupon.code.toUpperCase().trim(),
          discount_percent: Number(newCoupon.discount_percent),
          max_limit: Number(newCoupon.max_limit),
          expiry_date: newCoupon.expiry_date,
          min_order_amount: Number(newCoupon.min_order_amount),
          used_count: 0,
        },
      ]);

      if (error) throw error;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen hata";
      toast.error("Hata: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "KUPONU SİL?",
      text: "Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "SİL",
      background: "#0a0a0a",
      color: "#fff",
      customClass: {
        popup: "rounded-[32px] border border-white/10 font-satoshi",
      },
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (!error) {
        toast.success("KUPON İMHA EDİLDİ");
        fetchCoupons();
      }
    }
  };

  return (
    <div className="animate-shop-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-admin-muted text-[10px] font-black uppercase tracking-[0.4em] mb-2 font-satoshi">
            Promotional Assets
          </p>
          <h1 className="text-6xl font-heavy italic uppercase tracking-tighter leading-none">
            Kuponlar
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[11px] tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <RiAddLine size={20} /> Yeni Kod Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="group bg-admin-card border border-admin-border p-8 rounded-[32px] relative overflow-hidden transition-all hover:border-white/20"
          >
            <div className="absolute top-0 right-0 bg-white text-black px-6 py-2 font-black italic uppercase text-[10px] rounded-bl-2xl">
              %{coupon.discount_percent} İndirim
            </div>

            <div className="mb-8">
              <RiTicket2Line
                className="text-admin-muted mb-4 group-hover:text-white transition-colors"
                size={32}
              />
              <h2 className="text-4xl font-heavy italic uppercase tracking-tighter break-all">
                {coupon.code}
              </h2>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-admin-muted">
                <span className="flex items-center gap-2 text-white/40">
                  <RiTimeLine /> SKT:
                </span>
                <span className="text-white">
                  {new Date(coupon.expiry_date).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.1em]">
                  <span className="text-zinc-500 text-[8px]">
                    Kullanım Kotası
                  </span>
                  <span className="text-white">
                    {coupon.used_count} / {coupon.max_limit}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-1000"
                    style={{
                      width: `${Math.min((coupon.used_count / coupon.max_limit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <br></br>
            <button
              onClick={() => handleDelete(coupon.id)}
              className="absolute bottom-6 right-8 text-zinc-400 hover:text-admin-danger transition-colors p-2"
            >
              <RiDeleteBin6Line size={18} />
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            onClick={() => setShowAddModal(false)}
          />

          <div className="bg-[#161616] border border-white/5 w-full max-w-sm rounded-[32px] p-8 relative z-10 animate-shop-fade-in shadow-2xl mt-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-heavy italic uppercase tracking-tighter leading-none mb-1 text-white">
                Kupon Düzenle
              </h2>
              <p className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">
                Configuration Terminal
              </p>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div className="group">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                  Kod
                </label>
                <input
                  required
                  type="text"
                  placeholder="SUMMER26"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-6 font-bold uppercase text-white outline-none focus:border-white/30 transition-all text-lg"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                    İndirim %
                  </label>
                  <input
                    required
                    type="number"
                    className="no-spin w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-6 font-bold text-white outline-none focus:border-white/30 transition-all"
                    value={newCoupon.discount_percent}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discount_percent: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                    Kupon Adedi
                  </label>
                  <input
                    required
                    type="number"
                    className="no-spin w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-6 font-bold text-white outline-none focus:border-white/30 transition-all"
                    value={newCoupon.max_limit}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        max_limit: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                  Min. Sepet Tutarı (₺)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="no-spin w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-6 font-bold text-white outline-none focus:border-white/30 transition-all"
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      min_order_amount: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                  Son Geçerlilik
                </label>
                <input
                  required
                  type="date"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-6 font-bold text-white outline-none focus:border-white/30 transition-all text-xs appearance-auto"
                  value={newCoupon.expiry_date}
                  style={{ colorScheme: "dark" }}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, expiry_date: e.target.value })
                  }
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-2xl font-heavy italic uppercase text-sm tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 mt-4 active:scale-95"
              >
                {loading ? "..." : "KUPONU ONAYLA"}
              </button>
            </form>
          </div>

          <style>{`
      .no-spin::-webkit-inner-spin-button, 
      .no-spin::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
      }
      .no-spin { -moz-appearance: textfield; }
      
      input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: invert(1); 
        opacity: 0.6;
      }
    `}</style>
        </div>
      )}
    </div>
  );
}
