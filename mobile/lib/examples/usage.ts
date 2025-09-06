/**
 * Supabase Service Usage Examples
 * 
 * This file demonstrates how to use the Supabase services in your React Native app
 */

import { SupabaseService } from '../services/SupabaseService';
import { Product, Seller, Customer } from '../types/database';

// Example: Initialize and test connection
export async function initializeApp() {
  console.log('Initializing Supabase connection...');
  
  // Test database connection
  const isConnected = await SupabaseService.testConnection();
  if (!isConnected) {
    console.error('Failed to connect to database');
    return false;
  }

  // Get database statistics
  const stats = await SupabaseService.getStats();
  console.log('Database stats:', stats);

  // Initialize with sample data if empty
  if (stats.products === 0) {
    await SupabaseService.initializeWithSampleData();
  }

  return true;
}

// Example: Product operations
export async function productExamples() {
  console.log('=== Product Examples ===');

  // Get all available products
  const products = await SupabaseService.products.getAvailableProducts();
  console.log('Available products:', products);

  // Search products
  const searchResults = await SupabaseService.products.search('coffee');
  console.log('Coffee products:', searchResults);

  // Get products by category
  const beverages = await SupabaseService.products.getByCategory('Beverages');
  console.log('Beverages:', beverages);

  // Get products with seller information
  const productsWithSellers = await SupabaseService.products.getProductsWithSeller();
  console.log('Products with sellers:', productsWithSellers);

  // Create a new product
  const newProduct = await SupabaseService.products.create({
    seller_id: 'some-seller-id',
    name: 'New Product',
    description: 'A new product description',
    price: 9.99,
    category: 'Snacks',
    inventory: 10,
    available: true
  });
  console.log('Created product:', newProduct);
}

// Example: Seller operations
export async function sellerExamples() {
  console.log('=== Seller Examples ===');

  // Get all active sellers
  const activeSellers = await SupabaseService.sellers.getActiveSellers();
  console.log('Active sellers:', activeSellers);

  // Search sellers
  const searchResults = await SupabaseService.sellers.search('cafe');
  console.log('Cafe sellers:', searchResults);

  // Get nearby sellers (requires location data)
  const nearbySellers = await SupabaseService.sellers.getNearbySellers(40.7128, -74.0060, 5);
  console.log('Nearby sellers:', nearbySellers);

  // Create a new seller
  const newSeller = await SupabaseService.sellers.create({
    auth_id: 'some-auth-id',
    name: 'New Seller',
    email: 'newseller@example.com',
    phone: '+1234567890',
    rating: 0,
    is_active: true
  });
  console.log('Created seller:', newSeller);
}

// Example: Customer operations
export async function customerExamples() {
  console.log('=== Customer Examples ===');

  // Get all customers
  const customers = await SupabaseService.customers.getAll();
  console.log('All customers:', customers);

  // Search customers
  const searchResults = await SupabaseService.customers.search('john');
  console.log('John customers:', searchResults);

  // Update customer location
  const updatedCustomer = await SupabaseService.customers.updateLocation(
    'customer-id',
    40.7128,
    -74.0060
  );
  console.log('Updated customer location:', updatedCustomer);

  // Update customer preferences
  const preferences = {
    dietary_restrictions: ['vegetarian'],
    favorite_categories: ['Beverages', 'Desserts'],
    max_delivery_distance: 5
  };
  const customerWithPrefs = await SupabaseService.customers.updatePreferences(
    'customer-id',
    preferences
  );
  console.log('Updated customer preferences:', customerWithPrefs);
}

// Example: Profile operations
export async function profileExamples() {
  console.log('=== Profile Examples ===');

  // Get all profiles
  const profiles = await SupabaseService.profiles.getAll();
  console.log('All profiles:', profiles);

  // Search profiles by username
  const searchResults = await SupabaseService.profiles.searchByUsername('admin');
  console.log('Admin profiles:', searchResults);

  // Create a new profile
  const newProfile = await SupabaseService.profiles.create({
    id: 'some-user-id',
    username: 'newuser',
    role: 'customer',
    bio: 'A new user profile'
  });
  console.log('Created profile:', newProfile);
}

// Example: Complex queries
export async function complexQueryExamples() {
  console.log('=== Complex Query Examples ===');

  // Get featured products (high inventory, good seller rating)
  const featuredProducts = await SupabaseService.products.getFeaturedProducts(5);
  console.log('Featured products:', featuredProducts);

  // Get products by price range
  const affordableProducts = await SupabaseService.products.getByPriceRange(0, 5);
  console.log('Affordable products:', affordableProducts);

  // Get all categories
  const categories = await SupabaseService.products.getCategories();
  console.log('Available categories:', categories);
}

// Example: Error handling
export async function errorHandlingExample() {
  console.log('=== Error Handling Example ===');

  try {
    // This will fail because the ID doesn't exist
    const product = await SupabaseService.products.getById('non-existent-id');
    if (product === null) {
      console.log('Product not found - handled gracefully');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Example: Real-time subscriptions (if needed)
export function setupRealtimeSubscriptions() {
  console.log('=== Real-time Subscriptions ===');

  // Subscribe to product changes
  const productSubscription = SupabaseService.getClient()
    .channel('products')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        console.log('Product changed:', payload);
      }
    )
    .subscribe();

  // Subscribe to seller changes
  const sellerSubscription = SupabaseService.getClient()
    .channel('sellers')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'sellers' },
      (payload) => {
        console.log('Seller changed:', payload);
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    productSubscription.unsubscribe();
    sellerSubscription.unsubscribe();
  };
}


