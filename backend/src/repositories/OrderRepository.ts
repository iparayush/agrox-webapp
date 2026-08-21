import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError, generateOrderNumber, calculateEarnings } from '../utils/helpers.js';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'FARMER_PENDING'
  | 'FARMER_ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

// Valid next states for each status (state machine)
const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAYMENT_CONFIRMED', 'CANCELLED'],
  PAYMENT_CONFIRMED: ['FARMER_PENDING', 'CANCELLED'],
  FARMER_PENDING: ['FARMER_ACCEPTED', 'REJECTED'],
  FARMER_ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['DELIVERED'],
  DELIVERED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  CANCELLED: [],
  REJECTED: [],
  REFUNDED: [],
};

export interface OrderLineItem {
  product_id: string;
  farmer_id: string;
  product_name: string;
  unit_price: number;
  unit: string;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderPayload {
  customer_id: string;
  items: OrderLineItem[];
  delivery_address: Record<string, unknown>;
  delivery_type: string;
  payment_method: string;
}

export class OrderRepository {
  async createOrder(payload: CreateOrderPayload) {
    const orderNumber = generateOrderNumber();
    const subtotal = payload.items.reduce((sum, i) => sum + i.subtotal, 0);
    const delivery_charge = payload.delivery_type === 'Express' ? 40 : 25;
    const total_amount = parseFloat((subtotal + delivery_charge).toFixed(2));

    const order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_id: payload.customer_id,
      subtotal,
      delivery_charge,
      discount: 0,
      total_amount,
      payment_status: 'PENDING',
      order_status: 'FARMER_PENDING',
      delivery_address: payload.delivery_address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isRealSupabase && supabaseAdmin) {
      // Create order row
      const { data: newOrder, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert(order)
        .select()
        .single();
      if (orderErr) throw new AppError(orderErr.message, 500, 'DB_ERROR');

      // Insert order items
      const orderItems = payload.items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        farmer_id: item.farmer_id,
        product_name: item.product_name,
        unit_price: item.unit_price,
        unit: item.unit,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));
      await supabaseAdmin.from('order_items').insert(orderItems);

      // Initial status history
      await supabaseAdmin.from('order_status_history').insert({
        order_id: newOrder.id,
        new_status: 'FARMER_PENDING',
        changed_by: payload.customer_id,
      });

      return newOrder;
    }

    return order;
  }

  async updateStatus(orderId: string, newStatus: OrderStatus, changedBy: string, reason?: string) {
    if (isRealSupabase && supabaseAdmin) {
      const { data: current } = await supabaseAdmin
        .from('orders')
        .select('order_status')
        .eq('id', orderId)
        .single();

      if (current) {
        const allowed = VALID_TRANSITIONS[current.order_status] || [];
        if (!allowed.includes(newStatus)) {
          throw new AppError(
            `Cannot transition from ${current.order_status} to ${newStatus}`,
            409,
            'INVALID_STATUS_TRANSITION'
          );
        }
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ order_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();
      if (error) throw new AppError(error.message, 500, 'DB_ERROR');

      await supabaseAdmin.from('order_status_history').insert({
        order_id: orderId,
        old_status: current?.order_status,
        new_status: newStatus,
        changed_by: changedBy,
        reason,
      });

      // On payment confirmed — calculate farmer earnings
      if (newStatus === 'PAYMENT_CONFIRMED') {
        await this.calculateAndRecordEarnings(orderId);
      }

      return data;
    }

    return { id: orderId, order_status: newStatus, updated_at: new Date().toISOString() };
  }

  async calculateAndRecordEarnings(orderId: string) {
    if (!isRealSupabase || !supabaseAdmin) return;
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('farmer_id, subtotal')
      .eq('order_id', orderId);
    if (!items) return;

    // Group by farmer
    const byFarmer: Record<string, number> = {};
    for (const item of items) {
      byFarmer[item.farmer_id] = (byFarmer[item.farmer_id] || 0) + item.subtotal;
    }

    for (const [farmerId, gross] of Object.entries(byFarmer)) {
      const { gross_amount, platform_charge, net_amount } = calculateEarnings(gross);
      await supabaseAdmin.from('farmer_earnings').insert({
        farmer_id: farmerId,
        order_id: orderId,
        gross_amount,
        platform_charge,
        net_amount,
        status: 'PENDING',
      });
    }
  }

  async getOrders(userId: string, role: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    if (isRealSupabase && supabaseAdmin) {
      let query;
      if (role === 'CUSTOMER') {
        query = supabaseAdmin
          .from('orders')
          .select('*, order_items(*, products(name, product_images(image_url)))', { count: 'exact' })
          .eq('customer_id', userId);
      } else if (role === 'FARMER') {
        query = supabaseAdmin
          .from('order_items')
          .select('*, orders(*)', { count: 'exact' })
          .eq('farmer_id', userId);
      } else {
        query = supabaseAdmin.from('orders').select('*', { count: 'exact' });
      }
      const { data, count } = await (query as any).range(offset, offset + limit - 1).order('created_at', { ascending: false });
      return { items: data || [], total: count || 0 };
    }

    // Mock orders
    return {
      items: [
        { id: 'AGX-20260821-921', order_number: 'AGX-20260821-921', customer_name: 'Ayushi Par', farmer_name: 'Ramesh Patil', subtotal: 116, delivery_fee: 25, total_amount: 141, payment_method: 'UPI', order_status: 'READY', created_at: new Date().toISOString() },
      ],
      total: 1,
    };
  }

  async getOrderById(orderId: string) {
    if (isRealSupabase && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*, products(name)), order_status_history(*)')
        .eq('id', orderId)
        .single();
      return data;
    }
    return null;
  }
}

export const orderRepository = new OrderRepository();
