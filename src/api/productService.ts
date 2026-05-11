import { supabase } from "../lib/supabase";

interface SupabaseProductRow {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  created_at: string;
  brand?: string;
  slug: string; 
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
  title?:string;
  stock?:number;
  rating?:number;
  slug: string;
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
  id: Number(row.id),
  name: row.title || "",
  price: row.price || 0,
  description: row.description || "",
  images: row.images || [],
  brand: row.brand || "",
  slug: row.slug || "",
  faqs: row.faqs || [],
  category: row.category || null,
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
    return (data || []).map(mapProductRow);
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
};

export const getProductBySlug = async (
  slug: string,
): Promise<APIProduct | null> => {
  try {
    if (!slug) {
      console.error("Sorgulama için geçerli bir slug sağlanmadı.");
      return null;
    }

    const { data, error } = await supabase
      .from("products")
      .select(`*, category:categories (id, name, image)`)
      .eq("slug", slug)
      .maybeSingle(); 

    if (error) throw error;
    return data ? mapProductRow(data) : null;
  } catch (error) {
    console.error("Ürün detayı çekilirken hata:", error);
    return null;
  }
};
