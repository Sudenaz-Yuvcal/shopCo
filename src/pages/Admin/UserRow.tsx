import {
  RiUser6Line,
  RiShieldUserLine,
  RiArrowRightUpLine,
} from "react-icons/ri";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  full_name?: string; 
  avatar_url?: string;
  created_at: string;
}

interface UserRowProps {
  user: User;
}

export const UserRow = ({ user }: UserRowProps) => {
  const isAdmin = user.role === "admin";

  return (
    <tr className="group border-b border-white/5 hover:bg-white/[0.02] transition-all duration-300">
      <td className="py-8 px-6">
        <div className="flex items-center gap-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              isAdmin
                ? "bg-white border-white text-black"
                : "bg-zinc-900 border-white/10 text-zinc-500 group-hover:border-white/30"
            }`}
          >
            {isAdmin ? (
              <RiShieldUserLine size={24} />
            ) : (
              <RiUser6Line size={24} />
            )}
          </div>
          <div>
            <p className="font-heavy uppercase italic text-lg tracking-tighter leading-none mb-1 group-hover:translate-x-1 transition-transform">
              {user.full_name || "İsimsiz Kullanıcı"}
            </p>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td className="py-8 px-6 hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">
            Katılım
          </span>
          <span className="text-zinc-300 font-bold text-[11px] font-satoshi uppercase italic">
            {new Date(user.created_at).toLocaleDateString("tr-TR")}
          </span>
        </div>
      </td>

      <td className="py-8 px-6 text-center">
        <span
          className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
            isAdmin
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              : "bg-zinc-900 text-zinc-500 border border-white/5"
          }`}
        >
          {user.role}
        </span>
      </td>

      <td className="py-8 px-6 text-right">
        <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-[10px] font-heavy italic uppercase tracking-tighter hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 group/btn">
          Detayları Gör
          <RiArrowRightUpLine
            size={14}
            className="group-hover/btn:rotate-45 transition-transform"
          />
        </button>
      </td>
    </tr>
  );
};
