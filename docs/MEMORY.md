# PROJECT MEMORY — AGROX

## Current State
- **Phase**: Full-Stack Dynamic Integration Live
- **Directory Layout**: Clean separation into `frontend/` and `backend/`
- **Backend**: Node.js + Express + TypeScript in `backend/`, running on port 4000 ✅ (Connected to Supabase db `kservmpdmzcbgdrcyvhs`)
- **Frontend**: React + Vite in `frontend/`, running on port 3000 ✅ (Direct API client & Supabase integration active)

## Completed
- Updated `.gitignore` to safely protect all `.env`, `.env.*`, `backend/.env`, and `frontend/.env` credentials ✅
- Dynamic API Client layer (`frontend/src/lib/api.ts`) built with full token lifecycle and typed endpoints ✅
- Dynamic Login and Registration screens wired directly to backend authentication API (`/api/v1/auth/*`) ✅
- Dynamic product catalogue loading on mount via backend REST API & Supabase fallbacks ✅
- Dynamic order submission wired directly to database (`/api/v1/orders` & Supabase `orders` table) ✅
- Both Vite dev server (port 3000) and Express API server (port 4000) verified active and responding ✅
- Redesigned pure full-screen mobile UI for Customer App and Farmer App (completely removed all phone mockup borders, desktop switcher bars, and fake preview frames) ✅
- Separated applications with clean viewport routing (`/` Customer App, `/farmer` Farmer Hub, `/admin` Admin Console) ✅

## In Progress
- Implementing remaining modules: repositories layer, cart API, categories API, inventory API, notifications API, reviews API, full Supabase integration, rate limiting, logging, address API, search/filter/pagination, payment verification

## Important Decisions
- Hybrid: Express handles business logic, Supabase is DB. Services have mock fallback when SUPABASE_URL is mock.
- Order number: `AGX-YYYYMMDD-XXXXXX` (sequential per day via DB sequence/counter)
- Platform fee: 5% of gross order subtotal
- Earnings computed server-side on payment confirmation only
- JWT secret from env, never hardcoded in code commits
- `.env` in `.gitignore`; `.env.example` committed

## Important Constraints
- NEVER negative inventory (CHECK constraint in schema.sql)
- Reviews only for DELIVERED orders (checked in review service)
- Farmers can only modify own products/inventory
- Admin cannot approve own farmer account
- Stock reservation is atomic (must use DB transaction or row locking)
- Frontend on port 3000 must not be broken

## Known Issues
- Services currently return mock data when Supabase URL is "mock-agrox". Full DB integration wired but needs real SUPABASE_URL + SERVICE_ROLE_KEY.
- No repository layer yet — services call Supabase client directly.
- Cart, Categories, Inventory, Notifications, Reviews, Addresses APIs missing.
- No rate limiting yet on auth endpoints.
- No request logging (morgan) yet.

## Next Actions
1. Add `bcrypt` for password hashing in authService
2. Create `backend/src/utils/` — helpers (orderNumber, earnings, pagination, ApiResponse)  
3. Create `backend/src/repositories/` layer for each entity
4. Implement Cart API (GET cart, POST item, PATCH qty, DELETE item)
5. Implement Categories API (public read, admin write)
6. Implement Inventory API (farmer read/update own)
7. Implement Address API (customer CRUD)
8. Implement Notifications API (list, mark read)
9. Implement Reviews API (create, list — BR-006 enforced)
10. Implement Payment webhook handler
11. Add morgan request logger
12. Add express-rate-limit on /auth routes
13. Add `/api/v1/categories` route
14. Write integration smoke tests
15. Update all docs

## Important Files
- `backend/src/app.ts` — Express app entry
- `backend/src/server.ts` — HTTP server
- `backend/src/config/env.ts` — all env vars
- `backend/src/config/database.ts` — Supabase admin client
- `backend/src/middlewares/authMiddleware.ts` — `authenticateToken`, `requireRole`
- `backend/db/schema.sql` — full Postgres DDL to run in Supabase SQL editor
- `docs/DATABASE.md` — table definitions reference
- `docs/BUSINESS_RULES.md` — BR-001 through BR-008
- `docs/API_CONTRACT.md` — endpoint specs
