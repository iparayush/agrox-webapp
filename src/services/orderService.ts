import { supabaseAdmin, isRealSupabase } from '../config/database.js';

export class OrderService {
  async createOrder(customerId: string, data: any) {
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const seq = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `AGX-${todayStr}-${seq}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_id: customerId,
      subtotal: 116,
      delivery_charge: data.delivery_type === 'Express' ? 40 : 25,
      discount: 10,
      total_amount: 131,
      payment_status: 'PAID',
      order_status: 'FARMER_PENDING',
      delivery_address: data.delivery_address || {
        street: 'Gangapur Road',
        city: 'Nashik',
        pincode: '422013',
        phone: '+91 98234 56789',
      },
      created_at: new Date().toISOString(),
    };

    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('orders').insert(newOrder);
    }

    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: string, userId: string) {
    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);

      await supabaseAdmin.from('order_status_history').insert({
        order_id: orderId,
        new_status: status,
        changed_by: userId,
      });
    }

    return { id: orderId, order_status: status, updated_at: new Date().toISOString() };
  }

  async getOrders(userId: string, role: string) {
    return [
      {
        id: 'AGX-8921',
        customer_name: 'Ayushi Par',
        farmer_name: 'Ramesh Patil',
        subtotal: 116,
        delivery_fee: 25,
        total_amount: 131,
        payment_method: 'UPI',
        order_status: 'READY',
        created_at: new Date().toISOString(),
      },
    ];
  }
}

export const orderService = new OrderService();
