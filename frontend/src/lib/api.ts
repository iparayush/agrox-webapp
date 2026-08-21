/**
 * AGROX API Client — centralized HTTP client for all backend API calls.
 * Handles auth tokens, error formatting, and base URL configuration.
 */

const rawUrl = import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api/v1';
const API_BASE = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api/v1`;

let authToken: string | null = localStorage.getItem('agrox_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('agrox_token', token);
  } else {
    localStorage.removeItem('agrox_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('agrox_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: any) {
  if (user) {
    localStorage.setItem('agrox_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('agrox_user');
  }
}

export function clearAuth() {
  setAuthToken(null);
  setStoredUser(null);
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

async function request<T>(
  method: string,
  path: string,
  body?: any,
  requiresAuth = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (requiresAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({ success: false, message: 'Network error' }));

    if (!res.ok) {
      return { success: false, message: json.message || json.error || `Request failed (${res.status})` };
    }
    return { success: true, ...json };
  } catch (err: any) {
    console.warn(`[API] ${method} ${path} failed:`, err.message);
    return { success: false, message: err.message || 'Network error — is the backend running?' };
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (data: { full_name: string; email: string; phone: string; password: string; role?: string }) =>
      request<{ token: string; user: any }>('POST', '/auth/register', data),

    login: (emailOrPhone: string, password: string) =>
      request<{ token: string; user: any }>('POST', '/auth/login', { emailOrPhone, password }),

    getProfile: () => request<any>('GET', '/auth/profile', undefined, true),

    updateProfile: (updates: any) => request<any>('PATCH', '/auth/profile', updates, true),
  },

  // ─── Products ──────────────────────────────────────────────────────────────────
  products: {
    list: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set('category', params.category);
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const query = qs.toString() ? `?${qs}` : '';
      return request<{ items: any[]; total: number }>('GET', `/products${query}`);
    },

    getById: (id: string) => request<any>('GET', `/products/${id}`),

    create: (data: any) => request<any>('POST', '/products', data, true),
  },

  // ─── Orders ────────────────────────────────────────────────────────────────────
  orders: {
    list: () => request<{ items: any[]; total: number }>('GET', '/orders', undefined, true),

    create: (data: any) => request<any>('POST', '/orders', data, true),

    updateStatus: (id: string, status: string, reason?: string) =>
      request<any>('PATCH', `/orders/${id}/status`, { status, reason }, true),
  },

  // ─── Categories ────────────────────────────────────────────────────────────────
  categories: {
    list: () => request<any[]>('GET', '/categories'),
  },

  // ─── Cart ──────────────────────────────────────────────────────────────────────
  cart: {
    get: () => request<any>('GET', '/cart', undefined, true),
    add: (productId: string, quantity: number) => request<any>('POST', '/cart', { product_id: productId, quantity }, true),
    update: (itemId: string, quantity: number) => request<any>('PATCH', `/cart/${itemId}`, { quantity }, true),
    remove: (itemId: string) => request<any>('DELETE', `/cart/${itemId}`, undefined, true),
    clear: () => request<any>('DELETE', '/cart', undefined, true),
  },

  // ─── Farmer ────────────────────────────────────────────────────────────────────
  farmer: {
    dashboard: () => request<any>('GET', '/farmer/dashboard', undefined, true),
    earnings: () => request<any>('GET', '/farmer/earnings', undefined, true),
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────────
  admin: {
    dashboard: () => request<any>('GET', '/admin/dashboard', undefined, true),
    getUsers: (role?: string) => request<any[]>('GET', `/admin/users${role ? `?role=${role}` : ''}`, undefined, true),
    updateUserStatus: (id: string, status: string) =>
      request<any>('PATCH', `/admin/users/${id}/status`, { status }, true),
    getFarmers: () => request<any[]>('GET', '/admin/farmers', undefined, true),
    verifyFarmer: (id: string, status: string) =>
      request<any>('PATCH', `/admin/farmers/${id}/verify`, { status }, true),
    getProducts: () => request<any[]>('GET', '/admin/products', undefined, true),
    updateProductStatus: (id: string, status: string) =>
      request<any>('PATCH', `/admin/products/${id}/status`, { status }, true),
    getOrders: (status?: string) =>
      request<any[]>('GET', `/admin/orders${status && status !== 'All' ? `?status=${status}` : ''}`, undefined, true),
    updateOrderStatus: (id: string, status: string) =>
      request<any>('PATCH', `/admin/orders/${id}/status`, { status }, true),
    getPayments: () => request<any>('GET', '/admin/payments', undefined, true),
  },

  // ─── Notifications ─────────────────────────────────────────────────────────────
  notifications: {
    list: (unreadOnly = false) => request<any>('GET', `/notifications?unread_only=${unreadOnly}`, undefined, true),
    markRead: (id: string) => request<any>('PATCH', `/notifications/${id}/read`, undefined, true),
    markAllRead: () => request<any>('PATCH', '/notifications/read-all', undefined, true),
  },

  // ─── Health ────────────────────────────────────────────────────────────────────
  health: () => request<any>('GET', '/health'),
};
