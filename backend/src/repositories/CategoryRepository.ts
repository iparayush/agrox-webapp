import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError } from '../utils/helpers.js';

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Vegetables', slug: 'vegetables', image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80', is_active: true, sort_order: 1 },
  { id: 'cat-2', name: 'Fruits', slug: 'fruits', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80', is_active: true, sort_order: 2 },
  { id: 'cat-3', name: 'Grains & Cereals', slug: 'grains', image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80', is_active: true, sort_order: 3 },
  { id: 'cat-4', name: 'Dairy & Eggs', slug: 'dairy', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', is_active: true, sort_order: 4 },
  { id: 'cat-5', name: 'Spices & Herbs', slug: 'spices', image_url: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80', is_active: true, sort_order: 5 },
  { id: 'cat-6', name: 'Pulses', slug: 'pulses', image_url: 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=400&q=80', is_active: true, sort_order: 6 },
  { id: 'cat-7', name: 'Organic Products', slug: 'organic', image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', is_active: true, sort_order: 7 },
  { id: 'cat-8', name: 'Flowers & Plants', slug: 'flowers', image_url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc6e?w=400&q=80', is_active: true, sort_order: 8 },
];

export class CategoryRepository {
  async getAll(activeOnly = true) {
    if (isRealSupabase && supabaseAdmin) {
      let query = supabaseAdmin.from('categories').select('*').order('sort_order');
      if (activeOnly) query = query.eq('is_active', true);
      const { data } = await query;
      return data || MOCK_CATEGORIES;
    }
    return activeOnly ? MOCK_CATEGORIES.filter((c) => c.is_active) : MOCK_CATEGORIES;
  }

  async create(payload: { name: string; slug?: string; description?: string; image_url?: string; sort_order?: number }) {
    const slug = payload.slug || payload.name.toLowerCase().replace(/\s+/g, '-');
    if (isRealSupabase && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert({ ...payload, slug })
        .select()
        .single();
      if (error) throw new AppError(error.message, 500, 'DB_ERROR');
      return data;
    }
    return { id: `cat-${Date.now()}`, ...payload, slug, is_active: true };
  }

  async update(id: string, payload: Partial<{ name: string; is_active: boolean; image_url: string; sort_order: number }>) {
    if (isRealSupabase && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('categories').update(payload).eq('id', id).select().single();
      if (error) throw new AppError(error.message, 500, 'DB_ERROR');
      return data;
    }
    return { id, ...payload };
  }
}

export const categoryRepository = new CategoryRepository();
