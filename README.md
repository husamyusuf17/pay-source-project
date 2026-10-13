# Pay Source Project

A complete interview-training project that models a simplified **Source-to-Pay procurement platform** using the technologies and architecture relevant to a Full Stack Developer role:

- **MongoDB** — document database
- **Express.js** — backend web framework
- **Angular** — frontend framework
- **Node.js** — JavaScript runtime
- **BFF (Backend for Frontend)** — frontend-specific aggregation endpoints
- **JWT** — authentication
- **Role-based authorization** — REQUESTER, MANAGER, PROCUREMENT, FINANCE, ADMIN

The goal is not to copy Penny's proprietary implementation. The goal is to understand how a business requirement becomes frontend code, HTTP/API design, middleware, business logic, database models, and user-facing state.

## Business flow implemented

```text
Business need
  -> Purchase Request
  -> Approval
  -> RFQ
  -> Supplier Offers
  -> Award
  -> Purchase Order
  -> Goods Receipt / GRN
  -> Invoice
  -> 3-Way Match (PO + GRN + Invoice)
  -> Payment
```

## Architecture

```text
Angular Component
    -> Angular Service
    -> HTTP Request
    -> Auth Interceptor adds JWT
    -> Express Route
    -> Authentication Middleware
    -> Authorization Middleware
    -> Controller
    -> Service / Business Logic
    -> Mongoose Model
    -> MongoDB
    -> HTTP Response
    -> Angular Service
    -> Component/UI
```

The dashboard also demonstrates a BFF:

```text
Angular Dashboard
    -> GET /api/bff/dashboard
    -> BFF Service
       -> Purchase Requests
       -> Suppliers
       -> RFQs
       -> Purchase Orders
       -> Invoices
    -> one frontend-shaped response
```

## Run the project

### 1. MongoDB

Make sure your MongoDB Windows service is running:

```powershell
Get-Service MongoDB
```

### 2. Backend

```powershell
cd backend
copy .env.example .env
npm.cmd install
npm.cmd run seed
npm.cmd run dev
```

Backend runs on `http://localhost:5000`.

### 3. Frontend

Open a second terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd start
```

Angular normally runs on `http://localhost:4200`. The included proxy forwards `/api` to the Node backend.

### Demo accounts

All passwords are `Password123!`.

| Role | Email |
|---|---|
| Requester | requester@demo.com |
| Manager | manager@demo.com |
| Procurement | procurement@demo.com |
| Finance | finance@demo.com |
| Admin | admin@demo.com |

## How to study this project today

Do **not** memorize every line. Learn it in this order:

1. Read `docs/01_BUSINESS_FLOW.md`.
2. Read `docs/02_ARCHITECTURE.md`.
3. Start backend and run `scripts/full-demo-flow.ps1`.
4. Open each backend file while the demo flow runs and trace the request.
5. Start Angular and repeat the same business actions from the UI.
6. Read `docs/03_CODE_WALKTHROUGH.md`.
7. Read `docs/04_API_FLOWS.md`.
8. Finish with `docs/05_INTERVIEW_GUIDE.md`.

Tomorrow, convert what you understand into a detailed cheat sheet rather than learning new architecture.
