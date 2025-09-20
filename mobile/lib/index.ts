// Main Supabase service exports
export { SupabaseService } from './services/SupabaseService';
export { supabase } from './supabase';

// Individual service exports
export { ProfileService } from './services/ProfileService';
export { CustomerService } from './services/CustomerService';
export { SellerService } from './services/SellerService';
export { ProductService } from './services/ProductService';
export { UserService } from './services/UserService';
export { TestDataService } from './services/TestDataService';
export { CartService } from './services/CartService';
export type { CartWithItems } from './services/CartService';

// Type exports
export type { Database } from './supabase';
export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Customer,
  CustomerInsert,
  CustomerUpdate,
  Seller,
  SellerInsert,
  SellerUpdate,
  Product,
  ProductInsert,
  ProductUpdate,
  ProductWithSeller,
  SellerWithProducts,
  CustomerWithProfile,
  ProductFilter,
  SellerFilter,
  CustomerFilter,
  ApiResponse,
  PaginatedResponse
} from '../types/database';
export { MockAuthService } from "./services/MockAuthService";
