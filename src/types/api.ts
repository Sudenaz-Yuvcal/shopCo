export interface APIProduct {
  id: number;
  name: string;
  description: string;
  title: string;
  price: number;
  stock?:string;
  slug:string;
  rating:string;
  images: string[];
  category: {
    id: number;
    name: string;
  };

  faqs?: {
    question: string;
    answer: string;
  }[];
}
