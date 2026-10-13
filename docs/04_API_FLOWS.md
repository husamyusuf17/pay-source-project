# 4. API Flows

## Login

```text
POST /api/auth/login
body: email + password
  -> authController.login
  -> authService.login
  -> User.findOne(email)
  -> bcrypt.compare(password, hash)
  -> jwt.sign(...)
  -> token + sanitized user
```

Angular stores the token locally for this training project and the interceptor adds it to later requests.

## Create Purchase Request

```text
POST /api/purchase-requests
Bearer REQUESTER token
  -> authenticate
  -> authorize REQUESTER/ADMIN
  -> controller.create
  -> purchaseRequestService.create
  -> calculate amount
  -> calculate approval requirements
  -> PurchaseRequest.create
  -> AuditLog.create
  -> 201
```

## Approve

```text
PATCH /api/purchase-requests/:id/approve
  -> req.params.id contains :id
  -> JWT identity -> req.user
  -> role authorization
  -> verify PENDING_APPROVAL
  -> prevent self-approval
  -> update assigned approval
  -> if all approvals complete, status APPROVED
  -> save()
```

`PATCH` is appropriate because approval changes only part of an existing resource/state.

## Create RFQ

```text
POST /api/sourcing/rfqs
  -> PROCUREMENT authorization
  -> verify purchase request is APPROVED
  -> verify invited suppliers
  -> create RFQ
  -> purchase request status = SOURCING
```

## Submit Offer

```text
POST /api/sourcing/rfqs/:id/offers
  -> RFQ must be OPEN
  -> supplier must be invited
  -> create Offer
```

## Award Offer

```text
PATCH /api/sourcing/rfqs/:id/award/:offerId
  -> verify offer belongs to RFQ
  -> all offers -> REJECTED
  -> selected offer -> AWARDED
  -> RFQ -> AWARDED
```

## Purchase Order

```text
POST /api/purchase-orders/from-rfq/:rfqId
  -> RFQ must be AWARDED
  -> load winning offer and Purchase Request
  -> create PO
  -> Purchase Request -> PO_CREATED
```

## Goods Receipt

```text
POST /api/grns
  -> load PO
  -> create GRN
  -> sum all GRNs for that PO
  -> if complete: PO RECEIVED + request RECEIVED
  -> otherwise: PO PARTIALLY_RECEIVED
```

## Invoice

```text
POST /api/invoices
  -> load PO
  -> create invoice
  -> PO / request -> INVOICED
```

## 3-Way Match

```text
POST /api/invoices/:id/match
  -> Invoice
  -> Purchase Order
  -> all GRNs
  -> amount match?
  -> quantities match?
  -> MATCHED or MISMATCH
```

## Payment

```text
POST /api/payments/:invoiceId
  -> FINANCE authorization
  -> invoice must be MATCHED
  -> prevent duplicate payment
  -> Payment.create
  -> invoice, PO, request -> PAID
```

## BFF Dashboard

```text
GET /api/bff/dashboard
  -> authenticate
  -> Promise.all:
     request count
     pending approval count
     supplier count
     open RFQ count
     open PO count
     invoice review count
  -> one JSON response designed for Angular
```

## HTTP status concepts

- `200 OK` successful read/update
- `201 Created` new resource
- `400 Bad Request` invalid data/business state
- `401 Unauthorized` authentication required/invalid
- `403 Forbidden` identity known but action not allowed
- `404 Not Found` resource/route missing
- `409 Conflict` duplicate/conflicting resource
- `500 Internal Server Error` unexpected backend failure
