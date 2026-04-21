import type { APIProduct } from "../types/api";
import type { Product } from "../types/product";

interface ExtendedAPIProduct extends APIProduct {
  brand?: string;
  rating?: number;
  color?: string;
}

export const cleanImageUrl = (url: string): string => {
  if (!url) return "";

  let cleaned = url.replace(/^\["?|"?\]$/g, "").replace(/\\"/g, '"');
  cleaned = cleaned.replace(/^"|"$/g, "");

  return cleaned;
};

export const getCleanProducts = (data: APIProduct[] = []): Product[] => {
  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

  return data
    .filter((p) => {
      const firstImage = p.images?.[0] || "";
      return (
        p.title &&
        p.title.length > 2 &&
        p.images?.length > 0 &&
        !firstImage.includes("placehold") &&
        !firstImage.includes("600x400")
      );
    })
    .map((p) => {
      const item = p as ExtendedAPIProduct;

      const defaultBrand = BRANDS[p.id % BRANDS.length];
      const defaultRating = parseFloat((3.8 + (p.id % 12) / 10).toFixed(1));

      return {
        id: p.id,
        name: p.title.trim(),
        image: cleanImageUrl(p.images[0]),
        value: p.price,
        price: p.price,
        category: p.category?.name || "Mağaza",
        rating: item.rating ?? defaultRating,
        brand: item.brand ?? defaultBrand,
        color: item.color ?? "Black",
      };
    });
};
