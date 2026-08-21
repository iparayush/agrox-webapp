-- ==========================================
-- AGROX SUPABASE POSTGRESQL PRODUCTION DDL
-- Paste this script directly into the Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drop existing resources if any (clean start)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS settlements CASCADE;
DROP TABLE IF EXISTS farmer_earnings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS farmer_documents CASCADE;
DROP TABLE IF EXISTS farms CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS settlement_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'FARMER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'BLOCKED', 'SUSPENDED', 'PENDING');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE document_type AS ENUM ('IDENTITY', 'FARM_PROOF', 'BANK_PROOF', 'OTHER');
CREATE TYPE product_status AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED');
CREATE TYPE order_status AS ENUM (
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
  'REFUNDED'
);
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE settlement_status AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED');
CREATE TYPE notification_type AS ENUM ('ORDER', 'PAYMENT', 'PRODUCT', 'FARMER', 'SYSTEM', 'PROMOTION');

-- 3. TABLES

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  default_address_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farmers
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  verification_status verification_status NOT NULL DEFAULT 'PENDING',
  farm_name VARCHAR(255),
  farm_size NUMERIC(10, 2),
  farm_size_unit VARCHAR(20) DEFAULT 'acres',
  farming_type VARCHAR(100),
  village VARCHAR(100),
  taluka VARCHAR(100),
  district VARCHAR(100),
  state VARCHAR(100) DEFAULT 'Maharashtra',
  pincode VARCHAR(10),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farms
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farm_name VARCHAR(255) NOT NULL,
  address TEXT,
  village VARCHAR(100),
  taluka VARCHAR(100),
  district VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  farm_size NUMERIC(10, 2),
  farm_size_unit VARCHAR(20) DEFAULT 'acres',
  farming_type VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farmer Documents
CREATE TABLE farmer_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_url TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  variety VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  unit VARCHAR(20) NOT NULL,
  minimum_order_quantity NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (minimum_order_quantity > 0),
  harvest_date DATE,
  farming_method VARCHAR(50) DEFAULT 'Organic',
  status product_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  available_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
  reserved_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  unit VARCHAR(20) NOT NULL,
  low_stock_threshold NUMERIC(10, 2) DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'HOME',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Carts
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_status payment_status NOT NULL DEFAULT 'PENDING',
  order_status order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  delivery_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  farmer_id UUID NOT NULL REFERENCES farmers(id),
  product_name VARCHAR(255) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Status History
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status order_status,
  new_status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  gateway VARCHAR(50) DEFAULT 'RAZORPAY',
  gateway_transaction_id VARCHAR(100),
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50) NOT NULL,
  status payment_status NOT NULL DEFAULT 'PENDING',
  gateway_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farmer Earnings
CREATE TABLE farmer_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  gross_amount NUMERIC(10, 2) NOT NULL,
  platform_charge NUMERIC(10, 2) NOT NULL,
  other_charges NUMERIC(10, 2) DEFAULT 0.00,
  net_amount NUMERIC(10, 2) NOT NULL,
  status settlement_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settlements
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id),
  amount NUMERIC(10, 2) NOT NULL,
  period_start DATE,
  period_end DATE,
  status settlement_status NOT NULL DEFAULT 'PENDING',
  reference_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  product_id UUID NOT NULL REFERENCES products(id),
  farmer_id UUID NOT NULL REFERENCES farmers(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR(20) DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'SYSTEM',
  reference_id VARCHAR(100),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_farmers_verification ON farmers(verification_status);
CREATE INDEX IF NOT EXISTS idx_farmers_district ON farmers(district);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 5. TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGN UP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Agrox User'),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'CUSTOMER'::public.user_role),
    'ACTIVE'::public.user_status
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role;
  
  -- Create role record
  IF COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER') = 'CUSTOMER' THEN
    INSERT INTO public.customers (profile_id) VALUES (new.id)
    ON CONFLICT (profile_id) DO NOTHING;
  ELSIF COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER') = 'FARMER' THEN
    INSERT INTO public.farmers (profile_id, verification_status) VALUES (new.id, 'PENDING')
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback so user creation never gets blocked
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 7. DEFINE RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Farmers can manage their own products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = products.farmer_id AND farmers.profile_id = auth.uid()
    )
  );

-- Categories
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

-- Orders
CREATE POLICY "Customers can view their own orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.customers 
      WHERE customers.id = orders.customer_id AND customers.profile_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can view order items belonging to them" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = order_items.farmer_id AND farmers.profile_id = auth.uid()
    )
  );
