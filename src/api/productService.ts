import { supabase } from "../lib/supabase";

interface SupabaseProductRow {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  created_at: string;
  category_id: number;
  brand?: string;
  faqs?: { question: string; answer: string }[];
  variants: {
    size: string;
    color: string;
    stock: number;
  }[];
  category: {
    id: number;
    name: string;
    image: string;
  } | null;
}

export interface APIProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  brand: string;
  faqs: { question: string; answer: string }[];
  variants: {
    size: string;
    color: string;
    stock: number;
  }[];
  category: {
    id: number;
    name: string;
    image: string;
  } | null;
  created_at?: string;
}

const mapProductRow = (row: SupabaseProductRow): APIProduct => ({
  id: row.id,
  name: row.title,
  price: row.price,
  description: row.description,
  images: row.images,
  brand: row.brand || "",
  faqs: row.faqs || [],
  category: row.category,
  created_at: row.created_at,
  variants: row.variants || [],
});

export const getProducts = async (): Promise<APIProduct[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`*, category:categories (id, name, image)`)
      .order("id", { ascending: false });

    if (error) throw error;

    const rows = data as SupabaseProductRow[];
    return rows.map(mapProductRow);
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
};

export const getProductBySlug = async (
  identifier: string,
): Promise<APIProduct | null> => {
  try {
    const idStr = identifier.includes("-")
      ? identifier.split("-").pop()
      : identifier;
    const id = Number(idStr);

    if (isNaN(id)) return null;

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *, 
        category:categories (id, name, image)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return mapProductRow(data as SupabaseProductRow);
  } catch (error) {
    console.error("Ürün detayı çekilirken hata:", error);
    return null;
  }
};
