# 7. Troubleshooting and Debugging Patterns

## `Cannot GET/POST/PATCH/DELETE /api/...`
Meaning: Express has no matching method + path loaded.

Check:
1. route exists
2. router is exported
3. server mounts router at expected base path
4. server restarted/nodemon reloaded

## `ReferenceError: X is not defined`
JavaScript is using a variable/function that does not exist in the current scope.

## `Cannot access X before initialization`
A `let`/`const` binding is referenced before its declaration has executed. Define functions before exporting/using them.

## `401`
Token missing, invalid or expired.

## `403`
User identity is valid but role/business permission fails.

## `400 Invalid MongoDB id`
A URL parameter intended as ObjectId is malformed.

## Mongoose validation error
The document violates schema rules such as required field, minimum value or enum.

## MongoDB connection failure
Check:

```powershell
Get-Service MongoDB
```

and `.env`:

```text
MONGO_URI=mongodb://127.0.0.1:27017/pay_source_project
```

## Angular calls return 401
Check login/token and DevTools Network request header:

```text
Authorization: Bearer <token>
```

## CORS
During this project Angular uses a development proxy. Backend also enables CORS for training. In production, restrict allowed origins rather than allowing everything.
