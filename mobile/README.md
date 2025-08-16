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

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS or Android:
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

data/
└── mockProducts.ts         # Mock product data

types/
└── product.ts             # Product type definitions
```

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
