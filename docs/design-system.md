# Design System: Local Farmer Marketplace

This document is the visual source of truth for the whole frontend (React). Every color, size, and shape **must** use the tokens defined here. Do not hardcode values in components.

> **UI language:** The documentation is in English, but all user-facing text in the app (buttons, labels, statuses, messages) is written in **Indonesian**, following the SRS. Strings shown in quotes below are the exact Indonesian UI copy.

---

## 1. Visual Direction

**Character:** clean, spacious, premium, and warm. It should feel like a modern agritech product that is close to local farmers, not a crowded online shop and not a cold corporate site.

**Core principles**

1. **Green comes from only two places:** photography and one UI accent color (the dark green of the "+ Add" button). Everything else is neutral: white, very light grey, charcoal.
2. **Photos are the hero.** Farmer, field, and harvest photos get generous space. The UI around them stays quiet.
3. **Density follows function.** The landing page is very spacious. The marketplace is medium. The seller dashboard is the densest (tables and numbers).
4. **One primary action per area.** Only one solid green button stands out in each section of a screen.
5. **The farmer is the selling point.** The farmer's name and location always appear on product cards.

**Reference sources by area**

| Area | Reference | What to take |
|---|---|---|
| Landing page | Luckycharm | Typography, whitespace, pill navbar, pill buttons, photo style, neutral palette |
| Catalog, product detail, cart, checkout | Odaplace + vegetable cards | Card structure, detail layout, stepper, radio cards |
| Seller Overview | Mokopi | Greeting, summary cards, recent orders table, sidebar |
| Seller Orders, Reviews | SadaxCart | Compact stats, filters, pastel status badges, pagination |
| Seller Products | Fikri Store | Product card grid, stock indicator bar, filter tabs |

Colors from the references (Odaplace and Fikri orange, SadaxCart teal) are **not used**. Only structure and shapes are taken.

---

## 2. Color

### 2.1 Core palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary-600` | `#316339` | Main accent: primary buttons, active links, active icons, highlighted prices |
| `--color-primary-700` | `#285230` | Primary button hover/pressed |
| `--color-primary-800` | `#1F4025` | Text on light green backgrounds, dark hero areas |
| `--color-primary-100` | `#E1EEE3` | Active menu background, selected cards, light green badges |
| `--color-primary-50` | `#F1F7F2` | Row hover background, selected radio card background |
| `--color-ink` | `#22292F` | Primary text, pill navbar, landing charcoal buttons |
| `--color-ink-soft` | `#4B545B` | Secondary text (descriptions, form labels) |
| `--color-ink-muted` | `#6B747B` | Tertiary text (captions, placeholders, metadata) |
| `--color-border` | `#E4E7EA` | Card borders, inputs, table dividers |
| `--color-surface` | `#FFFFFF` | Cards, panels, inputs, main page background |
| `--color-canvas` | `#F6F7F8` | Dashboard page background, filter areas |
| `--color-media-bg` | `#EEEFF1` | Uniform background behind product photos |

The green `#316339` was sampled from the "+ Add" button in the vegetable card reference. Its contrast ratio against white is about 7:1, which is safe for both text and buttons.

### 2.2 Functional colors

| Token | Hex | Usage |
|---|---|---|
| `--color-danger-600` | `#D92D20` | Errors, delete, out of stock |
| `--color-danger-50` | `#FDE9E7` | Error badge and alert background |
| `--color-warning-600` | `#B7791F` | Warnings, low stock |
| `--color-warning-50` | `#FEF3C7` | Warning badge and alert background |
| `--color-info-600` | `#1D4ED8` | Information |
| `--color-info-50` | `#DBEAFE` | Info badge and alert background |
| `--color-star` | `#F5B400` | Rating stars |

### 2.3 Order status colors

Statuses follow the SRS (UC-13). Use the `StatusBadge` component only; never write status colors by hand.

| Status key | UI label | Background | Text | Style |
|---|---|---|---|---|
| `pending_payment` | "Menunggu Pembayaran" | `#FEF3C7` | `#92600A` | Pastel |
| `paid` | "Dibayar" | `#E1EEE3` | `#2A6B35` | Pastel |
| `processing` | "Diproses" | `#DBEAFE` | `#1D4ED8` | Pastel |
| `shipped` | "Dikirim" | `#E8E4FB` | `#5B3FC4` | Pastel |
| `completed` | "Selesai" | `#316339` | `#FFFFFF` | Solid |
| `cancelled` | "Dibatalkan" | `#FDE9E7` | `#B42318` | Pastel |

Badges are pill-shaped with a small colored dot to the left of the text. Color must never be the only indicator: the text label is always shown.

### 2.4 Color usage rules

- Maximum one solid green button per screen area. Other actions use outline or ghost buttons.
- Marketplace and landing page background: white. Dashboard page background: `--color-canvas`, with white panels on top.
- Do not use gradients as UI decoration. Gradients are only allowed as a thin dark overlay on photos so text stays readable.
- Do not use pure black `#000`. Use `--color-ink`.

---

## 3. Typography

**One font family: Manrope** (Google Fonts, weights 400, 500, 600, 700). Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.

Large headings use weight 600 with slightly tight letter-spacing. Numbers in tables and prices use `font-variant-numeric: tabular-nums` so they align.

### 3.1 Scale

| Token | Size / line height | Weight | Letter-spacing | Used for |
|---|---|---|---|---|
| `display` | 56 / 60 | 600 | -0.02em | Landing hero (desktop) |
| `h1` | 40 / 46 | 600 | -0.015em | Landing section titles |
| `h2` | 28 / 36 | 600 | -0.01em | Marketplace and dashboard page titles |
| `h3` | 22 / 30 | 600 | 0 | Large card titles, panel titles |
| `h4` | 18 / 26 | 600 | 0 | Small headings, product name on the detail page |
| `body-lg` | 18 / 28 | 400 | 0 | Landing intro paragraphs |
| `body` | 16 / 24 | 400 | 0 | Main body text |
| `body-sm` | 14 / 20 | 400 / 500 | 0 | Table text, form labels, product name on cards |
| `caption` | 12 / 16 | 500 | 0 | Metadata, small categories, badges |

On mobile: `display` drops to 36/42, `h1` to 30/36, `h2` to 24/32.

### 3.2 Rules

- Primary text uses `--color-ink`, supporting text `--color-ink-soft`, metadata `--color-ink-muted`.
- The contrast in size is the source of the premium feel: large headings next to small supporting text. Do not flatten sizes.
- Maximum paragraph line length is about 70 characters.
- Use sentence case for all labels and buttons. Do not use all caps for labels.
- Left-aligned by default. Centered only for the landing hero and empty states.

---

## 4. Spacing, Radius, Shadow

### 4.1 Spacing

4px base. Tokens: `1 = 4`, `2 = 8`, `3 = 12`, `4 = 16`, `5 = 20`, `6 = 24`, `8 = 32`, `10 = 40`, `12 = 48`, `16 = 64`, `24 = 96`.

| Context | Value |
|---|---|
| Product card padding | 12 (text area), photo goes edge to edge at the top |
| Dashboard panel padding | 20 to 24 |
| Gap between cards in a grid | 16 (mobile), 20 (desktop) |
| Gap between landing sections | 96 (desktop), 64 (mobile) |
| Gap between marketplace sections | 40 to 48 |

### 4.2 Radius

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | 8px | Inputs, marketplace and dashboard buttons, tabs |
| `--radius-md` | 12px | Product cards, summary cards, panels, tables |
| `--radius-lg` | 16px | Landing photos, large cards, modals |
| `--radius-xl` | 24px | Landing hero and large photo sections |
| `--radius-pill` | 9999px | Badges, landing navbar, landing buttons, rating pills, filter chips |

Photos always follow their card's radius. Do not use one radius for everything: the size hierarchy must be visible.

### 4.3 Shadow and border

The main style is a **thin border**, not shadows.

| Token | Value | Used for |
|---|---|---|
| `--shadow-none` | 1px border `--color-border` | Cards, panels, inputs (default) |
| `--shadow-hover` | `0 6px 20px rgba(34,41,47,0.08)` | Product card on hover |
| `--shadow-overlay` | `0 12px 32px rgba(34,41,47,0.14)` | Dropdowns, modals, toasts |

### 4.4 CSS tokens

```css
:root {
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

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  --shadow-hover: 0 6px 20px rgba(34, 41, 47, 0.08);
  --shadow-overlay: 0 12px 32px rgba(34, 41, 47, 0.14);

  --font-sans: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

---

## 5. Layout and Breakpoints

**Mobile-first.**

| Breakpoint | Width | Product grid |
|---|---|---|
| `sm` | ≥ 640px | 2 columns |
| `md` | ≥ 768px | 3 columns |
| `lg` | ≥ 1024px | 4 columns |
| `xl` | ≥ 1280px | 4 columns, wider container |

- Maximum container width is 1200px, with 16px side padding (mobile) and 24px (tablet and up).
- The landing page uses a 1200px container for content and a full-width hero photo.
- Seller dashboard: fixed 240px left sidebar, content on the right. Below `lg`, the sidebar becomes a drawer opened from a menu button.
- Wide tables may scroll horizontally inside their own container. The page itself must never scroll sideways.

---

## 6. Base Components

### 6.1 Buttons

| Variant | Appearance | Used for |
|---|---|---|
| Primary | `--color-primary-600` background, white text, hover `--color-primary-700` | Main action: add, checkout, pay, save |
| Secondary | White background, `--color-border` border, `--color-ink` text | Supporting actions: cancel, view details |
| Charcoal | `--color-ink` background, white text, pill shape with an arrow icon | Landing page CTAs only |
| Ghost | No background, `--color-ink-soft` text, `--color-canvas` background on hover | Tertiary actions, icons in tables |
| Danger | `--color-danger-600` background, white text | Delete confirmation |

Sizes: height 36 (small), 44 (default), 52 (large, landing and checkout). Radius `--radius-sm` in the marketplace and dashboard, `--radius-pill` on the landing page. The "Tambah" button on product cards is small, with a plus icon and text.

Required states: hover, focus (2px ring in `--color-primary-600` with a 2px offset), disabled (50% opacity, no pointer), and loading (spinner inside the button, text stays).

### 6.2 Inputs and forms

- Height 44, radius `--radius-sm`, 1px `--color-border` border, white background.
- Focus: `--color-primary-600` border and a `--color-primary-100` outer ring.
- Error: `--color-danger-600` border, 12px red error message below the input.
- Label above the input, 14px weight 500, `--color-ink-soft`. Placeholder uses `--color-ink-muted`.
- Search field: magnifier icon on the left, pill shape in the marketplace navbar.

### 6.3 Product card (marketplace)

Structure from top to bottom:

1. **Photo area**, 1:1 ratio, `--color-media-bg` background, `object-fit: cover`, `--radius-md` on the top corners. A small "Organik" badge in the top-left corner when the product is organic.
2. **Category** (caption, `--color-ink-muted`), e.g. "Sayuran".
3. **Product name with unit** (body-sm, weight 600, max 2 lines), e.g. "Cabai Merah, 500 g".
4. **Farmer and location** (caption, `--color-ink-soft`) with a small pin icon. The farmer name is clickable and links to the farmer profile (UC-07).
5. **Bottom row:** price on the left (body-sm, weight 700, `--color-ink`), small primary "Tambah" button on the right.
6. **Rating:** small yellow pill with a star and number, next to the text "Terjual 120".

Card: white background, 1px border, `--radius-md`. On hover: `--shadow-hover` and a slightly darker border. Products with stock 0 show a faded photo, the label "Stok habis", and a disabled "Tambah" button.

### 6.4 Badges and chips

- **Status and label badges:** pill, height 24, caption text weight 600, colored dot on the left.
- **Rating pill:** `--color-star` background, `--color-ink` text, filled star icon.
- **Filter chips:** pill, `--color-border` border, white background. Active: `--color-primary-100` background, `--color-primary-800` text.

### 6.5 Stock indicator bar

A thin 4px rounded bar on seller product cards.

| Condition | Color | Label |
|---|---|---|
| High stock | `--color-primary-600` | "210 stok" |
| Low stock (≤ 10) | `--color-warning-600` | "8 stok · menipis" |
| Out of stock (0) | `--color-danger-600` | "Stok habis" |

### 6.6 Checkout stepper

Horizontal breadcrumb: **Keranjang → Data Penerima → Ringkasan → Pembayaran**. The active step uses `--color-ink` text at weight 600. Completed steps show a green check icon. Upcoming steps use `--color-ink-muted`. Separators are small arrow icons.

The system has no shipping or courier step and no credit card form. Payment happens on the Xendit invoice page.

### 6.7 Radio / choice cards

Used for exclusive choices (for example, product unit). 1px border, `--radius-md`, 16 padding. Selected: `--color-primary-600` border, `--color-primary-50` background, green radio. Do not use orange or peach as in the original references.

### 6.8 Tables (dashboard)

- Table header uses `--color-canvas` background and caption text at weight 600 in `--color-ink-soft`.
- Rows are 56 to 64 high, with `--color-border` dividers and `--color-primary-50` on hover.
- Small 40×40 product photo with radius 8 in the first column.
- Action column on the right: small secondary "Detail" button and an optional three-dot menu.
- Below the table: pagination with "Sebelumnya" and "Berikutnya" buttons; the active page number has a `--color-primary-100` background.
- Above the table: a search field, a status filter dropdown, and (optionally) a date range.

### 6.9 Summary cards (Overview)

Three cards side by side, per UC-16: **Jumlah Pesanan**, **Total Pendapatan**, **Jumlah Produk**. Each card holds an icon in a `--color-primary-100` circle, a label (caption), a large number (h2, tabular), and an optional change badge. On the Orders page, the stats are just a compact row of numbers without boxes, separated by thin vertical lines.

### 6.10 Seller sidebar

240 wide, white background, 1px right border. Logo on top, then the menu: **Overview, Produk, Pesanan, Ulasan, Profil Petani**. The active item uses a `--color-primary-100` background, `--color-primary-800` text, and a green icon. Other items use `--color-ink-soft`. The user profile and logout button sit at the bottom.

---

## 7. Photography and Image Style

- **Product photos:** 1:1 ratio, `object-fit: cover`, `--color-media-bg` as a fallback before the photo loads. Give sellers upload hints: use a square photo, product centered, bright light.
- **Landing photos:** authentic photography. Aerial shots of wide fields, close-ups of farmers' hands, fresh harvests, farmers' faces. Avoid overly sterile stock photos.
- **Placeholder without a photo:** `--color-media-bg` background with a grey leaf icon.
- **Farmer avatar:** circle with a photo, falling back to initials on a `--color-primary-100` background.

---

## 8. Landing Page Visual Language

Used on the landing page only, not in the marketplace or dashboard:

- A floating pill navbar at the top center, `--color-ink` background, white text, active item with a white background.
- Large centered hero heading with a small badge with a green dot above it.
- Four-point star icons and thin vertical dashed lines as subtle decoration around the hero.
- Full-width hero photo with large rounded corners.
- A four-column stats row below the hero (large number, small label).
- A photo grid with `--radius-lg` in the farmer story section.
- Charcoal pill buttons with an arrow icon.

Statistics on the landing page must reflect the real state of the system (number of farmers, products, orders). Do not use large corporate-style numbers that do not fit the scale of a local marketplace.

---

## 9. UI States

Every list or data page must handle four states.

| State | Appearance |
|---|---|
| Loading | Grey skeleton (`--color-media-bg`) shaped like the real content. Avoid full-screen spinners |
| Empty | A simple icon, a short title, one guiding sentence, and one action button if relevant |
| Error | `--color-danger-50` alert explaining the problem, with a "Coba lagi" button |
| Success | Toast at the top right, auto-dismisses after 4 seconds, uses the same action name as its button |

Empty state copy, per the SRS:

| Page | UI message |
|---|---|
| Catalog | "Belum ada produk yang tersedia." |
| Search results | "Produk tidak ditemukan. Coba kata kunci lain." |
| Cart | "Keranjang masih kosong." |
| Order history | "Belum ada pesanan." |
| Incoming orders (seller) | "Belum ada pesanan masuk." |
| Reviews (seller) | "Belum ada ulasan." |

---

## 10. Seller Order Actions by Status

Action buttons in the seller order table and detail page appear only for the matching status (UC-20, UC-21). Sellers have no action to cancel an order.

| Status | Action shown |
|---|---|
| `pending_payment` | None |
| `paid` | "Proses Pesanan" |
| `processing` | "Tandai Dikirim" |
| `shipped` | None (waiting for buyer confirmation) |
| `completed` | None |
| `cancelled` | None |

On the buyer side, the "Konfirmasi Pesanan Diterima" button appears only when the status is `shipped` (UC-14). This action always asks for confirmation in a modal before running.

---

## 11. Language and Writing (UI Copy)

- **UI language is Indonesian**, with a friendly and direct tone. Sentence case for all interface text.
- **Currency:** Rupiah in the format `Rp 15.000` (dot as thousands separator, no decimals).
- **Units:** a space between number and unit, e.g. `500 g`, `1 kg`.
- **Dates:** `23 Okt 2026`.
- **Action names stay consistent across a flow.** The button "Simpan produk" produces the toast "Produk disimpan". The button "Proses pesanan" produces the toast "Pesanan diproses".
- **Buttons name the outcome:** "Tambah ke Keranjang", "Bayar Sekarang", "Simpan produk". Avoid "Submit" or "OK".
- **Error messages** explain the problem and how to fix it, without excessive apology. Example: "Stok tidak mencukupi. Kurangi jumlah atau pilih produk lain."

---

## 12. Motion

Use sparingly.

- UI transitions: 150 to 200 ms, `ease-out`, only for hover, focus, dropdown open/close, and modals.
- No entrance animation on every section and no decorative animation that runs on its own.
- One permitted exception: a single subtle reveal on the landing hero.
- Respect `prefers-reduced-motion`: disable all non-essential transitions.

---

## 13. Accessibility

- Text contrast at least 4.5:1. Do not use `--color-ink-muted` for important text on grey backgrounds.
- Keyboard focus is always visible (2px green ring).
- Minimum touch target of 44×44 px on mobile.
- Status colors are always paired with a text label.
- All images have `alt` text. Product photos use the product and farmer name.
- Forms use `label` elements linked to inputs, and error messages are linked with `aria-describedby`.

---

## 14. Out of Scope (Do Not Build)

Elements from the reference images that are **not** in the SRS and must not be added unless requested:

- Courier options (DHL, FedEx, JNE) and a Shipping step in checkout.
- Credit card or PayPal forms. Payment goes only through the Xendit page.
- Wishlist (heart icon), strikethrough discounts, and savings labels.
- Dark mode and theme toggle.
- Dashboard: Customers, Analytics Report, Advance Settings, Live Orders, Top Selling Items, performance gauge.
- Seller products: SKU, wholesale pricing, dropshipping, bundles, license keys.
- Seller orders: manual add-order button, cancel-order button, Inbox, Promotion.
- Complex marketplace filter sidebar (supplier type, minimum order). Filtering is just keyword search and, if needed, category chips.

---

## 15. Pre-Completion Checklist for Every Page

- [ ] All colors, radii, and fonts use tokens, with no hardcoded values.
- [ ] Only one primary green button per screen area.
- [ ] All four states (loading, empty, error, success) are handled.
- [ ] Text uses Indonesian UI copy, Rupiah, and status terms from the SRS.
- [ ] No elements from the "Out of Scope" list.
- [ ] Checked at mobile, tablet, and desktop widths.
- [ ] Keyboard focus and color contrast checked.
