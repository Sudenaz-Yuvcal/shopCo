import { FiChevronRight, FiLogOut } from "react-icons/fi";
import Button from "../../components/ui/Button";
import type { ReactNode } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface UserData {
  name: string;
  surname: string;
  email: string;
}

interface AccountSidebarProps {
  user: UserData;
  activeTab: string;
  setActiveTab: (id: string) => void;
  setShowLogoutModal: (val: boolean) => void;
  menuItems: MenuItem[];
}

const AccountSidebar = ({
  user,
  activeTab,
  setActiveTab,
  setShowLogoutModal,
  menuItems,
}: AccountSidebarProps) => (
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
      {menuItems.map((item) => (
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
            className={`transition-all duration-300 ${
              activeTab === item.id
                ? "opacity-100"
                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
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
);

export default AccountSidebar;
