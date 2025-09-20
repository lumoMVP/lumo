import { CustomerService } from './CustomerService';
import { SellerService } from './SellerService';
import { Database } from '../supabase';
import { MOCK_CUSTOMER_EMAIL, MOCK_SELLER_EMAIL } from '@env';

type Customer = Database['public']['Tables']['customers']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

export interface AuthContext {
  customer: Customer;
  seller: Seller;
  isAuthenticated: boolean;
}

/**
 * Mock Authentication Service for testing with Supabase
 * This service authenticates using the taaha-customer from the customers table
 * and uses taaha-seller as the seller for testing purposes
 */
export class MockAuthService {
  private static authContext: AuthContext | null = null;
  
  // Target user emails for mock authentication - loaded from environment variables
  private static readonly CUSTOMER_EMAIL = MOCK_CUSTOMER_EMAIL;
  private static readonly SELLER_EMAIL = MOCK_SELLER_EMAIL;

  /**
   * Initialize mock authentication by finding and setting up customer and seller
   */
  static async initializeMockAuth(): Promise<boolean> {
    try {
      console.log('🔧 Initializing mock authentication...');
      
      // Find the customer in the database
      const customer = await CustomerService.getByEmail(this.CUSTOMER_EMAIL);
      if (!customer) {
        console.error('❌ Customer not found in database');
        console.log('💡 Make sure customer exists in the customers table with email:', this.CUSTOMER_EMAIL);
        return false;
      }

      // Find the seller in the database
      const seller = await SellerService.getByEmail(this.SELLER_EMAIL);
      if (!seller) {
        console.error('❌ Seller not found in database');
        console.log('💡 Make sure seller exists in the sellers table with email:', this.SELLER_EMAIL);
        return false;
      }

      // Set up authentication context
      this.authContext = {
        customer,
        seller,
        isAuthenticated: true
      };

      console.log('✅ Mock authentication initialized successfully');
      console.log('👤 Customer:', customer.name, `(${customer.email})`);
      console.log('🏪 Seller:', seller.name, `(${seller.email})`);

      return true;
    } catch (error) {
      console.error('💥 Error initializing mock authentication:', error);
      return false;
    }
  }

  /**
   * Get the current authenticated customer
   */
  static getCurrentCustomer(): Customer | null {
    return this.authContext?.customer || null;
  }

  /**
   * Get the current seller (for testing purposes)
   */
  static getCurrentSeller(): Seller | null {
    return this.authContext?.seller || null;
  }

  /**
   * Get the full authentication context
   */
  static getAuthContext(): AuthContext | null {
    return this.authContext;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.authContext?.isAuthenticated || false;
  }

  /**
   * Get customer ID for database operations
   */
  static getCustomerId(): string | null {
    return this.authContext?.customer?.id || null;
  }

  /**
   * Get seller ID for database operations
   */
  static getSellerId(): string | null {
    return this.authContext?.seller?.id || null;
  }

  /**
   * Mock sign in (already authenticated in init)
   */
  static async signIn(email: string, password: string): Promise<boolean> {
    console.log('🔐 Mock sign in attempt for:', email);
    
    if (email === this.CUSTOMER_EMAIL && this.authContext) {
      console.log('✅ Mock sign in successful');
      return true;
    }
    
    console.log('❌ Mock sign in failed - user not found or not initialized');
    return false;
  }

  /**
   * Mock sign out
   */
  static async signOut(): Promise<void> {
    console.log('👋 Mock sign out');
    this.authContext = null;
  }

  /**
   * Test authentication and display current user info
   */
  static async testAuth(): Promise<void> {
    if (!this.isAuthenticated()) {
      console.log('❌ Not authenticated');
      return;
    }

    const customer = this.getCurrentCustomer();
    const seller = this.getCurrentSeller();

    console.log('🧪 Testing authentication...');
    console.log('📋 Auth Status:', this.isAuthenticated() ? 'Authenticated' : 'Not Authenticated');
    
    if (customer) {
      console.log('👤 Current Customer:');
      console.log('   - ID:', customer.id);
      console.log('   - Name:', customer.name);
      console.log('   - Email:', customer.email);
      console.log('   - Phone:', customer.phone || 'Not provided');
      console.log('   - Address:', customer.address || 'Not provided');
    }

    if (seller) {
      console.log('🏪 Current Seller (for testing):');
      console.log('   - ID:', seller.id);
      console.log('   - Name:', seller.name);
      console.log('   - Email:', seller.email);
      console.log('   - Rating:', seller.rating || 'No rating');
      console.log('   - Active:', seller.is_active ? 'Yes' : 'No');
    }

    console.log('✅ Authentication test complete');
  }

  /**
   * Update customer location (mock GPS)
   */
  static async updateCustomerLocation(latitude: number, longitude: number): Promise<boolean> {
    const customerId = this.getCustomerId();
    if (!customerId) {
      console.error('❌ No authenticated customer to update location');
      return false;
    }

    try {
      const updatedCustomer = await CustomerService.updateLocation(customerId, latitude, longitude);
      if (updatedCustomer && this.authContext) {
        // Update the cached customer data
        this.authContext.customer = updatedCustomer;
        console.log('📍 Customer location updated:', `${latitude}, ${longitude}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('💥 Error updating customer location:', error);
      return false;
    }
  }

  /**
   * Get authentication headers for API calls (if needed)
   */
  static getAuthHeaders(): Record<string, string> {
    const customer = this.getCurrentCustomer();
    return {
      'X-Customer-ID': customer?.id || '',
      'X-Auth-ID': customer?.auth_id || '',
      'Authorization': `Bearer mock-token-${customer?.id || 'anonymous'}`
    };
  }

  /**
   * Reset authentication (for testing)
   */
  static reset(): void {
    console.log('🔄 Resetting mock authentication');
    this.authContext = null;
  }

  /**
   * Refresh authentication data from database
   */
  static async refreshAuth(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const customer = await CustomerService.getByEmail(this.CUSTOMER_EMAIL);
      const seller = await SellerService.getByEmail(this.SELLER_EMAIL);

      if (customer && seller && this.authContext) {
        this.authContext.customer = customer;
        this.authContext.seller = seller;
        console.log('🔄 Authentication data refreshed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('💥 Error refreshing authentication:', error);
      return false;
    }
  }

  /**
   * Verify that the required users exist in the database
   */
  static async verifyRequiredUsers(): Promise<{
    customerExists: boolean;
    sellerExists: boolean;
    message: string;
  }> {
    try {
      const customer = await CustomerService.getByEmail(this.CUSTOMER_EMAIL);
      const seller = await SellerService.getByEmail(this.SELLER_EMAIL);

      const customerExists = !!customer;
      const sellerExists = !!seller;

      let message = '';
      if (!customerExists && !sellerExists) {
        message = `Both customer (${this.CUSTOMER_EMAIL}) and seller (${this.SELLER_EMAIL}) are missing from database`;
      } else if (!customerExists) {
        message = `Customer (${this.CUSTOMER_EMAIL}) is missing from database`;
      } else if (!sellerExists) {
        message = `Seller (${this.SELLER_EMAIL}) is missing from database`;
      } else {
        message = 'Both required users exist in database';
      }

      return { customerExists, sellerExists, message };
    } catch (error) {
      return {
        customerExists: false,
        sellerExists: false,
        message: `Error verifying users: ${error}`
      };
    }
  }

  /**
   * Get setup instructions for missing users
   */
  static getSetupInstructions(): string {
    return `
To set up the required users for mock authentication:

1. Customer Setup:
   - Email: ${this.CUSTOMER_EMAIL}
   - Table: customers
   - Required fields: name, email, auth_id

2. Seller Setup:
   - Email: ${this.SELLER_EMAIL}
   - Table: sellers
   - Required fields: name, email, auth_id, is_active: true

You can create these users through your Supabase dashboard or using SQL inserts.
    `;
  }
}
