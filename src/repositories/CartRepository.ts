import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError } from '../utils/helpers.js';

export class CartRepository {
  /**
   * Get or create the cart for a customer. Returns cart with items.
   */
  async getCart(customerId: string) {
    if (isRealSupabase && supabaseAdmin) {
      // Ensure cart exists
      let { data: cart } = await supabaseAdmin
        .from('carts')
        .select('id')
        .eq('customer_id', customerId)
        .single();

      if (!cart) {
        const { data: newCart } = await supabaseAdmin
          .from('carts')
          .insert({ customer_id: customerId })
          .select()
          .single();
        cart = newCart;
      }

      const { data: items } = await supabaseAdmin
        .from('cart_items')
        .select('*, products(id, name, price, unit, farming_method, farmer_id, product_images(image_url, is_primary), inventory(available_quantity))')
        .eq('cart_id', cart!.id);

      return { cart_id: cart!.id, items: items || [] };
    }

    // Mock cart
    return {
      cart_id: `cart-${customerId}`,
      items: [
        {
          id: 'ci-1',
          product_id: 'prod-1',
          quantity: 3,
          products: {
            id: 'prod-1',
            name: 'Fresh Red Onion',
            price: 28,
            unit: 'kg',
            farming_method: 'Organic',
            farmer_id: 'f-1',
            image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80',
          },
        },
      ],
    };
  }

  async addItem(customerId: string, productId: string, quantity: number) {
    if (isRealSupabase && supabaseAdmin) {
      // Get or create cart
      let { data: cart } = await supabaseAdmin.from('carts').select('id').eq('customer_id', customerId).single();
      if (!cart) {
        const { data: nc } = await supabaseAdmin.from('carts').insert({ customer_id: customerId }).select().single();
        cart = nc;
      }

      // Validate stock
      const { data: inv } = await supabaseAdmin
        .from('inventory')
        .select('available_quantity')
        .eq('product_id', productId)
        .single();
      if (!inv || inv.available_quantity < quantity) {
        throw new AppError(`Insufficient stock. Only ${inv?.available_quantity || 0} units available.`, 409, 'INSUFFICIENT_STOCK');
      }

      // Upsert cart item
      const { data: existing } = await supabaseAdmin
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart!.id)
        .eq('product_id', productId)
        .single();

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (inv.available_quantity < newQty) {
          throw new AppError(`Insufficient stock for total quantity ${newQty}.`, 409, 'INSUFFICIENT_STOCK');
        }
        await supabaseAdmin.from('cart_items').update({ quantity: newQty }).eq('id', existing.id);
        return { ...existing, quantity: newQty };
      } else {
        const { data: item } = await supabaseAdmin
          .from('cart_items')
          .insert({ cart_id: cart!.id, product_id: productId, quantity })
          .select()
          .single();
        return item;
      }
    }

    return { id: `ci-${Date.now()}`, product_id: productId, quantity };
  }

  async updateItem(customerId: string, itemId: string, quantity: number) {
    if (isRealSupabase && supabaseAdmin) {
      // Verify cart ownership
      const { data: item } = await supabaseAdmin.from('cart_items').select('cart_id, product_id, carts!inner(customer_id)').eq('id', itemId).single();
      if (!item || (item.carts as any).customer_id !== customerId) {
        throw new AppError('Cart item not found', 404, 'NOT_FOUND');
      }
      // Stock check
      const { data: inv } = await supabaseAdmin.from('inventory').select('available_quantity').eq('product_id', item.product_id).single();
      if (!inv || inv.available_quantity < quantity) {
        throw new AppError('Insufficient stock', 409, 'INSUFFICIENT_STOCK');
      }
      const { data } = await supabaseAdmin.from('cart_items').update({ quantity }).eq('id', itemId).select().single();
      return data;
    }
    return { id: itemId, quantity };
  }

  async removeItem(customerId: string, itemId: string) {
    if (isRealSupabase && supabaseAdmin) {
      const { data: item } = await supabaseAdmin.from('cart_items').select('cart_id, carts!inner(customer_id)').eq('id', itemId).single();
      if (!item || (item.carts as any).customer_id !== customerId) {
        throw new AppError('Cart item not found', 404, 'NOT_FOUND');
      }
      await supabaseAdmin.from('cart_items').delete().eq('id', itemId);
    }
  }

  async clearCart(customerId: string) {
    if (isRealSupabase && supabaseAdmin) {
      const { data: cart } = await supabaseAdmin.from('carts').select('id').eq('customer_id', customerId).single();
      if (cart) {
        await supabaseAdmin.from('cart_items').delete().eq('cart_id', cart.id);
      }
    }
  }
}

export const cartRepository = new CartRepository();
