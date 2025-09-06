// Re-export database types from Supabase client
export type { Database } from '../lib/supabase';

// Individual table types for convenience
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export type Seller = Database['public']['Tables']['sellers']['Row'];
export type SellerInsert = Database['public']['Tables']['sellers']['Insert'];
export type SellerUpdate = Database['public']['Tables']['sellers']['Update'];

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

// Extended types with relationships
export interface ProductWithSeller extends Product {
  sellers: Seller | null;
}

export interface SellerWithProducts extends Seller {
  products: Product[];
}

export interface CustomerWithProfile extends Customer {
  profiles: Profile | null;
}

// Filter and search types
export interface ProductFilter {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  available?: boolean;
  sellerId?: string;
  searchQuery?: string;
}

export interface SellerFilter {
  isActive?: boolean;
  minRating?: number;
  searchQuery?: string;
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
}

export interface CustomerFilter {
  searchQuery?: string;
  hasLocation?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}


