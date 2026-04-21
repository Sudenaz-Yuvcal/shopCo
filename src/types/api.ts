export interface APIProduct {
  id: number;
  name: string;
  description: number;
  title: string;
  price: number;
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
