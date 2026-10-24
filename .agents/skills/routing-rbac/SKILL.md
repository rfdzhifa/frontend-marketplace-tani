---
name: routing-rbac
description: Menjaga routing dan akses BUYER/SELLER
---

# Routing and RBAC

## Kapan digunakan
Saat membuat routes, redirects, protected pages, atau menu berdasarkan role.

## Sumber wajib
`docs/modules/auth.md`, `docs/sitemap-routes.md`, `ARCHITECTURE.md`.

## Prosedur
1. Gunakan React Router di `src/app/router.jsx`; guard reusable di `src/app/guards/` atau modul auth sesuai arsitektur.
2. `/register` dan `/login` publik; jika sudah login arahkan ke beranda sesuai role.
3. `/profile` hanya pengguna login.
4. BUYER → `/`; SELLER → `/seller/dashboard`.
5. Jika belum login pada protected route → `/login`; role salah → beranda sesuai role.
6. UI guard hanya UX; backend tetap wajib menegakkan authorization.
7. Jika sitemap bertentangan dengan auth backend teruji, tandai konflik dan ikuti `docs/modules/auth.md`.
