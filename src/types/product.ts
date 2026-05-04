export interface Product {
  id: number;
  title: string;
  price: number;
  size?: string;
  color?: string;
  description: string;
  category_id: number;
  images: string[];
  brand: string;
  created_at: string;
  rating: number;
  value: number;
  name: string;
  category: string;
  oldValue: number;
  image: string;
  stock: number;
  slug: string;
  variants: {
    color: string;
    size: string;
    stock: number;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
