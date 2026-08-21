# DECISIONS.md — Architecture Decision Log

## DEC-001: Hybrid Supabase + Node.js/Express API Architecture
- **Decision**: Use Supabase PostgreSQL as the primary database while exposing a Node.js/Express TypeScript backend server API for business logic execution, atomic transactions, and custom validation.
- **Why**: PRD specifies Supabase PostgreSQL and Row Level Security while explicit API contracts and complex transactional logic (stock reservation, order number generation, farmer earnings calculations) are cleanest in a modular Express service layer.
- **Alternatives Considered**: Direct client-only Supabase queries vs Dedicated Express backend.
- **Impact**: Clean separation of concerns, high maintainability, API-first capability.
- **Date**: 2026-08-21

## DEC-002: Order Snapshotting in `order_items`
- **Decision**: Store snapshot of `product_name`, `unit_price`, and `unit` directly inside `order_items`.
- **Why**: Prevents historical orders from corrupting when a farmer updates product price or name later.
- **Impact**: Immutable historical financial accuracy.
- **Date**: 2026-08-21

## DEC-003: Row Level Security (RLS) & Role-Based Access Control
- **Decision**: Enforce RLS policies directly at the PostgreSQL layer and check JWT roles (`CUSTOMER`, `FARMER`, `ADMIN`) in Express middleware.
- **Why**: Dual protection ensures security even if an API endpoint is misconfigured.
- **Date**: 2026-08-21
