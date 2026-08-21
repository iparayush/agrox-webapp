import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError } from '../utils/helpers.js';

export interface NotificationPayload {
  user_id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'PRODUCT' | 'FARMER' | 'SYSTEM' | 'PROMOTION';
  reference_id?: string;
}

const MOCK_NOTIFICATIONS: any[] = [
  { id: 'n-1', user_id: 'usr-101', title: 'Order Confirmed', message: 'Your order AGX-20260821-921 has been accepted by the farmer.', type: 'ORDER', is_read: false, created_at: new Date().toISOString() },
  { id: 'n-2', user_id: 'usr-101', title: 'Payment Successful', message: 'Payment of ₹141 received for order AGX-20260821-921.', type: 'PAYMENT', is_read: false, created_at: new Date().toISOString() },
  { id: 'n-3', user_id: 'usr-101', title: 'Order Ready', message: 'Your fresh produce is packed and ready for delivery!', type: 'ORDER', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export class NotificationRepository {
  async list(userId: string, unreadOnly = false, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    if (isRealSupabase && supabaseAdmin) {
      let query = supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (unreadOnly) query = query.eq('is_read', false);
      const { data, count } = await query;
      return { items: data || [], total: count || 0 };
    }
    const filtered = unreadOnly ? MOCK_NOTIFICATIONS.filter((n) => !n.is_read) : MOCK_NOTIFICATIONS;
    const items = filtered.filter((n) => n.user_id === userId).slice(offset, offset + limit);
    return { items, total: filtered.length };
  }

  async markRead(notificationId: string, userId: string) {
    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('notifications').update({ is_read: true }).eq('id', notificationId).eq('user_id', userId);
    }
    const n = MOCK_NOTIFICATIONS.find((x) => x.id === notificationId);
    if (n) n.is_read = true;
  }

  async markAllRead(userId: string) {
    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    }
    MOCK_NOTIFICATIONS.filter((n) => n.user_id === userId).forEach((n) => (n.is_read = true));
  }

  async create(payload: NotificationPayload) {
    if (isRealSupabase && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('notifications').insert(payload).select().single();
      return data;
    }
    const n = { id: `n-${Date.now()}`, ...payload, is_read: false, created_at: new Date().toISOString() };
    MOCK_NOTIFICATIONS.unshift(n);
    return n;
  }

  async unreadCount(userId: string): Promise<number> {
    if (isRealSupabase && supabaseAdmin) {
      const { count } = await (supabaseAdmin.from('notifications').select('*', { count: 'exact', head: true }) as any).eq('user_id', userId).eq('is_read', false);
      return count || 0;
    }
    return MOCK_NOTIFICATIONS.filter((n) => n.user_id === userId && !n.is_read).length;
  }
}

export const notificationRepository = new NotificationRepository();
