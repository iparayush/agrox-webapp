# DATABASE.md — AGROX Data Schema & PostgreSQL Specifications

## Tables & Entities

### 1. `profiles`
- `id` (UUID, Primary Key, Foreign Key ➔ `auth.users.id`)
- `full_name` (VARCHAR 255, NOT NULL)
- `email` (VARCHAR 255, UNIQUE)
- `phone` (VARCHAR 20, UNIQUE)
- `avatar_url` (TEXT)
- `role` (ENUM: `CUSTOMER`, `FARMER`, `ADMIN`, `SUPER_ADMIN`)
- `status` (ENUM: `ACTIVE`, `BLOCKED`, `SUSPENDED`, `PENDING`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 2. `customers`
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key ➔ `profiles.id`, UNIQUE)
- `default_address_id` (UUID)

### 3. `farmers`
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key ➔ `profiles.id`, UNIQUE)
- `verification_status` (ENUM: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`)
- `farm_name` (VARCHAR 255)
- `farm_size` (NUMERIC)
- `farm_size_unit` (VARCHAR 20)
- `farming_type` (VARCHAR 100)
- `village`, `taluka`, `district`, `state`, `pincode` (VARCHAR)
- `rating` (NUMERIC, Default 5.0)

### 4. `farmer_documents`
- `id` (UUID, Primary Key)
- `farmer_id` (UUID, Foreign Key ➔ `farmers.id`)
- `document_type` (ENUM: `IDENTITY`, `FARM_PROOF`, `BANK_PROOF`, `OTHER`)
- `document_url` (TEXT)
- `verification_status` (ENUM: `PENDING`, `APPROVED`, `REJECTED`)

### 5. `categories`
- `id` (UUID, Primary Key)
- `name` (VARCHAR 100, UNIQUE)
- `slug` (VARCHAR 100, UNIQUE)
- `image_url` (TEXT)
- `is_active` (BOOLEAN, Default true)

### 6. `products`
- `id` (UUID, Primary Key)
- `farmer_id` (UUID, Foreign Key ➔ `farmers.id`)
- `category_id` (UUID, Foreign Key ➔ `categories.id`)
- `name` (VARCHAR 255, NOT NULL)
- `variety` (VARCHAR 100)
- `price` (NUMERIC, NOT NULL)
- `unit` (VARCHAR 20, NOT NULL)
- `minimum_order_quantity` (NUMERIC, Default 1)
- `harvest_date` (DATE)
- `farming_method` (VARCHAR 50)
- `status` (ENUM: `DRAFT`, `PENDING_APPROVAL`, `ACTIVE`, `INACTIVE`, `REJECTED`)

### 7. `inventory`
- `id` (UUID, Primary Key)
- `product_id` (UUID, Foreign Key ➔ `products.id`, UNIQUE)
- `available_quantity` (NUMERIC, NOT NULL)
- `reserved_quantity` (NUMERIC, Default 0)
- `unit` (VARCHAR 20)
- `low_stock_threshold` (NUMERIC, Default 50)

### 8. `orders`
- `id` (UUID, Primary Key)
- `order_number` (VARCHAR 50, UNIQUE, e.g. `AGX-20260821-000001`)
- `customer_id` (UUID, Foreign Key ➔ `customers.id`)
- `subtotal`, `delivery_charge`, `discount`, `total_amount` (NUMERIC)
- `payment_status` (ENUM: `PENDING`, `PAID`, `FAILED`, `REFUNDED`)
- `order_status` (ENUM: `PENDING_PAYMENT`, `PAYMENT_CONFIRMED`, `FARMER_PENDING`, `FARMER_ACCEPTED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED`)
- `delivery_address` (JSONB)

### 9. `order_items`
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key ➔ `orders.id`)
- `product_id` (UUID, Foreign Key ➔ `products.id`)
- `farmer_id` (UUID, Foreign Key ➔ `farmers.id`)
- `product_name` (VARCHAR 255)
- `unit_price`, `quantity`, `subtotal` (NUMERIC)

### 10. `farmer_earnings`
- `id` (UUID, Primary Key)
- `farmer_id` (UUID, Foreign Key ➔ `farmers.id`)
- `order_id` (UUID, Foreign Key ➔ `orders.id`)
- `gross_amount`, `platform_charge`, `net_amount` (NUMERIC)

### 11. `settlements`
- `id` (UUID, Primary Key)
- `farmer_id` (UUID, Foreign Key ➔ `farmers.id`)
- `amount` (NUMERIC)
- `status` (ENUM: `PENDING`, `PROCESSING`, `PAID`, `FAILED`)
- `reference_id` (VARCHAR 100)
