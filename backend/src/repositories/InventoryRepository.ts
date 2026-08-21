import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError } from '../utils/helpers.js';

export class InventoryRepository {
  async getByProduct(productId: string) {
    if (isRealSupabase && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('inventory').select('*').eq('product_id', productId).single();
      return data || { product_id: productId, available_quantity: 0, reserved_quantity: 0 };
    }
    return { product_id: productId, available_quantity: 100, reserved_quantity: 0, unit: 'kg', low_stock_threshold: 50 };
  }

  async getFarmerInventory(farmerId: string) {
    if (isRealSupabase && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('inventory')
        .select('*, products!inner(id, name, unit, farmer_id, status)')
        .eq('products.farmer_id', farmerId);
      return data || [];
    }
    return [
      { product_id: 'prod-1', product_name: 'Fresh Red Onion', available_quantity: 250, reserved_quantity: 10, unit: 'kg', low_stock_threshold: 50 },
      { product_id: 'prod-2', product_name: 'Organic Potato', available_quantity: 180, reserved_quantity: 5, unit: 'kg', low_stock_threshold: 50 },
    ];
  }

  async update(productId: string, farmerId: string, payload: { available_quantity?: number; low_stock_threshold?: number }) {
    if (isRealSupabase && supabaseAdmin) {
      // Verify farmer owns the product
      const { data: prod } = await supabaseAdmin.from('products').select('farmer_id').eq('id', productId).single();
      if (!prod || prod.farmer_id !== farmerId) throw new AppError('Not authorized to update this inventory', 403, 'FORBIDDEN');

      if (payload.available_quantity !== undefined && payload.available_quantity < 0) {
        throw new AppError('Available quantity cannot be negative', 400, 'INVALID_QUANTITY');
      }

      const { data, error } = await supabaseAdmin
        .from('inventory')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('product_id', productId)
        .select()
        .single();
      if (error) throw new AppError(error.message, 500, 'DB_ERROR');
      return data;
    }
    return { product_id: productId, ...payload };
  }

  /**
   * Atomically reserve stock for an order. Throws if insufficient.
   */
  async reserveStock(productId: string, quantity: number) {
    if (isRealSupabase && supabaseAdmin) {
      const { data: inv, error } = await supabaseAdmin
        .from('inventory')
        .select('available_quantity, reserved_quantity')
        .eq('product_id', productId)
        .single();
      if (error || !inv) throw new AppError('Product inventory not found', 404, 'NOT_FOUND');
      if (inv.available_quantity < quantity) {
        throw new AppError(`Insufficient stock. Available: ${inv.available_quantity}`, 409, 'INSUFFICIENT_STOCK');
      }
      await supabaseAdmin.from('inventory').update({
        available_quantity: inv.available_quantity - quantity,
        reserved_quantity: inv.reserved_quantity + quantity,
        updated_at: new Date().toISOString(),
      }).eq('product_id', productId);
    }
  }

  /**
   * Release reserved stock on cancellation
   */
  async releaseStock(productId: string, quantity: number) {
    if (isRealSupabase && supabaseAdmin) {
      const { data: inv } = await supabaseAdmin.from('inventory').select('available_quantity, reserved_quantity').eq('product_id', productId).single();
      if (!inv) return;
      await supabaseAdmin.from('inventory').update({
        available_quantity: inv.available_quantity + quantity,
        reserved_quantity: Math.max(0, inv.reserved_quantity - quantity),
        updated_at: new Date().toISOString(),
      }).eq('product_id', productId);
    }
  }
}

export const inventoryRepository = new InventoryRepository();
