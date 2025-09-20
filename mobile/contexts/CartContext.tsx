import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartService } from '../lib/services/CartService';

interface CartContextType {
  cartQuantity: number;
  refreshCartQuantity: () => Promise<void>;
  triggerRefresh: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshCartQuantity = useCallback(async () => {
    try {
      const cart = await CartService.getCurrentCartWithItems();
      if (cart?.cart_items) {
        const totalQuantity = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
        setCartQuantity(totalQuantity);
      } else {
        setCartQuantity(0);
      }
    } catch (error) {
      console.error('Error fetching cart quantity:', error);
      setCartQuantity(0);
    }
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    refreshCartQuantity();
  }, [refreshCartQuantity, refreshTrigger]);

  return (
    <CartContext.Provider value={{
      cartQuantity,
      refreshCartQuantity,
      triggerRefresh
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
