import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product | null;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 40) / 2; // 40 = paddingHorizontal (12) * 2 + margin (8) * 2
  
  // Handle undefined/null product
  if (!product) {
    return (
      <View style={{
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        margin: 4,
        width: cardWidth,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: '#666', fontSize: 14 }}>Loading...</Text>
      </View>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getProductIcon = (category: string | null) => {
    // Simple emoji mapping for categories
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

  return (
    <TouchableOpacity 
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        width: cardWidth,
        height: 200,
        justifyContent: 'space-between',
      }}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        {product.image_url ? (
          <Image 
            source={{ uri: product.image_url }} 
            style={{ width: 60, height: 60, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ fontSize: 32 }}>{getProductIcon(product.category || null)}</Text>
        )}
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 8 }} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
          {formatPrice(product.price)}
        </Text>
        {product.category && (
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 }}>
            {product.category}
          </Text>
        )}
        {product.inventory !== undefined && (
          <Text style={{ fontSize: 10, color: product.inventory > 0 ? '#4CAF50' : '#F44336', textAlign: 'center', marginTop: 2 }}>
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
