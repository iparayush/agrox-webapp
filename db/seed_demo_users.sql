-- =================================================================
-- AGROX — SUPABASE SQL SCRIPT: DEMO USERS, PROFILES & SAMPLE DATA
-- =================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- =================================================================

-- 1. Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure Trigger Function handles search_path safely
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

-- =================================================================
-- 3. INSERT DEMO USERS IN auth.users
-- =================================================================

-- Demo 1: Customer (customer@agrox.com / password123)
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

-- Demo 2: Farmer (farmer@agrox.com / farmer123)
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

-- Demo 3: Admin (admin@agrox.com / admin123)
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

-- =================================================================
-- 4. INSERT PROFILES
-- =================================================================

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

-- =================================================================
-- 5. INSERT CUSTOMER & FARMER RECORDS
-- =================================================================

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

-- =================================================================
-- 6. INSERT SEED CATEGORIES
-- =================================================================

INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES
  ('ca111111-1111-4111-a111-111111111111', 'Vegetables', 'vegetables', 'Fresh seasonal green & root vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', 1),
  ('ca222222-2222-4222-a222-222222222222', 'Fruits', 'fruits', 'Farm-ripened orchard fresh fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400', 2),
  ('ca333333-3333-4333-a333-333333333333', 'Grains', 'grains', 'Nutrient rich staples & whole grains', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', 3),
  ('ca444444-4444-4444-a444-444444444444', 'Pulses', 'pulses', 'High-protein lentils, dal & pulses', 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=400', 4),
  ('ca555555-5555-4555-a555-555555555555', 'Spices', 'spices', 'Aromatic fresh ground & whole spices', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400', 5)
ON CONFLICT (name) DO NOTHING;

-- =================================================================
-- 7. INSERT SEED PRODUCTS & INVENTORY
-- =================================================================

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

-- Product Images
INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
VALUES
  ('ba111111-1111-4111-a111-111111111111', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600', true, 1),
  ('ba222222-2222-4222-a222-222222222222', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600', true, 1),
  ('ba333333-3333-4333-a333-333333333333', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600', true, 1)
ON CONFLICT DO NOTHING;

-- Inventory
INSERT INTO public.inventory (product_id, available_quantity, reserved_quantity, unit)
VALUES
  ('ba111111-1111-4111-a111-111111111111', 250, 0, 'kg'),
  ('ba222222-2222-4222-a222-222222222222', 500, 0, 'kg'),
  ('ba333333-3333-4333-a333-333333333333', 180, 0, 'kg')
ON CONFLICT (product_id) DO UPDATE SET
  available_quantity = EXCLUDED.available_quantity;
