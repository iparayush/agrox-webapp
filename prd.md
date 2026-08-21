# AGROX — DATA PRODUCT REQUIREMENTS DOCUMENT

**File:** `PRD.md`
**Version:** 1.0
**Project:** AGROX
**Backend:** Supabase
**Database:** PostgreSQL
**Frontend:** React + TypeScript

---
    
# 1. Purpose

This document defines the complete data requirements for the AGROX marketplace.

AGROX connects:

```text
FARMERS
   ↓
AGROX MARKETPLACE
   ↓
CUSTOMERS
```

The database must support:

* Customer accounts
* Farmer accounts
* Farmer verification
* Farms
* Products
* Categories
* Inventory
* Cart
* Orders
* Payments
* Farmer earnings
* Reviews
* Notifications
* Admin management
* Audit logs

---

# 2. Database Requirements

Use:

**Supabase PostgreSQL**

Requirements:

* UUID primary keys
* Foreign keys
* Indexes
* Constraints
* Timestamps
* Row Level Security
* Database functions where required
* Transactions for critical operations

All production data must be stored in Supabase.

---

# 3. USER DATA

## `profiles`

Stores common user information.

Fields:

```text
id
full_name
email
phone
avatar_url
role
status
created_at
updated_at
```

### Role

```text
CUSTOMER
FARMER
ADMIN
SUPER_ADMIN
```

### Status

```text
ACTIVE
BLOCKED
SUSPENDED
PENDING
```

---

# 4. CUSTOMER DATA

## `customers`

Fields:

```text
id
profile_id
default_address_id
created_at
updated_at
```

Relationship:

```text
profiles
   ↓
customers
```

A customer must only be able to access their own customer record.

---

# 5. FARMER DATA

## `farmers`

Fields:

```text
id
profile_id
verification_status
farm_name
farm_size
farm_size_unit
farming_type
village
taluka
district
state
pincode
latitude
longitude
description
rating
total_orders
created_at
updated_at
```

Verification status:

```text
PENDING
APPROVED
REJECTED
SUSPENDED
```

Only approved farmers can publish products publicly.

---

# 6. FARM DATA

## `farms`

Fields:

```text
id
farmer_id
farm_name
address
village
taluka
district
state
pincode
latitude
longitude
farm_size
farm_size_unit
farming_type
description
created_at
updated_at
```

A farmer can have one or more farms if required by the business model.

Relationship:

```text
farmer
   ↓
farms
```

---

# 7. FARMER DOCUMENTS

## `farmer_documents`

Fields:

```text
id
farmer_id
document_type
document_url
verification_status
rejection_reason
verified_by
verified_at
created_at
```

Document types:

```text
IDENTITY
FARM_PROOF
BANK_PROOF
OTHER
```

Documents must be private.

Only:

* Farmer owner
* Authorized admin

can access them.

---

# 8. CATEGORY DATA

## `categories`

Fields:

```text
id
name
slug
description
image_url
is_active
sort_order
created_at
updated_at
```

Initial categories:

```text
Vegetables
Fruits
Grains
Pulses
Spices
Organic
Seeds
Other
```

---

# 9. PRODUCT DATA

## `products`

Fields:

```text
id
farmer_id
category_id
name
slug
description
variety
price
unit
minimum_order_quantity
harvest_date
farming_method
status
created_at
updated_at
```

Status:

```text
DRAFT
PENDING_APPROVAL
ACTIVE
INACTIVE
REJECTED
```

Only `ACTIVE` products appear in the customer marketplace.

---

# 10. PRODUCT IMAGES

## `product_images`

Fields:

```text
id
product_id
image_url
sort_order
is_primary
created_at
```

Images are stored using:

**Supabase Storage**

Bucket:

```text
product-images
```

---

# 11. INVENTORY DATA

## `inventory`

Fields:

```text
id
product_id
available_quantity
reserved_quantity
unit
low_stock_threshold
updated_at
```

Example:

```text
Onion

Available:
100 kg

Reserved:
5 kg
```

Available stock should never become negative.

---

# 12. ADDRESS DATA

## `addresses`

Fields:

```text
id
user_id
label
full_name
phone
address_line_1
address_line_2
city
district
state
pincode
latitude
longitude
is_default
created_at
updated_at
```

Labels:

```text
HOME
WORK
OTHER
```

Users can manage their own addresses.

---

# 13. CART DATA

## `carts`

Fields:

```text
id
customer_id
created_at
updated_at
```

One active cart per customer.

---

## `cart_items`

Fields:

```text
id
cart_id
product_id
quantity
created_at
updated_at
```

The server must validate:

* Product exists
* Product is active
* Farmer is approved
* Stock is available
* Quantity is valid

---

# 14. ORDER DATA

## `orders`

Fields:

```text
id
order_number
customer_id
subtotal
delivery_charge
discount
total_amount
currency
payment_status
order_status
delivery_address
created_at
updated_at
```

Example order number:

```text
AGX-20260821-000001
```

The UUID remains the internal primary key.

---

# 15. ORDER ITEMS

## `order_items`

Fields:

```text
id
order_id
product_id
farmer_id
product_name
unit_price
unit
quantity
subtotal
created_at
```

Important:

Store a snapshot of:

* Product name
* Price
* Unit

This ensures historical orders remain correct even if the product later changes.

---

# 16. ORDER STATUS HISTORY

## `order_status_history`

Fields:

```text
id
order_id
old_status
new_status
changed_by
reason
created_at
```

Example:

```text
PENDING
↓
FARMER_ACCEPTED
↓
PREPARING
↓
READY
↓
DELIVERED
```

This creates a complete order audit trail.

---

# 17. ORDER STATUS

Allowed statuses:

```text
PENDING_PAYMENT
PAYMENT_CONFIRMED
FARMER_PENDING
FARMER_ACCEPTED
PREPARING
READY
DELIVERED
CANCELLED
REJECTED
REFUND_PENDING
REFUNDED
```

Status transitions must be validated.

---

# 18. PAYMENT DATA

## `payments`

Fields:

```text
id
order_id
customer_id
gateway
gateway_transaction_id
amount
currency
payment_method
status
gateway_response
paid_at
created_at
updated_at
```

Status:

```text
PENDING
SUCCESS
FAILED
REFUNDED
```

Never hardcode payment IDs.

Never trust payment success from the frontend.

---

# 19. REFUND DATA

## `refunds`

Fields:

```text
id
payment_id
order_id
amount
reason
status
gateway_refund_id
created_at
updated_at
```

Status:

```text
PENDING
PROCESSING
SUCCESS
FAILED
```

---

# 20. FARMER EARNINGS

## `farmer_earnings`

Fields:

```text
id
farmer_id
order_id
gross_amount
platform_charge
other_charges
net_amount
status
created_at
```

Example:

```text
Order:
₹1,000

Applicable charges:
₹50

Farmer earning:
₹950
```

All calculations must be server-side.

---

# 21. SETTLEMENT DATA

## `settlements`

Fields:

```text
id
farmer_id
amount
period_start
period_end
status
reference_id
paid_at
created_at
```

Status:

```text
PENDING
PROCESSING
PAID
FAILED
```

---

# 22. REVIEWS

## `reviews`

Fields:

```text
id
customer_id
product_id
farmer_id
order_id
rating
comment
status
created_at
updated_at
```

Rating:

```text
1–5
```

Only customers with valid completed purchases should be allowed to review the relevant product.

---

# 23. NOTIFICATIONS

## `notifications`

Fields:

```text
id
user_id
title
message
type
reference_id
is_read
created_at
```

Types:

```text
ORDER
PAYMENT
PRODUCT
FARMER
SYSTEM
PROMOTION
```

---

# 24. ADMIN DATA

## `admin_users`

Fields:

```text
id
profile_id
role
permissions
is_active
created_at
updated_at
```

Admin roles:

```text
ADMIN
SUPER_ADMIN
```

---

# 25. AUDIT LOGS

## `audit_logs`

Fields:

```text
id
actor_id
action
entity_type
entity_id
old_data
new_data
ip_address
created_at
```

Track important actions:

* Farmer approval
* Farmer rejection
* Product approval
* Product deletion
* Order modification
* Refund
* Admin changes
* User blocking

---

# 26. DATABASE RELATIONSHIPS

Main relationship:

```text
profiles
 ├── customers
 ├── farmers
 └── admin_users

farmers
 ├── farms
 ├── farmer_documents
 ├── products
 └── farmer_earnings

categories
 └── products

products
 ├── product_images
 ├── inventory
 └── order_items

customers
 ├── addresses
 ├── carts
 ├── orders
 ├── payments
 └── reviews

orders
 ├── order_items
 ├── payments
 ├── refunds
 ├── reviews
 ├── farmer_earnings
 └── order_status_history
```

---

# 27. DATA FLOW

## Customer

```text
Customer
 ↓
Browse Products
 ↓
Product
 ↓
Cart
 ↓
Checkout
 ↓
Order
 ↓
Payment
 ↓
Order Status
 ↓
Review
```

## Farmer

```text
Farmer
 ↓
Verification
 ↓
Product
 ↓
Inventory
 ↓
Order
 ↓
Fulfillment
 ↓
Earnings
 ↓
Settlement
```

## Admin

```text
Admin
 ↓
Users
 ↓
Farmers
 ↓
Products
 ↓
Orders
 ↓
Payments
 ↓
Reports
```

---

# 28. SECURITY REQUIREMENTS

Enable Row Level Security on all sensitive tables.

### Customer

Cannot:

* View another customer's orders
* Change another user's profile
* Change product prices
* Change payment status
* Change farmer earnings

### Farmer

Cannot:

* Modify another farmer's products
* Modify another farmer's inventory
* View private farmer documents
* Change payment status
* Change their own settlement status

### Admin

Access must depend on admin role and permissions.

---

# 29. DATA VALIDATION

Validate on both frontend and backend.

Examples:

### Price

Must be:

```text
> 0
```

### Quantity

Must be:

```text
> 0
```

### Rating

Must be:

```text
1–5
```

### Product

Must have:

* Name
* Category
* Price
* Unit
* Farmer
* Inventory

before activation.

---

# 30. DATABASE INDEXES

Create indexes for frequently searched fields.

Recommended:

```text
profiles.role
profiles.status

farmers.verification_status
farmers.district

products.category_id
products.farmer_id
products.status
products.name

inventory.product_id

orders.customer_id
orders.order_status
orders.payment_status
orders.created_at

order_items.order_id
order_items.farmer_id

payments.order_id
payments.status

notifications.user_id
notifications.is_read
```

---

# 31. REALTIME DATA

Enable Supabase Realtime for:

```text
orders
order_status_history
inventory
notifications
```

Example:

```text
Customer creates order
       ↓
Supabase Realtime
       ↓
Farmer receives order
       ↓
Farmer accepts
       ↓
Customer sees update
```

---

# 32. STORAGE DATA

Supabase Storage:

```text
product-images/
profile-images/
farm-images/
farmer-documents/
```

### Public

Product images can be public where appropriate.

### Private

Farmer documents must be private.

---

# 33. DATA RETENTION

Do not permanently delete important transaction records.

For orders and payments:

Use status/soft deletion where appropriate.

Example:

```text
is_deleted
deleted_at
```

Financial and audit records should remain available according to the applicable retention policy.

---

# 34. BACKUP

Production database should have:

* Automated backups
* Migration history
* Recovery strategy
* Storage backup strategy

Never treat frontend data as the source of truth.

---

# 35. SEED DATA

Development seed data may be created for testing.

Example:

```text
Demo Farmer
Demo Customer
Demo Products
Demo Categories
```

But seed/demo data must never be required for the production application to function.

---

# 36. SOURCE OF TRUTH

The production source of truth is:

**Supabase PostgreSQL**

Architecture:

```text
React
 ↓
Services / Repositories
 ↓
Supabase
 ↓
PostgreSQL
```

Not:

```text
React
 ↓
Hardcoded JSON
```

---

# 37. DATA REQUIREMENT

Every important screen must be backed by real data.

### Customer

```text
Home → Products
Search → Products
Product → Product
Farmer → Farmer
Cart → Cart
Orders → Orders
Profile → Profile
```

### Farmer

```text
Dashboard → Aggregated Database Data
Products → Products
Inventory → Inventory
Orders → Orders
Earnings → Earnings
Profile → Farmer
```

### Admin

```text
Dashboard → Aggregated Database Data
Users → Profiles
Farmers → Farmers
Products → Products
Orders → Orders
Payments → Payments
Reports → Database Queries
```

---

# 38. SUCCESS CRITERIA

The AGROX database system is complete when:

* Users can register.
* Roles are assigned securely.
* Farmers can submit verification.
* Admin can approve farmers.
* Farmers can add products.
* Admin can approve products.
* Customers can view approved products.
* Customers can add products to cart.
* Customers can create orders.
* Inventory updates correctly.
* Payments are recorded.
* Farmers receive orders.
* Farmers can update order status.
* Customer sees status updates.
* Farmer earnings are calculated.
* Settlements are recorded.
* Reviews can be submitted.
* Notifications are generated.
* RLS prevents unauthorized access.
* All critical operations are logged.
* No production feature depends on hardcoded data.

---

# 39. FINAL DATA ARCHITECTURE

```text
                    AGROX
                      │
          ┌───────────┼───────────┐
          │           │           │
      Customer      Farmer      Admin
          │           │           │
          └───────────┼───────────┘
                      │
                   Supabase
                      │
              ┌───────┼────────┐
              │       │        │
         PostgreSQL   Auth   Storage
              │
           Realtime
              │
        Edge Functions
              │
       Payments / Events
```

## Final Principle

**AGROX must be database-driven, secure, dynamic and scalable.**

The frontend displays data.

Supabase manages data.

PostgreSQL stores data.

RLS protects data.

Edge Functions handle sensitive business logic.

Realtime keeps applications synchronized.

The database is the **single source of truth** for the AGROX marketplace.
