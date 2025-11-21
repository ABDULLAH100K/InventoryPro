export interface Product {
  id: string;
  name: string;
  sku?: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  images: string[]; // Base64 strings
  expiryDate?: string;
  lowStockThreshold: number;
  description?: string;
  createdAt: number;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt'>;

export interface FilterState {
  search: string;
  minStock: number | '';
  maxStock: number | '';
  onlyLowStock: boolean;
}
