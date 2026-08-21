# TESTING.md — Testing Strategy

- **Unit Tests**: Test core business functions (`EarningsCalculator`, `OrderNumberGenerator`, `StockValidator`) using Vitest / Jest.
- **Integration Tests**: Supertest suite for API endpoints (`/api/v1/auth`, `/api/v1/products`, `/api/v1/orders`).
- **Database Tests**: Test Supabase RLS policies and SQL functions.
