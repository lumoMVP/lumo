import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductPress,
  refreshing = false,
  onRefresh
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
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']} // Android
              tintColor="#007AFF" // iOS
              title="Pull to refresh"
              titleColor="#666"
            />
          ) : undefined
        }
      />
    </View>
  );
};
