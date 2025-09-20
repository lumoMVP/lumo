import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCart } from '../contexts/CartContext';
import { RootStackParamList } from '../App';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList>;

interface CustomHeaderProps {
  title: string;
  showCart?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, showCart = false }) => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const { cartQuantity } = useCart();

  const handleCartPress = () => {
    console.log('Cart button pressed in header');
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.headerWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {showCart && (
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={handleCartPress}
              activeOpacity={0.6}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              testID="cart-button"
            >
              <Text style={styles.cartIcon}>🛒</Text>
              {cartQuantity > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartQuantity > 99 ? '99+' : cartQuantity}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#007AFF',
    paddingTop: 0,
  },
  safeArea: {
    backgroundColor: '#007AFF',
    flex: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    minHeight: 44,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  cartButton: {
    position: 'relative',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 20,
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
