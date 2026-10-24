---
name: auth-frontend
description: Implementasi frontend Authentication sesuai backend
---

# Auth Frontend

## Kapan digunakan
Untuk UC-01 Registrasi, UC-02 Login, UC-03 Edit Profil, session dan route guard.

## Sumber wajib
`docs/modules/auth.md` (bagian 1, 2, 4, 6, 7), `AGENTS.md`, `ARCHITECTURE.md`.

## Prosedur
1. Gunakan `features/auth/api/auth.api.js` untuk register/login/getProfile/updateProfile.
2. Gunakan `features/auth/hooks/` dengan TanStack Query; `context/AuthContext.jsx` untuk sesi.
3. `POST /api/v1/auth/register`: `name,email,phone,password,role`; sukses menuju `/login` tanpa auto-login.
4. `POST /api/v1/auth/login`: `email,password`; baca `data.token` dan `data.user`.
5. JWT disimpan `localStorage` sesuai kontrak saat ini; request terproteksi memakai `Authorization: Bearer <token>`. Tidak ada refresh token maupun endpoint logout backend.
6. BUYER → `/`; SELLER → `/seller/dashboard`; route `/profile` memerlukan login.
7. `PUT /api/v1/auth/profile` hanya `name,phone`; email/role immutable.
8. Jangan logout otomatis untuk error 401 dari request login publik; tangani 401 sesi pada request terlindungi.
9. Form UI presentational; error 400 `errors[]`, 409 email duplikat, 401 login generik; jangan tampilkan token.
10. Uji skenario frontend dalam `docs/modules/auth.md` dan laporkan status E2E terpisah.

## Keamanan
Hindari XSS, jangan log token, jangan simpan password.
