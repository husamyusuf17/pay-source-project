# 2. Architecture

## Full request path

Example: requester submits a Purchase Request.

```text
1. Angular form
2. Angular component reads form data
3. ProcurementApiService sends POST /api/purchase-requests
4. Auth interceptor adds Authorization: Bearer <JWT>
5. Express route matches POST /
6. authenticate middleware verifies JWT
7. authorize middleware verifies REQUESTER or ADMIN role
8. controller receives req/res
9. service calculates amount and approval rules
10. Mongoose model validates document shape
11. MongoDB persists document
12. service returns document
13. controller sends 201 JSON
14. Angular receives response
15. UI reloads request list
```

## Backend folders

```text
backend/
  config/       database connection
  controllers/  HTTP request/response coordination
  middleware/   authentication, authorization, error handling
  models/       Mongoose schemas/models
  routes/       URL + HTTP method -> controller mapping
  services/     business logic
  utils/        shared helpers such as AppError and audit logging
  scripts/      database seed
  server.js     application composition / entry point
```

### Route
A route answers: **which code handles this HTTP method + path?**

Example:

```js
router.patch('/:id/approve', authorize('MANAGER', 'FINANCE', 'ADMIN'), approve);
```

### Middleware
Middleware runs during the request/response cycle before the final controller. It is used for cross-cutting concerns:
- parse JSON
- authenticate JWT
- authorize roles
- error handling

### Controller
The controller translates HTTP into application calls:
- reads `req.body`, `req.params`, `req.user`
- calls service
- chooses HTTP response/status

It should not contain large business rules.

### Service
The service is where business policy lives:
- request must be approved before RFQ
- requester cannot approve own request
- offer must belong to RFQ
- PO requires awarded offer
- invoice must match before payment

### Model
The Mongoose model defines persistence structure and data-level validation.

### MongoDB
MongoDB stores the persistent documents.

## Angular folders

```text
frontend/src/app/
  core/
    guards/         route protection
    interceptors/   automatically attach JWT
    models/         TypeScript interfaces/types
    services/       API/BFF communication and auth state
  pages/            business screens
  app.routes.ts     frontend URL routing
  app.config.ts     dependency providers
  app.component.ts  application shell/navigation
```

## Component vs Angular Service

**Component**: screen/UI state and user interactions.

**Angular service**: reusable logic and HTTP communication.

The component should not manually construct authentication headers on every call. The interceptor does that once for the entire application.

## Authentication vs Authorization

Authentication = **Who are you?**
- email/password -> JWT
- JWT -> user identity

Authorization = **What are you allowed to do?**
- REQUESTER can create requests
- MANAGER can approve assigned requests
- PROCUREMENT can create RFQs/POs/GRNs
- FINANCE can create/match invoices and pay

## BFF

BFF means Backend for Frontend.

Normal domain endpoints expose individual resources:

```text
/api/purchase-requests
/api/suppliers
/api/sourcing/rfqs
/api/purchase-orders
/api/invoices
```

The dashboard would otherwise need many requests. The BFF exposes:

```text
GET /api/bff/dashboard
```

and aggregates domain information into one response shaped specifically for the Angular dashboard.

The detailed BFF endpoint:

```text
GET /api/bff/purchase-requests/:id/details
```

aggregates the complete lifecycle:
- purchase request
- RFQ
- offers
- purchase order
- GRNs
- invoice
- payment

In a larger architecture, these domains might be separate services. For training, they share one Express process but the BFF responsibility is still visible.
