export interface ProductResponseAdmin {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  minStockLevel: number;
  isActive: boolean;
}