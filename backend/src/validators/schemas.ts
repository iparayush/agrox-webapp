import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Full name is required (min 2 chars)').max(255),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .max(20),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'FARMER', 'ADMIN']).default('CUSTOMER'),
});

export const LoginSchema = z.object({
  emailOrPhone: z.string().min(3, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(2).max(255).optional(),
  phone: z.string().min(10).max(20).optional(),
  avatar_url: z.string().url().optional(),
});

// ─── Products ─────────────────────────────────────────────────────────────────
export const CreateProductSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(255),
  category_id: z.string().uuid('Invalid category ID').optional(),
  category_name: z.string().max(100).optional(),
  variety: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Price must be greater than 0'),
  unit: z.string().min(1, 'Unit is required').max(20),
  minimum_order_quantity: z.number().positive().default(1),
  available_quantity: z.number().nonnegative('Quantity cannot be negative'),
  low_stock_threshold: z.number().nonnegative().default(50),
  harvest_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'harvest_date must be YYYY-MM-DD')
    .optional(),
  farming_method: z.string().max(50).default('Organic'),
  image_url: z.string().url().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  organicOnly: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Categories ───────────────────────────────────────────────────────────────
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  image_url: z.string().url().optional(),
  sort_order: z.number().int().default(0),
});

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const AddCartItemSchema = z.object({
  product_id: z.string().min(1, 'product_id is required'),
  quantity: z.number().positive('Quantity must be positive'),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().positive('Quantity must be positive'),
});

// ─── Addresses ────────────────────────────────────────────────────────────────
export const CreateAddressSchema = z.object({
  label: z.string().max(50).default('HOME'),
  full_name: z.string().min(2).max(255),
  phone: z.string().min(10).max(20),
  address_line_1: z.string().min(5).max(500),
  address_line_2: z.string().max(500).optional(),
  city: z.string().min(2).max(100),
  district: z.string().max(100).optional(),
  state: z.string().min(2).max(100),
  pincode: z
    .string()
    .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  is_default: z.boolean().default(false),
});

export const UpdateAddressSchema = CreateAddressSchema.partial();

// ─── Orders ───────────────────────────────────────────────────────────────────
export const CheckoutOrderSchema = z.object({
  address_id: z.string().optional(),
  delivery_address: z
    .object({
      full_name: z.string().min(2),
      phone: z.string().min(10),
      address_line_1: z.string().min(5),
      city: z.string().min(2),
      state: z.string().min(2),
      pincode: z.string().regex(/^\d{6}$/),
    })
    .optional(),
  delivery_type: z.enum(['Standard', 'Express', 'Scheduled']).default('Standard'),
  payment_method: z.enum(['UPI', 'Card', 'Net Banking', 'COD']).default('UPI'),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'PAYMENT_CONFIRMED',
    'FARMER_PENDING',
    'FARMER_ACCEPTED',
    'PREPARING',
    'READY',
    'DELIVERED',
    'CANCELLED',
    'REJECTED',
    'REFUND_PENDING',
    'REFUNDED',
  ]),
  reason: z.string().max(500).optional(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const CreateReviewSchema = z.object({
  product_id: z.string().min(1),
  order_id: z.string().min(1),
  rating: z.number().int().min(1, 'Rating min 1').max(5, 'Rating max 5'),
  comment: z.string().max(2000).optional(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const NotificationQuerySchema = z.object({
  unread_only: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Farmer ───────────────────────────────────────────────────────────────────
export const UpdateFarmerProfileSchema = z.object({
  farm_name: z.string().max(255).optional(),
  farm_size: z.number().nonnegative().optional(),
  farm_size_unit: z.string().max(20).optional(),
  farming_type: z.string().max(100).optional(),
  village: z.string().max(100).optional(),
  taluka: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  description: z.string().max(2000).optional(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────
export const VerifyFarmerSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'SUSPENDED']),
  reason: z.string().max(500).optional(),
});

export const ModerateProductSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'REJECTED']),
  reason: z.string().max(500).optional(),
});

export const UserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'BLOCKED', 'SUSPENDED']),
  reason: z.string().max(500).optional(),
});

// ─── Payment ──────────────────────────────────────────────────────────────────
export const PaymentWebhookSchema = z.object({
  order_id: z.string().min(1),
  gateway_transaction_id: z.string().min(1),
  status: z.enum(['PAID', 'FAILED']),
  gateway: z.string().default('RAZORPAY'),
  gateway_response: z.record(z.unknown()).optional(),
});
