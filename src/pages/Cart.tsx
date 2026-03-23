import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import {
  FiTrash2,
  FiTag,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiX,
  FiCheckCircle,
  FiShoppingBag,
  FiRotateCcw,
  FiCreditCard,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TURKISH_CITIES } from "../constants/Cities";
import type { ICheckoutForm } from "../types/checkout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totals,
    isPromoApplied,
    appliedPromoCode,
    applyPromoCode,
    clearCart,
  } = useCart();

  const {
    raw: rawTotalPrice,
    final: finalPrice,
    subtotal: totalPrice,
    promoDiscount,
    delivery: deliveryFee,
  } = totals;

  const { user, addOrder } = useUser();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [progress, setProgress] = useState(100);
  const [isCouponValid, setIsCouponValid] = useState(false);

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

  useEffect(() => {
    const isRegistrant = localStorage.getItem("is_new_registrant") === "true";
    const expiry = localStorage.getItem("welcome_coupon_expiry");
    if (isRegistrant && expiry) {
      const now = new Date();
      if (now < new Date(expiry)) setIsCouponValid(true);
      else {
        localStorage.removeItem("is_new_registrant");
        localStorage.removeItem("welcome_coupon_expiry");
        setIsCouponValid(false);
      }
    }
  }, []);

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

  const showNotify = (msg: string, type: "success" | "error" = "success") =>
    setNotification({ msg, type });

  const handleApplyPromo = (code?: string) => {
    const targetCode =
      typeof code === "string" ? code : promoInput.trim().toUpperCase();
    if (!targetCode && !isPromoApplied) return;
    const result = applyPromoCode(targetCode);
    if (result.success) {
      showNotify(result.message, "success");
    } else {
      showNotify(result.message, "error");
    }
    setPromoInput("");
  };

  const onCheckoutSubmit = (data: ICheckoutForm) => {
    if (!user) {
      showNotify("ÖNCE GİRİŞ YAPMALISIN!", "error");
      return;
    }
    const orderId = addOrder(
      cart.map((item) => ({ ...item })),
      Math.round(Number(finalPrice)),
    );
    localStorage.removeItem("is_new_registrant");
    localStorage.removeItem("welcome_coupon_expiry");
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

  if (cart.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <FiShoppingBag size={48} className="text-zinc-200" />
        </div>
        <h2 className="text-4xl font-heavy uppercase tracking-tighter mb-4 italic text-zinc-300">
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
          className={`fixed bottom-10 right-10 z-[1000] bg-black text-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] border ${notification.type === "success" ? "border-white/10" : "border-red-600"} w-80 overflow-hidden animate-in slide-in-from-right-10 duration-500`}
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

        <h1 className="text-5xl md:text-7xl font-heavy mb-12 uppercase tracking-tighter italic border-b-[6px] border-black pb-8 inline-block leading-none">
          {showCheckout ? "ÖDEME" : "SEPETİM"}
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 w-full space-y-8">
            {!showCheckout ? (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-8 p-6 bg-zinc-50 rounded-[40px] border border-transparent hover:border-zinc-200 transition-all group"
                  >
                    <div className="w-32 h-32 bg-white rounded-[30px] overflow-hidden shadow-sm shrink-0 border border-zinc-100">
                      <img
                        src={item.image || undefined}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-heavy text-2xl uppercase tracking-tighter italic leading-none">
                            {item.name}
                          </h3>
                          <p className="text-[10px] font-black text-zinc-400 mt-3 uppercase tracking-widest italic">
                            {item.size} • {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.size, item.color)
                          }
                          className="text-zinc-300 hover:text-red-600 transition-colors p-2"
                        >
                          <FiTrash2 size={22} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-baseline gap-3">
                          <span className="font-heavy text-3xl tracking-tighter italic">
                            ${item.value}
                          </span>
                        </div>
                        <div className="bg-white border border-zinc-100 px-6 py-3 rounded-full flex gap-8 items-center shadow-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, -1)
                            }
                            className="text-zinc-400 hover:text-black"
                          >
                            <FiMinus />
                          </button>
                          <span className="font-black text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, 1)
                            }
                            className="text-zinc-400 hover:text-black"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form
                id="checkout-form"
                onSubmit={handleSubmit(onCheckoutSubmit)}
                className="space-y-12 animate-in slide-in-from-left duration-700"
              >
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
                    <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
                      01
                    </span>
                    <h2 className="text-2xl font-heavy uppercase italic tracking-tighter">
                      TESLİMAT BİLGİLERİ
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      {...register("firstName", { required: true })}
                      placeholder="AD"
                      style={errorStyle(errors.firstName)}
                      onChange={(e) => {
                        let val = e.target.value.replace(
                          /[^A-Za-zÇĞİÖŞÜçğıöşü ]/g,
                          "",
                        );
                        val = val.replace(/\s{2,}/g, " ");
                        e.target.value = val.toUpperCase();
                      }}
                      className="!rounded-3xl !py-5 font-black italic"
                    />
                    <Input
                      {...register("lastName", { required: true })}
                      placeholder="SOYAD"
                      style={errorStyle(errors.lastName)}
                      onChange={(e) => {
                        let val = e.target.value.replace(
                          /[^A-Za-zÇĞİÖŞÜçğıöşü ]/g,
                          "",
                        );
                        val = val.replace(/\s{2,}/g, " "); 
                        e.target.value = val.toUpperCase();
                      }}
                      className="!rounded-3xl !py-5 font-black italic"
                    />
                    <Input
                      {...register("email", {
                        required: true,
                        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      })}
                      placeholder="E-POSTA"
                      style={errorStyle(errors.email)}
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .toLowerCase()
                          .replace(
                            /[çğışüö]/g,
                            (m) =>
                              ({
                                ç: "c",
                                ğ: "g",
                                ı: "i",
                                ş: "s",
                                ü: "u",
                                ö: "o",
                              })[m] || m,
                          )
                          .replace(/\s/g, ""); 
                      }}
                      className="md:col-span-2 !rounded-3xl !py-5 font-black italic"
                    />
                    <Input
                      {...register("address", { required: true })}
                      placeholder="ADRES"
                      style={errorStyle(errors.address)}
                      className="md:col-span-2 !rounded-3xl !py-5 font-black italic"
                    />
                    <div className="relative">
                      <Input
                        {...register("city", { required: true })}
                        placeholder="ŞEHİR"
                        style={errorStyle(errors.city)}
                        onFocus={() => setShowCityList(true)}
                        className="!rounded-3xl !py-5 font-black italic"
                      />
                      {showCityList && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-100 rounded-[30px] shadow-2xl z-50 max-h-60 overflow-y-auto p-4">
                          {filteredCities.map((city) => (
                            <div
                              key={city}
                              onClick={() => {
                                setValue("city", city, {
                                  shouldValidate: true,
                                });
                                setShowCityList(false);
                              }}
                              className="p-4 hover:bg-black hover:text-white rounded-2xl cursor-pointer text-[11px] font-black italic uppercase tracking-widest"
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
                    <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
                      02
                    </span>
                    <h2 className="text-2xl font-heavy uppercase italic tracking-tighter">
                      ÖDEME DETAYLARI
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <Input
                      {...register("cardName", { required: true })}
                      placeholder="KART SAHİBİ"
                      style={errorStyle(errors.cardName)}
                      onChange={(e) =>
                        (e.target.value = e.target.value
                          .toUpperCase()
                          .replace(/[0-9]/g, ""))
                      }
                      className="!rounded-3xl !py-5 font-black italic"
                    />
                    <div className="relative">
                      <Input
                        {...register("cardNumber", {
                          required: true,
                          minLength: 16,
                        })}
                        maxLength={16}
                        placeholder="KART NUMARASI"
                        style={errorStyle(errors.cardNumber)}
                        onChange={(e) =>
                          (e.target.value = e.target.value.replace(/\D/g, ""))
                        }
                        className="!rounded-3xl !py-5 font-black italic"
                      />
                      <FiCreditCard
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300"
                        size={24}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        {...register("expiryDate", {
                          required: true,
                          pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        })}
                        maxLength={5}
                        placeholder="AA/YY"
                        style={errorStyle(errors.expiryDate)}
                        className="!rounded-3xl !py-5 text-center font-black italic"
                      />
                      <Input
                        {...register("cvc", { required: true, minLength: 3 })}
                        maxLength={3}
                        placeholder="CVC"
                        style={errorStyle(errors.cvc)}
                        onChange={(e) =>
                          (e.target.value = e.target.value.replace(/\D/g, ""))
                        }
                        className="!rounded-3xl !py-5 text-center font-black italic"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 w-full sticky top-32">
            <div className="bg-zinc-50 rounded-[50px] p-10 space-y-10 border border-zinc-100 shadow-sm">
              <h2 className="text-3xl font-heavy uppercase italic tracking-tighter border-b-4 border-black pb-6 leading-none">
                SİPARİŞ ÖZETİ
              </h2>
              <div className="space-y-6 text-[11px] font-black tracking-[0.2em] uppercase italic text-zinc-400">
                <div className="flex justify-between">
                  <span>ARA TOPLAM</span>
                  <span className="text-black text-lg font-black italic tracking-tighter">
                    ${rawTotalPrice}
                  </span>
                </div>
                {rawTotalPrice > totalPrice && (
                  <div className="flex justify-between text-zinc-400">
                    <span>ÜRÜN İNDİRİMİ</span>
                    <span className="text-lg font-black">
                      -${Math.round(Number(rawTotalPrice) - Number(totalPrice))}
                    </span>
                  </div>
                )}
                {isPromoApplied && (
                  <div className="flex justify-between text-red-600 animate-pulse">
                    <span>{appliedPromoCode} KODU</span>
                    <span className="text-lg font-black">
                      -${Math.round(Number(promoDiscount))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>KARGO</span>
                  <span className="text-black text-lg font-black">
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-6 border-t-2 border-zinc-200 flex justify-between items-end">
                  <span className="text-black text-sm">NET TOPLAM</span>
                  <span className="text-black text-5xl font-heavy tracking-tighter italic leading-none">
                    ${Math.round(Number(finalPrice))}
                  </span>
                </div>
              </div>

              {!showCheckout ? (
                <div className="space-y-6 pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative group">
                      <FiTag className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                      <Input
                        placeholder="KUPON KODU"
                        value={promoInput}
                        onChange={(e) =>
                          setPromoInput(e.target.value.toUpperCase())
                        }
                        className="!pl-14 !rounded-full !py-5 !bg-white !border-zinc-100 font-black italic text-xs uppercase"
                      />
                    </div>
                    <Button
                      onClick={() =>
                        handleApplyPromo(isPromoApplied ? "" : promoInput)
                      }
                      variant={isPromoApplied ? "danger" : "primary"}
                      className="!rounded-full !px-10 italic"
                    >
                      {isPromoApplied ? (
                        <FiRotateCcw className="animate-spin-slow" />
                      ) : (
                        "UYGULA"
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="primary"
                    size="xl"
                    onClick={() => setShowCheckout(true)}
                    className="w-full !py-6 !rounded-full italic tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-transform"
                  >
                    ÖDEMEYE GEÇ →
                  </Button>
                </div>
              ) : (
                <Button
                  form="checkout-form"
                  type="submit"
                  variant="primary"
                  size="xl"
                  className="w-full !py-8 !rounded-full italic tracking-[0.3em] shadow-2xl bg-black hover:bg-zinc-800 transition-all"
                >
                  SİPARİŞİ TAMAMLA
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
