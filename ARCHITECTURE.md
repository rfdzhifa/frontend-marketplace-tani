# ARCHITECTURE.md — Marketplace Produk Petani Lokal (Frontend Workspace)

> Frontend adaptation of the original project `ARCHITECTURE.md`. **Original architectural decisions remain authoritative**: Atomic Design + feature-based organization, `/api/v1`, response envelopes, uppercase roles and order statuses, and a shared HTTP client. This file changes workspace paths and documents frontend-specific implementation, not backend design.

## 1. Scope and authority

- Scope: React frontend workspace only. Backend implementation, migrations, and services remain in the separate backend workspace/repository.
- Read in order: this file → `docs/modules/<module>.md` (implemented module contract) → `docs/conventions.md` → `docs/api-contract.md` → `docs/sitemap-routes.md`, `docs/design-system.md`, `docs/content-copy.md`, and SRS.
- For implemented Authentication, `docs/modules/auth.md` (from backend `AUTH.md`) is authoritative on request/response, token, role and redirects.
- For future modules, architectural endpoint lists are **proposals** until the backend module has been implemented and tested. Ask rather than invent missing contracts.

## 2. Workspace layout and Git boundary

```text
frontend/                         # VS Code workspace; NOT the app Git repository
├── .agents/skills/              # local agent skills, outside app Git repository
├── docs/
│   ├── modules/auth.md          # verified Authentication contract
│   ├── api-contract.md
│   ├── conventions.md
│   ├── design-system.md
│   ├── sitemap-routes.md
│   ├── content-copy.md
│   └── SRS.pdf                   # use actual filename present in workspace
├── ARCHITECTURE.md
├── AGENTS.md
└── frontend-marketplace-tani/    # React + Vite app; Git root
    ├── src/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

Run npm commands inside `frontend-marketplace-tani/`. Keep docs and `.agents/skills` outside this Git repository. Do not copy credentials or `.env` secrets into documentation.

## 3. Technology

- React + Vite (JavaScript/ESM), React Router, Tailwind CSS v4 (`@import "tailwindcss"` and `@theme`).
- TanStack Query for server state; Axios via one shared HTTP client.
- React Hook Form + Zod, Radix primitives, Lucide icons, Sonner, clsx/tailwind-merge/CVA.
- ESLint + Prettier. New dependencies require approval.
- UI copy in Indonesian; identifiers and code in English.

## 4. Mandatory source structure

```text
frontend-marketplace-tani/src/
├── main.jsx
├── index.css
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   ├── providers.jsx
│   └── guards/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── features/
│   ├── auth/
│   ├── marketplace/
│   ├── farmer-profile/
│   ├── cart/
│   ├── checkout/
│   ├── order-tracking/
│   ├── review/
│   └── seller-dashboard/
├── layouts/
├── hooks/
├── services/httpClient.js
├── constants/
└── utils/
```

Each feature owns `api/`, `hooks/`, `components/`, `pages/`, and `index.js` as needed. Auth additionally owns `context/AuthContext.jsx`. A shared component lives in a folder such as `components/atoms/Button/Button.jsx` plus `index.js`.

## 5. Atomic Design and imports

| Layer | Responsibility | Must not do |
|---|---|---|
| Atoms | Small, reusable, domain-agnostic UI | API calls, feature hooks, domain business logic |
| Molecules | Composition of atoms | API calls, global server state |
| Organisms | Complex presentational sections | Direct API calls |
| Templates | Reusable page shells/layout | Page-specific data fetching |
| Pages | Assemble templates and feature hooks | Heavy business logic |

- Components receive data via props and report events through callbacks.
- Only feature hooks and pages may call feature API functions; prefer hooks for TanStack Query mutations and queries.
- Feature-private components stay under `features/<feature>/components/`. Share across features only when reuse is established.
- Cross-feature imports go through the other feature's `index.js`, not its internals.
- Never use inline `fetch`, a second Axios instance, hardcoded backend URLs, or hardcoded order statuses.

## 6. API and authentication

- API base path `/api/v1`; use `VITE_API_URL` for the complete base URL after checking actual backend host/port.
- Success: `{ success: true, message, data, meta? }`; error: `{ success: false, message, errors? }` with `errors` as field entries when applicable.
- Roles: `BUYER`, `SELLER` (case-sensitive).
- Auth endpoints: `POST /auth/register`, `POST /auth/login`, `GET /auth/profile`, `PUT /auth/profile`.
- Current backend auth: JWT expires in 1 day, frontend stores token in `localStorage`, HTTP header `Authorization: Bearer <token>`. No backend logout or refresh endpoint in current contract.
- Register redirects to `/login` without logging in; login redirects BUYER to `/` and SELLER to `/seller/dashboard`.
- Guard authenticated routes and role-specific routes; 401 on protected resources clears session and navigates to login. Avoid treating public login 401 as an authenticated-session expiration.
- Follow `docs/modules/auth.md` for all auth payloads, validations, error behavior, and test scenarios.

## 7. Routing, state, and UX

- Route tree in `app/router.jsx`; reusable guard in auth module (or `app/guards` as a thin adapter) to avoid duplicate authorization logic.
- Public `/`, `/products/:id`, `/farmers/:id`, `/login`, `/register`; authenticated `/profile`; buyer `/cart`, `/checkout`, `/orders`; seller `/seller/*`. Future routes require confirmation against implemented modules.
- Server data in TanStack Query; auth user/token in Context; local interaction state in React state.
- Handle loading, error and empty states; preserve entered form values on recoverable errors.
- Tailwind v4 tokens and visual behavior follow `docs/design-system.md`.

## 8. Module status

| Module | Backend | Frontend / E2E |
|---|---|---|
| Authentication (UC-01–03) | DONE; backend tests 11/11 PASS per handoff | Not verified / pending |
| Marketplace, Farmer Profile, Cart, Checkout/Payment, Order Tracking, Review, Seller Dashboard | Not verified in this workspace | Pending |

Do not label other modules unimplemented if later backend evidence is provided; update this table after verification.

## 9. Quality gates

Before claiming a frontend module done: ensure its backend contract is confirmed; build API → hooks → presentational components → pages → routes; run `npm run lint`, `npm run build`, relevant tests, and manual E2E checks. Never expose passwords, hashes, JWTs or secrets in logs. Record modified files and outstanding work.
