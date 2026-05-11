import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  RiUserForbidLine,
  RiUserFollowLine,
  RiSearch2Line,
  RiShieldUserLine,
  RiSettings3Line,
} from "react-icons/ri";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  membership_tier: string;
  is_active: boolean;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const ADMIN_EMAIL = "admin@shop.co";
      let query = supabase.from("users").select("*").neq("email", ADMIN_EMAIL);

      if (searchTerm.trim() !== "") {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setUsers(data as UserProfile[]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "VERİ AKIŞI KESİLDİ";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const toggleUserStatus = async (user: UserProfile) => {
    const isNowBanning = user.is_active;

    const result = await Swal.fire({
      title: isNowBanning ? "ERİŞİMİ KES?" : "ERİŞİMİ AÇ?",
      html: `
        <div class="space-y-4 py-4">
          <div class="bg-black/5 p-4 rounded-2xl border border-black/5">
            <p class="font-black text-black uppercase italic text-lg">${user.email}</p>
          </div>
          <p class="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
            BU KULLANICI ŞU ANDA SİSTEMDEN <span class="${isNowBanning ? "text-red-600" : "text-green-600"}">${isNowBanning ? "MEN EDİLECEK" : "YETKİLENDİRİLECEK"}</span>. 
            EMİN MİSİNİZ?
          </p>
        </div>
      `,
      icon: isNowBanning ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#f4f4f5",
      confirmButtonText: isNowBanning ? "EVET, BANLA" : "EVET, AKTİF ET",
      cancelButtonText: "VAZGEÇ",
      buttonsStyling: false,
      customClass: {
        popup:
          "border-[6px] border-black rounded-[40px] shadow-[20px_20px_0px_rgba(0,0,0,1)] p-12",
        title: "font-heavy italic uppercase tracking-tighter text-4xl",
        confirmButton:
          "bg-black text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all mx-2",
        cancelButton:
          "bg-zinc-100 text-zinc-500 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all mx-2",
      },
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("users")
        .update({ is_active: !user.is_active })
        .eq("id", user.id);

      if (!error) {
        toast.success(
          isNowBanning ? "KULLANICI SİSTEMDEN ATILDI" : "KULLANICI GERİ DÖNDÜ",
        );
        fetchUsers();
      } else {
        toast.error("HATA: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-12 animate-shop-fade-in pb-20 p-8 bg-black min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            User Permissions
          </p>
          <h1 className="text-6xl font-heavy italic uppercase tracking-tighter leading-none text-white">
            Kullanıcılar
          </h1>
        </div>

        <div className="relative group">
          <RiSearch2Line className="absolute left-6 top-1/2 -translate-y-1/2 text-black opacity-30 group-focus-within:opacity-100 transition-opacity" />
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="KİMLİK SORGULA..."
            className="border-[4px] border-black p-5 pl-14 font-black uppercase text-[11px] tracking-widest w-full lg:w-96 outline-none focus:bg-zinc-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all text-black"
          />
        </div>
      </div>

      <div className="border-[6px] border-black bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white border-b-4 border-black">
              <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em]">
                Kullanıcı Verisi
              </th>
              <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em] hidden md:table-cell">
                Seviye
              </th>
              <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em]">
                Durum
              </th>
              <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em] text-right">
                Yönetim
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center font-heavy italic text-2xl animate-pulse uppercase text-black"
                >
                  Veri Tabanı Sorgulanıyor...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-50 transition-colors group"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black flex items-center justify-center rounded-xl text-white">
                        <RiShieldUserLine size={24} />
                      </div>
                      <div>
                        <p className="text-2xl text-black font-heavy italic uppercase leading-none tracking-tighter group-hover:translate-x-1 transition-transform">
                          {user.name || "İSİMSİZ ÜYE"}
                        </p>
                        <p className="text-[10px] text-zinc-400 lowercase font-black tracking-widest mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 hidden md:table-cell">
                    <span className="bg-zinc-100 text-black px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg border border-black/5">
                      {user.membership_tier}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3 text-black">
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${user.is_active ? "bg-green shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-red shadow-[0_0_15px_rgba(239,68,68,0.5)]"}`}
                      />
                      <span className="font-black uppercase text-[10px] tracking-widest">
                        {user.is_active ? "Aktif" : "Banlı"}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-2 ml-auto ${
                        user.is_active
                          ? "bg-red text-white"
                          : "bg-green text-white"
                      }`}
                    >
                      {user.is_active ? (
                        <RiUserForbidLine size={16} />
                      ) : (
                        <RiUserFollowLine size={16} />
                      )}
                      {user.is_active ? "BAN" : "AKTİF ET"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 opacity-20 text-black">
        <RiSettings3Line className="animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">
          System Log: Users fetched at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
