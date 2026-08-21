# SECURITY.md — Security & Authorization Architecture

- **Authentication**: JWT-based bearer tokens & Supabase Auth integration. Password hashing using `bcrypt` (12 salt rounds).
- **Authorization**: Middleware checks role (`CUSTOMER`, `FARMER`, `ADMIN`, `SUPER_ADMIN`) and verifies object-level tenancy (`req.user.id === resource.owner_id`).
- **Input Sanitization**: Untrusted client inputs parsed with Zod schemas to prevent SQL injection & XSS.
- **Headers & Protection**: Helmet.js for security headers, CORS origin restriction, rate limiting via Express rate-limit (100 requests / 15 mins per IP).
- **Secrets Management**: No hardcoded API keys or database credentials in code. Loaded via `dotenv` from `.env`.
