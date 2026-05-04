import type { Product } from "./product";

export interface CartItem extends Omit<Product, "size"> {
  quantity: number;
  color: string;
  size: string;
  stock: number;
}
