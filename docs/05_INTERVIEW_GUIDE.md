# 5. Interview Guide

## Explain the application in 45 seconds

"I built a simplified Source-to-Pay application using the MEAN stack. Angular handles the UI and uses services and an HTTP interceptor to call the backend. Node.js runs an Express API with routes, authentication and role-based middleware. Controllers handle HTTP concerns, services enforce procurement business rules, Mongoose models define the MongoDB documents, and MongoDB persists the data. The workflow covers purchase requests, approvals, RFQs, supplier offers, awards, purchase orders, receiving, invoice 3-way matching and payment. I also implemented BFF endpoints that aggregate multiple backend domains into responses designed for the Angular frontend."

## What is Node.js?
A JavaScript runtime that runs JavaScript outside the browser. It is commonly used for server/API applications and supports event-driven, non-blocking I/O.

## Node vs Express
Node.js is the runtime. Express is a web framework running on Node that simplifies routing, middleware and HTTP request/response handling.

## What is middleware?
Code that runs during the request-response pipeline before the final handler. Examples: JSON parsing, authentication, authorization, logging and validation.

## Route vs controller vs service vs model
- route -> where the request goes
- controller -> HTTP req/res coordination
- service -> business rules
- model -> data structure/persistence interface

## What is REST?
An API style centered on resources and standard HTTP operations. Example: `/purchase-requests` with POST to create, GET to read and PATCH to change state.

## POST vs PUT vs PATCH
- POST creates a resource/action
- PUT normally replaces the full resource representation
- PATCH changes part of an existing resource

## `req.body`, `req.params`, `req.query`
- body -> payload sent inside request
- params -> variables inside URL path
- query -> filters/options after `?`

## Async/await
Database/network operations complete later. `await` lets the current async function wait for its Promise result without blocking the entire Node event loop.

## MongoDB vs Mongoose
MongoDB is the database. Mongoose is the Node ODM used to define schemas/models, validate data and query MongoDB.

## SQL vs NoSQL
Relational SQL databases organize strongly structured data in tables with relational joins. MongoDB stores document-shaped JSON-like data and can embed or reference related information. Choice depends on domain consistency, query patterns and data model—not simply which is "better."

## Authentication vs authorization
- authentication -> who are you?
- authorization -> what are you allowed to do?

## JWT flow
Login verifies password and signs a token. The client sends `Authorization: Bearer <token>`. Middleware verifies it and attaches the user to `req.user`.

## What is BFF?
A Backend for Frontend is a backend layer designed around the needs of a specific frontend. It can aggregate several domain calls, transform data, centralize authentication concerns and keep backend complexity away from the UI.

## Why backend validation if Angular validates?
Frontend validation is for usability and can be bypassed. Backend validation protects security, business rules and database integrity.

## Why service layer?
It prevents controllers from becoming business-logic containers. The same business rules can be reused from other controllers, jobs or interfaces, and are easier to test.

## Procurement questions

### Purchase Request vs Purchase Order
Purchase Request is internal permission to buy. Purchase Order is the formal order to the supplier.

### RFQ
Request for Quotation: suppliers are invited to submit commercial offers.

### GRN
Goods Receipt Note: records what actually arrived, including partial deliveries.

### 3-way matching
Compare PO + GRN + Invoice before payment.

### Source-to-Pay
The end-to-end process from demand/sourcing and supplier selection through ordering, receipt, invoice and payment.

## Strong architecture follow-ups

### Why prevent self-approval?
Segregation of duties: the person requesting spend should not independently authorize the same spend.

### Why use enums for statuses?
They stop invalid states from entering the database and make workflow rules predictable.

### Why audit logs?
Enterprise procurement needs traceability: who performed an action, when, and on which entity.

### What happens if MongoDB fails?
The awaited database operation rejects, Express error handling returns an error response, and the request does not falsely report success. In production you would add centralized monitoring, retries where safe, health checks and resilient deployment/database architecture.

### How would this scale?
Keep services stateless, use database indexes, cache read-heavy data, paginate large results, move long tasks to queues, and split domains/services only when scale/team complexity justifies it.
