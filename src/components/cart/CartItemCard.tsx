import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import type { CartItem } from "../../context/CartContext";

interface CartItemCardProps {
  item: CartItem;
  onRemoveClick: () => void;
  updateQuantity: (
    id: number,
    size: string,
    color: string,
    delta: number,
  ) => void;
}

const CartItemCard = ({
  item,
  onRemoveClick,
  updateQuantity,
}: CartItemCardProps) => {
  const handleDecrease = () => {
    if (item.quantity === 1) {
      onRemoveClick();
    } else {
      updateQuantity(item.id, item.size, item.color, -1);
    }
  };

  return (
    <div className="flex gap-8 p-6 bg-zinc-50 rounded-[40px] border border-transparent hover:border-zinc-200 transition-all group">
      <div className="w-32 h-32 bg-white rounded-[30px] overflow-hidden shadow-sm shrink-0 border border-zinc-100">
        <img
          src={item.image || undefined}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          alt={item.name}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="flex justify-between items-start text-left">
          <div>
            <h3 className="font-[1000] text-2xl font-satoshi tracking-tighter leading-none text-black">
              {item.name}
            </h3>
            <p className="text-[10px] font-black text-zinc-400 mt-3 uppercase tracking-widest italic">
              {item.size} • {item.color}
            </p>
          </div>
          <button
            onClick={onRemoveClick}
            className="text-zinc-300 hover:text-red transition-colors p-2"
          >
            <FiTrash2 size={22} />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-[1000] text-3xl tracking-tighter italic text-black">
            ${item.price || item.value}
          </span>

          <div className="bg-white border border-zinc-100 px-6 py-3 rounded-full flex gap-8 items-center shadow-sm">
            <button
              onClick={handleDecrease}
              className="text-zinc-400 hover:text-black transition-colors"
            >
              <FiMinus />
            </button>
            <span className="font-black text-sm tabular-nums text-black">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
              className="text-zinc-400 hover:text-black transition-colors"
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
