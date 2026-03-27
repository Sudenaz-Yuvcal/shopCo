import { useForm, type SubmitHandler } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ICheckoutForm } from "../types/checkout";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutSchema } from "../utils/schemas";
import ShippingSection from "../sections/checkout/shipping-section";
import PaymentSection from "../sections/checkout/payment-section";
import CheckoutSummary from "../sections/checkout/checkout-summary";
import type { FieldErrors } from "react-hook-form";

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICheckoutForm>({
    resolver: yupResolver(checkoutSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ICheckoutForm> = (data) => {
    const loadingToast = toast.loading("ÖDEME İŞLENİYOR...", {
      position: "top-center",
      theme: "dark",
    });

    console.log("Sipariş Verisi:", data);

    setTimeout(() => {
      toast.update(loadingToast, {
        render: "ÖDEME ONAYLANDI!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        theme: "dark",
      });
      clearCart();
      navigate("/success");
    }, 2500);
  };
  const onError = (errors: FieldErrors<ICheckoutForm>) => {
    console.log("Form Hataları:", errors);

    Object.keys(errors).forEach((key) => {
      console.warn(
        `Hatalı Alan: ${key} ->`,
        errors[key as keyof ICheckoutForm]?.message,
      );
    });
    toast.error("LÜTFEN TÜM ALANLARI DOĞRU DOLDURUN!", {
      theme: "dark",
      position: "top-center",
    });
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
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex flex-col lg:grid lg:grid-cols-12 gap-16"
        >
          <div className="lg:col-span-7 space-y-24">
            <ShippingSection register={register} errors={errors} />
            <PaymentSection
              register={register}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="lg:col-span-5">
            <CheckoutSummary cart={cart} totals={totals} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
