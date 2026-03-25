import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

interface CartNotificationProps {
  notification: { msg: string; type: "success" | "error" } | null;
  setNotification: (val: null) => void;
  progress: number;
}

const CartNotification = ({
  notification,
  setNotification,
  progress,
}: CartNotificationProps) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-10 right-10 z-[1000] bg-black text-white rounded-3xl shadow-2xl border ${
        notification.type === "success" ? "border-white/10" : "border-red-600"
      } w-80 overflow-hidden animate-in slide-in-from-right-10`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {notification.type === "success" ? (
            <FiCheckCircle className="text-green-500" size={24} />
          ) : (
            <FiAlertCircle className="text-red-500" size={24} />
          )}
          <p className="text-[10px] font-black uppercase italic tracking-widest">
            {notification.msg}
          </p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-zinc-500 hover:text-white"
        >
          <FiX />
        </button>
      </div>
      <div className="h-1 bg-zinc-800">
        <div
          className={`h-full transition-all duration-[50ms] ${
            notification.type === "success" ? "bg-white" : "bg-red-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default CartNotification;
