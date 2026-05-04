export const cleanImageUrl = (url: string): string => {
  if (!url) return "";
  let cleaned = url.replace(/^\["?|"?\]$/g, "").replace(/\\"/g, '"');
  cleaned = cleaned.replace(/^"|"$/g, "");
  return cleaned;
};
export const getCleanProducts = (data: any[] = []): any[] => {
  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

  return data.map((p) => {
    const productId = Number(p.id);

    const categoryMap: Record<number, string> = {
      1: "Casual",
      2: "Formal",
      3: "Gym",
      4: "Party",
    };

    const rawCatId = Number(p.category_id || p.category?.id);

    return {
      ...p,
      id: productId,
      name: p.title || p.name || "İsimsiz Ürün",
      price: Number(p.price || 0),
      value: Number(p.price || 0),
      category: categoryMap[rawCatId] || "Mağaza",
      category_id: rawCatId,
      brand: p.brand || BRANDS[productId % BRANDS.length],
      image: p.images?.[0] || p.image || "",
      rating: p.rating || parseFloat((3.8 + (productId % 12) / 10).toFixed(1)),
      variants: p.variants || [],
      faqs: p.faqs || [],
    };
  });
};
