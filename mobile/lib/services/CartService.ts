import { supabase } from '../supabase';
import { Database } from '../supabase';
import { CustomerService } from './CustomerService';
import { MockAuthService } from './MockAuthService';

type Cart = Database['public']['Tables']['carts']['Row'];
type CartInsert = Database['public']['Tables']['carts']['Insert'];
type CartUpdate = Database['public']['Tables']['carts']['Update'];
type CartItem = Database['public']['Tables']['cart_items']['Row'];
type CartItemInsert = Database['public']['Tables']['cart_items']['Insert'];
type CartItemUpdate = Database['public']['Tables']['cart_items']['Update'];
type ActiveCart = Database['public']['Views']['active_carts']['Row'];

export interface CartWithItems extends Cart {
  cart_items: (CartItem & {
    products: {
      id: string;
      name: string;
      price: number;
      image_url: string | null;
      available: boolean | null;
      inventory: number;
    };
  })[];
}

export class CartService {
  /**
   * Get or create an active cart for the current user
   */
  static async getOrCreateActiveCart(): Promise<Cart | null> {
    try {
      // Use MockAuthService if available, fallback to Supabase auth
      let customerId: string | null = null;

      if (MockAuthService.isAuthenticated()) {
        customerId = MockAuthService.getCustomerId();
      } else {
        // Fallback to Supabase auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No authenticated user');
          return null;
        }

        // Get customer by auth_id
        const customer = await CustomerService.getByAuthId(user.id);
        if (!customer) {
          console.error('Customer not found for authenticated user');
          return null;
        }
        customerId = customer.id;
      }

      if (!customerId) {
        console.error('No customer ID available');
        return null;
      }

      // Try to find existing active cart
      const { data: existingCart, error: findError } = await supabase
        .from('active_carts')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error finding active cart:', findError);
        return null;
      }

      if (existingCart) {
        return existingCart as Cart;
      }

      // Create new active cart
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({
          customer_id: customerId,
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating new cart:', createError);
        return null;
      }

      return newCart;
    } catch (error) {
      console.error('Error in getOrCreateActiveCart:', error);
      return null;
    }
  }

  /**
   * Add a product to cart or update quantity if it already exists
   */
  static async addToCart(productId: string, quantity: number = 1): Promise<boolean> {
    try {
      // Get or create active cart
      const cart = await this.getOrCreateActiveCart();
      if (!cart) {
        console.error('Could not get or create active cart');
        return false;
      }

      // Check if product already exists in cart
      const { data: existingItem, error: findItemError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .single();

      if (findItemError && findItemError.code !== 'PGRST116') {
        console.error('Error checking existing cart item:', findItemError);
        return false;
      }

      if (existingItem) {
        // Update existing item quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity
          })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart item quantity:', updateError);
          return false;
        }
      } else {
        // Add new item to cart (unit_price will be set automatically by trigger)
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: productId,
            quantity: quantity
          });

        if (insertError) {
          console.error('Error adding item to cart:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in addToCart:', error);
      return false;
    }
  }

  /**
   * Get cart with items and product details
   */
  static async getCartWithItems(cartId: string): Promise<CartWithItems | null> {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select(`
          *,
          cart_items (
            *,
            products (
              id,
              name,
              price,
              image_url,
              available,
              inventory
            )
          )
        `)
        .eq('id', cartId)
        .single();

      if (error) {
        console.error('Error fetching cart with items:', error);
        return null;
      }

      return data as CartWithItems;
    } catch (error) {
      console.error('Error in getCartWithItems:', error);
      return null;
    }
  }

  /**
   * Get current user's active cart with items
   */
  static async getCurrentCartWithItems(): Promise<CartWithItems | null> {
    try {
      const cart = await this.getOrCreateActiveCart();
      if (!cart) return null;

      return await this.getCartWithItems(cart.id);
    } catch (error) {
      console.error('Error in getCurrentCartWithItems:', error);
      return null;
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    try {
      if (quantity <= 0) {
        return await this.removeCartItem(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) {
        console.error('Error updating cart item quantity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCartItemQuantity:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  static async removeCartItem(cartItemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Error removing cart item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeCartItem:', error);
      return false;
    }
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(cartId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

      if (error) {
        console.error('Error clearing cart:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in clearCart:', error);
      return false;
    }
  }

  /**
   * Get cart total
   */
  static async getCartTotal(cartId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity, unit_price')
        .eq('cart_id', cartId);

      if (error) {
        console.error('Error calculating cart total:', error);
        return 0;
      }

      return data?.reduce((total, item) => {
        return total + (item.quantity * item.unit_price);
      }, 0) || 0;
    } catch (error) {
      console.error('Error in getCartTotal:', error);
      return 0;
    }
  }

  /**
   * Get cart item count
   */
  static async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getOrCreateActiveCart();
      if (!cart) return 0;

      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('cart_id', cart.id);

      if (error) {
        console.error('Error getting cart item count:', error);
        return 0;
      }

      return data?.reduce((total, item) => total + item.quantity, 0) || 0;
    } catch (error) {
      console.error('Error in getCartItemCount:', error);
      return 0;
    }
  }

  /**
   * Update cart status (e.g., to 'checked_out')
   */
  static async updateCartStatus(cartId: string, status: string): Promise<boolean> {
    try {
      const updates: CartUpdate = { status };
      
      if (status === 'checked_out') {
        updates.checked_out_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('carts')
        .update(updates)
        .eq('id', cartId);

      if (error) {
        console.error('Error updating cart status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCartStatus:', error);
      return false;
    }
  }
}
