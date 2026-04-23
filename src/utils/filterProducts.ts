import type { Product } from "../types/product";

interface SupabaseProduct {
  id: number | string;
  name?: string;
  title?: string;
  price?: number;
  category_id?: number | string;
  category: { id: string | number; name: string } | null | undefined;
  images?: string[];
  image?: string;
  brand?: string;
  stock?: number;
  rating?: number;
  description?: string;
}

export const cleanImageUrl = (url: string): string => {
  if (!url) return "";
  let cleaned = url.replace(/^\["?|"?\]$/g, "").replace(/\\"/g, '"');
  cleaned = cleaned.replace(/^"|"$/g, "");
  return cleaned;
};

export const getCleanProducts = (data: SupabaseProduct[] = []): Product[] => {
  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

  return data.map((p) => {
    const productName = p.name || p.title || "İsimsiz Ürün";

    let rawCatId: number = 0;
    if (p.category && typeof p.category === "object") {
      rawCatId = Number(p.category.id);
    } else if (p.category_id) {
      rawCatId = Number(p.category_id);
    }

    const categoryNames: Record<number, string> = {
      1: "Clothes",
      2: "Electronics",
      3: "Shoes",
      4: "Miscellaneous",
      5: "Furniture",
    };

    const productId = Number(p.id);
    const defaultBrand = BRANDS[productId % BRANDS.length];
    const defaultRating = parseFloat((3.8 + (productId % 12) / 10).toFixed(1));

    return {
      id: productId,
      name: productName,
      price: Number(p.price || 0),
      value: Number(p.price || 0),
      category: categoryNames[rawCatId] || "Mağaza",
      categoryId: rawCatId !== 0 ? String(rawCatId) : "",
      image:
        p.images && p.images.length > 0
          ? cleanImageUrl(p.images[0])
          : p.image || "",
      brand: p.brand || defaultBrand,
      rating: p.rating || defaultRating,
      stock: Number(p.stock ?? 0),
      description: p.description || "",
    };
  });
};
