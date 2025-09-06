import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { Product } from '../types/product';
import { UserService } from '../lib/services/UserService';

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product.name);
    // TODO: Implement cart functionality
  };

  const handleCheckout = () => {
    console.log('Checkout pressed');
    // TODO: Navigate to checkout screen
  };

  const handleCartPress = () => {
    console.log('Cart pressed');
    // TODO: Navigate to cart screen
  };

  const handleOrdersPress = () => {
    console.log('Orders pressed');
    // TODO: Navigate to orders screen
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>9:41</Text>
          <TouchableOpacity style={{ padding: 8 }}>
            <Text style={{ fontSize: 20, color: '#333' }}>☰</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#333' }}>Products</Text>
          {refreshing && (
            <ActivityIndicator size="small" color="#007AFF" />
          )}
        </View>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
          From sellers within 0.5 miles • Taaha-Customer
        </Text>
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

      {/* Checkout Button */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity 
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={handleCheckout}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingVertical: 12, paddingHorizontal: 20 }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>☰</Text>
          <Text style={{ fontSize: 12, color: '#007AFF', fontWeight: '600' }}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }} onPress={handleCartPress}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>🛒</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }} onPress={handleOrdersPress}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>📋</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
};
