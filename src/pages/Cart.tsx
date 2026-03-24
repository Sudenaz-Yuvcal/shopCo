import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useOrder } from "../context/OrderContext";
import {
  FiArrowLeft,
  FiX,
  FiCheckCircle,
  FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { usePromo } from "../context/PromoContext";
import { useCartTotals } from "../hooks/useCartTotals";

import Button from "../components/ui/Button";
import CartItemCard from "../components/cart/CartItemCard";
import OrderSummary from "../components/cart/OrderSummary";
import CheckoutForm from "../components/cart/CheckoutForm";

import { TURKISH_CITIES } from "../constants/Cities";
import type { ICheckoutForm } from "../types/checkout";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addOrder } = useOrder();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { applyPromoCode, appliedPromoCode, isPromoApplied } = usePromo();
  const totals = useCartTotals();

  const [promoInput, setPromoInput] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [progress, setProgress] = useState(100);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICheckoutForm>();
  const watchedCity = watch("city") || "";

  const errorStyle = (isError: any) => ({
    border: isError ? "2px solid #ef4444" : "1px solid #e4e4e7",
    backgroundColor: isError ? "#fef2f2" : "white",
    transition: "all 0.3s ease",
  });

  const showNotify = (msg: string, type: "success" | "error" = "success") =>
    setNotification({ msg, type });

  const handleApplyPromo = (code?: string) => {
    const targetCode =
      typeof code === "string" ? code : promoInput.trim().toUpperCase();
    if (!targetCode && !isPromoApplied) return;

    const result = applyPromoCode(targetCode, totals.subtotal);
    if (result.success) {
      showNotify(result.message, "success");
    } else {
      showNotify(result.message, "error");
    }
    setPromoInput("");
  };

  const onCheckoutSubmit = (_data: ICheckoutForm) => {
    if (!user) {
      showNotify("ÖNCE GİRİŞ YAPMALISIN!", "error");
      return;
    }
    const orderId = addOrder(
      cart.map((item) => ({ ...item })),
      Math.round(totals.final),
    );
    showNotify(`Siparişin alındı! No: ${orderId}`, "success");
    setTimeout(() => {
      clearCart();
      navigate("/account");
    }, 2000);
  };

  const filteredCities = useMemo(
    () =>
      TURKISH_CITIES.filter((city) =>
        city.toLowerCase().includes(watchedCity.toLowerCase()),
      ),
    [watchedCity],
  );

  useEffect(() => {
    if (notification) {
      setProgress(100);
      const timer = setInterval(
        () => setProgress((p) => Math.max(0, p - 1)),
        50,
      );
      const close = setTimeout(() => setNotification(null), 5000);
      return () => {
        clearInterval(timer);
        clearTimeout(close);
      };
    }
  }, [notification]);

  if (cart.length === 0)
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

  return (
    <div className="min-h-screen bg-white font-satoshi text-left">
      <Helmet>
        <title>Shop.co | {showCheckout ? "Güvenli Ödeme" : "Sepetim"}</title>
      </Helmet>

      {notification && (
        <div
          className={`fixed bottom-10 right-10 z-[1000] bg-black text-white rounded-3xl shadow-2xl border ${notification.type === "success" ? "border-white/10" : "border-red-600"} w-80 overflow-hidden animate-in slide-in-from-right-10`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {notification.type === "success" ? (
                <FiCheckCircle className="text-green-500" size={24} />
              ) : (
                <FiAlertCircle className="text-red-500" size={24} />
              )}
              <p className="text-[10px] font-black uppercase italic tracking-widest">
                {notification.msg}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-zinc-500 hover:text-white"
            >
              <FiX />
            </button>
          </div>
          <div className="h-1 bg-zinc-800">
            <div
              className={`h-full transition-all duration-[50ms] ${notification.type === "success" ? "bg-white" : "bg-red-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() =>
            showCheckout ? setShowCheckout(false) : navigate("/shop")
          }
          className="flex items-center gap-3 text-zinc-400 hover:text-black transition-all mb-10 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">
            {showCheckout ? "SEPETE DÖN" : "ALIŞVERİŞE DEVAM ET"}
          </span>
        </button>

        <h1 className="text-5xl md:text-7xl font-black mb-12 uppercase tracking-tighter italic border-b-[6px] border-black pb-8 inline-block leading-none">
          {showCheckout ? "ÖDEME" : "SEPETİM"}
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 w-full space-y-8">
            {!showCheckout ? (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItemCard
                    key={`${item.id}-${item.size}-${item.color}`}
                    item={item}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </div>
            ) : (
              <CheckoutForm
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onCheckoutSubmit={onCheckoutSubmit}
                setValue={setValue}
                showCityList={showCityList}
                setShowCityList={setShowCityList}
                filteredCities={filteredCities}
                errorStyle={errorStyle}
              />
            )}
          </div>

          <div className="lg:col-span-5 w-full sticky top-32">
            <OrderSummary
              totals={totals}
              promoInput={promoInput}
              setPromoInput={setPromoInput}
              handleApplyPromo={handleApplyPromo}
              isPromoApplied={isPromoApplied}
              appliedPromoCode={appliedPromoCode}
              showCheckout={showCheckout}
              setShowCheckout={setShowCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
