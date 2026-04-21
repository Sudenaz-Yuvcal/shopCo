export interface Product {
  id: number;
  name: string;
  price: number;
  value: number;
  image: string;
  category: string;
  color?: string;
  oldValue?: number;
  rating: number;
  brand?: string;
  size?: string[];
  inStock?: boolean;
  description?: string;
  images?: string[];

  faqs?: {
    question: string;
    answer: string;
  }[];
}
