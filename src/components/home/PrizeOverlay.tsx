import { FiGift } from "react-icons/fi";
import Button from "../ui/Button";

interface PrizeOverlayProps {
  wonPrize: string;
  onClose: () => void;
}

export const PrizeOverlay = ({ wonPrize, onClose }: PrizeOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10002] animate-in zoom-in">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      <div className="bg-white p-10 rounded-[40px] text-center border-[10px] border-yellow-400 max-w-[300px] w-full relative">
        <FiGift
          size={50}
          className="mx-auto text-yellow-500 animate-bounce mb-4"
        />
        <h2 className="text-black text-3xl font-black italic">TEBRİKLER!</h2>
        <p className="my-4 text-black font-black text-xl border-y-2 border-dashed border-zinc-200 py-4 uppercase leading-none">
          {wonPrize}
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          KAPAT
        </Button>
      </div>
    </div>
  );
};
