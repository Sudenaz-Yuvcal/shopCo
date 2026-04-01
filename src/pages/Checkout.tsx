import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ICheckoutForm } from "../types/checkout";
import CheckoutForm from "../components/Cart/CheckoutForm";
import CheckoutSummary from "../sections/checkout/checkout-summary";
import { TURKISH_CITIES } from "../constants/Cities";

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckoutSubmit = (data: ICheckoutForm) => {
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
            filteredCities={[...TURKISH_CITIES]}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-10 space-y-6">
            <CheckoutSummary cart={cart} totals={totals} />

            <button
              form="checkout-form"
              type="submit"
              className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-zinc-900 transition-all active:scale-[0.98]"
            >
              ÖDEMEYİ TAMAMLA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
