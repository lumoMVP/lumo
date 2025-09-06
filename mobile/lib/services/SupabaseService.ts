import { supabase } from '../supabase';
import { ProfileService } from './ProfileService';
import { CustomerService } from './CustomerService';
import { SellerService } from './SellerService';
import { ProductService } from './ProductService';

/**
 * Main Supabase service manager that provides access to all table services
 * and common database operations
 */
export class SupabaseService {
  // Individual service instances
  static profiles = ProfileService;
  static customers = CustomerService;
  static sellers = SellerService;
  static products = ProductService;

  /**
   * Get the Supabase client instance
   */
  static getClient() {
    return supabase;
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }

      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  static async getStats(): Promise<{
    profiles: number;
    customers: number;
    sellers: number;
    products: number;
  }> {
    try {
      const [profilesResult, customersResult, sellersResult, productsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('sellers').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true })
      ]);

      return {
        profiles: profilesResult.count || 0,
        customers: customersResult.count || 0,
        sellers: sellersResult.count || 0,
        products: productsResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching database stats:', error);
      return {
        profiles: 0,
        customers: 0,
        sellers: 0,
        products: 0
      };
    }
  }

  /**
   * Initialize database with sample data (for development)
   */
  static async initializeWithSampleData(): Promise<boolean> {
    try {
      // Check if data already exists
      const stats = await this.getStats();
      if (stats.customers > 0 || stats.sellers > 0 || stats.products > 0) {
        console.log('Database already has data, skipping initialization');
        return true;
      }

      console.log('Initializing database with sample data...');

      // Create sample sellers
      const seller1 = await SellerService.create({
        auth_id: '00000000-0000-0000-0000-000000000001',
        name: 'Downtown Delights',
        email: 'downtown@example.com',
        phone: '+1234567890',
        address: '123 Main St, Downtown',
        rating: 4.5,
        is_active: true
      });

      const seller2 = await SellerService.create({
        auth_id: '00000000-0000-0000-0000-000000000002',
        name: 'Campus Corner Cafe',
        email: 'campus@example.com',
        phone: '+1234567891',
        address: '456 University Ave, Campus',
        rating: 4.2,
        is_active: true
      });

      if (!seller1 || !seller2) {
        throw new Error('Failed to create sample sellers');
      }

      // Create sample products
      const products = [
        {
          seller_id: seller1.id,
          name: 'Chocolate Chip Cookies',
          description: 'Fresh baked chocolate chip cookies',
          price: 3.99,
          category: 'Desserts',
          inventory: 20,
          available: true
        },
        {
          seller_id: seller1.id,
          name: 'Coffee Latte',
          description: 'Rich and creamy coffee latte',
          price: 4.50,
          category: 'Beverages',
          inventory: 15,
          available: true
        },
        {
          seller_id: seller2.id,
          name: 'Veggie Wrap',
          description: 'Fresh vegetables wrapped in a tortilla',
          price: 6.99,
          category: 'Lunch',
          inventory: 10,
          available: true
        },
        {
          seller_id: seller2.id,
          name: 'Fruit Smoothie',
          description: 'Mixed fruit smoothie with yogurt',
          price: 5.25,
          category: 'Beverages',
          inventory: 12,
          available: true
        }
      ];

      for (const product of products) {
        await ProductService.create(product);
      }

      console.log('Sample data initialization completed');
      return true;
    } catch (error) {
      console.error('Error initializing sample data:', error);
      return false;
    }
  }

  /**
   * Clear all data (for development/testing)
   */
  static async clearAllData(): Promise<boolean> {
    try {
      console.log('Clearing all data...');

      // Delete in reverse order to respect foreign key constraints
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('sellers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      console.log('All data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

// Export individual services for convenience
export { ProfileService, CustomerService, SellerService, ProductService };


