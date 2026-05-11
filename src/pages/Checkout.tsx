import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/Cart/CheckoutForm";
import CheckoutSummary from "../sections/checkout/checkout-summary";
import { supabase } from "../lib/supabase";
import { TURKISH_CITIES } from "../constants/Cities";
import type { ICheckoutForm } from "../types/checkout";

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckoutSubmit = async (data: ICheckoutForm) => {
    console.log("Butona basıldı, fonksiyon başladı");

    const loadingToast = toast.loading("SİPARİŞİNİZ HAZIRLANIYOR...", {
      theme: "dark",
    });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("2. Kullanıcı:", user?.id || "Giriş yapılmamış");

      const payload = {
        customer_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        address: `${data.address}, ${data.city}`,
        total_price:
          Number(totals.final?.toString().replace(/[^0-9.-]+/g, "")) || 0,
        status: "pending",
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        user_id: user?.id || null,
      };

      console.log("3. Gönderilen Veri (Payload):", payload);

      const { data: orderResponse, error: orderError } = await supabase
        .from("orders")
        .insert([payload])
        .select();

      if (orderError) {
        console.error("4. SUPABASE HATASI:", orderError.message);
        toast.update(loadingToast, {
          render: `Hata: ${orderError.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }

      console.log("5. BAŞARILI! Gelen Veri:", orderResponse);

      try {
        const updatePromises = cart.map((item) =>
          supabase.rpc("update_variant_stock_jsonb", {
            target_id: item.id,
            variant_size: item.size,
            amount_change: -item.quantity,
          }),
        );
        await Promise.all(updatePromises);
      } catch (stockErr) {
        console.warn("Stok güncellenirken hata oluştu:", stockErr);
      }

      toast.update(loadingToast, {
        render: "SİPARİŞ ALINDI! YÖNLENDİRİLİYORSUNUZ...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        theme: "dark",
      });

      clearCart();
      setTimeout(() => navigate("/success"), 800);
    } catch (err: unknown) {
      console.error("Beklenmedik Hata:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Bir şeyler ters gitti.";

      toast.update(loadingToast, {
        render: errorMessage.toUpperCase(),
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
            filteredCities={[...TURKISH_CITIES]}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
