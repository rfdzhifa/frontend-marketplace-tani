# AGENTS.md — Marketplace Produk Petani Lokal (Frontend Workspace)

You are working in the **frontend workspace**, not the backend repository. Build a React marketplace connecting BUYER users with local farmer SELLER users. Xendit operates in sandbox mode; the app tracks order fulfillment status, not shipping logistics.

## Mandatory reading and precedence

1. `ARCHITECTURE.md` — authoritative frontend structure and architectural rules adapted from the older project architecture.
2. `docs/modules/<module>.md` — implemented backend contract for the module being worked on; `docs/modules/auth.md` is verified for Authentication.
3. `docs/conventions.md` — detailed React/Tailwind and naming conventions.
4. `docs/api-contract.md` — **distinguishes verified endpoints from proposals**.
5. `docs/sitemap-routes.md`, `docs/design-system.md`, `docs/content-copy.md`, and the SRS for routes, UI, and use cases; any conflict with the preceding sources must be flagged, not silently implemented.

When sources conflict, retain the original older architectural decisions (Atomic Design, `/api/v1`, uppercase roles, response envelope). For **implemented auth behavior**, use the tested backend `AUTH.md` copied as `docs/modules/auth.md`. Ask before resolving any remaining ambiguous conflict.

## Workspace and commands

```text
frontend/
├── .agents/skills/              # agent-only; outside app Git
├── docs/                        # specifications; outside app Git
├── AGENTS.md
├── ARCHITECTURE.md
└── frontend-marketplace-tani/    # React/Vite app; Git repository root
```

Run commands from `frontend-marketplace-tani/`:
```bash
npm run dev
npm run lint
npm run build
npm run format:check
```

Do not initialize Git at `frontend/` or move agent skills/docs into the app repository unless explicitly requested.

## Hard rules

- Work on one feature/use case at a time. Before editing, propose a concise plan and wait for approval.
- React + Vite + Tailwind CSS v4; React Router; TanStack Query; Axios shared client; React Hook Form + Zod. No extra dependencies without approval.
- Atomic Design for shared UI: `atoms → molecules → organisms → templates → pages` (pages in feature folders).
- One shared component per folder, e.g. `Button/Button.jsx` + `Button/index.js`.
- Shared reusable UI in `src/components/`; feature-only UI in `src/features/<feature>/components/`.
- Components are presentational: no API calls in atoms, molecules, or organisms. API requests live in `features/<feature>/api/` and are called by hooks/pages. Prefer TanStack Query in hooks.
- Shared Axios instance: `src/services/httpClient.js`; no direct `fetch` or hardcoded API host in UI components.
- Cross-feature imports use the feature's public `index.js`.
- Roles are `BUYER` and `SELLER`; use constants for order status values.
- API base path `/api/v1`, success `{ success, message, data, meta? }`, errors `{ success: false, message, errors? }`.
- Never invent endpoints or fields. **Only Authentication has a verified backend contract at present.** Confirm future modules before integration.
- User-facing copy is Indonesian; code identifiers are English. Use visual tokens from `docs/design-system.md`.
- Every page must handle loading, error, and empty/recoverable states.
- No secrets, JWTs, passwords, password hashes, or sensitive user data in logs or commits.
- Do not edit unrelated files or reformat the entire codebase.

## Authentication (backend DONE; frontend E2E pending)

- `POST /api/v1/auth/register`: `name`, `email`, `phone`, `password`, `role`; register does not log in.
- `POST /api/v1/auth/login`: `email`, `password`; response `data.token` and `data.user`.
- `GET /api/v1/auth/profile` and `PUT /api/v1/auth/profile`; edit only `name`, `phone`.
- JWT is valid for one day; frontend stores token in `localStorage`, attaches `Authorization: Bearer <token>`; no refresh token or backend logout endpoint.
- BUYER login → `/`; SELLER login → `/seller/dashboard`; register → `/login`.
- Logout removes local auth session. Protected 401 invalidates session and navigates to login; do not break error handling on public login requests.
- Read `docs/modules/auth.md` before implementing fields, validators, responses, or errors. Do not substitute old draft `/auth/me`, `/auth/logout`, cookie sessions, or lowercase roles.

## Per-feature workflow

1. Read module contract and relevant SRS use cases; verify backend implementation status.
2. Propose files to add/change, endpoint dependencies, and testing plan; wait for approval.
3. Implement feature API functions → hooks → atomic/presentational components → pages → route and guards.
4. Implement loading/error/empty/permission states; respect UI design and Indonesian copy.
5. Run lint/build and relevant tests; perform E2E with the actual backend for any integration claim.
6. Report files changed, checks performed, blockers, and any contract discrepancies.

## Definition of Done

- [ ] Correct use cases and backend-verified contract
- [ ] Atomic Design, feature boundaries and imports respected
- [ ] No API calls from UI components; shared HTTP client used
- [ ] Auth/role guards and error handling tested as applicable
- [ ] Loading/error/empty states handled
- [ ] Lint/build/tests pass; E2E verified before marking integrated
- [ ] Documentation updated only for confirmed changes

If unclear or contradictory: stop, document the conflict, and ask. Do not silently assume a new endpoint or backend behavior.
