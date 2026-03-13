export interface Review {
  id: number;
  name: string; 
  text: string;
  rating: number;
  date: string;
  verified?: boolean;
}

export type SortOption = "latest" | "oldest";
