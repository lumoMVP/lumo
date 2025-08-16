import React from 'react';
import { 
  TouchableOpacity, 
  Modal,
  ScrollView,
  SafeAreaView,
  View,
  Text
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

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
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
            <Text style={{ fontSize: 80 }}>{product.images[0]}</Text>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>{product.name}</Text>
            <Text style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>{product.brand}</Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginBottom: 24 }}>{formatPrice(product.price_cents)}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Size:</Text>
              <Text style={{ fontSize: 16, color: '#333' }}>{product.size_text} {product.unit}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Category:</Text>
              <Text style={{ fontSize: 16, color: '#333' }}>{product.category}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Stock:</Text>
              <Text style={{ fontSize: 16, color: '#333' }}>{product.qty_on_hand} available</Text>
            </View>

            {product.allergens.length > 0 && product.allergens[0] !== 'none' && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>Allergens:</Text>
                <Text style={{ fontSize: 16, color: '#333' }}>{product.allergens.join(', ')}</Text>
              </View>
            )}

            <Text style={{ fontSize: 16, color: '#333', lineHeight: 24, marginTop: 24, marginBottom: 20 }}>{product.description}</Text>

            {product.tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={{ backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, color: '#666' }}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
          <TouchableOpacity 
            style={{ backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
            onPress={handleAddToCart}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
