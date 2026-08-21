# DEPLOYMENT.md — Deployment & Infrastructure Guide

- **Environment File**: `.env.example` contains variable keys (`PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `NODE_ENV`).
- **Production Server**: Node.js 20+ / Express with TypeScript compiled build (`dist/server.js`).
- **Database**: Supabase PostgreSQL cloud instance with applied SQL DDL migrations (`backend/db/schema.sql`).
- **Health Check**: `GET /api/v1/health` returns status `{ "status": "ok", "uptime": 124, "database": "connected" }`.
