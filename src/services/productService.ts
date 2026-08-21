import { supabaseAdmin, isRealSupabase } from '../config/database.js';

export class ProductService {
  async getProducts(filters: any) {
    if (isRealSupabase && supabaseAdmin) {
      let query = supabaseAdmin.from('products').select('*, categories(name)');
      if (filters.category) query = query.eq('categories.name', filters.category);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      const { data, error } = await query;
      if (!error && data) return data;
    }

    // Mock dataset matching frontend produce items
    return [
      {
        id: 'prod-1',
        name: 'Fresh Red Onion',
        category: 'Vegetables',
        variety: 'Nashik Red Grade A',
        price: 28,
        unit: 'kg',
        available_quantity: 250,
        farming_method: 'Organic',
        farmer_name: 'Ramesh Patil',
        farmer_location: 'Niphad, Nashik',
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
      },
      {
        id: 'prod-2',
        name: 'Organic Potato',
        category: 'Vegetables',
        variety: 'Kufri Jyoti',
        price: 30,
        unit: 'kg',
        available_quantity: 180,
        farming_method: 'Organic',
        farmer_name: 'Ramesh Patil',
        farmer_location: 'Niphad, Nashik',
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
      },
    ];
  }

  async createProduct(farmerId: string, data: any) {
    const newProd = {
      id: `prod-${Date.now()}`,
      farmer_id: farmerId,
      name: data.name,
      category: data.category_name || 'Vegetables',
      variety: data.variety || 'Local Fresh',
      price: data.price,
      unit: data.unit,
      available_quantity: data.available_quantity,
      minimum_order_quantity: data.minimum_order_quantity || 1,
      harvest_date: data.harvest_date || new Date().toISOString().split('T')[0],
      farming_method: data.farming_method || 'Organic',
      description: data.description || 'Fresh direct harvest',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('products').insert(newProd);
    }

    return newProd;
  }
}

export const productService = new ProductService();
