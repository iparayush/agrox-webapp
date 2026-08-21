# ARCHITECTURE.md — AGROX Technical Architecture

## System Overview

```text
                                ┌──────────────────────────────────────────────┐
                                │             AGROX React Frontend             │
                                │  (Customer App | Farmer App | Admin Panel)  │
                                └──────────────────────┬───────────────────────┘
                                                       │ REST / JSON (JWT / Supabase)
                                                       ▼
                                ┌──────────────────────────────────────────────┐
                                │          AGROX Node.js / Express API         │
                                │           (Typescript Backend Server)        │
                                └──────────────────────┬───────────────────────┘
                                                       │
         ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
         ▼                                             ▼                                             ▼
┌──────────────────┐                         ┌──────────────────┐                         ┌──────────────────┐
│  Supabase Auth   │                         │  PostgreSQL DB   │                         │ Supabase Storage │
│ (JWT & Identity) │                         │ (RLS & Realtime) │                         │  (Media & Docs)  │
└──────────────────┘                         └──────────────────┘                         └──────────────────┘
```

## Layer Architecture Breakdown

```text
HTTP Request
    ↓
Route Layer (backend/src/routes/)
    ↓
Middleware Layer (authMiddleware, rlsGuard, inputValidator, errorHandler)
    ↓
Controller Layer (backend/src/controllers/)
    ↓
Service Layer (backend/src/services/ - Business Logic & Transactions)
    ↓
Repository Layer (backend/src/repositories/ - Database Access Layer)
    ↓
Database (Supabase PostgreSQL / Client)
```

## Data Flow Pipeline

1. **Authentication & Authorization**: Requests present bearer JWT tokens decoded by `authMiddleware` to populate `req.user` with `id` and `role` (`CUSTOMER`, `FARMER`, `ADMIN`).
2. **Order Placement Workflow**:
   - Customer submits cart checkout.
   - `OrderService` starts a DB transaction.
   - Validates live stock availability in `inventory`.
   - Generates unique order number `AGX-YYYYMMDD-XXXXXX`.
   - Creates snapshot in `order_items`.
   - Reserves stock in `inventory`.
   - Creates record in `order_status_history`.
   - Triggers `NotificationService` for Realtime farmer alert.
3. **Payment Verification**: Server verifies webhook signature or gateway callback, updates `payments` status, and auto-calculates farmer earnings in `farmer_earnings`.
