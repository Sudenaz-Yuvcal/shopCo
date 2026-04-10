import type { APIProduct } from "../types/api";
import type { Product } from "../types/product";

export const cleanImageUrl = (url: string): string => {
  if (!url) return "https://placehold.co/600x800?text=SHOP.CO";

  let cleaned = url.replace(/[\[\]"]/g, "").replace(/\\/g, "");

  // if (cleaned.includes("files/")) {
  //   return "https://placehold.co/600x800?text=Gecersiz+Resim";
  // }

  return cleaned;
};

export const getCleanProducts = (data: APIProduct[]): Product[] => {
  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

  return data
    .filter((p: APIProduct) => {
      const firstImage = p.images?.[0] || "";

      return (
        p.title &&
        p.title.length > 2 &&
        p.images &&
        p.images.length > 0 &&
        !firstImage.includes("placehold") &&
        !firstImage.includes("600x400")
      );
    })
    .map((p: APIProduct) => {
      const cleanImage = cleanImageUrl(p.images[0]);

      return {
        id: p.id,
        name: p.title,
        image: cleanImage,
        value: p.price,
        price: p.price,
        category: p.category?.name || "Mağaza",
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
        color: "black",
      };
    });
};
