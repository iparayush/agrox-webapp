# API_CONTRACT.md — AGROX API Specifications

All API endpoints reside under `/api/v1/`.

## 1. Authentication (`/api/v1/auth`)

### POST `/api/v1/auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "full_name": "Ayushi Par",
    "email": "ayushi@example.com",
    "phone": "+91 98234 56789",
    "password": "Password123!",
    "role": "CUSTOMER"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGci...",
      "user": { "id": "uuid", "email": "...", "role": "CUSTOMER" }
    }
  }
  ```

### POST `/api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "emailOrPhone": "ayushi@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**: Token & user object.

---

## 2. Products (`/api/v1/products`)

### GET `/api/v1/products`
- **Auth**: Public
- **Query Params**: `category`, `search`, `minPrice`, `maxPrice`, `organicOnly`, `page`, `limit`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "Fresh Red Onion",
        "category": "Vegetables",
        "price": 28,
        "unit": "kg",
        "available_quantity": 250,
        "farmer_name": "Ramesh Patil",
        "image_url": "https://..."
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1 }
  }
  ```

### POST `/api/v1/products`
- **Auth**: Required (`FARMER`)
- **Request Body**: Name, Category ID, Price, Unit, Stock, Harvest Date, Farming Method.

---

## 3. Cart (`/api/v1/cart`)

### GET `/api/v1/cart`
- **Auth**: Required (`CUSTOMER`)
- **Response (200 OK)**: Customer active cart grouped by farmer.

### POST `/api/v1/cart/items`
- **Auth**: Required (`CUSTOMER`)
- **Request Body**: `{ "product_id": "uuid", "quantity": 2 }`

---

## 4. Orders (`/api/v1/orders`)

### POST `/api/v1/orders`
- **Auth**: Required (`CUSTOMER`)
- **Request Body**:
  ```json
  {
    "address_id": "uuid",
    "delivery_type": "Standard",
    "payment_method": "UPI"
  }
  ```
- **Response (201 Created)**: Created order details with `order_number` (`AGX-20260821-000001`).

### PATCH `/api/v1/orders/:id/status`
- **Auth**: Required (`FARMER` | `ADMIN`)
- **Request Body**: `{ "status": "FARMER_ACCEPTED" }`

---

## 5. Farmer Management & Earnings (`/api/v1/farmer`)

### GET `/api/v1/farmer/dashboard`
- **Auth**: Required (`FARMER`)
- **Response**: Aggregated sales, total orders, pending orders count, live stock.

### GET `/api/v1/farmer/earnings`
- **Auth**: Required (`FARMER`)
- **Response**: Total earnings, period breakdown, settlements list.

---

## 6. Admin Panel (`/api/v1/admin`)

### GET `/api/v1/admin/dashboard`
- **Auth**: Required (`ADMIN`)
- **Response**: Platform KPIs, GMV trends, user counts, recent order stream.

### PATCH `/api/v1/admin/farmers/:id/verify`
- **Auth**: Required (`ADMIN`)
- **Request Body**: `{ "status": "APPROVED" }`
