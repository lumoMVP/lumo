import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { Product } from '../types/product';
import { mockProducts } from '../data/mockProducts';

export const ProductsScreen: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#333' }}>Products</Text>
      </View>

      {/* Product Grid */}
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <ProductGrid 
          products={products} 
          onProductPress={handleProductPress}
        />
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
