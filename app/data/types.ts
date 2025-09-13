export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
  offer?: number;
  bestseller?: boolean;
  qty?: number;
};
