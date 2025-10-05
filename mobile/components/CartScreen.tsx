import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CartService, CartWithItems } from '../lib';
import { CartItem } from './CartItem';
import { RootStackParamList } from '../App';
import { useCart } from '../contexts/CartContext';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const { triggerRefresh } = useCart();

  const loadCart = useCallback(async () => {
    try {
      const cartData = await CartService.getCurrentCartWithItems();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      Alert.alert('Error', 'Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleProductsPress = () => {
    navigation.navigate('Products');
  };

  const handleOrdersPress = () => {
    console.log('Orders pressed');
    // TODO: Navigate to orders screen when implemented
  };

  const handleSellerPress = () => {
    navigation.navigate('Seller');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCart();
  }, [loadCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      const success = await CartService.updateCartItemQuantity(itemId, quantity);
      if (success) {
        await loadCart(); // Refresh cart data
        triggerRefresh(); // Refresh cart quantity in header
      } else {
        Alert.alert('Error', 'Failed to update quantity. Please try again.');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await CartService.removeCartItem(itemId);
              if (success) {
                await loadCart(); // Refresh cart data
                triggerRefresh(); // Refresh cart quantity in header
              } else {
                Alert.alert('Error', 'Failed to remove item. Please try again.');
              }
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClearCart = async () => {
    if (!cart) return;

    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await CartService.clearCart(cart.id);
              if (success) {
                await loadCart(); // Refresh cart data
                triggerRefresh(); // Refresh cart quantity in header
              } else {
                Alert.alert('Error', 'Failed to clear cart. Please try again.');
              }
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (!cart || cart.cart_items.length === 0) return;

    // Check for unavailable items or insufficient stock
    const unavailableItems = cart.cart_items.filter(item => !item.products.available);
    const insufficientStockItems = cart.cart_items.filter(
      item => item.products.available && item.products.inventory < item.quantity
    );

    if (unavailableItems.length > 0) {
      Alert.alert(
        'Unavailable Items',
        'Some items in your cart are no longer available. Please remove them before checkout.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (insufficientStockItems.length > 0) {
      Alert.alert(
        'Insufficient Stock',
        'Some items in your cart have insufficient stock. Please adjust quantities before checkout.',
        [{ text: 'OK' }]
      );
      return;
    }

    setCheckingOut(true);
    try {
      // Here you would typically integrate with a payment processor
      // For now, we'll just update the cart status to checked_out
      const success = await CartService.updateCartStatus(cart.id, 'checked_out');
      
      if (success) {
        Alert.alert(
          'Order Placed!',
          'Your order has been placed successfully. You will receive a confirmation shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back or to order confirmation screen
                loadCart(); // This will create a new active cart
                triggerRefresh(); // Refresh cart quantity in header
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.cart_items.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);
  };

  const getTotalItemCount = () => {
    if (!cart) return 0;
    return cart.cart_items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some products to get started!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = calculateTotal();
  const itemCount = getTotalItemCount();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {itemCount} item{itemCount !== 1 ? 's' : ''} • Total: ${total.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={cart.cart_items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        )}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <View style={styles.checkoutContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.checkoutButton, checkingOut && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={checkingOut}
        >
          {checkingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleProductsPress}>
          <Text style={styles.navIcon}>🛍️</Text>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleSellerPress}>
          <Text style={styles.navIcon}>🧑‍💼</Text>
          <Text style={styles.navText}>Seller</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleSettingsPress}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cartList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
  },
});
