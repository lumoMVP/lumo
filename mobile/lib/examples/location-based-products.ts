/**
 * Example usage of location-based product filtering
 * 
 * This file demonstrates how to use the new location-based product filtering
 * functionality to show customers products from sellers within a 0.5 mile radius.
 */

import { UserService, TestDataService } from '../index';

// Example: How to get products from nearby sellers
export async function getNearbyProductsExample() {
  try {
    console.log('🔍 Finding products from nearby sellers...');
    
    // Get products from sellers within 0.5 miles
    const products = await UserService.getProductsFromNearbySellers(0.5);
    
    if (products.length === 0) {
      console.log('❌ No products found from sellers in your area');
      return;
    }
    
    console.log(`✅ Found ${products.length} products from nearby sellers:`);
    
    products.forEach((product, index) => {
      console.log(`
        ${index + 1}. ${product.name}
           Price: $${product.price}
           Seller: ${product.seller?.name || 'Unknown'}
           Category: ${product.category}
           Available: ${product.inventory} in stock
      `);
    });
    
  } catch (error) {
    console.error('❌ Error fetching nearby products:', error);
  }
}

// Example: How to set up test data
export async function setupTestDataExample() {
  try {
    console.log('🚀 Setting up test data...');
    
    // Create sample products for existing Taaha users
    await TestDataService.setupTestData();
    
    // Create additional test sellers at different locations
    await TestDataService.createTestSellerAtLocation('Nearby Seller', 37.7750, -122.4190); // Very close
    await TestDataService.createTestSellerAtLocation('Far Seller', 37.8000, -122.4000); // Far away
    
    console.log('✅ Test data setup complete!');
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  }
}

// Example: How to test the location filtering
export async function testLocationFilteringExample() {
  try {
    console.log('🧪 Testing location-based filtering...');
    
    // Test with different radius values
    const radiusOptions = [0.1, 0.5, 1.0, 2.0]; // in kilometers
    
    for (const radius of radiusOptions) {
      console.log(`\n📍 Testing with ${radius}km radius:`);
      
      const products = await UserService.getProductsFromNearbySellers(radius);
      console.log(`   Found ${products.length} products`);
      
      if (products.length > 0) {
        products.forEach(product => {
          console.log(`   - ${product.name} from ${product.seller?.name}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing location filtering:', error);
  }
}

// Example: How to update user location
export async function updateLocationExample() {
  try {
    console.log('📍 Updating customer location...');
    
    // Update customer location (e.g., when they move)
    const newLatitude = 37.7849;
    const newLongitude = -122.4094;
    
    const success = await UserService.updateCustomerLocation(newLatitude, newLongitude);
    
    if (success) {
      console.log('✅ Customer location updated successfully');
      
      // Now get products from the new location
      const products = await UserService.getProductsFromNearbySellers(0.5);
      console.log(`Found ${products.length} products from new location`);
    } else {
      console.log('❌ Failed to update customer location');
    }
    
  } catch (error) {
    console.error('❌ Error updating location:', error);
  }
}

// Example: Complete workflow
export async function completeWorkflowExample() {
  try {
    console.log('🎯 Running complete location-based product workflow...\n');
    
    // 1. Set up test data
    console.log('Step 1: Setting up test data');
    await setupTestDataExample();
    
    // 2. Get nearby products
    console.log('\nStep 2: Getting nearby products');
    await getNearbyProductsExample();
    
    // 3. Test different radius values
    console.log('\nStep 3: Testing different radius values');
    await testLocationFilteringExample();
    
    // 4. Update location and test again
    console.log('\nStep 4: Updating location and testing again');
    await updateLocationExample();
    
    console.log('\n✅ Complete workflow finished!');
    
  } catch (error) {
    console.error('❌ Error in complete workflow:', error);
  }
}

// Export all examples
export const locationBasedProductExamples = {
  getNearbyProducts: getNearbyProductsExample,
  setupTestData: setupTestDataExample,
  testLocationFiltering: testLocationFilteringExample,
  updateLocation: updateLocationExample,
  completeWorkflow: completeWorkflowExample
};
