import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Supabase configuration from environment variables
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is not defined in environment variables');
}

if (!supabaseAnonKey) {
  throw new Error('SUPABASE_ANON_KEY is not defined in environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          role: string;
          bio: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          username: string;
          role: string;
          bio?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          role?: string;
          bio?: string | null;
          created_at?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          phone: string | null;
          address: string | null;
          location: any | null; // PostGIS geography type
          preferences: any | null; // JSONB
          created_at: string | null;
        };
        Insert: {
          id?: string;
          auth_id: string;
          name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          location?: any | null;
          preferences?: any | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          auth_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          location?: any | null;
          preferences?: any | null;
          created_at?: string | null;
        };
      };
      sellers: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          phone: string | null;
          address: string | null;
          location: any | null; // PostGIS geography type
          rating: number | null;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          auth_id: string;
          name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          location?: any | null;
          rating?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          auth_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          location?: any | null;
          rating?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          available: boolean | null;
          category: string | null;
          inventory: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          seller_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          available?: boolean | null;
          category?: string | null;
          inventory?: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          seller_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          available?: boolean | null;
          category?: string | null;
          inventory?: number;
          created_at?: string | null;
        };
      };
      carts: {
        Row: {
          id: string;
          customer_id: string;
          status: string;
          created_at: string;
          updated_at: string;
          checked_out_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          checked_out_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          checked_out_at?: string | null;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      active_carts: {
        Row: {
          id: string;
          customer_id: string;
          status: string;
          created_at: string;
          updated_at: string;
          checked_out_at: string | null;
        };
      };
    };
  };
};
