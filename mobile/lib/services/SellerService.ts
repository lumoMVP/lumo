import { supabase } from '../supabase';
import { Database } from '../supabase';

type Seller = Database['public']['Tables']['sellers']['Row'];
type SellerInsert = Database['public']['Tables']['sellers']['Insert'];
type SellerUpdate = Database['public']['Tables']['sellers']['Update'];

export class SellerService {
  /**
   * Get a seller by ID
   */
  static async getById(id: string): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching seller:', error);
      return null;
    }

    // Convert PostGIS location to text format if it exists
    if (data && data.location) {
      try {
        const { data: locationText, error: locationError } = await supabase
          .rpc('get_seller_location_text', { seller_id: id });
        
        if (!locationError && locationText) {
          data.location = locationText;
        }
      } catch (err) {
        console.warn('Could not convert location to text format:', err);
      }
    }

    return data;
  }

  /**
   * Get a seller by auth ID
   */
  static async getByAuthId(authId: string): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.error('Error fetching seller by auth ID:', error);
      return null;
    }

    // Convert PostGIS location to text format if it exists
    if (data && data.location) {
      try {
        const { data: locationText, error: locationError } = await supabase
          .rpc('get_seller_location_text', { seller_id: data.id });
        
        if (!locationError && locationText) {
          data.location = locationText;
        }
      } catch (err) {
        console.warn('Could not convert location to text format:', err);
      }
    }

    return data;
  }

  /**
   * Get a seller by email
   */
  static async getByEmail(email: string): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching seller by email:', error);
      return null;
    }

    // Convert PostGIS location to text format if it exists
    if (data && data.location) {
      try {
        const { data: locationText, error: locationError } = await supabase
          .rpc('get_seller_location_text', { seller_id: data.id });
        
        if (!locationError && locationText) {
          data.location = locationText;
        }
      } catch (err) {
        console.warn('Could not convert location to text format:', err);
      }
    }

    return data;
  }

  /**
   * Create a new seller
   */
  static async create(seller: SellerInsert): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .insert(seller)
      .select()
      .single();

    if (error) {
      console.error('Error creating seller:', error);
      return null;
    }

    return data;
  }

  /**
   * Update a seller
   */
  static async update(id: string, updates: SellerUpdate): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating seller:', error);
      return null;
    }

    return data;
  }

  /**
   * Delete a seller
   */
  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting seller:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all active sellers
   */
  static async getActiveSellers(): Promise<Seller[]> {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching active sellers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get all sellers
   */
  static async getAll(): Promise<Seller[]> {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sellers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Search sellers by name or email
   */
  static async search(query: string): Promise<Seller[]> {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error searching sellers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update seller location
   */
  static async updateLocation(id: string, latitude: number, longitude: number): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .update({
        location: `POINT(${longitude} ${latitude})`
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating seller location:', error);
      return null;
    }

    return data;
  }

  /**
   * Update seller rating
   */
  static async updateRating(id: string, rating: number): Promise<Seller | null> {
    const { data, error } = await supabase
      .from('sellers')
      .update({ rating })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating seller rating:', error);
      return null;
    }

    return data;
  }

  /**
   * Toggle seller active status
   */
  static async toggleActiveStatus(id: string): Promise<Seller | null> {
    // First get current status
    const currentSeller = await this.getById(id);
    if (!currentSeller) return null;

    const { data, error } = await supabase
      .from('sellers')
      .update({ is_active: !currentSeller.is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling seller active status:', error);
      return null;
    }

    return data;
  }

  /**
   * Get sellers near a location (within radius)
   */
  static async getNearbySellers(latitude: number, longitude: number, radiusKm: number = 10): Promise<Seller[]> {
    const { data, error } = await supabase
      .rpc('get_nearby_sellers', {
        user_lat: latitude,
        user_lng: longitude,
        radius_meters: radiusKm * 1000
      });

    if (error) {
      console.error('Error fetching nearby sellers:', error);
      return [];
    }

    return data || [];
  }
}
