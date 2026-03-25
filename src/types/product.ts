export interface Product {
  id: number;
  name: string;
  value: number;
  image: string;
  category: string;
  color: string;
  oldValue?: number;
  rating: number;
  brand?: string;
  size?: string[];
  inStock?: boolean;
  price: number; 

}

export type CategoryType = "T-shirts" | "Shorts" | "Jeans";
