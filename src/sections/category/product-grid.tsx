import ProductCard from "../../components/product/ProductCard";
import { RiEqualizerLine } from "react-icons/ri";
import type { Product } from "../../types/product";

interface ProductGridProps {
  products: Product[];
  handleResetFilters: () => void;
}

const ProductGrid = ({ products, handleResetFilters }: ProductGridProps) => (
  <div className="flex-1">
    {products.length > 0 ? (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-in fade-in duration-1000">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    ) : (
      <div className="w-full py-40 flex flex-col items-center justify-center border-4 border-dashed border-zinc-50 rounded-[60px] opacity-40">
        <RiEqualizerLine size={60} className="text-zinc-200 mb-6" />
        <p className="font-black uppercase text-[11px] tracking-[0.4em] italic text-zinc-400 text-center leading-relaxed">
          KRİTERLERE UYGUN <br /> BİR TASARIM BULUNAMADI
        </p>
        <button onClick={handleResetFilters} className="mt-8 text-[10px] font-black underline uppercase tracking-widest hover:text-black">SIFIRLA</button>
      </div>
    )}
  </div>
);

export default ProductGrid;