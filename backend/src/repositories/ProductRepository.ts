import { BaseRepository } from './BaseRepository.js';
import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError, parsePagination } from '../utils/helpers.js';

export interface Product {
  id: string;
  farmer_id: string;
  category_id?: string;
  name: string;
  variety?: string;
  description?: string;
  price: number;
  unit: string;
  minimum_order_quantity: number;
  harvest_date?: string;
  farming_method: string;
  status: string;
  created_at: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  organicOnly?: boolean;
  farmerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
  }

  async searchProducts(filters: ProductFilters): Promise<{ items: Product[]; total: number }> {
    const { page = 1, limit = 20 } = filters;
    const { offset } = parsePagination({ page, limit });

    // Mock data for development
    const mockProducts = [
      { id: 'prod-1', farmer_id: 'f-1', name: 'Fresh Red Onion', variety: 'Nashik Red Grade A', price: 28, unit: 'kg', minimum_order_quantity: 1, farming_method: 'Organic', status: 'ACTIVE', available_quantity: 250, farmer_name: 'Ramesh Patil', farmer_location: 'Niphad, Nashik', category: 'Vegetables', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80', created_at: new Date().toISOString() },
      { id: 'prod-2', farmer_id: 'f-1', name: 'Organic Potato', variety: 'Kufri Jyoti', price: 30, unit: 'kg', minimum_order_quantity: 1, farming_method: 'Organic', status: 'ACTIVE', available_quantity: 180, farmer_name: 'Ramesh Patil', farmer_location: 'Niphad, Nashik', category: 'Vegetables', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80', created_at: new Date().toISOString() },
      { id: 'prod-3', farmer_id: 'f-2', name: 'Fresh Tomato', variety: 'Hybrid Cherry', price: 45, unit: 'kg', minimum_order_quantity: 1, farming_method: 'Organic', status: 'ACTIVE', available_quantity: 120, farmer_name: 'Sunita Bhave', farmer_location: 'Sangamner, Ahmednagar', category: 'Vegetables', rating: 4.7, image_url: 'https://images.unsplash.com/photo-1546470427-0d5ed6370000?w=800&q=80', created_at: new Date().toISOString() },
      { id: 'prod-4', farmer_id: 'f-3', name: 'Alphonso Mango', variety: 'Ratnagiri Hapus', price: 800, unit: 'dozen', minimum_order_quantity: 1, farming_method: 'Natural', status: 'ACTIVE', available_quantity: 60, farmer_name: 'Ganesh Sawant', farmer_location: 'Devgad, Sindhudurg', category: 'Fruits', rating: 5.0, image_url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80', created_at: new Date().toISOString() },
      { id: 'prod-5', farmer_id: 'f-4', name: 'Organic Wheat', variety: 'GW 496', price: 28, unit: 'kg', minimum_order_quantity: 5, farming_method: 'Organic', status: 'ACTIVE', available_quantity: 500, farmer_name: 'Priya Shinde', farmer_location: 'Solapur', category: 'Grains', rating: 4.6, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80', created_at: new Date().toISOString() },
    ];

    if (isRealSupabase && supabaseAdmin) {
      let query = supabaseAdmin
        .from('products')
        .select('*, categories(name), farmers(id, farm_name, village, district, rating, profiles(full_name)), product_images(image_url, is_primary), inventory(available_quantity)', { count: 'exact' })
        .eq('status', filters.status || 'ACTIVE');

      if (filters.farmerId) query = query.eq('farmer_id', filters.farmerId);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
      if (filters.organicOnly) query = query.eq('farming_method', 'Organic');
      if (filters.category) query = (query as any).eq('categories.name', filters.category);

      query = (query as any).range(offset, offset + limit - 1).order('created_at', { ascending: false });
      const { data, count, error } = await query;
      if (!error && data) return { items: data as unknown as Product[], total: count || 0 };
    }

    // Apply mock filters
    let filtered = mockProducts;
    if (filters.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    if (filters.category) filtered = filtered.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    if (filters.organicOnly) filtered = filtered.filter(p => p.farming_method === 'Organic');
    if (filters.farmerId) filtered = filtered.filter(p => p.farmer_id === filters.farmerId);
    const paginated = filtered.slice(offset, offset + limit);
    return { items: paginated as unknown as Product[], total: filtered.length };
  }

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    return (await this.searchProducts({ farmerId, status: 'ACTIVE', limit: 100 })).items;
  }

  async assertOwner(productId: string, farmerId: string): Promise<void> {
    if (isRealSupabase && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('products').select('farmer_id').eq('id', productId).single();
      if (!data || data.farmer_id !== farmerId) throw new AppError('You do not own this product', 403, 'FORBIDDEN');
    }
  }
}

export const productRepository = new ProductRepository();
