> **Synchronization note (2026-10-23):** For implemented Authentication, `docs/modules/auth.md` overrides older sitemap behavior. Canonical role redirects: BUYER `/`, SELLER `/seller/dashboard`; unauthorized role goes to its own role home. `/forbidden` remains a reserved route, not the default role-mismatch redirect. Routes for unimplemented features are specifications, not evidence of backend availability.

# Sitemap and Routes: Local Farmer Marketplace

This document defines every page, its URL, who can access it, and which SRS use case it fulfills. Do not invent pages or routes that are not listed here.

> **Language rule:** route paths and documentation are in English. User-facing labels (menu items, buttons, titles, messages) are in **Indonesian** and appear in quotes.

Related documents: `design-system.md` (visual rules), SRS (use cases UC-01 to UC-22).

---

## 1. Access Levels

| Level | Meaning |
|---|---|
| `public` | Anyone, logged in or not |
| `guest` | Only users who are **not** logged in (login, register). Logged-in users are redirected away |
| `buyer` | Logged in with the `BUYER` role |
| `seller` | Logged in with the `SELLER` role |
| `auth` | Any logged-in user, regardless of role |

Roles are enforced with Role-Based Access Control (RBAC), as stated in the SRS. The frontend guard is a convenience only. The backend must enforce the same rules on every endpoint.

---

## 2. Route Overview

### 2.1 Public and authentication

| Route | Page | Access | Use cases |
|---|---|---|---|
| `/` | Landing page | `public` | None (built last; see section 6) |
| `/register` | Registration | `guest` | UC-01 |
| `/login` | Login | `guest` | UC-02 |
| `/marketplace` | Product catalog and search | `public` | UC-04, UC-05 |
| `/products/:productId` | Product detail | `public` | UC-06 |
| `/farmers/:farmerId` | Farmer profile (public view) | `public` | UC-07 |

### 2.2 Buyer

| Route | Page | Access | Use cases |
|---|---|---|---|
| `/cart` | Shopping cart | `buyer` | UC-09 |
| `/checkout` | Checkout: recipient data and order summary | `buyer` | UC-10 |
| `/checkout/result/:orderId` | Payment result | `buyer` | UC-11 |
| `/orders` | Order history | `buyer` | UC-12 |
| `/orders/:orderId` | Order detail, status tracking, confirm received | `buyer` | UC-13, UC-14 |
| `/orders/:orderId/review/:productId` | Rating and review form | `buyer` | UC-15 |

### 2.3 Shared account

| Route | Page | Access | Use cases |
|---|---|---|---|
| `/profile` | Edit account profile | `auth` | UC-03 |

### 2.4 Seller

| Route | Page | Access | Use cases |
|---|---|---|---|
| `/seller/dashboard` | Overview (sales summary) | `seller` | UC-16 |
| `/seller/products` | Product list and stock | `seller` | UC-17, UC-18 |
| `/seller/products/new` | Add product | `seller` | UC-17 |
| `/seller/products/:productId/edit` | Edit product | `seller` | UC-17, UC-18 |
| `/seller/orders` | Incoming orders list | `seller` | UC-19 |
| `/seller/orders/:orderId` | Order detail and status actions | `seller` | UC-19, UC-20, UC-21 |
| `/seller/reviews` | Product reviews and average rating | `seller` | UC-22 |
| `/seller/farm-profile` | Manage farmer profile | `seller` | UC-08 |

### 2.5 System routes

| Route | Page | Access |
|---|---|---|
| `/forbidden` | 403, reserved system route (default role-mismatch redirects to the user's own role home per `docs/modules/auth.md`) | `auth` |
| `*` | 404, page not found | `public` |

---

## 3. Page Details

Each entry lists what the page shows and the states it must handle. All pages also handle loading, error, and success states as defined in `design-system.md` section 9.

### 3.1 Landing page: `/`

Built last, using the full landing page visual language from `design-system.md` section 8. It links to `/marketplace`, `/register`, and `/login`. Until it is built, `/` renders the Marketplace entry view (or redirects to `/marketplace` as a temporary implementation detail).

### 3.2 Registration: `/register` (UC-01)

- Fields: role choice (`BUYER` or `SELLER`), name, email, phone number, password.
- Validation (per `docs/modules/auth.md`): `name` required (2–100 chars), `email` valid format (max 100 chars), `phone` Indonesian format (`08…`, `628…`, or `+628…`, 10–15 digits), `password` min 8 chars containing letters and numbers, `role` `BUYER` or `SELLER`.
- Success: show "Registrasi berhasil" and redirect to `/login` (registration does **not** log in automatically).
- Errors: inline field errors from `errors[]` (400); "Email sudah terdaftar" on the email field when the email is taken (409).

### 3.3 Login: `/login` (UC-02)

- Fields: email, password.
- Success: store JWT token in `localStorage` and user in `AuthContext`; redirect by role (`BUYER` to `/`, `SELLER` to `/seller/dashboard`). If the user arrived via a protected route, return to that internal route (`?redirect=` or location state) only when the role is authorized; otherwise use the role home route.
- Error: generic `Alert` "Email atau password salah" (401), keeping the entered email intact.

### 3.4 Catalog and search: `/marketplace` (UC-04, UC-05)

- Search field (keyword) and optional category chips.
- Product grid using the product card from `design-system.md` section 6.3.
- Query parameters: `?q=<keyword>&category=<slug>&page=<n>`. Search state lives in the URL so results can be shared and the back button works.
- Empty keyword shows the full catalog (UC-05 A2).
- Empty states: "Belum ada produk yang tersedia." (no products at all), "Produk tidak ditemukan. Coba kata kunci lain." (no search result).

### 3.5 Product detail: `/products/:productId` (UC-06)

- Large photo, name, price and unit, stock, description, average rating and reviews, farmer info with link to `/farmers/:farmerId`, quantity selector, and "Tambah ke Keranjang".
- Out-of-stock products show "Stok habis" and a disabled add button.
- Unauthenticated buyer pressing "Tambah ke Keranjang": redirect to `/login?redirect=/products/:productId`.
- Seller viewing this page: the add-to-cart controls are hidden.
- Product not found or deleted (UC-06 A1): show the "not found" message inside the page layout, not the global 404.

### 3.6 Farmer profile: `/farmers/:farmerId` (UC-07)

- Farmer name, description, location, photo, and the list of that farmer's products.
- If the farmer has not completed their profile (UC-07 A1): show basic info and the product list only.

### 3.7 Cart: `/cart` (UC-09)

- List of items with photo, name, unit, farmer, price, quantity stepper, and remove button. Total price updates automatically.
- Stock is checked on every quantity change. Insufficient stock shows "Stok tidak mencukupi" and keeps the old quantity.
- Adding a product that is already in the cart increases its quantity (UC-09 A2).
- Empty cart: "Keranjang masih kosong." with a button to `/marketplace`.
- Primary action: "Checkout", which goes to `/checkout`.

### 3.8 Checkout: `/checkout` (UC-10)

Uses the checkout stepper from `design-system.md` section 6.6: **Keranjang → Data Penerima → Ringkasan → Pembayaran**.

- Entry requires at least one item in the cart. Otherwise redirect to `/cart`.
- On entry the system validates stock for all items. If any item is short, return to `/cart` with a message (UC-10 A1).
- Step "Data Penerima": recipient name, phone, address, optional order note.
- Step "Ringkasan": items, quantities, total, recipient data.
- Confirming creates the order with status "Menunggu Pembayaran", asks the backend for a Xendit invoice, then redirects the browser to the Xendit invoice URL (external page).
- If invoice creation fails, show an error and do not continue (UC-10 A2).

### 3.9 Payment result: `/checkout/result/:orderId` (UC-11)

This is the page Xendit sends the buyer back to after payment (success and failure redirect URLs both point here).

- The page **must read the order status from the backend** and must never trust query parameters or the redirect itself. The real status is set by the Xendit callback on the server.
- Possible displays:
  - "Dibayar": payment confirmed, with order summary and links to `/orders/:orderId` and `/marketplace`.
  - "Menunggu Pembayaran": callback not processed yet. Show a waiting state and re-check the status every few seconds for a short period, then show a manual refresh button.
  - "Dibatalkan": payment failed or expired. Explain that stock was not reduced and offer a link back to `/cart` to check out again (UC-11 A1).

### 3.10 Order history: `/orders` (UC-12)

- List of the buyer's orders: order number, date, total, status badge.
- Optional filter by status: `?status=<status-key>`.
- Empty state: "Belum ada pesanan."

### 3.11 Order detail: `/orders/:orderId` (UC-13, UC-14)

- Items, total, recipient data, current status, and the status history (Menunggu Pembayaran, Dibayar, Diproses, Dikirim, Selesai).
- When the status is "Dikirim": show "Konfirmasi Pesanan Diterima". Pressing it opens a confirmation modal. Confirming sets the status to "Selesai" (UC-14).
- When the status is "Selesai": each product in the order shows a "Beri ulasan" link to its review route, or "Sudah diulas" if the buyer already reviewed it.
- An order that does not exist or belongs to another buyer shows "Pesanan tidak ditemukan" (UC-13 A1).

### 3.12 Review form: `/orders/:orderId/review/:productId` (UC-15)

- Star rating (1 to 5, required) and a written review.
- Allowed only when the order status is "Selesai" and the buyer has not yet reviewed this product in this order. Otherwise show "Ulasan tidak dapat diberikan" with a link back to the order (UC-15 A1).
- Success: "Ulasan berhasil dikirim", then return to `/orders/:orderId`.

### 3.13 Profile: `/profile` (UC-03)

- Loads current user profile via `GET /auth/profile` and updates via `PUT /auth/profile`.
- Edit only `name` and `phone` number. `email` and `role` are read-only, as required by the implemented backend contract (`docs/modules/auth.md`).
- Success: show "Profil berhasil diperbarui".
- Cancel ("Batal") resets form values to initial profile data locally without sending any API request (UC-03 A2).
- Uses the buyer layout for Buyers and the seller layout for Sellers.

### 3.14 Seller Overview: `/seller/dashboard` (UC-16)

- Greeting with the farm name.
- Three summary cards: **Jumlah Pesanan**, **Total Pendapatan**, **Jumlah Produk** (see `design-system.md` section 6.9).
- Recent orders table (latest few rows) with a link to `/seller/orders`.
- With no sales data, all values show zero (UC-16 A1).

### 3.15 Seller products: `/seller/products` (UC-17, UC-18)

- Product grid with the stock indicator bar (`design-system.md` section 6.5), with a toggle to a table view.
- Filter tabs: "Semua", "Tersedia", "Stok habis". (The reference's Draft and Archived tabs are not used because the SRS has no such product states.)
- Per product: edit, delete, and quick stock update. Delete always asks for confirmation; cancelling keeps the product (UC-17 A3, A4).
- Stock update: whole non-negative number only. Stock 0 marks the product "Stok habis" so it cannot be bought (UC-18 A2).
- Primary button: "Tambah Produk", which goes to `/seller/products/new`.

### 3.16 Add and edit product: `/seller/products/new`, `/seller/products/:productId/edit` (UC-17)

- Fields: name, price, unit, stock, description, photo.
- The edit form is pre-filled. A seller can only open products they own; otherwise show "Produk tidak ditemukan".
- Success: show "Produk disimpan" and return to `/seller/products`.

### 3.17 Seller orders: `/seller/orders` (UC-19)

- Optional statistics row, search by order number or customer name, status filter, and the orders table with pagination (`design-system.md` section 6.8).
- Only orders that contain this seller's products are listed.
- Empty state: "Belum ada pesanan masuk."

### 3.18 Seller order detail: `/seller/orders/:orderId` (UC-19, UC-20, UC-21)

- Items, quantities, recipient data, order note, status, and status history.
- Status actions appear only for the matching status (see section 5): "Proses Pesanan" when the status is "Dibayar", "Tandai Dikirim" when it is "Diproses".
- Each change is recorded in the status history and triggers a notification to the buyer.
- A seller cannot cancel an order.

### 3.19 Seller reviews: `/seller/reviews` (UC-22)

- Average rating card at the top, then a list or table of reviews: product, rating, comment, date.
- Empty state: "Belum ada ulasan."

### 3.20 Manage farmer profile: `/seller/farm-profile` (UC-08)

- Form: farm name, description, location, photo. Pre-filled when a profile already exists.
- Success: "Profil berhasil disimpan." This data feeds the public page `/farmers/:farmerId`.

---

## 4. Layouts and Navigation

| Layout | Used by | Contents |
|---|---|---|
| `PublicLayout` | `/` | Landing navbar (pill) and footer |
| `AuthLayout` | `/login`, `/register` | Centered form on a clean background, logo, link to the other auth page |
| `MarketplaceLayout` | `/marketplace`, `/products/:id`, `/farmers/:id`, `/cart`, `/orders/*`, `/checkout/result/*`, `/profile` (buyer) | Top navbar with logo, search field, cart icon with item count, profile menu, footer |
| `CheckoutLayout` | `/checkout` | Simplified header (logo only) and the checkout stepper |
| `SellerLayout` | `/seller/*`, `/profile` (seller) | Left sidebar and a top header with the user menu |

**Marketplace navbar:** logo, search field, "Keranjang" (with count), "Pesanan", and a profile menu ("Profil", "Keluar"). When not logged in: "Masuk" and "Daftar" instead.

**Seller sidebar** (matches `design-system.md` section 6.10): "Overview" (`/seller/dashboard`), "Produk" (`/seller/products`), "Pesanan" (`/seller/orders`), "Ulasan" (`/seller/reviews`), "Profil Petani" (`/seller/farm-profile`). Account profile (`/profile`) and logout are in the user menu.

Add breadcrumbs only on seller detail and form pages (for example "Pesanan / #ORD-0012").

---

## 5. Route Guards and Redirect Rules

| Situation | Behavior |
|---|---|
| Not logged in, opens a `buyer`, `seller`, or `auth` route | Redirect to `/login` (preserving the intended destination for post-login redirect when authorized) |
| Logged in, opens `/login` or `/register` | Redirect by role: `BUYER` to `/`, `SELLER` to `/seller/dashboard` |
| Seller opens a buyer-only route (`/cart`, `/checkout`, `/orders/*`) | Redirect to `/seller/dashboard` (role home per `docs/modules/auth.md` section 6.1) |
| Buyer opens any `/seller/*` route | Redirect to `/` (role home per `docs/modules/auth.md` section 6.1) |
| Resource does not exist or is not owned by the user (product, order) | Show the in-page "not found" message, never reveal that it belongs to someone else |
| Token expired or invalid (`401` on protected request) | Clear the local session (`localStorage` token & user) and redirect to `/login` |
| Unknown URL | 404 page with a button back to `/marketplace` |

**Status actions by role** (single source for what each role may do to an order):

| Current status | Seller action | Buyer action |
|---|---|---|
| Menunggu Pembayaran | None | Pay through Xendit |
| Dibayar | "Proses Pesanan" | None |
| Diproses | "Tandai Dikirim" | None |
| Dikirim | None | "Konfirmasi Pesanan Diterima" |
| Selesai | None | "Beri ulasan" |
| Dibatalkan | None | Check out again from the cart |

Any action outside this table must be rejected by the backend, even if a request is sent manually.

---

## 6. Build Order

Suggested order for building pages, so each step can be tested with the previous ones:

1. `AuthLayout`, `/register`, `/login`, route guards, redirects.
2. `MarketplaceLayout`, `/marketplace`, `/products/:id`, `/farmers/:id`.
3. `/cart`, `/checkout`, `/checkout/result/:orderId`.
4. `/orders`, `/orders/:orderId`, `/orders/:orderId/review/:productId`.
5. `SellerLayout`, `/seller/dashboard`, `/seller/products` (and its form pages), `/seller/orders` (and detail), `/seller/reviews`, `/seller/farm-profile`.
6. `/profile`.
7. Landing page `/` last. Until then `/` renders the Marketplace entry view (or redirects to `/marketplace` as a temporary implementation detail).

---

## 7. Route Tree (React Router)

Reference structure for the router. `ProtectedRoute` (with optional `role="BUYER"` or `role="SELLER"`) and `GuestRoute` follow `docs/modules/auth.md` section 6.1 and `conventions.md` section 7.

```jsx
<Routes>
  <Route path="/" element={<LandingPage />} />

  <Route element={<GuestRoute />}>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
  </Route>

  <Route element={<MarketplaceLayout />}>
    <Route path="/marketplace" element={<CatalogPage />} />
    <Route path="/products/:productId" element={<ProductDetailPage />} />
    <Route path="/farmers/:farmerId" element={<FarmerProfilePage />} />

    <Route element={<ProtectedRoute role="BUYER" />}>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout/result/:orderId" element={<PaymentResultPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/orders/:orderId" element={<OrderDetailPage />} />
      <Route path="/orders/:orderId/review/:productId" element={<ReviewFormPage />} />
    </Route>
  </Route>

  <Route element={<ProtectedRoute role="BUYER" />}>
    <Route element={<CheckoutLayout />}>
      <Route path="/checkout" element={<CheckoutPage />} />
    </Route>
  </Route>

  <Route element={<ProtectedRoute role="SELLER" />}>
    <Route element={<SellerLayout />}>
      <Route path="/seller/dashboard" element={<SellerOverviewPage />} />
      <Route path="/seller/products" element={<SellerProductsPage />} />
      <Route path="/seller/products/new" element={<ProductFormPage />} />
      <Route path="/seller/products/:productId/edit" element={<ProductFormPage />} />
      <Route path="/seller/orders" element={<SellerOrdersPage />} />
      <Route path="/seller/orders/:orderId" element={<SellerOrderDetailPage />} />
      <Route path="/seller/reviews" element={<SellerReviewsPage />} />
      <Route path="/seller/farm-profile" element={<FarmProfilePage />} />
    </Route>
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/forbidden" element={<ForbiddenPage />} />
  </Route>

  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

`/profile` renders inside the layout that matches the logged-in role (`MarketplaceLayout` for Buyers, `SellerLayout` for Sellers). Handle this inside `ProfilePage` or with a small wrapper that chooses the layout by role.

---

## 8. Assumptions to Confirm

These points are not stated explicitly in the SRS. They were decided here so the frontend has a clear rule. Change them if the SRS or your plan differs.

1. **Catalog, product detail, and farmer profile are public.** UC-04 only requires the system to be accessible. Login is required from the cart onward (UC-09).
2. **Review form has its own route** instead of a modal, so it can be linked from the order detail page and tested on its own.
3. **Payment result is a separate page** (`/checkout/result/:orderId`) because Xendit redirects the buyer back to a URL after payment.
4. **Sellers cannot use buyer-only features** (cart, checkout, orders). A seller who wants to buy needs a separate Buyer account.
5. **Seller product filter tabs** are "Semua", "Tersedia", and "Stok habis", because the SRS has no draft or archived states.
