import { useState, useEffect, useCallback, useRef } from 'react';
import { CartService } from '../lib/services/CartService';

export const useCartQuantity = () => {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCartQuantity = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    // Update immediately
    updateCartQuantity();
    
    // Then update every 2 seconds
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(updateCartQuantity, 2000);
  }, [updateCartQuantity]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startPolling();
    
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return {
    cartQuantity,
    loading,
    refreshCartQuantity: updateCartQuantity,
    startPolling,
    stopPolling
  };
};
