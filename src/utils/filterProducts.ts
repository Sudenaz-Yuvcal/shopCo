import type { Product } from "../types/product";

interface FAQ {
  question: string;
  answer: string;
}

interface RawProduct {
  id: string | number;
  title?: string;
  name?: string;
  price?: number | string;
  category_id?: number | string;
  category?: { id: number | string; name?: string };
  brand?: string;
  images?: string[];
  image?: string;
  rating?: number | string;
  variants?: { size: string; color: string; stock: number }[];
  faqs?: FAQ[];
  description?: string;
  slug?: string;
}
export const getCleanProducts = (data: RawProduct[] = []): Product[] => {
  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

  return data.map((p: RawProduct): Product => {
    const productId = Number(p.id);
    const priceNum = Number(p.price || 0);

    const categoryMap: Record<number, string> = {
      1: "Casual",
      2: "Formal",
      3: "Gym",
      4: "Party",
    };

    const rawCatId = Number(p.category_id || p.category?.id || 0);

    const cleanRating =
      typeof p.rating === "string"
        ? parseFloat(p.rating)
        : p.rating || parseFloat((3.8 + (productId % 12) / 10).toFixed(1));

    const totalStock =
      p.variants?.reduce((acc, curr) => acc + (curr.stock || 0), 0) || 0;

    return {
      id: productId,
      title: p.title || p.name || "İsimsiz Ürün",
      name: p.name || p.title || "İsimsiz Ürün",
      price: priceNum,
      value: priceNum,
      oldValue: Math.round(priceNum * 1.3),
      stock: totalStock,
      category: categoryMap[rawCatId] || "Mağaza",
      category_id: rawCatId,
      brand: p.brand || BRANDS[productId % BRANDS.length],
      image: p.images?.[0] || p.image || "/shopCO.png",
      images: p.images || (p.image ? [p.image] : []),
      rating: cleanRating,
      variants: p.variants || [],
      faqs: p.faqs || [],
      description: p.description || "Harika bir SHOP.CO ürünü.",
      slug:
        p.slug ||
        (p.title || p.name || "product").toLowerCase().replace(/\s+/g, "-"),
      created_at: new Date().toISOString(),
    };
  });
};
