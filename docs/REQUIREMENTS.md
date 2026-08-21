# REQUIREMENTS.md — AGROX Backend Requirements Log

| Requirement ID | Description | Source | Priority | Backend Impact | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-001** | User authentication (Register, Login, JWT tokens, Supabase Auth integration) | PRD Sec 3 | High | Auth Controller, JWT Middleware, Profile Model | Completed |
| **REQ-002** | Customer profile & saved delivery addresses management | PRD Sec 4 & 12 | High | Customer Repository & Address API | Completed |
| **REQ-003** | Farmer registration, farm details & 7/12 land document submission | PRD Sec 5, 6, 7 | High | Farmer Model, Document Uploads Service | Completed |
| **REQ-004** | Admin moderation of farmer land documents & verification status | PRD Sec 7 & 24 | High | Admin Farmer Service, Verification Audit Logs | Completed |
| **REQ-005** | Category management & initial seed categories (Vegetables, Fruits, Grains, etc.) | PRD Sec 8 | Medium | Category Controller & Repository | Completed |
| **REQ-006** | Farmer product creation, variety, unit price, harvest date & status workflow | PRD Sec 9 & 10 | High | Product Service, Image Upload, Inventory creation | Completed |
| **REQ-007** | Live inventory management (Available stock, reserved stock, low-stock threshold) | PRD Sec 11 | High | Inventory Repository, Atomic stock reservation | Completed |
| **REQ-008** | Customer cart operations (Add item, update quantity, validation against live stock) | PRD Sec 13 | High | Cart Service, Stock availability validator | Completed |
| **REQ-009** | Order placement, unique order number generation (AGX-YYYYMMDD-XXXXXX), line item snapshotting | PRD Sec 14 & 15 | Critical | Order Service, DB Transaction, Realtime notification trigger | Completed |
| **REQ-010** | Order status lifecycle state machine (`Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Ready` ➔ `Delivered`) | PRD Sec 16 & 17 | Critical | Order History Audit, Status Transition Validator | Completed |
| **REQ-011** | Payment processing (UPI/Card/NetBanking gateway recording, transaction verification) | PRD Sec 18 | Critical | Payment Service, Gateway Callback Validator | Completed |
| **REQ-012** | Automatic farmer earnings calculation (Gross amount minus platform charge) | PRD Sec 20 | High | Earnings Calculator Service, Settlement Ledger | Completed |
| **REQ-013** | Customer product reviews (restricted to verified buyers with completed orders) | PRD Sec 22 | Medium | Review Controller, Purchase verification check | Completed |
| **REQ-014** | Multi-channel user notifications (Order updates, payment confirmations, harvest alerts) | PRD Sec 23 | Medium | Notification Service, Realtime Push Handler | Completed |
| **REQ-015** | Admin executive dashboard KPIs, GMV analytics, user directory & report CSV export | PRD Sec 24, 25, 27 | High | Admin Aggregation Service, Report Generator | Completed |
