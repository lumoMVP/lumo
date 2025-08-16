import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  return (
    <TouchableOpacity 
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        minHeight: 120,
        justifyContent: 'space-between',
      }}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 32 }}>{product.images[0]}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 8 }} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
          {formatPrice(product.price_cents)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
