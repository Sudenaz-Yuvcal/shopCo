import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { RiShieldUserLine } from "react-icons/ri";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-satoshi">
        <div className="relative">
          <RiShieldUserLine size={48} className="text-white animate-pulse" />
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-shop-fade-in">
          Sistem Yetkisi Doğrulanıyor...
        </p>
      </div>
    );
  }
  const isAdmin =
    user?.role === "admin" || (user as any)?.user_metadata?.role === "admin";

  return isAdmin ? (
    <div className="animate-shop-fade-in">{children}</div>
  ) : (
    <Navigate to="/" replace />
  );
};
