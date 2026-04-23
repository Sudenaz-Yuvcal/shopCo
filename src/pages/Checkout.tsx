import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ICheckoutForm } from "../types/checkout";
import CheckoutForm from "../components/Cart/CheckoutForm";
import CheckoutSummary from "../sections/checkout/checkout-summary";
import { TURKISH_CITIES } from "../constants/Cities";

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const { watch } = useForm<ICheckoutForm>();

  const watchedCity = watch("city") || "";

  const filteredCities = TURKISH_CITIES.filter((city) =>
    city.toLowerCase().includes(watchedCity.toLowerCase()),
  );

  const handleCheckoutSubmit = (data: ICheckoutForm) => {
    for (const item of cart) {
      const selectedVariant = item.variants?.find(
        (v) => v.color === item.color && v.size === item.size,
      );

      const currentStock = selectedVariant?.stock ?? 0;

      if (item.quantity > 10) {
        toast.error(`${item.name} için maksimum 10 adet sınırı aşılmış!`, {
          position: "top-center",
          theme: "dark",
        });
        return; 
      }

      if (item.quantity > currentStock) {
        toast.error(
          `Üzgünüz, ${item.name} (${item.size}) için yeterli stok yok!`,
          {
            position: "top-center",
            theme: "dark",
          },
        );
        return;
      }
    }

    console.log("Form Doğrulandı, İşlem Başlıyor:", data);

    const loadingToast = toast.loading("ÖDEME İŞLENİYOR...", {
      position: "top-center",
      theme: "dark",
    });

    setTimeout(() => {
      toast.update(loadingToast, {
        render: "ÖDEME ONAYLANDI!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        theme: "dark",
      });

      clearCart();
      setTimeout(() => {
        navigate("/success");
      }, 800);
    }, 2500);
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
