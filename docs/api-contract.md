# API Contract — Marketplace Produk Petani Lokal (Frontend)

## Status and authority

- **IMPLEMENTED / VERIFIED BACKEND:** Authentication only, based on `docs/modules/auth.md` (copied from backend `AUTH.md`). Backend tests: 11/11 passed according to the backend handoff.
- **PROPOSED / NOT VERIFIED:** All other modules. Their paths, payloads, and responses must be confirmed against the implemented backend module specification before frontend integration.
- Architecture precedence: original `ARCHITECTURE.md` conventions prevail over conflicting early frontend drafts. Implemented module contract prevails over unimplemented endpoint proposals.
- Do not create or call an endpoint merely because it appears in a proposal.

## 1. Shared conventions

- Base path: `/api/v1`; configure host via `VITE_API_URL`, for example `http://localhost:3000/api/v1` **only if that is the actual backend port**.
- JSON request fields use camelCase; roles are uppercase `BUYER` and `SELLER`.
- Success envelope: `{ "success": true, "message": "...", "data": ... }`; optional `meta` for pagination.
- Error envelope: `{ "success": false, "message": "...", "errors": [{ "field": "email", "message": "..." }] }` when validation errors are provided. Do not assume an error `code` or `fieldErrors` map.
- Expected HTTP codes include 200, 201, 400, 401, 403, 404, 409 and 500; endpoint-specific behavior follows implemented module specs.
- Pagination convention (proposed for future modules): `?page=1&limit=10`; response pagination metadata belongs under `meta`, not as an unwrapped list response.
- Money in integer IDR; format in the frontend. Verify date/ID formats with each implemented backend module.

## 2. Authentication — IMPLEMENTED

All paths below are relative to `/api/v1`. See `docs/modules/auth.md` for full validations, business rules, and test scenarios.

| Method | Path | Access | Use case | Status |
|---|---|---|---|---|
| POST | `/auth/register` | Public | UC-01 | IMPLEMENTED |
| POST | `/auth/login` | Public | UC-02 | IMPLEMENTED |
| GET | `/auth/profile` | Bearer JWT | UC-03 | IMPLEMENTED |
| PUT | `/auth/profile` | Bearer JWT | UC-03 | IMPLEMENTED |

### POST `/auth/register`

Request:
```json
{ "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "password": "rahasia123", "role": "SELLER" }
```
Response 201:
```json
{ "success": true, "message": "Registrasi berhasil", "data": { "id": 1, "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "role": "SELLER" } }
```
Validation: `name` 2–100 characters; `email` valid, maximum 100; Indonesian `phone` starting `08`, `628`, or `+628`, 10–15 digits; `password` at least 8 characters containing letters and numbers; role `BUYER` or `SELLER`. Errors: 400 with field `errors[]`, 409 duplicate email. Registration does **not** log the user in.

### POST `/auth/login`

Request:
```json
{ "email": "budi@mail.com", "password": "rahasia123" }
```
Response 200:
```json
{ "success": true, "message": "Login berhasil", "data": { "token": "<jwt>", "user": { "id": 1, "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "role": "SELLER" } } }
```
Errors: 400 invalid input, 401 generic message `Email atau password salah`. JWT lifetime: one day. Frontend stores token and user for auth session; token in `localStorage`, sent as `Authorization: Bearer <token>`. BUYER redirects to `/`; SELLER redirects to `/seller/dashboard`.

### GET `/auth/profile`

Header: `Authorization: Bearer <token>`.
Response 200:
```json
{ "success": true, "message": "Berhasil", "data": { "id": 1, "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "role": "SELLER" } }
```
Error: 401 for missing, invalid or expired token.

### PUT `/auth/profile`

Header: `Authorization: Bearer <token>`.
Request:
```json
{ "name": "Budi S.", "phone": "081298765432" }
```
Response 200:
```json
{ "success": true, "message": "Profil berhasil diperbarui", "data": { "id": 1, "name": "Budi S.", "email": "budi@mail.com", "phone": "081298765432", "role": "SELLER" } }
```
Only `name` and `phone` can be edited; `email` and `role` cannot. Errors: 400 validation, 401 unauthenticated. Cancel edit is a frontend-only action with no request.

### Authentication exclusions and security

- No implemented `/auth/logout`, `/auth/me`, `/users/me`, refresh-token, forgot-password, or email-verification endpoint in this module contract.
- Logout clears frontend token/user and navigates to `/login`.
- `httpClient` attaches Bearer token; 401 from protected API triggers session clear and navigation to `/login` (avoid redirect loops on failed public login).
- Token storage in `localStorage` follows current implementation but increases XSS exposure; do not render untrusted HTML or log tokens.

## 3. Future module endpoint proposals — NOT IMPLEMENTED / NOT VERIFIED

The following paths are **architectural proposals**, transcribed from the older authoritative `ARCHITECTURE.md` section 4.4. They are not an API integration guarantee. Exact method, payload, access, status transitions, and response fields must be documented by each backend module's tested specification before use.

| Module | Proposed methods and paths | Intended access |
|---|---|---|
| Marketplace | `GET /products`, `GET /products/:id` | Public |
| Seller products | `POST /seller/products`, `PUT /seller/products/:id`, `DELETE /seller/products/:id`, `PATCH /seller/products/:id/stock` | SELLER |
| Farmer profile | `GET /farmers/:id`, `GET /seller/farmer-profile`, `PUT /seller/farmer-profile` | Public / SELLER |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id` | BUYER |
| Checkout and orders | `POST /orders/checkout`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/confirm-received` | BUYER |
| Seller orders | `GET /seller/orders`, `GET /seller/orders/:id`, `PATCH /seller/orders/:id/process`, `PATCH /seller/orders/:id/ship` | SELLER |
| Payment callback | `POST /payments/xendit/webhook` | Xendit callback; backend only |
| Reviews | `POST /reviews`, `GET /products/:id/reviews`, `GET /seller/reviews` | BUYER / Public / SELLER |
| Dashboard | `GET /seller/dashboard/overview` | SELLER |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read` | Authenticated |

Earlier frontend proposals, including `/checkout`, `/webhooks/xendit`, `/seller/dashboard/summary`, `/seller/farm-profile`, and action-style seller order `POST` endpoints, conflict with older architecture. **Do not use either variant until that module's backend implementation is verified.**

## 4. Order status contract — ARCHITECTURAL, NOT VERIFIED

Use constants, not hardcoded strings. Older architecture defines:
`MENUNGGU_PEMBAYARAN`, `DIBAYAR`, `DIPROSES`, `DIKIRIM`, `SELESAI`, `DIBATALKAN`.
Backend `order` module owns the state machine and must validate transitions. The UI cannot change statuses arbitrarily. Do not use lowercase draft values such as `pending_payment` as API enum values.

## 5. Integration checklist

1. Check the corresponding `docs/modules/<module>.md` and backend test results.
2. Confirm method, path, role, request, response envelope, field validation, and errors.
3. Implement requests in `features/<feature>/api/` via shared `services/httpClient.js`.
4. Call API functions from feature hooks/pages; UI components remain presentational.
5. Test loading, error, empty and permission states, including 401/403.
6. Mark module VERIFIED only after actual end-to-end integration succeeds.
