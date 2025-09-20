import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartWithItems } from '../lib';

interface CartItemProps {
  item: CartWithItems['cart_items'][0];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(true);
    try {
      if (newQuantity === 0) {
        onRemove(item.id);
      } else {
        onUpdateQuantity(item.id, newQuantity);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const subtotal = item.quantity * item.unit_price;

  return (
    <View style={styles.cartItem}>
      <Image
        source={{
          uri: item.products.image_url || 'https://via.placeholder.com/80x80?text=No+Image'
        }}
        style={styles.productImage}
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.products.name}
        </Text>
        <Text style={styles.productPrice}>
          ${item.unit_price.toFixed(2)} each
        </Text>
        <Text style={styles.subtotal}>
          Subtotal: ${subtotal.toFixed(2)}
        </Text>
        
        {!item.products.available && (
          <Text style={styles.unavailableText}>Currently unavailable</Text>
        )}
        
        {item.products.available && item.products.inventory < item.quantity && (
          <Text style={styles.lowStockText}>
            Only {item.products.inventory} left in stock
          </Text>
        )}
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, isUpdating && styles.disabledButton]}
          onPress={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating}
        >
          <Ionicons name="remove" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={[styles.quantityButton, isUpdating && styles.disabledButton]}
          onPress={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.products.inventory <= item.quantity}
        >
          <Ionicons name="add" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.removeButton, isUpdating && styles.disabledButton]}
          onPress={() => onRemove(item.id)}
          disabled={isUpdating}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      {isUpdating && (
        <View style={styles.updatingOverlay}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  unavailableText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
    marginTop: 4,
  },
  lowStockText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
    marginTop: 4,
  },
  quantityControls: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 8,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  updatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
