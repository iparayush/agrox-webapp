-- ======================================================================================
-- AGROX 2.0 — COMPLETE ALL-IN-ONE SUPABASE SCHEMA & SEED SCRIPT
-- ======================================================================================
-- Instructions:
-- 1. Open Supabase Dashboard -> SQL Editor (Click 'New query')
-- 2. Select All (Cmd+A / Ctrl+A) -> Paste -> Click 'RUN'
-- ======================================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE ENUM TYPES (Safely)
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('CUSTOMER', 'FARMER', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.user_status AS ENUM ('ACTIVE', 'BLOCKED', 'SUSPENDED', 'PENDING');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.product_status AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'FARMER_PENDING', 'FARMER_ACCEPTED',
    'PREPARING', 'READY', 'DELIVERED', 'CANCELLED', 'REJECTED', 'REFUND_PENDING', 'REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.settlement_status AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_type AS ENUM ('ORDER', 'PAYMENT', 'PRODUCT', 'FARMER', 'SYSTEM', 'PROMOTION');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. CREATE ALL TABLES

-- 3.1 Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'CUSTOMER',
  status public.user_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  default_address_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Farmers Table
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  verification_status public.verification_status NOT NULL DEFAULT 'PENDING',
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

-- 3.4 Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
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

-- 3.5 Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  variety VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  unit VARCHAR(20) NOT NULL,
  minimum_order_quantity NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (minimum_order_quantity > 0),
  harvest_date DATE,
  farming_method VARCHAR(50) DEFAULT 'Organic',
  status public.product_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  available_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
  reserved_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  unit VARCHAR(20) NOT NULL,
  low_stock_threshold NUMERIC(10, 2) DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 3.9 Carts Table
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10 Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.11 Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_status public.payment_status NOT NULL DEFAULT 'PENDING',
  order_status public.order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  delivery_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.12 Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id),
  product_name VARCHAR(255) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.13 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'SYSTEM',
  reference_id VARCHAR(100),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGN UP
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
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public view active products" ON public.products FOR SELECT USING (status = 'ACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public view categories" ON public.categories FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ======================================================================================
-- 6. INSERT DEMO AUTH USERS IN auth.users
-- ======================================================================================

-- 1. Demo Customer (customer@agrox.com / password123)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '11111111-1111-4111-a111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'customer@agrox.com',
  crypt('password123', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ayushi Par","role":"CUSTOMER"}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- 2. Demo Farmer (farmer@agrox.com / farmer123)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '22222222-2222-4222-a222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'farmer@agrox.com',
  crypt('farmer123', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ramesh Patil","role":"FARMER"}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- 3. Demo Admin (admin@agrox.com / admin123)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '33333333-3333-4333-a333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@agrox.com',
  crypt('admin123', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Administrator","role":"ADMIN"}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- ======================================================================================
-- 7. INSERT PROFILES & ROLES
-- ======================================================================================

INSERT INTO public.profiles (id, full_name, email, phone, role, status)
VALUES
  ('11111111-1111-4111-a111-111111111111', 'Ayushi Par', 'customer@agrox.com', '+91 98234 56789', 'CUSTOMER', 'ACTIVE'),
  ('22222222-2222-4222-a222-222222222222', 'Ramesh Patil', 'farmer@agrox.com', '+91 98765 43210', 'FARMER', 'ACTIVE'),
  ('33333333-3333-4333-a333-333333333333', 'System Administrator', 'admin@agrox.com', '+91 99999 00000', 'ADMIN', 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

INSERT INTO public.customers (profile_id)
VALUES ('11111111-1111-4111-a111-111111111111')
ON CONFLICT (profile_id) DO NOTHING;

INSERT INTO public.farmers (id, profile_id, verification_status, farm_name, farm_size, village, taluka, district, state)
VALUES (
  'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-4222-a222-222222222222',
  'APPROVED',
  'Patil Organic Farms',
  8.5,
  'Dindori',
  'Dindori',
  'Nashik',
  'Maharashtra'
)
ON CONFLICT (profile_id) DO UPDATE SET
  id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
  verification_status = 'APPROVED',
  farm_name = EXCLUDED.farm_name,
  village = EXCLUDED.village,
  district = EXCLUDED.district;

-- ======================================================================================
-- 8. INSERT CATEGORIES, PRODUCTS, IMAGES & INVENTORY
-- ======================================================================================

INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES
  ('ca111111-1111-4111-a111-111111111111', 'Vegetables', 'vegetables', 'Fresh seasonal green & root vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', 1),
  ('ca222222-2222-4222-a222-222222222222', 'Fruits', 'fruits', 'Farm-ripened orchard fresh fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400', 2),
  ('ca333333-3333-4333-a333-333333333333', 'Grains', 'grains', 'Nutrient rich staples & whole grains', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', 3),
  ('ca444444-4444-4444-a444-444444444444', 'Pulses', 'pulses', 'High-protein lentils, dal & pulses', 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=400', 4),
  ('ca555555-5555-4555-a555-555555555555', 'Spices', 'spices', 'Aromatic fresh ground & whole spices', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400', 5)
ON CONFLICT (name) DO NOTHING;

-- Product 1: Tomatoes
INSERT INTO public.products (
  id, farmer_id, category_id, name, variety, description, price, unit, minimum_order_quantity, status, farming_method, harvest_date
)
SELECT
  'ba111111-1111-4111-a111-111111111111',
  f.id,
  c.id,
  'Organic Hybrid Tomatoes',
  'Vaishali Hybrid',
  'Juicy, sun-ripened organic red tomatoes harvested early morning.',
  38.00,
  'kg',
  1,
  'ACTIVE'::public.product_status,
  'Organic',
  CURRENT_DATE
FROM public.farmers f, public.categories c
WHERE f.profile_id = '22222222-2222-4222-a222-222222222222' AND c.slug = 'vegetables'
ON CONFLICT (id) DO NOTHING;

-- Product 2: Red Onions
INSERT INTO public.products (
  id, farmer_id, category_id, name, variety, description, price, unit, minimum_order_quantity, status, farming_method, harvest_date
)
SELECT
  'ba222222-2222-4222-a222-222222222222',
  f.id,
  c.id,
  'Nashik Red Onions',
  'Garwa Red',
  'Pungent, long-lasting high quality Nashik onions directly from Dindori farm.',
  28.00,
  'kg',
  2,
  'ACTIVE'::public.product_status,
  'Natural',
  CURRENT_DATE - INTERVAL '1 day'
FROM public.farmers f, public.categories c
WHERE f.profile_id = '22222222-2222-4222-a222-222222222222' AND c.slug = 'vegetables'
ON CONFLICT (id) DO NOTHING;

-- Product 3: Grapes
INSERT INTO public.products (
  id, farmer_id, category_id, name, variety, description, price, unit, minimum_order_quantity, status, farming_method, harvest_date
)
SELECT
  'ba333333-3333-4333-a333-333333333333',
  f.id,
  c.id,
  'Seedless Thompson Grapes',
  'Thompson Green',
  'Sweet, crunchy export-grade table grapes from Nashik vineyards.',
  85.00,
  'kg',
  1,
  'ACTIVE'::public.product_status,
  'Organic',
  CURRENT_DATE
FROM public.farmers f, public.categories c
WHERE f.profile_id = '22222222-2222-4222-a222-222222222222' AND c.slug = 'fruits'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
VALUES
  ('ba111111-1111-4111-a111-111111111111', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600', true, 1),
  ('ba222222-2222-4222-a222-222222222222', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600', true, 1),
  ('ba333333-3333-4333-a333-333333333333', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600', true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.inventory (product_id, available_quantity, reserved_quantity, unit)
VALUES
  ('ba111111-1111-4111-a111-111111111111', 250, 0, 'kg'),
  ('ba222222-2222-4222-a222-222222222222', 500, 0, 'kg'),
  ('ba333333-3333-4333-a333-333333333333', 180, 0, 'kg')
ON CONFLICT (product_id) DO UPDATE SET
  available_quantity = EXCLUDED.available_quantity;
