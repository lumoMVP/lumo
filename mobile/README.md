# LUMO MVP - Product Catalog

A React Native mobile app for hyperlocal food delivery, featuring a product catalog with mock data.

## Features

- **Product Catalog**: Grid layout displaying products with emojis, names, and prices
- **Product Details**: Modal view with comprehensive product information
- **Mock Data**: 6 sample products (chips, water, soda, cookies, banana, tissues)
- **Responsive Design**: Clean, modern UI matching the mockup design
- **Navigation**: Bottom tab navigation (Products, Cart, Orders)

## Components

- `ProductsScreen`: Main screen with header, product grid, checkout button, and navigation
- `ProductGrid`: 2-column grid layout for products
- `ProductCard`: Individual product display card
- `ProductDetailModal`: Detailed product view with add to cart functionality

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your Supabase credentials
   # Get these from your Supabase project dashboard
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on iOS or Android:
   ```bash
   npm run ios
   # or
   npm run android
   ```

## Project Structure

```
components/
├── ProductsScreen.tsx      # Main products screen
├── ProductGrid.tsx         # Product grid layout
├── ProductCard.tsx         # Individual product card
└── ProductDetailModal.tsx  # Product detail modal

lib/
├── supabase.ts            # Supabase client configuration
└── services/              # Database service classes

types/
├── product.ts             # Product type definitions
└── env.d.ts               # Environment variable types

.env                       # Environment variables (not in git)
.env.example               # Environment variables template
```

## Environment Variables

The app uses environment variables for configuration:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `APP_NAME`: Application name
- `APP_VERSION`: Application version

**Important**: Never commit your `.env` file to version control. Use `.env.example` as a template.

## Mock Products

The app includes 6 sample products:
- Chips ($1.50) - 🍟
- Water ($1.00) - 💧
- Soda ($1.50) - 🥤
- Cookies ($2.00) - 🍪
- Banana ($1.75) - 🍌
- Tissues ($1.75) - 🧻

## Next Steps

- Implement cart functionality
- Add checkout flow
- Integrate with backend API
- Add user authentication
- Implement location services
