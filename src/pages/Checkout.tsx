import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ICheckoutForm } from "../types/checkout";
import CheckoutForm from "../components/Cart/CheckoutForm";
import CheckoutSummary from "../sections/checkout/checkout-summary";
import { TURKISH_CITIES } from "../constants/Cities";
import { supabase } from "../lib/supabase";

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const { watch } = useForm<ICheckoutForm>();

  const watchedCity = watch("city") || "";
  const filteredCities = TURKISH_CITIES.filter((city) =>
    city.toLowerCase().includes(watchedCity.toLowerCase()),
  );

  const handleCheckoutSubmit = async (data: ICheckoutForm) => {
    for (const item of cart) {
      const selectedVariant = item.variants?.find(
        (v: { size: string; stock: number }) => v.size === item.size,
      );

      const currentStock = selectedVariant?.stock ?? 0;

      if (item.quantity > currentStock) {
        toast.error(
          `Üzgünüz, ${item.title} (${item.size}) için yeterli stok yok! (Kalan: ${currentStock})`,
          {
            position: "top-center",
            theme: "dark",
          },
        );
        return;
      }
    }

    const loadingToast = toast.loading("ÖDEME VE STOKLAR İŞLENİYOR...", {
      position: "top-center",
      theme: "dark",
    });

    try {
      const updatePromises = cart.map((item) =>
        supabase.rpc("update_variant_stock_jsonb", {
          target_id: item.id,
          variant_size: item.size,
          variant_color: item.color, 
          amount_change: -item.quantity,
        }),
      );

      const results = await Promise.all(updatePromises);

      const firstError = results.find((res) => res.error);
      if (firstError) {
        throw new Error(
          firstError.error?.message || "Stok güncellenirken bir sorun oluştu.",
        );
      }

      toast.update(loadingToast, {
        render: "ÖDEME ONAYLANDI VE STOKLAR GÜNCELLENDİ!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        theme: "dark",
      });

      console.log("Müşteri Bilgileri:", data);

      clearCart();
      setTimeout(() => {
        navigate("/success");
      }, 800);
    } catch (error: unknown) {
      let errorMessage = "İşlem başarısız oldu.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen font-satoshi container mx-auto px-4 py-10">
      <Helmet>
        <title>Güvenli Ödeme | SHOP.CO</title>
      </Helmet>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <CheckoutForm
            onCheckoutSubmit={handleCheckoutSubmit}
            filteredCities={filteredCities}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-10 space-y-6">
            <CheckoutSummary cart={cart} totals={totals} />

            <button
              form="checkout-form"
              type="submit"
              disabled={cart.length === 0}
              className={`w-full py-5 rounded-full font-black uppercase italic tracking-widest transition-all active:scale-[0.98] ${
                cart.length === 0
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-zinc-900 shadow-xl shadow-black/10"
              }`}
            >
              {cart.length === 0 ? "SEPETİNİZ BOŞ" : "ÖDEMEYİ TAMAMLA"}
            </button>

            {cart.length > 0 && (
              <p className="text-[10px] text-zinc-400 text-center font-medium italic uppercase tracking-tighter">
                * Ödemeniz 256-bit SSL şifreleme ile korunmaktadır.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
