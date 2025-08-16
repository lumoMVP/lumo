export interface Product {
  id: string;
  name: string;
  brand: string;
  size_text: string;
  unit: string;
  upc: string;
  images: string[];
  allergens: string[];
  category: string;
  tags: string[];
  description: string;
  price_cents: number;
  qty_on_hand: number;
  is_listed: boolean;
  low_stock_threshold: number;
  seller_id: string;
  seller_name: string;
  distance_m: number;
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
