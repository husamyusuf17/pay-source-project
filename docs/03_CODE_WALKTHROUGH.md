# 3. Code Walkthrough

Use this document while opening the files in VS Code.

## `backend/server.js`

Purpose: compose and start the backend.

Key sequence:

```js
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/...', routes);
app.use(notFound);
app.use(errorHandler);
await connectDB();
app.listen(PORT);
```

Interview explanation: Express is the framework; Node is the runtime. `express.json()` is middleware that parses JSON into `req.body`.

## `middleware/auth.js`

### `authenticate`
1. Read `Authorization` header.
2. Expect `Bearer <token>`.
3. Verify JWT signature and expiration.
4. Load user from MongoDB.
5. Store the authenticated user in `req.user`.
6. Call `next()`.

### `authorize(...roles)`
Checks whether `req.user.role` is allowed. If not, response becomes 403.

Remember:
- 401 = not authenticated / token invalid
- 403 = authenticated but not permitted

## `models/PurchaseRequest.js`

Important model ideas:
- ObjectId reference to User
- nested item documents
- controlled `enum` status
- approval subdocuments
- automatic timestamps

`ObjectId + ref` creates a relationship in a document database. `.populate()` can resolve referenced documents.

## `purchaseRequestService.js`

### Create
The server calculates the amount:

```js
quantity * estimatedUnitPrice
```

This avoids trusting a client-supplied total.

The service creates approval requirements based on amount. That is a clear example of **business logic**.

### Decide
The service checks:
- request exists
- status is pending
- requester is not approving own request
- user's role has a pending approval

Then it mutates the approval subdocument and saves the Purchase Request.

## `sourcingService.js`

### Create RFQ
Checks:
- Purchase Request exists
- it is APPROVED
- suppliers exist and are ACTIVE

Then request state changes to `SOURCING`.

### Submit offer
Checks:
- RFQ exists
- RFQ is OPEN
- supplier was actually invited

### Award
Checks offer belongs to RFQ, then rejects competing offers and awards one.

## `purchaseOrderService.js`

A PO can be created only from an AWARDED RFQ. A unique constraint on `rfq` prevents two POs for one RFQ.

## `receivingService.js`

Multiple GRNs are summed to determine whether the PO is partially or fully received.

This is a good interview example for aggregation/business logic.

## `invoiceService.js`

3-way matching is implemented in `match()`:
- compare invoice amount with PO total
- aggregate quantities across GRNs
- compare received quantities with ordered quantities

It then sets `MATCHED` or `MISMATCH`.

## `paymentService.js`

Payment is blocked unless invoice status is `MATCHED`.

This demonstrates an important enterprise principle: **the backend controls legal state transitions**.

## `bffService.js`

Dashboard runs multiple independent database queries in parallel with:

```js
await Promise.all([...])
```

Why? The queries do not depend on each other, so waiting for them in parallel reduces total latency compared with executing them one after another.

The request details BFF constructs one frontend response from several domain models.

## Angular `auth.interceptor.ts`

Without an interceptor, every API call would need to repeat:

```ts
headers: { Authorization: `Bearer ${token}` }
```

The interceptor centralizes this cross-cutting concern.

## Angular `auth.guard.ts`

A route guard protects frontend navigation. Important: **it does not replace backend authorization**. A user can bypass the frontend and call an API directly, so the backend still checks JWT + role.

## Angular `procurement-api.service.ts`

This class centralizes domain API calls. Components call methods such as:

```ts
createPurchaseRequest(...)
approvePurchaseRequest(...)
createRFQ(...)
matchInvoice(...)
```

The Angular component therefore focuses on UI behavior rather than raw HTTP configuration.
