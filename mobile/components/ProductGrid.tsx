import React from 'react';
import { View, FlatList } from 'react-native';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductPress 
}) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard 
      product={item} 
      onPress={onProductPress}
    />
  );

  const keyExtractor = (item: Product) => item.id;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};
