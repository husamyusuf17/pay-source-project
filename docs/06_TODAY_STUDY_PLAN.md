# 6. One-Day Study Plan (about 5–6 focused hours)

You have two days left. Today should be understanding + execution; tomorrow should be recall + cheat sheet + mock interview.

## Block 1 — 45 minutes: Business
Read `01_BUSINESS_FLOW.md`. Draw the lifecycle from memory.

Target: explain PR, RFQ, PO, GRN, invoice, 3-way match and payment without code.

## Block 2 — 60 minutes: Backend architecture
Open `server.js`, then route -> middleware -> controller -> service -> model.

Trace **Create Purchase Request** manually.

Target: know what belongs in each layer and why.

## Block 3 — 60 minutes: Auth + approval
Login as Requester and Manager. Create then approve a request.

Target: explain JWT, 401 vs 403, `req.user`, `req.params.id`, PATCH, business state and self-approval prevention.

## Break
Take a real break.

## Block 4 — 75 minutes: Source-to-Pay continuation
Use Procurement user:
- RFQ
- offers
- award
- PO
- GRN

Target: explain how each business noun becomes a MongoDB model and API resource.

## Block 5 — 45 minutes: Finance
Use Finance user:
- invoice
- 3-way match
- payment

Intentionally create one mismatching invoice or partial GRN and observe the backend rule.

## Block 6 — 45 minutes: Angular + BFF
Open frontend:
- component
- Angular service
- interceptor
- guard
- BFF service

Trace dashboard call end to end.

## Final 30 minutes
Close the code and draw this from memory:

```text
Angular Component
-> Angular Service
-> HTTP
-> Interceptor
-> Route
-> Middleware
-> Controller
-> Service
-> Model
-> MongoDB
```

Then explain the entire procurement flow from memory.
