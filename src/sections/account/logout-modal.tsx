import { FiX, FiAlertCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";

interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ onClose, onConfirm }: LogoutModalProps) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    />
    <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-zinc-100 animate-in zoom-in-95 duration-300">
      <button
        onClick={onClose}
        className="absolute right-8 top-8 text-zinc-300 hover:text-black transition-colors"
      >
        <FiX size={24} />
      </button>

      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-8">
        <FiAlertCircle size={32} />
      </div>

      <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-4 leading-none">
        OTURUMU <br /> KAPATIYORSUN.
      </h3>
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-10 leading-relaxed italic">
        Hesabından çıkış yapmak istediğine emin misin?
      </p>

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          onClick={onConfirm}
          className="w-full !rounded-full !py-5 !bg-red-600 hover:!bg-red-700 italic tracking-[0.3em]"
        >
          EVET, ÇIKIŞ YAP
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full !rounded-full !py-5 !border-zinc-100 italic tracking-[0.3em] font-black"
        >
          VAZGEÇ
        </Button>
      </div>
    </div>
  </div>
);

export default LogoutModal;
