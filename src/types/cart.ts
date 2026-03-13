import type { Product } from "./product";


export interface CartItem extends Omit<Product, "size"> {
  quantity: number;
  color: string;
  size: string; 
}
export type CartItemIdentifier = Pick<CartItem, "id" | "size" | "color">;
