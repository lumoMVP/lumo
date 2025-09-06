import { UserService } from './UserService';
import { CustomerService } from './CustomerService';
import { SellerService } from './SellerService';
import { ProductService } from './ProductService';

/**
 * Service to set up test data for development
 * This creates sample customers, sellers, and products for testing
 */
export class TestDataService {
  /**
   * Set up test data with sample products for existing Taaha users
   */
  static async setupTestData(): Promise<void> {
    try {
      console.log('Setting up test data...');

      // Get existing Taaha users
      const customer = await CustomerService.getByEmail('taaha.customer@example.com');
      const seller = await SellerService.getByEmail('taaha.seller@example.com');

      if (!customer) {
        console.error('Taaha-Customer not found in database');
        return;
      }

      if (!seller) {
        console.error('Taaha-Seller not found in database');
        return;
      }

      console.log('Found existing users:');
      console.log('Customer:', customer.name);
      console.log('Seller:', seller.name);

      // Create some sample products for the existing seller
      const products = [
        {
          id: `product-${Date.now()}-1`,
          seller_id: seller.id,
          name: 'Fresh Chips',
          description: 'Crispy potato chips made fresh daily',
          price: 3.99,
          category: 'Snacks',
          inventory: 50,
          available: true,
          image_url: 'https://example.com/chips.jpg'
        },
        {
          id: `product-${Date.now()}-2`,
          seller_id: seller.id,
          name: 'Energy Bar',
          description: 'Nutritious energy bar with nuts and honey',
          price: 4.50,
          category: 'Health',
          inventory: 30,
          available: true,
          image_url: 'https://example.com/energy-bar.jpg'
        },
        {
          id: `product-${Date.now()}-3`,
          seller_id: seller.id,
          name: 'Cold Drink',
          description: 'Refreshing cold beverage',
          price: 2.99,
          category: 'Beverages',
          inventory: 25,
          available: true,
          image_url: 'https://example.com/drink.jpg'
        }
      ];

      // Insert products
      for (const product of products) {
        await ProductService.create(product);
      }

      console.log('Test data setup complete!');
      console.log('Products created:', products.length);

    } catch (error) {
      console.error('Error setting up test data:', error);
    }
  }

  /**
   * Create a seller at a specific location for testing
   */
  static async createTestSellerAtLocation(
    name: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    try {
      const seller = await SellerService.create({
        id: `test-seller-${Date.now()}`,
        auth_id: `test-seller-auth-${Date.now()}`,
        name: name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: '+1234567890',
        business_name: `${name}'s Shop`,
        business_type: 'Store',
        location: `POINT(${longitude} ${latitude})`,
        rating: 4.0,
        is_active: true
      });

      // Add a sample product
      await ProductService.create({
        id: `product-${Date.now()}`,
        seller_id: seller?.id || '',
        name: `${name}'s Special Snack`,
        description: 'A delicious snack from ' + name,
        price: 5.99,
        category: 'Snacks',
        inventory: 20,
        available: true,
        image_url: 'https://example.com/snack.jpg'
      });

      console.log(`Created test seller: ${name} at ${latitude}, ${longitude}`);
    } catch (error) {
      console.error('Error creating test seller:', error);
    }
  }

  /**
   * Test the location-based product filtering
   */
  static async testLocationFiltering(): Promise<void> {
    try {
      console.log('Testing location-based product filtering...');
      
      const products = await UserService.getProductsFromNearbySellers(0.5);
      
      console.log(`Found ${products.length} products from nearby sellers:`);
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price} (${product.seller?.name})`);
      });
      
    } catch (error) {
      console.error('Error testing location filtering:', error);
    }
  }
}
