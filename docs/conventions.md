# Frontend Conventions: Local Farmer Marketplace

This document defines the tech stack, folder structure, naming, and coding rules for the React frontend. Follow it for every file you create or edit.

**Precedence:** `ARCHITECTURE.md` (older, authoritative) > `docs/modules/auth.md` (implemented auth contract) > this document > other frontend design specs. For modules not yet implemented, endpoints are proposals until backend confirmation.

Read these first:

- `design-system.md` for all visual rules and tokens.
- `sitemap-routes.md` for pages, routes, and access rules.
- `api-contract.md` for endpoints (do not invent endpoints that are not listed there).
- The SRS for use cases UC-01 to UC-22.

> **Language rule:** code, comments, file names, and documentation are in English. User-facing text in the app is in **Indonesian**.

---

## 1. Tech Stack

| Area | Choice | Notes |
|---|---|---|
| Framework | React 19 + Vite | Single-page app, JavaScript (JSX) |
| Routing | React Router v7 (library mode) | Route tree as in `sitemap-routes.md` section 7 |
| Styling | **Tailwind CSS v4** | Tokens defined in CSS with `@theme` (section 5). No `tailwind.config.js` |
| Server state | TanStack Query (React Query) | All API data goes through it |
| HTTP client | Axios | One shared instance (section 6) |
| Forms | React Hook Form + Zod | Validation schemas in Indonesian |
| UI primitives | Radix UI (`dialog`, `dropdown-menu`, `tabs`, etc.) | Unstyled and accessible; styled with our own tokens |
| Icons | `lucide-react` | One icon set only |
| Toasts | `sonner` | Styled to match `design-system.md` section 9 |
| Class helpers | `clsx` + `tailwind-merge` (as `cn`), `class-variance-authority` | For component variants |
| Formatting | Native `Intl` APIs | No date or currency library |
| Lint and format | ESLint + Prettier (+ `prettier-plugin-tailwindcss`) | Plugin sorts Tailwind classes |

**Not used (do not add):** Redux, Zustand, MobX, shadcn/ui default styles, Bootstrap, MUI, Ant Design, styled-components, CSS modules, moment.js, lodash. Ask before adding any dependency that is not in this table.

Backend is Express.js with MySQL and Xendit (Sandbox). Secret keys never appear in the frontend.

---

## 2. Workspace and Source Structure

The Git repository root is `frontend/frontend-marketplace-tani/`. Workspace-only `frontend/docs/`, `frontend/AGENTS.md`, `frontend/ARCHITECTURE.md`, and `frontend/.agents/skills/` live **outside** that repository. Do not commit them accidentally. Paths below are relative to the React app root.

```text
src/
├── main.jsx
├── index.css
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   ├── providers.jsx
│   └── guards/                 # ProtectedRoute and guest-only behavior
├── components/               # SHARED Atomic Design
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
│   └── seller-dashboard/     # overview, product-management, order-management, review
├── layouts/                  # Only when necessary; shared page templates remain in components/templates/
├── services/httpClient.js    # Shared Axios instance and interceptors
├── hooks/                    # Cross-feature generic hooks
├── utils/                    # cn, formatCurrency, formatDate
└── constants/                # roles, orderStatus, routes, messages
```

Feature structure:

```text
features/<feature>/
├── api/                      # <feature>.api.js; pure Axios functions
├── hooks/                    # TanStack Query hooks and query key factories
├── components/               # Feature-only presentational molecules/organisms
├── pages/                    # Route-level pages
├── schemas/                  # Optional Zod validation schemas
└── index.js                  # Public exports for other features
```

**Import boundaries:** atoms import React and styling utilities only; molecules compose atoms; organisms compose atoms/molecules and receive data and callbacks via props; templates compose organisms without page-specific data; pages compose UI and feature hooks. Only feature hooks and pages may invoke feature API functions; presentational components never call API. Cross-feature imports must use the target feature's `index.js`, not its internals. If a component is reused by two or more features, move it to shared `components/` at the appropriate Atomic Design level. Each component gets its own directory, e.g. `components/atoms/Button/Button.jsx` and `components/atoms/Button/index.js`.

## 3. Naming

| Item | Convention | Example |
|---|---|---|
| React component files | PascalCase `.jsx` | `ProductCard.jsx` |
| Hooks | camelCase starting with `use` | `useCart.js` |
| Utility and API files | camelCase `.js` | `format.js`, `api.js` |
| Folders | kebab-case | `farm-profile/` |
| Components and types | PascalCase | `StatusBadge` |
| Variables and functions | camelCase | `totalPrice` |
| Constants | UPPER_SNAKE_CASE | `ORDER_STATUS` |
| Event handlers | `handle` + Event | `handleSubmit` |
| Boolean props and variables | `is`, `has`, `can` prefix | `isLoading`, `hasStock` |
| Environment variables | `VITE_` prefix, UPPER_SNAKE_CASE | `VITE_API_URL` |
| Route paths | lowercase, kebab-case | `/farm-profile` |

Page components end with `Page` (`CartPage`). Layouts end with `Layout`.

**Exports:** components use named exports. Route-level pages use a **default export** so they can be lazy-loaded. One component per folder (`ComponentName/ComponentName.jsx` and `ComponentName/index.js`).

---

## 4. Component Rules (Atomic Design)

1. **Atoms:** smallest reusable UI elements; React and styling only; no feature/domain knowledge, global state, or API.
2. **Molecules:** combine atoms; no API or global state.
3. **Organisms:** compose atoms/molecules; all data through props and actions through callbacks; no API calls.
4. **Templates:** shared layout skeletons; no page-specific fetching.
5. **Pages:** live in `features/*/pages/`; compose templates and hooks; move complex business logic into hooks.
6. **Feature-specific UI:** stays in `features/<feature>/components/`, even when molecule/organism in complexity; promote to shared Atomic Design when reused by multiple features.
7. **Imports:** follow section 2 boundaries; one component per folder; use feature public `index.js` for cross-feature imports.
8. **Accessibility:** links navigate, buttons perform actions; icon-only controls have `aria-label`; inputs have labels; images have alt text; use Radix for accessible dialogs/dropdowns/tabs.
9. **Styling:** use Tailwind design tokens, `cn()` for conditional class merging, and `cva` for component variants; avoid repeated raw controls and hardcoded styles.
10. **Quality:** functional components only, no committed debug logging, no dead commented code. Every page handles loading, error, and empty states when applicable.

### 4.1 Shared component catalog and placement

| Level | Components |
|---|---|
| Atoms | `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioCard`, `Label`, `Badge`, `Chip`, `Spinner`, `Skeleton`, `Rating`, `Alert` |
| Molecules | `FormField`, `SearchBar`, `PriceTag`, `QuantityInput`, `QuantityStepper`, `RatingStars`, `RatingPill`, `StatusBadge`, `StockBar`, `FarmerAvatar` |
| Organisms | `Navbar`, `Footer`, `ProductCard`, `ProductGrid`, `DataTable`, `Modal`, `ConfirmDialog`, `Pagination`, `EmptyState`, `ErrorState`, `CheckoutStepper`, `StatCard`, `PageHeader` |
| Templates | `BuyerLayout`, `SellerLayout`, `AuthLayout` and other reusable page shells |
| Pages | `RegisterPage`, `LoginPage`, `ProfilePage` and other route pages under feature folders |

These are initial placements by composition responsibility; adjust an individual component's level based on actual implementation, without breaking dependency direction. Feature-specific `RoleSelector`, `RegisterForm`, `LoginForm`, and `ProfileForm` remain under `features/auth/components/`.

## 5. Tailwind CSS Rules

### 5.1 Setup (Tailwind v4)

- Install `tailwindcss` and `@tailwindcss/vite`, and add the plugin in `vite.config.js`.
- `src/index.css` starts with `@import "tailwindcss";` followed by the `@theme` block below.
- **Do not create `tailwind.config.js`.** Tokens live in CSS.
- Load Manrope (weights 400, 500, 600, 700) from Google Fonts in `index.html`.

### 5.2 Token mapping

This block turns the tokens from `design-system.md` into Tailwind utilities.

```css
@import "tailwindcss";

@theme {
  /* Colors: utilities like bg-primary-600, text-ink, border-border */
  --color-primary-50: #F1F7F2;
  --color-primary-100: #E1EEE3;
  --color-primary-600: #316339;
  --color-primary-700: #285230;
  --color-primary-800: #1F4025;

  --color-ink: #22292F;
  --color-ink-soft: #4B545B;
  --color-ink-muted: #6B747B;
  --color-border: #E4E7EA;
  --color-surface: #FFFFFF;
  --color-canvas: #F6F7F8;
  --color-media-bg: #EEEFF1;

  --color-danger-600: #D92D20;
  --color-danger-50: #FDE9E7;
  --color-warning-600: #B7791F;
  --color-warning-50: #FEF3C7;
  --color-info-600: #1D4ED8;
  --color-info-50: #DBEAFE;
  --color-star: #F5B400;

  /* Order status colors: used only inside StatusBadge */
  --color-status-pending-bg: #FEF3C7;
  --color-status-pending-fg: #92600A;
  --color-status-paid-bg: #E1EEE3;
  --color-status-paid-fg: #2A6B35;
  --color-status-processing-bg: #DBEAFE;
  --color-status-processing-fg: #1D4ED8;
  --color-status-shipped-bg: #E8E4FB;
  --color-status-shipped-fg: #5B3FC4;
  --color-status-completed-bg: #316339;
  --color-status-completed-fg: #FFFFFF;
  --color-status-cancelled-bg: #FDE9E7;
  --color-status-cancelled-fg: #B42318;

  /* Font */
  --font-sans: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Type scale: utilities like text-h2, text-body-sm */
  --text-display: 56px;
  --text-display--line-height: 60px;
  --text-display--letter-spacing: -0.02em;
  --text-h1: 40px;
  --text-h1--line-height: 46px;
  --text-h1--letter-spacing: -0.015em;
  --text-h2: 28px;
  --text-h2--line-height: 36px;
  --text-h2--letter-spacing: -0.01em;
  --text-h3: 22px;
  --text-h3--line-height: 30px;
  --text-h4: 18px;
  --text-h4--line-height: 26px;
  --text-body-lg: 18px;
  --text-body-lg--line-height: 28px;
  --text-body: 16px;
  --text-body--line-height: 24px;
  --text-body-sm: 14px;
  --text-body-sm--line-height: 20px;
  --text-caption: 12px;
  --text-caption--line-height: 16px;

  /* Radius: rounded-sm, rounded-md, rounded-lg, rounded-xl; pill = rounded-full */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Shadows: shadow-hover, shadow-overlay */
  --shadow-hover: 0 6px 20px rgba(34, 41, 47, 0.08);
  --shadow-overlay: 0 12px 32px rgba(34, 41, 47, 0.14);
}

@layer base {
  body {
    @apply bg-surface font-sans text-body text-ink antialiased;
  }
  /* Tabular numbers for prices and tables */
  .tabular {
    font-variant-numeric: tabular-nums;
  }
}
```

Font weights are set with utility classes: headings use `font-semibold` (600), prices use `font-bold` (700), captions and labels use `font-medium` (500).

Breakpoints use Tailwind defaults, which already match `design-system.md` section 5: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

### 5.3 Usage rules

1. **Never hardcode a color.** No `bg-[#316339]`, no `text-green-700`, no `style={{ color: ... }}`. Use `bg-primary-600`, `text-ink`, and so on.
2. **No arbitrary values for tokens.** Use `rounded-md`, not `rounded-[12px]`. Use `text-h2`, not `text-[28px]`. Arbitrary values are acceptable only for one-off layout needs (for example a fixed `w-[240px]` sidebar) and should be rare.
3. **Mobile-first.** Write the base style for mobile, then add `sm:`, `md:`, `lg:` overrides. Product grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
4. **Default Tailwind palette colors are not allowed** (`gray-500`, `green-600`, `red-500`, ...). Only the tokens above.
5. **Merge classes with `cn()`** whenever a component accepts a `className` prop or has conditional classes.
6. **Focus ring:** every interactive element uses `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2`. Put this in the shared `Button` and `Input` styles, not on every usage.
7. **Order status colors** are applied only inside `StatusBadge`, from the `--color-status-*` tokens.
8. **Repeated long class strings** become a component (or a `cva` variant), not a copied string.
9. **Reduced motion:** transitions use `motion-safe:` or respect `prefers-reduced-motion`.

---

## 6. Data and API Layer

### 6.1 Shared Axios client

Use `src/services/httpClient.js`, not `src/lib/api.js`. Configure `baseURL` from `import.meta.env.VITE_API_URL` with the **full `/api/v1` prefix** (example: `http://localhost:3000/api/v1`; verify the actual backend port). Do not hardcode backend URLs in features.

Auth backend currently issues a JWT in `data.token`. Frontend stores the token in `localStorage` and adds `Authorization: Bearer <token>` on authenticated requests. Do **not** use the previous cookie/`withCredentials: true` assumption. On a protected request returning 401, clear auth and navigate to `/login`; prevent redirect loops on login failures. Never log or expose tokens.

API success response follows `{ success, message, data, meta? }`; error follows `{ success: false, message, errors?: [{ field, message }] }`. `meta` is optional for non-paginated endpoints. Hooks/pages must extract `data` from the envelope consistently; field errors map to form inputs. Do not assume an endpoint returns a raw resource.

### 6.2 API call placement

- `features/<feature>/api/<feature>.api.js`: pure functions calling the shared Axios instance; no React imports.
- `features/<feature>/hooks/useX.js`: TanStack Query hooks/mutations and query key factories; call API functions here.
- `features/<feature>/pages/`: compose hooks with presentational UI; may invoke API functions when warranted by the older architecture, but hooks are preferred.
- `components/` and `features/<feature>/components/`: no Axios, fetch, or API calls.

### 6.3 Query and mutation rules

Use TanStack Query for server state, stable query key factories, and invalidate relevant keys after successful mutations. Search, filters, and pagination belong in URL search params when applicable. Render loading, error, and empty states; do not fake persisted changes in local state. Match query parameter names to verified backend contracts rather than inventing them.

## 7. Authentication (implemented backend contract)

The source of truth is `docs/modules/auth.md` (copied from backend `AUTH.md`). Endpoints are relative to `/api/v1`:

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Register BUYER or SELLER; **does not log in automatically** |
| POST | `/auth/login` | Returns `data.token` and `data.user` |
| GET | `/auth/profile` | Authenticated current user |
| PUT | `/auth/profile` | Update `name` and `phone` only |

JWT lifetime is 1 day; `AuthProvider` stores user/token, restores token from `localStorage` on reload, and retrieves profile as needed. Logout is **local only** (clear token/user, navigate to `/login`); there is no documented backend logout endpoint. `ProtectedRoute` supports optional `role="BUYER"` or `role="SELLER"`; unauthenticated users go to `/login`, wrong-role users return to their role homepage. After login, BUYER goes to `/`, SELLER goes to `/seller/dashboard`. After registration, show success and go to `/login`. Avoid redirecting before auth restoration completes.

Implement `features/auth/api/auth.api.js`, `hooks/useRegister.js`, `useLogin.js`, `useProfile.js`, `useUpdateProfile.js`, `context/AuthContext.jsx`, and auth pages; guards are defined in `app/guards/` and wired in `app/router.jsx`.

## 8. Forms and Validation

- Use React Hook Form with a Zod schema and `zodResolver`. Schemas live in the feature's `schemas.js`.
- Validation messages are Indonesian, short, and say how to fix the problem ("Email tidak valid", "Stok harus berupa bilangan bulat tidak negatif").
- Show field errors under the field (`design-system.md` section 6.2). Map `fieldErrors` from the API onto the matching fields.
- The submit button shows a loading state and is disabled while the request runs, to prevent double submits (this matters for checkout and payment).
- Destructive or irreversible actions (delete product, confirm order received) use `ConfirmDialog` before sending the request.
- Success feedback uses a toast whose text matches the action name, as in `design-system.md` section 11.

---

## 9. State Management

Keep state as close to where it is used as possible.

| Kind of state | Where it lives |
|---|---|
| Server data (products, cart, orders, reviews) | React Query |
| Auth and current user | `AuthProvider` (React Context) |
| Search, filters, pagination, active tab | URL search params |
| Form values | React Hook Form |
| Modal open/close, toggles, local UI | `useState` in the component |

The cart is stored on the server per buyer (items persist after login and across devices). The navbar cart count comes from the cart query.

Do not introduce a global store.

---

## 10. Constants and Formatting

### 10.1 Order status

Use backend enum values from `ARCHITECTURE.md` (not lowercase API draft values):

```js
export const ORDER_STATUS = {
  MENUNGGU_PEMBAYARAN: "MENUNGGU_PEMBAYARAN",
  DIBAYAR: "DIBAYAR",
  DIPROSES: "DIPROSES",
  DIKIRIM: "DIKIRIM",
  SELESAI: "SELESAI",
  DIBATALKAN: "DIBATALKAN",
};
```

Map these to Indonesian display labels in a shared constant; use `StatusBadge` for status colors. This is the architecture contract for modules still pending implementation verification.

### 10.2 Roles

```js
export const ROLES = { BUYER: "BUYER", SELLER: "SELLER" };
```

### 10.3 Formatting

Use native `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })` and `Intl.DateTimeFormat("id-ID", ...)` via helpers in `src/utils/`. Do not assume the exact numeric serialization of future money fields before their backend contracts are verified.

## 11. Environment and Configuration

`frontend-marketplace-tani/.env.example`:

```text
VITE_API_URL=http://localhost:3000/api/v1
```

- Only `VITE_` variables reach the browser. **Never put secret keys (Xendit secret key, database credentials, JWT secret) in the frontend.**
- Payment goes through the backend. The frontend only receives the Xendit invoice URL from the backend and redirects the browser to it.
- The backend configures Xendit success and failure redirect URLs to `<FRONTEND_URL>/checkout/result/:orderId` (see `sitemap-routes.md` section 3.9).
- Backend CORS must allow the frontend origin and the `Authorization` header; cookie credentials are not part of the current authentication contract.

---

## 12. Code Quality

- ESLint with the React and React Hooks rules. No unused variables or imports.
- Prettier for formatting, with `prettier-plugin-tailwindcss` to sort classes.
- Keep functions small and components focused. If a component grows past roughly 150 lines, split it.
- Comments explain **why**, not what. Do not leave TODO comments without a short reason.
- Handle edge cases from the SRS use cases (alternative flows A1, A2, ...) as they are implemented, not later.

---

## 13. Working Rules for AI Assistants

1. Before building any UI, read `design-system.md`. Before adding any route or guard, read `sitemap-routes.md`.
2. Do not invent API endpoints, response shapes, or fields. If something is missing from the verified backend module documentation, say so and propose it instead of guessing. For auth use `docs/modules/auth.md`; for other modules treat `api-contract.md` as a draft until backend verification.
3. Do not add dependencies outside the table in section 1 without asking.
4. Do not build anything from the "Out of Scope" list in `design-system.md` section 14.
5. Reuse components from section 4.1. If a needed component is missing, create it at the appropriate Atomic Design level with one component per folder.
6. Use tokens only. No hardcoded colors, radii, or font sizes.
7. All user-facing text is Indonesian. All code, comments, and file names are English.
8. When a task touches several pages, finish one page completely (all states, responsive, accessible) before starting the next.
9. After finishing a task, list which files were created or changed and which use cases (UC-xx) are now covered.

---

## 14. Decisions to Confirm

These choices are not specified in the SRS. They were made here to keep the frontend consistent. Change them if your plan differs.

1. **JavaScript (JSX), not TypeScript.** Simpler for a first full-stack project. Moving to TypeScript later is possible but changes the file extensions in section 3.
2. **Tailwind CSS v4** with tokens in CSS (`@theme`). Many online examples still show v3 (`tailwind.config.js`), so the "do not create `tailwind.config.js`" rule is stated explicitly.
3. **JWT Bearer authentication using `localStorage`**, as implemented by the backend `AUTH.md`. Do not switch to cookies without coordinating a backend change.
4. **Server-side cart.** The SRS says the system saves cart items, so the cart lives in the database, not in the browser.
5. **Radix UI primitives** for dialogs, dropdowns, and tabs, styled with our own tokens, instead of a full component library, so the look stays faithful to `design-system.md`.
