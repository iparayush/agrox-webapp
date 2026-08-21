# VALIDATION.md — Input Validation Protocols

All incoming API request parameters, query strings, and request bodies are strictly validated using **Zod** middleware schemas.

## Sample Validation Schemas
- `RegisterSchema`: Requires valid email/phone format, full name (min 2 chars), password (min 8 chars with digit & symbol).
- `CreateProductSchema`: Requires `name`, `category_id`, `price` (> 0), `unit`, `available_quantity` (>= 0), `harvest_date` (ISO Date).
- `CheckoutOrderSchema`: Requires `address_id`, `delivery_type` (`Standard` | `Express` | `Scheduled`), `payment_method` (`UPI` | `Card` | `Net Banking`).
