# 1. Business Flow — Source-to-Pay

## Why the system exists

Procurement software controls how an organization requests, approves, sources, orders, receives, invoices and pays for goods or services. The software exists because email, spreadsheets and manual handoffs make it difficult to answer basic control questions:

- Who requested the purchase?
- Was the spending approved?
- Which suppliers were invited?
- What did suppliers offer?
- Why was one supplier selected?
- What did we order?
- What actually arrived?
- Does the invoice match the PO and receipt?
- Has the supplier been paid?
- Who performed each action?

## Implemented lifecycle

### 1. Purchase Request
An employee requests permission to buy something. It is **internal**.

Example:
- 10 laptops
- IT department
- expected unit price BHD 500
- reason: new employees

The backend calculates the estimated total instead of trusting the client.

### 2. Approval
The request begins as `PENDING_APPROVAL`.

Training rule:
- up to BHD 10,000 -> MANAGER approval
- above BHD 10,000 -> MANAGER + FINANCE approval

The requester is not allowed to approve their own request. This demonstrates segregation of duties.

### 3. RFQ — Request for Quotation
After approval, Procurement invites one or more active suppliers to quote.

The request moves from `APPROVED` to `SOURCING`.

### 4. Supplier Offers
Each invited supplier can have one offer containing:
- total price
- delivery days
- warranty months
- payment terms

The cheapest supplier is not automatically the best supplier. Delivery, quality, warranty, performance and payment terms can matter.

### 5. Award
Procurement selects one offer. The selected offer becomes `AWARDED`; competing offers become `REJECTED`.

### 6. Purchase Order
A PO is the formal commercial order to the selected supplier. It is different from a Purchase Request:

- Purchase Request: "Can our company buy this?"
- Purchase Order: "Our company is ordering this from this supplier."

### 7. GRN — Goods Receipt Note
Receiving records what physically arrived. Multiple GRNs can exist for one PO, allowing partial delivery.

Example:
- Ordered: 10 laptops
- first GRN: 6
- second GRN: 4

The PO is `PARTIALLY_RECEIVED` until all ordered quantities are received, then becomes `RECEIVED`.

### 8. Invoice
Finance records the supplier invoice against the PO.

### 9. 3-Way Matching
The system compares:

```text
Purchase Order  -> what we ordered and agreed to pay
GRN             -> what we actually received
Invoice         -> what the supplier is charging
```

The training system checks:
1. Invoice amount equals PO amount.
2. Total received quantity is at least the ordered quantity.

If both pass -> `MATCHED`.
If either fails -> `MISMATCH`.

### 10. Payment
Only a `MATCHED` invoice can be paid. This is another example of backend-enforced business state.

## State sequence

```text
PENDING_APPROVAL
  -> APPROVED
  -> SOURCING
  -> PO_CREATED
  -> RECEIVED
  -> INVOICED
  -> PAID
```

A request may instead transition from `PENDING_APPROVAL` to `REJECTED`.

## Interview message

Business software development is the conversion of business policy into controlled data and state transitions:

```text
Business rule
  -> API permission
  -> service-layer condition
  -> database state
  -> frontend status/action
```
