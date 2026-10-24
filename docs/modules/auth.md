# Authentication — Kontrak Frontend (UC-01, UC-02, UC-03)

> Sumber kebenaran: `backend/docs/modules/auth.md` (`AUTH.md`). Disalin dari bagian 1, 2, 4, 6, dan 7. Jika kontrak backend berubah, sinkronkan dokumen ini terlebih dahulu.
> Semua endpoint relatif terhadap base path `/api/v1`.

## 1. Tujuan & Use Case

Mengelola pendaftaran akun, login, dan edit profil. Pengguna memilih peran **BUYER** atau **SELLER**. Akses fitur dibatasi dengan RBAC.

| UC | Nama | Aktor | Endpoint |
|---|---|---|---|
| UC-01 | Registrasi | Buyer, Seller | `POST /auth/register` |
| UC-02 | Login | Buyer, Seller | `POST /auth/login` |
| UC-03 | Edit Profil | Buyer, Seller | `GET /auth/profile`, `PUT /auth/profile` |

Acuan SRS: bagian 3.1 (Tabel 1 s.d. 3) dan activity diagram 3.1.3.

---

## 2. Aturan Bisnis

1. Email bersifat unik dan tidak case-sensitive (disimpan lowercase).
2. Password minimal 8 karakter, mengandung huruf dan angka, disimpan sebagai hash bcrypt (cost 10). Hash tidak pernah dikembalikan di response.
3. Role hanya `BUYER` atau `SELLER`, dipilih saat registrasi, dan **tidak bisa diubah** setelahnya.
4. Registrasi **tidak** otomatis login; pengguna diarahkan ke halaman login (UC-01 langkah 8).
5. Pesan login gagal sengaja **generik** ("Email atau password salah"), tidak membedakan email tidak ada atau password salah.
6. Setelah login, redirect berdasarkan role: BUYER ke `/` (Marketplace), SELLER ke `/seller/dashboard`.
7. Edit profil hanya mengubah `name` dan `phone`. Email dan role tidak dapat diubah.
8. Profil petani (nama usaha, lokasi, foto) **bukan** bagian modul ini; dikelola di modul Farmer Profile.

**Keputusan teknis (ubah di sini bila berbeda):**
- Token: JWT, masa berlaku 1 hari, payload `{ sub: userId, role }`.
- Penyimpanan token di frontend: `localStorage`, dikirim lewat header `Authorization: Bearer <token>`.
- Belum ada refresh token, lupa password, dan verifikasi email (di luar SRS).

---

## 4. API

Base path: `/api/v1`. Format response mengikuti `ARCHITECTURE.md`.

### 4.1 POST `/auth/register` — publik (UC-01)

Request body:

```json
{
  "name": "Budi Santoso",
  "email": "budi@mail.com",
  "phone": "081234567890",
  "password": "rahasia123",
  "role": "SELLER"
}
```

Validasi:

| Field | Aturan |
|---|---|
| `name` | wajib, 2 s.d. 100 karakter |
| `email` | wajib, format email valid, maks 100 karakter |
| `phone` | wajib, format nomor Indonesia (`08…`, `628…`, atau `+628…`), 10 s.d. 15 digit |
| `password` | wajib, min 8 karakter, mengandung huruf dan angka |
| `role` | wajib, `BUYER` atau `SELLER` |

Response `201`:

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": { "id": 1, "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "role": "SELLER" }
}
```

Error:

| Kode | Kondisi | Rujukan |
|---|---|---|
| 400 | Data tidak lengkap / format tidak valid (`errors[]` per field) | UC-01 A1 |
| 409 | Email sudah terdaftar | UC-01 A2 |

### 4.2 POST `/auth/login` — publik (UC-02)

Request body:

```json
{ "email": "budi@mail.com", "password": "rahasia123" }
```

Response `200`:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "role": "SELLER" }
  }
}
```

Error:

| Kode | Kondisi | Rujukan |
|---|---|---|
| 400 | Email/password kosong atau format email salah | — |
| 401 | Email atau password salah (pesan generik) | UC-02 A1 |

### 4.3 GET `/auth/profile` — login, semua role (UC-03)

Header: `Authorization: Bearer <token>`

Response `200`:

```json
{
  "success": true,
  "message": "Berhasil",
  "data": { "id": 1, "name": "Budi Santoso", "email": "budi@mail.com", "phone": "081234567890", "role": "SELLER" }
}
```

Error: `401` token tidak ada / tidak valid / kedaluwarsa.

### 4.4 PUT `/auth/profile` — login, semua role (UC-03)

Request body:

```json
{ "name": "Budi S.", "phone": "081298765432" }
```

Validasi: `name` dan `phone` mengikuti aturan registrasi. Field lain (`email`, `role`) diabaikan/ditolak.

Response `200`:

```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "data": { "id": 1, "name": "Budi S.", "email": "budi@mail.com", "phone": "081298765432", "role": "SELLER" }
}
```

Error: `400` data tidak valid (UC-03 A1), `401` tidak terautentikasi.

> UC-03 A2 (batal ubah profil) adalah perilaku frontend: tidak ada request yang dikirim.

---

## 6. Frontend

### 6.1 Route & halaman

| Route | Halaman | Akses | Rujukan |
|---|---|---|---|
| `/register` | `RegisterPage` | Publik (redirect jika sudah login) | UC-01 |
| `/login` | `LoginPage` | Publik (redirect jika sudah login) | UC-02 |
| `/profile` | `ProfilePage` | Login (semua role) | UC-03 |

Perilaku:
- Register sukses: toast/pesan berhasil, lalu pindah ke `/login`.
- Login sukses: simpan token + user di `AuthProvider`, redirect sesuai role (aturan bisnis 6).
- Logout: hapus token dan user, kembali ke `/login`.
- `ProtectedRoute` (`role` opsional) dibuat di modul ini dan dipakai semua modul lain. Belum login: ke `/login`. Role tidak sesuai: ke halaman beranda sesuai role.

### 6.2 Komponen (atomic design)

| Level | Komponen | Lokasi | Catatan |
|---|---|---|---|
| Atoms | `Button`, `Input`, `Label`, `Spinner`, `Alert` | `components/atoms/` | Dipakai ulang modul lain |
| Molecules | `FormField` (Label + Input + pesan error), `RoleSelector` (pilihan Buyer/Seller) | `components/molecules/` (`FormField`), `features/auth/components/` (`RoleSelector`) | `RoleSelector` khusus auth |
| Organisms | `RegisterForm`, `LoginForm`, `ProfileForm` | `features/auth/components/` | Menerima `onSubmit`, `isLoading`, `errors` via props |
| Templates | `AuthLayout` (kartu di tengah halaman) | `components/templates/` | Untuk login & register |
| Pages | `RegisterPage`, `LoginPage`, `ProfilePage` | `features/auth/pages/` | Menyambungkan hook ke organism |

Organisms hanya menampilkan form dan memanggil callback; **pemanggilan API ada di hooks**.

### 6.3 API, hooks, dan state

```text
features/auth/
├── api/auth.api.js          # register(), login(), getProfile(), updateProfile()
├── hooks/
│   ├── useRegister.js       # useMutation
│   ├── useLogin.js          # useMutation + set auth + redirect
│   ├── useProfile.js        # useQuery
│   └── useUpdateProfile.js  # useMutation + invalidate profile
├── context/AuthContext.jsx  # { user, token, login(), logout(), isAuthenticated }
└── index.js
```

`httpClient` menambahkan header `Authorization` dari token, dan pada respons `401` memanggil logout lalu mengarahkan ke `/login`.

### 6.4 Kondisi UI

| Halaman | Loading | Error | Empty / lainnya |
|---|---|---|---|
| Register | Tombol Daftar disabled + spinner | Error per field dari `errors[]`; 409 tampil di field email | — |
| Login | Tombol Login disabled + spinner | `Alert` "Email atau password salah" | — |
| Profile | Skeleton/spinner saat memuat | `Alert` jika gagal memuat | Tombol Batal mengembalikan nilai awal tanpa request (UC-03 A2) |

---

## 7. Skenario Test

**Backend (service/API):**

| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Register data valid (BUYER dan SELLER) | 201, user tersimpan, `password_hash` bukan plaintext, tidak ada hash di response |
| 2 | Register field kosong / email tidak valid / password lemah | 400 dengan `errors[]` |
| 3 | Register email sudah terdaftar (beda huruf besar/kecil) | 409 |
| 4 | Register dengan `role` di luar enum | 400 |
| 5 | Login kredensial benar | 200, token valid, `user` tanpa hash |
| 6 | Login password salah / email tidak terdaftar | 401, pesan sama persis |
| 7 | GET profile tanpa token / token rusak / kedaluwarsa | 401 |
| 8 | GET profile dengan token valid | 200, data milik user itu |
| 9 | PUT profile valid | 200, data terbarui; `email` dan `role` tidak berubah |
| 10 | PUT profile data tidak valid | 400 |
| 11 | `authorize('SELLER')` diakses BUYER | 403 |

**Frontend (manual/komponen):**

| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Register sukses | Pindah ke `/login` dengan pesan berhasil |
| 2 | Register email duplikat | Error tampil di field email, form tidak hilang |
| 3 | Login BUYER | Redirect ke `/` |
| 4 | Login SELLER | Redirect ke `/seller/dashboard` |
| 5 | Login gagal | Alert tampil, input tetap terisi email |
| 6 | Buka `/profile` tanpa login | Redirect ke `/login` |
| 7 | BUYER membuka `/seller/dashboard` | Ditolak, diarahkan ke `/` |
| 8 | Edit profil lalu Simpan / Batal | Simpan: data berubah; Batal: tidak ada request |
| 9 | Token kedaluwarsa saat memakai aplikasi | Otomatis logout ke `/login` |
| 10 | Refresh halaman saat sudah login | Sesi tetap (token dibaca dari `localStorage`) |
