import { Helmet } from "react-helmet-async";
import { ALL_PRODUCTS } from "../constants/Product";
import { useWishlist } from "../context/WishlistContext";
import DiscountBanner from "../sections/discount/discount-banner";
import DiscountHeader from "../sections/discount/discount-header";
import DiscountGrid from "../sections/discount/discount-grid";

const Discount = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const discountProducts = ALL_PRODUCTS.filter(
    (p) => p.oldValue && p.oldValue > p.value,
  );

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>İndirim Fırsatları | SHOP.CO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left font-satoshi">
        <DiscountBanner />
        <DiscountHeader count={discountProducts.length} />
        <DiscountGrid
          products={discountProducts}
          toggleWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
        />
      </div>
    </div>
  );
};

export default Discount;
