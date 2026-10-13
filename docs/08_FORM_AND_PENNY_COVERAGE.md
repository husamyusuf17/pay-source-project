# 8. Coverage of Your Penny Application Form

This project is deliberately mapped to the six technical areas Penny asked you to describe.

| Penny question | Where you practice it |
|---|---|
| MEAN Stack Experience | MongoDB models + Express API + Angular frontend + Node runtime |
| Frontend Tech Proficiency | Angular standalone components, reactive forms, router, services, interceptor, guard, TypeScript |
| BFF Environment Experience | `/api/bff/dashboard`, `/api/bff/purchase-requests/:id/details`, `bffService.js`, Angular `BffService` |
| API Development Experience | REST endpoints, HTTP methods/status, request body/params, controllers, validation, centralized errors |
| NoSQL Database Experience | MongoDB documents, ObjectId references, Mongoose schemas/models, queries, populate, indexes |
| NodeJS Framework Knowledge | Express 5 routing, middleware, controllers, JWT, role authorization, service architecture |

## Penny product/business coverage

The project models the business concepts you should understand in the interview:

- Purchase Requests
- Multi-step approval workflows
- Role/privilege control
- Supplier management
- RFQs
- Supplier quotations/offers
- Supplier award
- Purchase Orders
- Goods Receipt Notes / partial receiving
- Invoices
- PO + GRN + Invoice 3-way matching
- Payment gating
- Spend/workflow dashboard concepts
- Audit trail

## What is intentionally not implemented

A real enterprise system is much larger. This training application intentionally does not attempt to reproduce proprietary or high-complexity features such as ERP connectors, production payment rails, OCR, AI vendor recommendations, AI negotiations, multi-tenant configuration, enterprise SSO, currency/tax engines, document storage, or full supplier portals.

In an interview, distinguish clearly between:

1. what you implemented in this training project;
2. what you understand conceptually from Penny's public product;
3. what you have used professionally or in prior personal projects.
