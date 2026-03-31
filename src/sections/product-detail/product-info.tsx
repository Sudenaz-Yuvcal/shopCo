import { useState } from "react";
import {
  RiHeartLine,
  RiHeartFill,
  RiCheckLine,
  RiStarFill,
} from "react-icons/ri";
import { FiMinus, FiPlus } from "react-icons/fi";
import Button from "../../components/Ui/Button";
import type { Product } from "../../types/product";

interface ProductInfoProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (qty: number, size: string, color: string) => void;
  userAddress?: string;
}

const COLOR_OPTIONS = [
  { name: "Siyah", id: "black", tailwind: "bg-black" },
  { name: "Haki", id: "khaki", tailwind: "bg-[#4F4631]" },
  { name: "Mavi", id: "denim", tailwind: "bg-[#31344F]" },
];

const ProductInfo = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  userAddress,
}: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, product.image, product.image];

  const discount = product.oldValue
    ? Math.round(((product.oldValue - product.value) / product.oldValue) * 100)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto items-start font-satoshi">
      <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 h-auto lg:h-[530px]">
        <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-28 shrink-0 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
          <br></br>
          {images.slice(0, 3).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`aspect-square rounded-2xl overflow-hidden border-2 bg-[#F0F0F0] transition-all shrink-0 w-24 lg:w-full ${
                activeImg === i
                  ? "border-black ring-2 ring-black ring-offset-2"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt="thumb"
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </button>
          ))}
        </div>
        <div className="flex-1 rounded-[40px] overflow-hidden flex items-center justify-center p-8">
          <img
            src={images[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply transform hover:scale-105 transition-transform duration-50s0"
          />
        </div>
      </div>

      <div className="lg:col-span-5 text-left space-y-6">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-5xl font-[1000] font-integral uppercase italic tracking-tighter leading-[0.85] flex-1">
            {product.name}
          </h1>
          <button
            onClick={() => onToggleFavorite(product)}
            className="p-3 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-all"
          >
            {isFavorite ? (
              <RiHeartFill size={28} className="text-red-500" />
            ) : (
              <RiHeartLine size={28} className="text-zinc-300" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <RiStarFill
                key={i}
                size={18}
                className={
                  i < Math.round(product.rating)
                    ? "text-yellow-400"
                    : "text-zinc-200"
                }
              />
            ))}
          </div>
          <span className="text-sm font-bold ml-1">{product.rating}/5</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-4xl font-black italic tracking-tighter">
            ${product.value}
          </span>
          {product.oldValue && (
            <div className="flex items-center gap-2">
              <span className="text-3xl text-zinc-200 line-through font-black italic">
                ${product.oldValue}
              </span>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black">
                -{discount}%
              </span>
            </div>
          )}
        </div>

        <p className="text-zinc-400 text-[13px] font-medium leading-relaxed max-w-sm">
          {product.description ||
            "Bu ürün gardırobunuzun en ikonik parçası olmaya aday."}
        </p>

        <div className="h-px bg-zinc-100 w-full" />
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic">
            RENK SEÇENEKLERİ
          </p>
          <div className="flex gap-3">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${color.tailwind} ${selectedColor === color.id ? "ring-2 ring-black ring-offset-4" : "opacity-80"}`}
              >
                {selectedColor === color.id && (
                  <RiCheckLine className="text-white text-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-zinc-100 w-full" />
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic">
            BEDENİNİ SEÇ
          </p>
          <div className="flex gap-2">
            {["Small", "Medium", "Large", "X-Large"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase transition-all ${selectedSize === size ? "bg-black text-white" : "bg-[#F0F0F0] text-zinc-400 hover:bg-zinc-200"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 h-14">
          <div className="bg-[#F0F0F0] px-6 rounded-full flex items-center justify-between min-w-[140px]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-zinc-500"
            >
              <FiMinus size={22} />
            </button>
            <span className="text-xl font-black italic">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-zinc-500"
            >
              <FiPlus size={22} />
            </button>
          </div>
          <Button
            onClick={() => onAddToCart(quantity, selectedSize, selectedColor)}
            className="flex-1 !rounded-full !bg-black !text-white italic font-black"
          >
            SEPETE EKLE →
          </Button>
        </div>

        {userAddress && (
          <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] italic">
            TESLİMAT: <span className="text-black">{userAddress}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
