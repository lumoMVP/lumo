import { supabase } from '../supabase';
import { Database } from '../supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export class ProductService {
  /**
   * Get a product by ID
   */
  static async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  }

  /**
   * Get products by seller ID
   */
  static async getBySellerId(sellerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by seller:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new product
   */
  static async create(product: ProductInsert): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data;
  }

  /**
   * Update a product
   */
  static async update(id: string, updates: ProductUpdate): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data;
  }

  /**
   * Delete a product
   */
  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all available products
   */
  static async getAvailableProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available products:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get products by category
   */
  static async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('available', true)
      .order('name');

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Search products by name or description
   */
  static async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('available', true)
      .order('name');

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get products within price range
   */
  static async getByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .eq('available', true)
      .order('price');

    if (error) {
      console.error('Error fetching products by price range:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update product availability
   */
  static async updateAvailability(id: string, available: boolean): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update({ available })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product availability:', error);
      return null;
    }

    return data;
  }

  /**
   * Update product inventory
   */
  static async updateInventory(id: string, inventory: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update({ inventory })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product inventory:', error);
      return null;
    }

    return data;
  }

  /**
   * Get all categories
   */
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)
      .eq('available', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))];
    return categories as string[];
  }

  /**
   * Get featured products (high inventory, good rating)
   */
  static async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        sellers!inner(rating)
      `)
      .eq('available', true)
      .gte('inventory', 5)
      .order('inventory', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get products with seller information
   */
  static async getProductsWithSeller(): Promise<any[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        sellers!inner(
          id,
          name,
          rating,
          is_active
        )
      `)
      .eq('available', true)
      .eq('sellers.is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products with seller info:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get products from specific seller IDs
   */
  static async getProductsBySellerIds(sellerIds: string[]): Promise<Product[]> {
    if (sellerIds.length === 0) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('seller_id', sellerIds)
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by seller IDs:', error);
      return [];
    }

    return data || [];
  }
}
