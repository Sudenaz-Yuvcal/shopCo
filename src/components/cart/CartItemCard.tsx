import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import type { CartItem as BaseCartItem } from "../../context/CartContext";

interface Variant {
  size: string;
  color: string;
  stock: number;
}

type EnhancedCartItem = BaseCartItem & {
  variants?: Variant[];
  value?: number | string;
  stock?: number;
};

interface CartItemCardProps {
  item: EnhancedCartItem;
  onRemoveClick: () => void;
  updateQuantity: (
    id: number,
    size: string,
    color: string,
    newQty: number,
  ) => void;
}

const CartItemCard = ({
  item,
  onRemoveClick,
  updateQuantity,
}: CartItemCardProps) => {
  const colorMap: Record<string, string> = {
    "#31344F": "Mavi",
    "#4F4631": "Haki",
    "#000000": "Siyah",
    "#FFFFFF": "Beyaz",
    "#FF3333": "Kırmızı",
  };

  const colorName = colorMap[item.color.toUpperCase()] || item.color;

  const currentVariant = item.variants?.find(
    (v) => v.size === item.size && v.color === item.color,
  );

  const stockLimit = currentVariant?.stock ?? item.stock ?? 99;

  const currentQty = Number(item.quantity) || 0;

  const displayPrice = Number(item.price || item.value || 0);

  const handleDecrease = () => {
    const nextQty = currentQty - 1;
    if (nextQty <= 0) {
      onRemoveClick();
    } else {
      updateQuantity(Number(item.id), item.size, item.color, nextQty);
    }
  };

  const handleIncrease = () => {
    const nextQty = currentQty + 1;
    if (nextQty <= 10 && nextQty <= stockLimit) {
      updateQuantity(Number(item.id), item.size, item.color, nextQty);
    }
  };

  return (
    <div className="flex bg-zinc-50 rounded-[40px] border border-transparent hover:border-zinc-200 transition-all group p-4 gap-4">
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
            <h3 className="font-[1000] text-2xl font-satoshi tracking-tighter leading-none text-black uppercase">
              {item.name}
            </h3>
            <p className="text-[10px] font-black text-zinc-400 mt-3 uppercase tracking-widest italic">
              {item.size} • {colorName}
            </p>
          </div>
          <button
            onClick={onRemoveClick}
            className="text-zinc-300 hover:text-red-500 transition-colors p-2"
          >
            <FiTrash2 size={22} />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-[1000] text-3xl tracking-tighter italic text-black">
            ${displayPrice.toLocaleString()}
          </span>

          <div className="bg-white border border-zinc-100 px-6 py-3 rounded-full flex gap-8 items-center shadow-sm">
            <button
              onClick={handleDecrease}
              className="text-zinc-400 hover:text-black transition-colors"
              type="button"
            >
              <FiMinus />
            </button>

            <span className="font-black text-sm tabular-nums text-black min-w-[20px] text-center">
              {currentQty}
            </span>

            <button
              onClick={handleIncrease}
              disabled={currentQty >= 10 || currentQty >= stockLimit}
              className={`transition-colors ${
                currentQty >= 10 || currentQty >= stockLimit
                  ? "opacity-20 cursor-not-allowed"
                  : "text-zinc-400 hover:text-black"
              }`}
              type="button"
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
