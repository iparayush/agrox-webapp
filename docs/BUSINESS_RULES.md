# BUSINESS_RULES.md — AGROX Business Rules

- **BR-001**: Only farmers with `verification_status = 'APPROVED'` can publish products with `status = 'ACTIVE'` to the public marketplace.
- **BR-002**: Product `price` must be strictly greater than 0, and `available_quantity` must never be negative.
- **BR-003**: Placing an order atomically reserves `available_quantity` in `inventory`. If stock is insufficient, order creation fails.
- **BR-004**: Order number format must strictly follow `AGX-YYYYMMDD-XXXXXX` where `XXXXXX` is a sequential zero-padded integer per day.
- **BR-005**: Farmer earnings calculation rule:
  - `gross_amount` = Total product items subtotal
  - `platform_charge` = 5% of `gross_amount`
  - `net_amount` = `gross_amount` - `platform_charge`
- **BR-006**: Product reviews can only be submitted by customers who have a confirmed `DELIVERED` order containing the specific product.
- **BR-007**: Farmers cannot modify another farmer's products, inventory, or settlement details.
- **BR-008**: Administrators cannot approve their own farmer account.
