import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiShoppingCart2Line,
  RiUserLine,
  RiSearchLine,
  RiArrowDownSLine,
  RiCloseLine,
  RiHeartLine,
} from "react-icons/ri";
import { HiMenuAlt1 } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useWishlist } from "../context/WishlistContext";
import { ALL_PRODUCTS } from "../constants/Product";
import type { Product } from "../types/product";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import WheelOfFortune from "../sections/home/wheel-of-fortune";
const normalizeString = (str: string) => {
  if (!str) return "";
  return str
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

interface NavbarProps {
  setIsMenuOpen: (val: boolean) => void;
  showBanner: boolean;
  setShowBanner: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  setIsMenuOpen,
  showBanner,
  setShowBanner,
}) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useUser();
  const { wishlist } = useWishlist();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const normalizedSearch = normalizeString(searchTerm);

      const filtered = ALL_PRODUCTS.filter((product: Product) => {
        const productName = normalizeString(product.name);
        const productCategory = normalizeString(product.category);
        const productBrand = normalizeString(product.brand || "");

        return (
          productName.includes(normalizedSearch) ||
          productCategory.includes(normalizedSearch) ||
          productBrand.includes(normalizedSearch)
        );
      }).slice(0, 6);

      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchTerm]);

  const handleSeeAll = () => {
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm md:shadow-none bg-white">
      {showBanner && (
        <div className="w-full bg-black text-white py-2.5 px-4 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
            <p className="text-[10px] md:text-xs font-light tracking-wide italic">
              İlk siparişinde %20 indirim kazanmak için kayıt ol.
              <Link
                to="/register"
                className="font-[1000] underline ml-2 hover:opacity-80 transition-opacity italic"
              >
                Hemen Kaydol
              </Link>
            </p>
          </div>
          <Button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 !w-8 !h-8 !p-0 !bg-transparent !border-none !shadow-none text-white hover:rotate-90"
          >
            <RiCloseLine size={18} />
          </Button>
        </div>
      )}

      <nav className="w-full h-20 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-10">
          <div className="flex items-center gap-4 shrink-0">
            <Button
              variant="white"
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden !p-2 -ml-2 !bg-transparent !border-none !shadow-none hover:!bg-gray-50"
            >
              <HiMenuAlt1 size={28} className="text-black" />
            </Button>
            <WheelOfFortune />
            <Link to="/" className="text-3xl font-[1000] italic">
              SHOP.CO
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-black font-[1000] uppercase text-[11px] tracking-widest shrink-0">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <div className="flex items-center gap-1 hover:text-gray-400 transition-colors py-2 italic">
                <span>Mağaza</span>
                <RiArrowDownSLine
                  className={`transition-transform duration-300 ${isShopOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isShopOpen && (
                <div className="absolute top-full left-0 w-56 bg-white border border-black/5 shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1">
                    {["Erkek", "Kadın", "Çocuk"].map((cat) => (
                      <Link
                        key={cat}
                        to={`/shop?category=${cat}`}
                        className="block px-4 py-3 hover:bg-black hover:text-white rounded-xl transition-all font-black text-[10px] italic uppercase tracking-tighter"
                      >
                        {cat} Giyim
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/discount"
              className="hover:text-red-600 transition-colors italic"
            >
              İndirim
            </Link>
            <Link
              to="/newproduct"
              className="hover:text-gray-400 transition-colors italic"
            >
              Yeni Gelenler
            </Link>
            <Link
              to="/brands"
              className="hover:text-gray-400 transition-colors italic"
            >
              Markalar
            </Link>
          </div>

          <div
            className="hidden lg:block flex-1 relative max-w-md"
            ref={searchRef}
          >
            <div className="relative group">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSeeAll()}
                placeholder="ZARA, GUCCI, CALVIN ARA..."
                className="!py-3 pl-12 w-full text-[10px] bg-brand-gray border-none !rounded-full font-black tracking-widest focus:ring-2 focus:ring-black transition-all"
              />
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg group-focus-within:opacity-100 group-focus-within:text-black transition-all" />
            </div>
            {isSearchOpen && (
              <div className="absolute top-full left-0 w-full mt-3 bg-white border border-black/10 rounded-[30px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in slide-in-from-top-4 z-[100]">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-3">
                      {searchResults.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate(`/product/${p.id}`);
                            setIsSearchOpen(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-brand-soft rounded-[20px] cursor-pointer transition-all group"
                        >
                          <img
                            src={p.image}
                            className="w-14 h-14 bg-brand-surface rounded-xl shrink-0 border border-black/5"
                            alt={p.name}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-[1000] text-[11px] uppercase italic truncate text-black">
                              {p.name}
                            </h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                              {p.category} | {p.brand}
                            </p>
                          </div>
                          <p className="font-[1000] text-sm italic tracking-tighter text-black">
                            ${p.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSeeAll}
                      className="w-full !p-4 !text-[10px] tracking-[0.4em] italic"
                    >
                      TÜM KOLEKSİYONU GÖR →
                    </Button>
                  </>
                ) : (
                  <div className="p-10 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                    Sonuç bulunamadı.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link
              to="/cart"
              className="relative text-2xl hover:scale-110 transition-transform"
            >
              <RiShoppingCart2Line />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-[1000] animate-bounce border-2 border-white shadow-lg leading-none">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/wishlist"
              className="relative text-2xl hover:scale-110 transition-transform"
            >
              <RiHeartLine />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-[1000] border-2 border-white shadow-lg leading-none">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to={user ? "/account" : "/login"}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[11px] font-black border-2 border-black/10 shadow-xl hover:scale-110 transition-all uppercase italic"
            >
              {user ? user.name[0] : <RiUserLine />}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
