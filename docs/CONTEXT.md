# CONTEXT.md — AGROX AI Memory Context

## Project Name
**AGROX** — Real Farmer-to-City Direct Marketplace

## Purpose
AGROX connects local agricultural producers directly with urban consumers (**Farmers sell → AGROX marketplace → Customers buy**), eliminating middleman exploitation, ensuring fair farm-gate prices, and delivering fresh harvest to city households with cold-chain logistics.

## Target Users
1. **Customers (Urban Consumers)**: Browse produce, order fresh harvest, track live delivery, review farmers.
2. **Farmers (Local Producers)**: Register farms, verify 7/12 land documents, list produce, manage live stock, accept orders, track earnings & bank settlements.
3. **Administrators (Marketplace Ops)**: Moderate products, verify farmer land records, manage users, audit payments, inspect logistics reports, configure platform settings.

## Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router.
- **Backend API**: Node.js, Express, TypeScript (ES2023), Zod validation, JWT & Supabase Auth.
- **Database & Storage**: Supabase PostgreSQL (Row Level Security, Realtime, Triggers, Indexes), Supabase Storage buckets.
- **Integrations**: Payment Gateways (Razorpay/UPI), SMS/Push Notifications.

## Backend Architecture
Standard modular RESTful API architecture with strict layer separation:
`Route` ➔ `Middleware` ➔ `Controller` ➔ `Service` ➔ `Repository` ➔ `Database (Supabase PostgreSQL)`.

## Current Implementation Status
- **Phase 1**: Frontend UI/UX Suite (Customer 16 screens, Farmer 12 screens, Admin 9 screens) completed and verified.
- **Phase 2**: AI Backend Architecture, Data Schema, Documentation, Node.js/Express API server & Supabase PostgreSQL DDL migrations.
