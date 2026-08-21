export type UserRole = 'customer' | 'farmer' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  is_blocked?: boolean;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  name: string;
  photo_url: string;
  is_verified: boolean;
  village: string;
  district: string;
  location_text: string;
  farm_size_acres: number;
  rating: number;
  reviews_count: number;
  farm_photos: string[];
  bio?: string;
  documents_status: 'pending' | 'verified' | 'rejected';
  bank_details?: {
    account_number: string;
    ifsc: string;
    bank_name: string;
    holder_name: string;
  };
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Organic'
  | 'Seeds'
  | 'Others';

export type FarmingMethod = 'Organic' | 'Natural' | 'Standard' | 'Hydroponic';

export interface Product {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_location: string;
  farmer_avatar: string;
  farmer_verified?: boolean;
  name: string;
  category: ProductCategory;
  variety: string;
  price_per_unit: number; // in ₹
  unit: string; // e.g. 'kg', 'quintal', 'pack'
  available_quantity_kg: number;
  min_order_qty: number;
  harvest_date: string;
  farming_method: FarmingMethod;
  description: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export type OrderStatus =
  | 'Placed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit: string;
  image_url: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone?: string;
  delivery_address: DeliveryAddress;
  delivery_type: 'Standard' | 'Express' | 'Scheduled';
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  timeline: OrderTimelineStep[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'delivery' | 'system';
  created_at: string;
  is_read: boolean;
  group: 'Today' | 'Earlier';
}

export interface Settlement {
  id: string;
  farmer_id: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Processing' | 'Pending';
  bank_ref: string;
}

export interface SalesAnalytics {
  period: string;
  sales: number;
  ordersCount: number;
}
