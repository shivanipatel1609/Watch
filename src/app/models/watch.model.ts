export interface WatchSpecification {
  label: string;
  value: string;
}

export interface WatchReview {
  author: string;
  rating: number;
  comment: string;
}

export interface Watch {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  rating: number;
  images: string[];
  specifications: WatchSpecification[];
  reviews: WatchReview[];
  accent: string;
  featured?: boolean;
}
