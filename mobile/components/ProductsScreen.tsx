import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { Product } from '../types/product';
import { UserService } from '../lib/services/UserService';
import { CartService } from '../lib/services/CartService';
import { RootStackParamList } from '../App';
import { useCart } from '../contexts/CartContext';

type ProductsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Products'>;

export const ProductsScreen: React.FC = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerRefresh } = useCart();

  // Load products from nearby sellers on component mount
  useEffect(() => {
    loadProductsFromNearbySellers();
  }, []);

  const loadProductsFromNearbySellers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Get products from sellers within 0.5 mile radius
      const nearbyProducts = await UserService.getProductsFromNearbySellers(0.5);
      
      if (nearbyProducts.length === 0) {
        setError('No products available from sellers in your area. Try expanding your search radius or check back later.');
      } else {
        setProducts(nearbyProducts);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      console.log('Adding to cart:', product.name);
      
      // Check if product is available and in stock
      if (!product.available) {
        console.log('Product unavailable:', product.name);
        return;
      }
      
      if (product.inventory <= 0) {
        console.log('Product out of stock:', product.name);
        return;
      }

      // Add to cart
      const success = await CartService.addToCart(product.id, 1);
      
      if (success) {
        console.log('Successfully added to cart:', product.name);
        // Trigger cart quantity refresh
        triggerRefresh();
      } else {
        console.log('Failed to add to cart:', product.name);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };


  const handleOrdersPress = () => {
    console.log('Orders pressed');
    // TODO: Navigate to orders screen when implemented
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleRetry = () => {
    loadProductsFromNearbySellers();
  };

  const onRefresh = async () => {
    await loadProductsFromNearbySellers(true);
    // Optional: Show a brief success message
    if (products.length > 0) {
      console.log(`Refreshed! Found ${products.length} products from nearby sellers.`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
        <Text style={{ fontSize: 14, color: '#666' }}>
          From sellers within 0.5 miles • Taaha-Customer
        </Text>
        
        {refreshing && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </View>

      {/* Product Grid */}
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
              Finding products from nearby sellers...
            </Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>⚠️</Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
              {error}
            </Text>
            <TouchableOpacity 
              style={{
                backgroundColor: '#007AFF',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={handleRetry}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ProductGrid 
            products={products} 
            onProductPress={handleProductPress}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>


      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingVertical: 12, paddingHorizontal: 20 }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>🛍️</Text>
          <Text style={{ fontSize: 12, color: '#007AFF', fontWeight: '600' }}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }} onPress={handleOrdersPress}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>📋</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }} onPress={handleSettingsPress}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>⚙️</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};
