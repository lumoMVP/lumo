export interface Product {
  id: string;
  seller_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url?: string | null;
  available: boolean | null;
  category?: string | null;
  created_at?: string | null;
  inventory: number;
}

export interface ProductFilter {
  category?: string;
  maxPrice?: number;
  allergens?: string[];
  searchQuery?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
}
