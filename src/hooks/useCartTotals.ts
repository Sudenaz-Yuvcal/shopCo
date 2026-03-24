import { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { usePromo } from "../context/PromoContext";

const FREE_DELIVERY_LIMIT = 300;
const SHIPPING_COST = 15;

export const useCartTotals = () => {
  const { cart } = useCart();
  const { appliedPromoCode } = usePromo();

  return useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.value * item.quantity,
      0,
    );

    const raw = cart.reduce(
      (acc, item) => acc + (item.oldValue || item.value) * item.quantity,
      0,
    );

    let promoDiscount = 0;
    if (appliedPromoCode === "SUDE30") {
      promoDiscount = subtotal * 0.3;
    }
    if (appliedPromoCode === "HOSGELDIN50" && subtotal >= 500) {
      promoDiscount = subtotal * 0.5;
    }

    const isFreeDelivery =
      subtotal - promoDiscount >= FREE_DELIVERY_LIMIT || cart.length === 0;
    const delivery = isFreeDelivery ? 0 : SHIPPING_COST;

    const final = subtotal - promoDiscount + delivery;

    return {
      raw,
      subtotal,
      itemDiscount: raw - subtotal,
      promoDiscount,
      delivery,
      final,
    };
  }, [cart, appliedPromoCode]);
};
