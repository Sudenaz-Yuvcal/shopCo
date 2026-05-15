import React from "react";
import { RiCloseLine, RiHeartLine, RiDeleteBin6Line } from "react-icons/ri";

interface CartDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  onMoveToFavorites: () => void;
}

const CartDeleteModal: React.FC<CartDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  onMoveToFavorites,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] border-4 border-black p-8 relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <RiCloseLine size={24} />
        </button>

        <div className="text-center space-y-6">
          <div className="bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-black">
            <RiDeleteBin6Line size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-[1000] uppercase tracking-tighter italic">
              Emin misin?
            </h3>
            <p className="text-zinc-500 text-xs font-bold uppercase italic tracking-wider leading-relaxed">
              Bu ürünü sepetten çıkarıyorsun. <br /> Favorilere ekleyerek sonra
              da bakabilirsin!
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={onMoveToFavorites}
              className="w-full bg-black text-white py-4 rounded-full font-black text-[11px] tracking-[0.2em] italic flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              <RiHeartLine size={18} />
              SİL VE FAVORİLERE EKLE
            </button>

            <button
              onClick={onConfirmDelete}
              className="w-full bg-white text-red-600 border-2 border-red-100 py-4 rounded-full font-black text-[11px] tracking-[0.2em] italic hover:bg-red-50 transition-all"
            >
              SİL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDeleteModal;
