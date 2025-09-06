import { CustomerService } from './CustomerService';
import { SellerService } from './SellerService';
import { ProductService } from './ProductService';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface UserContext {
  customerId: string;
  sellerId: string;
  currentLocation: Location | null;
}

export class UserService {

  // Cache for user IDs to avoid repeated database calls
  private static customerId: string | null = null;
  private static sellerId: string | null = null;
  
  // Default email addresses (can be overridden)
  private static customerEmail: string = 'taahakamal@yahoo.com';
  private static sellerEmail: string = 'taaha@example.com';

  /**
   * Parse PostGIS POINT format to Location object
   */
  private static parseLocation(locationString: string): Location | null {
    try {
      // Handle PostGIS POINT format: "POINT(longitude latitude)"
      const locationMatch = locationString.match(/POINT\(([^ ]+) ([^ ]+)\)/);
      if (locationMatch) {
        return {
          longitude: parseFloat(locationMatch[1]),
          latitude: parseFloat(locationMatch[2])
        };
      }
      
      // Handle GeoJSON format if needed: {"type":"Point","coordinates":[longitude,latitude]}
      const geoJsonMatch = locationString.match(/"coordinates":\[([^,]+),([^\]]+)\]/);
      if (geoJsonMatch) {
        return {
          longitude: parseFloat(geoJsonMatch[1]),
          latitude: parseFloat(geoJsonMatch[2])
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing location:', error);
      return null;
    }
  }

  /**
   * Get the current user context with existing Taaha users
   */
  static async getCurrentUserContext(): Promise<UserContext> {
    try {
      // Get customer ID if not cached
      if (!this.customerId) {
        const customer = await CustomerService.getByEmail(this.customerEmail);
        this.customerId = customer?.id || null;
        if (!this.customerId) {
          console.warn(`Customer not found: ${this.customerEmail}`);
        }
      }

      // Get seller ID if not cached
      if (!this.sellerId) {
        const seller = await SellerService.getByEmail(this.sellerEmail);
        this.sellerId = seller?.id || null;
        if (!this.sellerId) {
          console.warn(`Seller not found: ${this.sellerEmail}`);
        }
      }

      // Get current customer's location from database
      let currentLocation: Location | null = null;
      if (this.customerId) {
        const customer = await CustomerService.getById(this.customerId);
        if (customer?.location) {
          currentLocation = this.parseLocation(customer.location);
        }
      }

      return {
        customerId: this.customerId || '',
        sellerId: this.sellerId || '',
        currentLocation
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return {
        customerId: '',
        sellerId: '',
        currentLocation: null
      };
    }
  }

  /**
   * Get products from nearby sellers for the current customer
   */
  static async getProductsFromNearbySellers(radiusKm: number = 0.5): Promise<any[]> {
    const userContext = await this.getCurrentUserContext();
    
    if (!userContext.currentLocation) {
      console.warn('No location available for customer');
      return [];
    }

    try {
      // First, get nearby sellers
      const nearbySellers = await SellerService.getNearbySellers(
        userContext.currentLocation.latitude,
        userContext.currentLocation.longitude,
        radiusKm
      );

      if (nearbySellers.length === 0) {
        console.log('No sellers found within the specified radius');
        return [];
      }

      // Get seller IDs
      const sellerIds = nearbySellers.map(seller => seller.id);

      // Get products from these sellers
      const products = await ProductService.getProductsBySellerIds(sellerIds);

      // Add seller information to each product
      const productsWithSellerInfo = products.map(product => {
        const seller = nearbySellers.find(s => s.id === product.seller_id);
        return {
          ...product,
          seller: seller
        };
      });

      return productsWithSellerInfo;
    } catch (error) {
      console.error('Error fetching products from nearby sellers:', error);
      return [];
    }
  }

  /**
   * Update customer location
   */
  static async updateCustomerLocation(latitude: number, longitude: number): Promise<boolean> {
    const userContext = await this.getCurrentUserContext();
    
    try {
      const updatedCustomer = await CustomerService.updateLocation(
        userContext.customerId,
        latitude,
        longitude
      );
      
      return updatedCustomer !== null;
    } catch (error) {
      console.error('Error updating customer location:', error);
      return false;
    }
  }

  /**
   * Update seller location
   */
  static async updateSellerLocation(latitude: number, longitude: number): Promise<boolean> {
    const userContext = await this.getCurrentUserContext();
    
    try {
      const updatedSeller = await SellerService.updateLocation(
        userContext.sellerId,
        latitude,
        longitude
      );
      
      return updatedSeller !== null;
    } catch (error) {
      console.error('Error updating seller location:', error);
      return false;
    }
  }

  /**
   * Get customer information
   */
  static async getCurrentCustomer() {
    const userContext = await this.getCurrentUserContext();
    return await CustomerService.getById(userContext.customerId);
  }

  /**
   * Get seller information
   */
  static async getCurrentSeller() {
    const userContext = await this.getCurrentUserContext();
    return await SellerService.getById(userContext.sellerId);
  }

  /**
   * Get the current customer's location from the database
   */
  static async getCurrentLocation(): Promise<Location | null> {
    const userContext = await this.getCurrentUserContext();
    return userContext.currentLocation;
  }

  /**
   * Set a custom location for the current customer
   */
  static async setCustomLocation(latitude: number, longitude: number): Promise<boolean> {
    const userContext = await this.getCurrentUserContext();
    
    if (!userContext.customerId) {
      console.error('No customer ID available for location update');
      return false;
    }

    try {
      const success = await this.updateCustomerLocation(latitude, longitude);
      if (success) {
        console.log(`Location updated to: ${latitude}, ${longitude}`);
        // Clear cached location by resetting customer ID cache
        this.customerId = null;
      }
      return success;
    } catch (error) {
      console.error('Error setting custom location:', error);
      return false;
    }
  }

  /**
   * Set custom email addresses for customer and seller
   */
  static setUserEmails(customerEmail: string, sellerEmail: string): void {
    this.customerEmail = customerEmail;
    this.sellerEmail = sellerEmail;
    // Clear cache to force re-fetch with new emails
    this.customerId = null;
    this.sellerId = null;
  }

  /**
   * Clear user cache (useful for testing or user switching)
   */
  static clearCache(): void {
    this.customerId = null;
    this.sellerId = null;
  }
}
