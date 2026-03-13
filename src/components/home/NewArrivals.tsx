import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import Button from "../ui/Button";
import { ALL_PRODUCTS } from "../../constants/Product";

const NewArrivals = () => {
  const newProducts = ALL_PRODUCTS.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 border-b border-gray-100 font-satoshi">
      <h2 className="text-[36px] md:text-[52px] font-[1000] text-center mb-10 md:mb-14 uppercase tracking-[-0.05em] text-black leading-none italic">
        YENİ GELENLER
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
        {newProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="flex justify-center mt-12 md:mt-16">
        <Link to="/shop" className="w-full md:w-64">
          <Button variant="outline" size="lg" className="w-full md:w-64">
            Hepsini Gör
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
