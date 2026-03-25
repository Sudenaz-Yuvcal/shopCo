import { FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in duration-700">
      <div className="w-32 h-32 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <FiShoppingBag size={48} className="text-zinc-200" />
      </div>
      <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-zinc-300">
        SEPETİN ŞU AN BOŞ
      </h2>
      <Button
        variant="primary"
        size="xl"
        onClick={() => navigate("/shop")}
        className="px-16 !rounded-full italic"
      >
        KEŞFETMEYE BAŞLA
      </Button>
    </div>
  );
};

export default EmptyCart;
