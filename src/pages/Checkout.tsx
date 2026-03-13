import { useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TURKISH_CITIES } from "../constants/Cities";
import type { ICheckoutForm } from "../types/checkout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FiLock, FiCreditCard } from "react-icons/fi";

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const {
    final: finalPrice,
    subtotal: totalPrice,
    delivery: deliveryFee,
  } = totals;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<ICheckoutForm>();


  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setValue("cardNumber", value, { shouldValidate: true });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length >= 2) {
      let month = parseInt(value.substring(0, 2));
      if (month > 12) month = 12;
      if (month === 0) month = 1;
      const formattedMonth = month.toString().padStart(2, "0");

      value =
        formattedMonth + (value.length > 2 ? "/" + value.substring(2, 4) : "");
    }
    setValue("expiryDate", value.slice(0, 5), { shouldValidate: true });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setValue("cvc", value, { shouldValidate: true });
  };

  const onSubmit = (_data: ICheckoutForm) => {
    toast.loading("ÖDEME İŞLENİYOR...", {
      position: "top-center",
      theme: "dark",
    });

    setTimeout(() => {
      toast.dismiss();
      toast.success("ÖDEME ONAYLANDI!", { theme: "dark" });
      clearCart();
      navigate("/success");
    }, 2500);
  };

  return (
    <div className="bg-white min-h-screen font-satoshi">
      <Helmet>
        <title>Güvenli Ödeme | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-black text-left">
        <div className="flex items-center gap-4 mb-10 border-b-[6px] border-black pb-8">
          <h1 className="text-5xl md:text-7xl font-[1000] uppercase tracking-tighter italic leading-none">
            ÖDEME
          </h1>
          <span className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full italic tracking-widest">
            SECURE 256-BIT
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:grid lg:grid-cols-12 gap-16"
        >
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
                <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
                  01
                </span>
                <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">
                  TESLİMAT ADRESİ
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  {...register("firstName", { required: "Ad zorunlu" })}
                  placeholder="AD"
                  className="!rounded-3xl !py-5 font-black italic uppercase"
                />
                <Input
                  {...register("lastName", { required: "Soyad zorunlu" })}
                  placeholder="SOYAD"
                  className="!rounded-3xl !py-5 font-black italic uppercase"
                />
                <Input
                  {...register("email", {
                    required: "E-posta zorunlu",
                    pattern: /^\S+@\S+$/i,
                  })}
                  type="email"
                  placeholder="E-POSTA"
                  className="md:col-span-2 !rounded-3xl !py-5 font-black"
                />
                <Input
                  {...register("address", { required: "Adres zorunlu" })}
                  placeholder="ADRES DETAYI"
                  className="md:col-span-2 !rounded-3xl !py-5 font-black italic uppercase"
                />
                <div className="relative">
                  <Input
                    {...register("city", { required: "Şehir zorunlu" })}
                    list="city-list"
                    placeholder="ŞEHİR"
                    className="!rounded-3xl !py-5 font-black italic uppercase"
                  />
                  <datalist id="city-list">
                    {TURKISH_CITIES.map((city: string) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <Input
                  {...register("zipCode", {
                    required: true,
                    pattern: /^\d{5}$/,
                  })}
                  placeholder="POSTA KODU (5 HANE)"
                  maxLength={5}
                  className="!rounded-3xl !py-5 font-black"
                />
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4">
                <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic">
                  02
                </span>
                <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">
                  KART DETAYLARI
                </h2>
              </div>
              <div className="bg-[#FAFAFA] p-8 rounded-[40px] border border-zinc-100 space-y-6">
                <Input
                  {...register("cardName", { required: true })}
                  placeholder="KART ÜZERİNDEKİ İSİM"
                  className="!rounded-2xl !py-5 bg-white border-none shadow-sm font-black italic uppercase"
                />

                <div className="relative">
                  <Input
                    {...register("cardNumber", {
                      required: true,
                      minLength: 16,
                    })}
                    placeholder="KART NUMARASI (16 HANE)"
                    onChange={handleCardNumberChange}
                    maxLength={16}
                    className="!rounded-2xl !py-5 bg-white border-none shadow-sm font-black tracking-[0.2em]"
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
                      minLength: 5,
                    })}
                    placeholder="AA / YY"
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="!rounded-2xl !py-5 bg-white border-none shadow-sm text-center font-black"
                  />
                  <Input
                    {...register("cvc", { required: true, minLength: 3 })}
                    placeholder="CVC"
                    onChange={handleCvcChange}
                    maxLength={3}
                    className="!rounded-2xl !py-5 bg-white border-none shadow-sm text-center font-black"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="border-2 border-black rounded-[50px] p-10 bg-white sticky top-32 space-y-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-[1000] uppercase tracking-tighter italic border-b-4 border-black pb-6">
                ÖZET
              </h2>

              <div className="max-h-[300px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex justify-between items-center group"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-100 shrink-0 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-[1000] text-sm uppercase italic leading-none mb-1">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          {item.size} | {item.quantity} ADET
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-lg italic">
                      ${item.value * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t-2 border-zinc-100 text-[11px] font-black uppercase tracking-widest text-zinc-400 italic">
                <div className="flex justify-between">
                  <span>ARA TOPLAM</span>
                  <span className="text-black text-sm">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>KARGO</span>
                  <span className="text-black text-sm">
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-6 flex justify-between items-end border-t-2 border-black">
                  <span className="text-black text-sm">TOPLAM</span>
                  <span className="text-black text-5xl font-[1000] tracking-tighter italic leading-none">
                    ${finalPrice}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full !py-8 !rounded-full italic tracking-[0.3em] shadow-2xl hover:bg-zinc-900 transition-all"
              >
                ÖDEMEYİ TAMAMLA <FiLock className="ml-2 inline" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
