export interface Product {
  id: number;
  name: string;
  title?: string;
  price: number;
  value: number;
  image: string;
  category: string;
  categoryId?: string;
  color?: string; 
  oldValue?: number;
  rating: number;
  brand?: string;
  size?: string[]; 
  inStock?: boolean;
  description?: string;
  images?: string[];
  created_at?: string;
  supabaseSlug?: string;
  stock: number; 

  variants?: {
    color: string;
    size: string;
    stock: number;
  }[];

  faqs?: {
    question: string;
    answer: string;
  }[];
}
