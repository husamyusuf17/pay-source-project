# 9. File Map — What Every Important File Is For

## Backend entry and infrastructure

- `backend/server.js` — starts Express, mounts routes, connects middleware and MongoDB.
- `backend/config/db.js` — Mongoose/MongoDB connection.
- `backend/.env.example` — environment configuration template.
- `backend/middleware/auth.js` — JWT authentication + role authorization.
- `backend/middleware/errorHandler.js` — centralized errors and 404s.
- `backend/utils/AppError.js` — application error with HTTP status.
- `backend/utils/audit.js` — records audit events.

## Backend business domains

### Users/auth
- `models/User.js`
- `services/authService.js`
- `controllers/authController.js`
- `routes/authRoutes.js`

### Purchase Requests / approvals
- `models/PurchaseRequest.js`
- `services/purchaseRequestService.js`
- `controllers/purchaseRequestController.js`
- `routes/purchaseRequestRoutes.js`

### Suppliers
- `models/Supplier.js`
- `services/supplierService.js`
- `controllers/supplierController.js`
- `routes/supplierRoutes.js`

### Sourcing
- `models/RFQ.js`
- `models/Offer.js`
- `services/sourcingService.js`
- `controllers/sourcingController.js`
- `routes/sourcingRoutes.js`

### Purchasing
- `models/PurchaseOrder.js`
- `services/purchaseOrderService.js`
- `controllers/purchaseOrderController.js`
- `routes/purchaseOrderRoutes.js`

### Receiving
- `models/GoodsReceipt.js`
- `services/receivingService.js`
- `controllers/receivingController.js`
- `routes/receivingRoutes.js`

### Finance
- `models/Invoice.js`
- `models/Payment.js`
- `services/invoiceService.js`
- `services/paymentService.js`
- controllers/routes with matching names.

### BFF
- `services/bffService.js` — aggregates domain data into frontend-specific responses.
- `controllers/bffController.js`
- `routes/bffRoutes.js`

### Audit
- `models/AuditLog.js`

## Frontend

- `src/main.ts` — bootstraps Angular.
- `app.config.ts` — router + HttpClient/interceptor providers.
- `app.routes.ts` — frontend routes.
- `app.component.ts` — shell and navigation.
- `core/services/auth.service.ts` — login/token/current-user state.
- `core/services/procurement-api.service.ts` — business API calls.
- `core/services/bff.service.ts` — BFF calls.
- `core/interceptors/auth.interceptor.ts` — adds Bearer token.
- `core/guards/auth.guard.ts` — redirects unauthenticated navigation.
- `pages/*` — user-facing procurement screens.
