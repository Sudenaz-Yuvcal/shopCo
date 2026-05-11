import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useOrder } from "../context/OrderContext";
import { usePromo } from "../context/PromoContext";
import { useFavorite } from "../context/FavoriteContext";
import { useCartTotals } from "../hooks/useCartTotals";
import CartItemCard from "../components/Cart/CartItemCard";
import OrderSummary from "../components/Cart/OrderSummary";
import CheckoutForm from "../components/Cart/CheckoutForm";
import EmptyCart from "../sections/cart/cart-empty";
import CartNotification from "../sections/cart/cart-notification";
import CartDeleteModal from "../components/Cart/CartDeleteModal";
import { TURKISH_CITIES } from "../constants/Cities";
import type { ICheckoutForm } from "../types/checkout";
import type { CartItem } from "../context/CartContext";
import type { Product } from "../types/product";
import { supabase } from "../lib/supabase";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addOrder } = useOrder();
  const { toggleFavorite } = useFavorite();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { applyPromoCode, appliedPromoCode, isPromoApplied } = usePromo();
  const totals = useCartTotals();

  const [promoInput, setPromoInput] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [progress, setProgress] = useState(100);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: CartItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const handleOpenDeleteModal = (item: CartItem) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.item) {
      removeFromCart(
        deleteModal.item.id,
        deleteModal.item.size,
        deleteModal.item.color,
      );
      setDeleteModal({ isOpen: false, item: null });
      showNotify("ÜRÜN SEPETTEN SİLİNDİ", "error");
    }
  };

  const handleMoveToFavorites = () => {
    const item = deleteModal.item;
    if (item) {
      const { quantity, size, color, ...productData } = item;
      toggleFavorite(productData as unknown as Product);
      removeFromCart(item.id, item.size, item.color);
      setDeleteModal({ isOpen: false, item: null });
      showNotify("FAVORİLERE EKLENDİ VE SEPETTEN ÇIKARILDI 🖤", "success");
    }
  };

  const { watch } = useForm<ICheckoutForm>();
  const watchedCity = watch("city") || "";

  const showNotify = (msg: string, type: "success" | "error" = "success") =>
    setNotification({ msg, type });

  const handleApplyPromo = (code?: string) => {
    const targetCode =
      typeof code === "string" ? code : promoInput.trim().toUpperCase();
    if (!targetCode && !isPromoApplied) return;
    const result = applyPromoCode(targetCode, totals.subtotal);
    if (targetCode) {
      showNotify(result.message, result.success ? "success" : "error");
    }
    setPromoInput("");
  };

  const onCheckoutSubmit = async (data: ICheckoutForm) => {
    if (!user) return showNotify("LÜTFEN ÖNCE GİRİŞ YAPIN!", "error");

    showNotify("SİPARİŞİNİZ İŞLENİYOR...", "success");

    try {
      for (const item of cart) {
        const cleanId = parseInt(String(item.id).replace(/\D/g, ""), 10);
        const { error: rpcError } = await supabase.rpc(
          "update_variant_stock_jsonb",
          {
            target_id: cleanId,
            variant_size: item.size.trim(),
            variant_color: item.color.trim(),
            amount_change: -item.quantity,
          },
        );
        if (rpcError)
          throw new Error(`${item.name} stok hatası: ${rpcError.message}`);
      }

      const { error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            status: "Alındı",
            promo_code: isPromoApplied ? appliedPromoCode : null,
            discount_amount: Math.round(totals.promoDiscount),
            address: data.address,
            city: data.city,
            card_name: data.cardName,
            card_number: data.cardNumber,
            expiry_date: data.expiryDate,
            cvc: data.cvc,
            total_amount: Math.round(totals.final),
            items: cart.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              image: item.image,
            })),
          },
        ])
        .select();

      if (orderError) throw new Error(`Sipariş hatası: ${orderError.message}`);

      if (isPromoApplied && appliedPromoCode) {
        const { error: promoUpdateError } = await supabase.rpc(
          "increment_coupon_usage",
          {
            quote_code: appliedPromoCode.toUpperCase(),
          },
        );

        if (promoUpdateError) {
          console.error("Kupon sayacı güncellenemedi:", promoUpdateError);
        } else {
          console.log("Kupon başarıyla güncellendi!");
        }
      }
      if (isPromoApplied && appliedPromoCode) {
        const { error: promoError } = await supabase.rpc(
          "increment_coupon_usage",
          {
            quote_code: appliedPromoCode.toUpperCase(),
          },
        );
        if (promoError) console.error("Kupon sayacı artırılamadı:", promoError);
      }
  

      const orderId = addOrder(
        cart.map((item) => ({ ...item })),
        Math.round(totals.final),
      );

      showNotify(`SİPARİŞ BAŞARILI! NO: ${orderId}`, "success");

      setTimeout(() => {
        clearCart?.();
        navigate("/success");
      }, 2000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "BİR HATA OLUŞTU.";
      showNotify(message, "error");
      console.error("Checkout Error:", error);
    }
  };

  const filteredCities = useMemo(() => {
    const allCities = [...TURKISH_CITIES];
    if (!watchedCity) return allCities;
    return allCities.filter((city) =>
      city.toLowerCase().includes(watchedCity.toLowerCase()),
    );
  }, [watchedCity]);

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

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-white font-satoshi text-left container mx-auto px-4 py-10 relative overflow-x-hidden">
      <Helmet>
        <title>Shop.co | {showCheckout ? "Güvenli Ödeme" : "Sepetim"}</title>
      </Helmet>

      <CartDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirmDelete={handleConfirmDelete}
        onMoveToFavorites={handleMoveToFavorites}
      />

      <CartNotification
        notification={notification}
        setNotification={setNotification}
        progress={progress}
      />

      <button
        onClick={() =>
          showCheckout ? setShowCheckout(false) : navigate("/shop")
        }
        className="flex items-center gap-3 text-zinc-400 hover:text-black transition-all mb-10 group"
      >
        <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" />
        <span className="text-[10px] font-black tracking-widest ">
          {showCheckout ? "SEPETE DÖN" : "ALIŞVERİŞE DEVAM ET"}
        </span>
      </button>

      <h1 className="text-5xl md:text-4xl font-[1000] uppercase italic">
        {showCheckout ? "ÖDEME" : "SEPETİM"}
      </h1>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 items-start mt-10">
        <div className="lg:col-span-7 w-full space-y-8">
          {!showCheckout ? (
            <div className="space-y-6">
              {cart.map((item) => (
                <CartItemCard
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  onRemoveClick={() => handleOpenDeleteModal(item)}
                  updateQuantity={(id, size, color, newQty) =>
                    newQty < 1
                      ? handleOpenDeleteModal(item)
                      : updateQuantity(id, size, color, newQty)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <CheckoutForm
                onCheckoutSubmit={onCheckoutSubmit}
                filteredCities={filteredCities}
              />
            </div>
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
  );
};

export default Cart;
