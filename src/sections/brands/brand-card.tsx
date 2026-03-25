import { FiArrowUpRight } from "react-icons/fi";

interface BrandCardProps {
  brand: {
    id: number;
    name: string;
    desc: string;
    color: string;
  };
  onClick: () => void;
}

const BrandCard = ({ brand, onClick }: BrandCardProps) => (
  <div
    onClick={onClick}
    className="group relative h-64 bg-brand-offwhite border border-zinc-100 rounded-[40px] cursor-pointer overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"
  >
    
    <div
      className={`absolute inset-0 bg-gradient-to-br ${brand.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
    />
    <div className="relative h-full z-10 p-10 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-black text-3xl md:text-4xl font-[1000] tracking-tighter italic leading-none transition-transform duration-500 group-hover:-translate-y-1">
            {brand.name}
          </h2>
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] italic group-hover:text-black transition-colors">
            {brand.desc}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white border border-zinc-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500 transform group-hover:rotate-45 shadow-sm">
          <FiArrowUpRight size={20} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-zinc-300 group-hover:text-black transition-colors">
          KOLEKSİYONU GÖR
        </span>
        <div className="h-1 w-0 bg-black transition-all duration-700 group-hover:w-full absolute bottom-0 left-0" />
      </div>
    </div>
  </div>
);

export default BrandCard;
