import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * AGROX Supabase Database Schema Guide:
 * 
 * TABLE profiles (
 *   id uuid primary key,
 *   full_name text,
 *   email text,
 *   phone text,
 *   role text,
 *   avatar_url text,
 *   created_at timestamp
 * );
 * 
 * TABLE farmers (
 *   id uuid primary key,
 *   user_id uuid references profiles(id),
 *   name text,
 *   photo_url text,
 *   is_verified boolean,
 *   village text,
 *   district text,
 *   farm_size_acres numeric,
 *   rating numeric
 * );
 * 
 * TABLE products (
 *   id uuid primary key,
 *   farmer_id uuid references farmers(id),
 *   name text,
 *   category text,
 *   variety text,
 *   price_per_unit numeric,
 *   unit text,
 *   available_quantity_kg numeric,
 *   min_order_qty numeric,
 *   harvest_date date,
 *   farming_method text,
 *   description text,
 *   image_url text,
 *   is_active boolean,
 *   is_approved boolean
 * );
 * 
 * TABLE orders (
 *   id uuid primary key,
 *   customer_id uuid references profiles(id),
 *   farmer_id uuid references farmers(id),
 *   total_amount numeric,
 *   order_status text,
 *   payment_status text,
 *   created_at timestamp
 * );
 */

export async function fetchProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetch products fallback to mock:', err);
    return null;
  }
}

export async function createOrderInSupabase(orderData: any) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('orders').insert(orderData).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase create order fallback to mock:', err);
    return null;
  }
}
