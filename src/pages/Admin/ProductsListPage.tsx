import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  RiDeleteBin6Line,
  RiEditLine,
  RiAddLine,
  RiBox3Line,
  RiPriceTag3Line,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../constants/Style";
import { toast } from "react-hot-toast";
import type { Product, ProductVariant } from "../../types/product"; 

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [deleteId, setDeleteId] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("ENVANTER YÜKLENEMEDİ");
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const deleteProduct = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteId.id);

    if (!error) {
      toast.success("ÜRÜN SİSTEMDEN KALDIRILDI");
      setProducts(products.filter((p) => p.id !== deleteId.id));
      setDeleteId(null);
    } else {
      toast.error("SİLME İŞLEMİ BAŞARISIZ");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getCategoryName = (id: number | string) => {
    return CATEGORIES.find((c) => String(c.id) === String(id))?.name || "Genel";
  };

  const calculateTotalStock = (variants: ProductVariant[]) => {
    if (!variants || !Array.isArray(variants)) return 0;
    return variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
  };

  return (
    <div className="animate-shop-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-admin-muted text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Inventory Management
          </p>
          <h1 className="text-6xl font-heavy italic uppercase tracking-tighter leading-none">
            Ürünler
          </h1>
        </div>
        <Link
          to="/admin/add-product"
          className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[11px] tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <RiAddLine size={20} /> Yeni Ürün Tanımla
        </Link>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-40 text-center font-heavy italic text-2xl animate-pulse text-zinc-800 uppercase tracking-tighter">
            Veritabanı Taranıyor...
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="group bg-admin-card border border-admin-border p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-white/20"
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 relative flex-shrink-0">
                  <img
                    src={p.images?.[0] || p.image_url}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt={p.title || "Product"}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white text-black text-[8px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm">
                      {p.brand}
                    </span>
                    <span className="text-admin-muted font-bold text-[9px] uppercase tracking-widest">
                      / {getCategoryName(p.category_id)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-heavy uppercase italic tracking-tighter leading-none truncate max-w-[300px]">
                    {p.title || p.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-12 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                <div className="flex gap-12">
                  <div>
                    <p className="text-[9px] font-black uppercase text-admin-muted tracking-widest mb-1 flex items-center gap-2">
                      <RiBox3Line /> Stok
                    </p>
                    <p className="text-xl font-heavy italic tracking-tighter">
                      {calculateTotalStock(p.variants ?? [])}{" "}
                      <span className="text-[10px] not-italic text-zinc-500 ml-1">
                        ADET
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-admin-muted tracking-widest mb-1 flex items-center gap-2">
                      <RiPriceTag3Line /> Fiyat
                    </p>
                    <p className="text-xl font-heavy italic tracking-tighter text-white">
                      ${p.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                    className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <RiEditLine size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p)}
                    className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-zinc-400 hover:text-admin-danger hover:bg-admin-danger/10 transition-all"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-shop-fade-in">
          <div className="bg-admin-card border border-admin-border p-12 max-w-md w-full rounded-[40px] relative overflow-hidden shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-admin-danger/10 text-admin-danger rounded-full flex items-center justify-center mx-auto mb-6">
                <RiDeleteBin6Line size={40} />
              </div>
              <h2 className="text-3xl font-heavy italic uppercase tracking-tighter leading-none mb-4">
                SİSTEMDEN <br />{" "}
                <span className="text-admin-danger">KALDIR</span>
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Bu işlem geri alınamaz
              </p>
            </div>

            <div className="bg-white/5 rounded-[24px] p-6 mb-8 border border-white/5">
              <p className="text-[8px] font-black text-admin-muted uppercase tracking-[0.3em] mb-2 text-center">
                Silinecek Ürün
              </p>
              <p className="font-heavy text-xl text-white text-center italic uppercase tracking-tighter leading-tight">
                "{deleteId.title || deleteId.name}"
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={deleteProduct}
                className="w-full bg-admin-danger text-white py-6 rounded-2xl font-heavy italic uppercase text-lg tracking-tighter hover:bg-red transition-all active:scale-[0.98]"
              >
                VERİLERİ İMHA ET
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="w-full bg-transparent text-zinc-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
              >
                SİSTEMDE TUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
