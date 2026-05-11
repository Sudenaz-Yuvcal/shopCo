export interface OrderItem {
  id: string;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: number;
  address: string;
  city: string;
  total: number;
  date: string;
  total_amount: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  items: OrderItem[];
  user_id: string;
  shipping_address: string;
  customer_name?: string;
  payment_method?: string;
}
