# Supabase Client Setup

This directory contains the complete Supabase client setup for the Uber Snacks mobile app, with individual service objects for each database table.

## 📁 File Structure

```
lib/
├── supabase.ts                 # Main Supabase client configuration
├── index.ts                    # Main exports for easy importing
├── services/
│   ├── SupabaseService.ts      # Main service manager
│   ├── ProfileService.ts       # Profile table operations
│   ├── CustomerService.ts      # Customer table operations
│   ├── SellerService.ts        # Seller table operations
│   └── ProductService.ts       # Product table operations
└── examples/
    └── usage.ts               # Usage examples and patterns
```

## 🚀 Quick Start

### 1. Import the services

```typescript
import { SupabaseService } from './lib';
// or import individual services
import { ProductService, SellerService } from './lib';
```

### 2. Test the connection

```typescript
const isConnected = await SupabaseService.testConnection();
if (isConnected) {
  console.log('Connected to Supabase!');
}
```

### 3. Use the services

```typescript
// Get all available products
const products = await SupabaseService.products.getAvailableProducts();

// Search for products
const coffeeProducts = await SupabaseService.products.search('coffee');

// Get active sellers
const sellers = await SupabaseService.sellers.getActiveSellers();
```

## 🗄️ Database Schema

The setup includes support for these tables:

- **profiles** - User profiles with roles and bio
- **customers** - Customer information with location and preferences
- **sellers** - Seller information with ratings and location
- **products** - Product catalog with inventory and categories

## 🛠️ Available Services

### ProfileService
- `getById(id)` - Get profile by ID
- `getByUsername(username)` - Get profile by username
- `create(profile)` - Create new profile
- `update(id, updates)` - Update profile
- `delete(id)` - Delete profile
- `getAll()` - Get all profiles
- `searchByUsername(query)` - Search profiles

### CustomerService
- `getById(id)` - Get customer by ID
- `getByAuthId(authId)` - Get customer by auth ID
- `getByEmail(email)` - Get customer by email
- `create(customer)` - Create new customer
- `update(id, updates)` - Update customer
- `delete(id)` - Delete customer
- `getAll()` - Get all customers
- `search(query)` - Search customers
- `updateLocation(id, lat, lng)` - Update customer location
- `updatePreferences(id, prefs)` - Update customer preferences

### SellerService
- `getById(id)` - Get seller by ID
- `getByAuthId(authId)` - Get seller by auth ID
- `getByEmail(email)` - Get seller by email
- `create(seller)` - Create new seller
- `update(id, updates)` - Update seller
- `delete(id)` - Delete seller
- `getActiveSellers()` - Get active sellers
- `getAll()` - Get all sellers
- `search(query)` - Search sellers
- `updateLocation(id, lat, lng)` - Update seller location
- `updateRating(id, rating)` - Update seller rating
- `toggleActiveStatus(id)` - Toggle active status
- `getNearbySellers(lat, lng, radius)` - Get nearby sellers

### ProductService
- `getById(id)` - Get product by ID
- `getBySellerId(sellerId)` - Get products by seller
- `create(product)` - Create new product
- `update(id, updates)` - Update product
- `delete(id)` - Delete product
- `getAvailableProducts()` - Get available products
- `getByCategory(category)` - Get products by category
- `search(query)` - Search products
- `getByPriceRange(min, max)` - Get products by price range
- `updateAvailability(id, available)` - Update availability
- `updateInventory(id, inventory)` - Update inventory
- `getCategories()` - Get all categories
- `getFeaturedProducts(limit)` - Get featured products
- `getProductsWithSeller()` - Get products with seller info

## 🔧 Configuration

The Supabase client is configured in `lib/supabase.ts` with:

- **Project URL**: `https://fulwnadigdwkgrbdaozo.supabase.co`
- **Anonymous Key**: Automatically retrieved from your MCP configuration
- **Database Types**: Full TypeScript support for all tables

## 📝 TypeScript Support

All services include full TypeScript support with:

- Database table types (`Row`, `Insert`, `Update`)
- Extended types with relationships
- Filter and search types
- API response types
- Pagination support

## 🧪 Development Tools

### Initialize Sample Data
```typescript
await SupabaseService.initializeWithSampleData();
```

### Get Database Statistics
```typescript
const stats = await SupabaseService.getStats();
console.log(stats); // { profiles: 0, customers: 0, sellers: 0, products: 0 }
```

### Clear All Data (Development)
```typescript
await SupabaseService.clearAllData();
```

## 🔄 Real-time Subscriptions

The setup supports real-time subscriptions:

```typescript
// Subscribe to product changes
const subscription = SupabaseService.getClient()
  .channel('products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => console.log('Product changed:', payload)
  )
  .subscribe();
```

## 🚨 Error Handling

All service methods include proper error handling:

- Return `null` for single item queries that fail
- Return empty arrays `[]` for list queries that fail
- Log errors to console for debugging
- Return `false` for boolean operations that fail

## 📚 Examples

See `lib/examples/usage.ts` for comprehensive usage examples including:

- Basic CRUD operations
- Search and filtering
- Complex queries
- Error handling
- Real-time subscriptions

## 🔐 Security

- All operations use the anonymous key for client-side access
- Row Level Security (RLS) should be enabled on your Supabase tables
- Sensitive operations should be handled through Edge Functions
- Always validate user input before database operations


