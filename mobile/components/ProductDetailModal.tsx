import React from 'react';
import { 
  TouchableOpacity, 
  Modal,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Image
} from 'react-native';
import { Product } from '../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  visible,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getProductIcon = (category: string | null) => {
    const iconMap: { [key: string]: string } = {
      'Beverages': '🥤',
      'Desserts': '🍰',
      'Snacks': '🍿',
      'Lunch': '🥪',
      'Breakfast': '🥞',
      'Dinner': '🍽️',
    };
    return iconMap[category || ''] || '🍎';
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Text style={{ fontSize: 24, color: '#666' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            {product.image_url ? (
              <Image 
                source={{ uri: product.image_url }} 
                style={{ width: 120, height: 120, borderRadius: 16 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontSize: 80 }}>{getProductIcon(product.category || null)}</Text>
            )}
          </View>

          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>{product.name}</Text>
            {product.description && (
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 16, lineHeight: 24 }}>{product.description}</Text>
            )}
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginBottom: 24 }}>{formatPrice(product.price)}</Text>
            
            {product.category && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Category:</Text>
                <Text style={{ fontSize: 16, color: '#333' }}>{product.category}</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Availability:</Text>
              <Text style={{ 
                fontSize: 16, 
                color: product.available ? '#4CAF50' : '#F44336',
                fontWeight: '500'
              }}>
                {product.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Stock:</Text>
              <Text style={{ 
                fontSize: 16, 
                color: product.inventory > 0 ? '#4CAF50' : '#F44336',
                fontWeight: '500'
              }}>
                {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
              </Text>
            </View>

            {product.seller_id && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Seller ID:</Text>
                <Text style={{ fontSize: 16, color: '#333' }}>{product.seller_id.substring(0, 8)}...</Text>
              </View>
            )}

            {product.created_at && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Added:</Text>
                <Text style={{ fontSize: 16, color: '#333' }}>
                  {new Date(product.created_at).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
          <TouchableOpacity 
            style={{ 
              backgroundColor: product.available && product.inventory > 0 ? '#007AFF' : '#CCCCCC', 
              borderRadius: 12, 
              paddingVertical: 16, 
              alignItems: 'center' 
            }}
            onPress={handleAddToCart}
            disabled={!product.available || product.inventory <= 0}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
              {product.available && product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
