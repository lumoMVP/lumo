import { supabase } from '../supabase';
import { Database } from '../supabase';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export class CustomerService {
  /**
   * Get a customer by ID
   */
  static async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }

    // Convert PostGIS location to text format if it exists
    if (data && data.location) {
      try {
        const { data: locationText, error: locationError } = await supabase
          .rpc('get_customer_location_text', { customer_id: id });
        
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
   * Get a customer by auth ID
   */
  static async getByAuthId(authId: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.error('Error fetching customer by auth ID:', error);
      return null;
    }

    // Convert PostGIS location to text format if it exists
    if (data && data.location) {
      try {
        const { data: locationText, error: locationError } = await supabase
          .rpc('get_customer_location_text', { customer_id: data.id });
        
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
   * Get a customer by email
   */
  static async getByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching customer by email:', error);
      return null;
    }

    // Convert PostGIS location to text format if it exists
    if (data && data.location) {
      try {
        const { data: locationText, error: locationError } = await supabase
          .rpc('get_customer_location_text', { customer_id: data.id });
        
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
   * Create a new customer
   */
  static async create(customer: CustomerInsert): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return null;
    }

    return data;
  }

  /**
   * Update a customer
   */
  static async update(id: string, updates: CustomerUpdate): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      return null;
    }

    return data;
  }

  /**
   * Delete a customer
   */
  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all customers
   */
  static async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Search customers by name or email
   */
  static async search(query: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name');

    if (error) {
      console.error('Error searching customers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update customer location
   */
  static async updateLocation(id: string, latitude: number, longitude: number): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        location: `POINT(${longitude} ${latitude})`
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer location:', error);
      return null;
    }

    return data;
  }

  /**
   * Update customer preferences
   */
  static async updatePreferences(id: string, preferences: any): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .update({ preferences })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer preferences:', error);
      return null;
    }

    return data;
  }
}
