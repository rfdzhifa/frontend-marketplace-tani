# Modul: Marketplace (Frontend)

> Letakkan di **repo frontend** sebagai `docs/modules/marketplace.md`.
> Dokumen ini berdiri sendiri: berisi kontrak API (salinan dari spec backend), perilaku UI, komponen, dan skenario test.
> Jika kontrak API di sini berbeda dengan `docs/modules/marketplace.md` di repo backend, **repo backend yang benar**.
> Bergantung pada modul Auth (`docs/modules/auth.md`): memakai `AuthContext`, `httpClient`, dan atom `Button`, `Input`, `Spinner`, `Alert`.

---

## 1. Tujuan & Use Case

Buyer (dan pengunjung yang belum login) dapat melihat katalog produk, mencari produk, dan membuka detail produk. Modul ini hanya **menampilkan** data; keranjang, profil petani, dan ulasan adalah modul lain.

| UC | Nama | Route | Endpoint backend |
|---|---|---|---|
| UC-04 | Melihat Katalog Produk | `/` | `GET /products` |
| UC-05 | Mencari Produk | `/?search=...` | `GET /products?search=` |
| UC-06 | Melihat Detail Produk | `/products/:id` | `GET /products/:id` |

Acuan SRS: bagian 3.2 (Tabel 4 s.d. 6) dan activity diagram 3.2.3.

## 2. Aturan UI

1. Kedua halaman **publik**. Tidak dibungkus `ProtectedRoute`.
2. Pencarian dijalankan lewat tombol **Cari** atau Enter (bukan live search), sesuai SRS.
3. State pencarian disimpan di query string: `/?search=cabai&page=2`. Refresh dan share link harus memulihkan kondisi yang sama. Mengirim pencarian baru mengembalikan `page` ke 1.
4. `page` di URL yang tidak valid (bukan angka, < 1) dianggap 1. Jika `page` melebihi `meta.totalPages` (dan `totalPages > 0`), pindah ke halaman terakhir.
5. Kolom pencarian kosong lalu Cari: hapus param `search` dan tampilkan seluruh katalog.
6. Produk `isAvailable = false` tetap tampil dengan badge "Stok habis"; tombol beli nonaktif.
7. Harga diformat rupiah: `Rp45.000` dengan satuan `/kg` (`Intl.NumberFormat('id-ID')`, tanpa desimal).
8. `reviewCount = 0` menampilkan teks "Belum ada rating", bukan bintang kosong dengan angka 0.
9. `imageUrl` kosong atau gagal dimuat (`onError`) menampilkan placeholder gambar, tanpa layout bergeser (gunakan rasio tetap, mis. 4:3).
10. Tombol **Tambah ke Keranjang**:
    - Belum login: arahkan ke `/login`.
    - Login sebagai SELLER: tombol nonaktif dengan keterangan "Hanya akun pembeli yang dapat membeli".
    - Login sebagai BUYER dan produk tersedia: panggil `onAddToCart({ productId, quantity })` dari props. Sampai modul Shopping Cart jadi, handler default menampilkan pesan "Fitur keranjang segera hadir".
11. Detail produk punya pemilih jumlah (min 1, maks `stock`). Tombol +/- berhenti di batas.
12. Nama petani menjadi link ke `/farmers/:id` hanya jika `FARMER_PROFILE_ENABLED = true` di `features/marketplace/config.js` (default `false`, tampil sebagai teks biasa). Ubah ke `true` setelah modul Farmer Profile jadi.
13. Teks antarmuka berbahasa Indonesia, kalimat biasa (sentence case), tombol memakai kata kerja ("Cari", "Tambah ke keranjang").

## 3. Kontrak API (salinan dari backend)

Base path: `/api/v1`. Semua response berbentuk `{ success, message, data, meta? }`. Error validasi: `{ success: false, message, errors: [{ field, message }] }`.

### 3.1 GET `/products`

Query (opsional): `search` (string, maks 100), `page` (>= 1, default 1), `limit` (1 s.d. 50, default 12).

```json
{
  "success": true,
  "message": "Berhasil",
  "data": [
    {
      "id": 1,
      "name": "Cabai Merah",
      "price": 45000,
      "unit": "kg",
      "stock": 25,
      "isAvailable": true,
      "imageUrl": "https://.../cabai.jpg",
      "avgRating": 4.5,
      "reviewCount": 8,
      "seller": { "id": 2, "name": "Petani Budi" }
    }
  ],
  "meta": { "page": 1, "limit": 12, "total": 30, "totalPages": 3 }
}
```

Katalog kosong atau tanpa hasil pencarian: `data: []`, `meta.total: 0`, `meta.totalPages: 0` (bukan error). Item list tidak memuat `description`. Error: `400` jika `page`/`limit`/`search` tidak valid.

### 3.2 GET `/products/:id`

```json
{
  "success": true,
  "message": "Berhasil",
  "data": {
    "id": 1,
    "name": "Cabai Merah",
    "description": "Cabai merah segar dipanen pagi hari.",
    "price": 45000,
    "unit": "kg",
    "stock": 25,
    "isAvailable": true,
    "imageUrl": "https://.../cabai.jpg",
    "avgRating": 4.5,
    "reviewCount": 8,
    "seller": { "id": 2, "name": "Petani Budi" },
    "reviews": []
  }
}
```

Error: `400` id tidak valid, `404` produk tidak ada atau sudah dihapus. `reviews` sementara selalu `[]`; tampilkan "Belum ada ulasan" bila kosong. Bentuk item ulasan akan ditentukan modul Review & Rating, jadi jangan mengasumsikan field-nya.

## 4. Struktur file

```text
src/features/marketplace/
├── api/marketplace.api.js          # getProducts({ search, page, limit }), getProductById(id)
├── hooks/
│   ├── useProducts.js              # useQuery ['products', { search, page }], placeholderData: keepPreviousData
│   └── useProduct.js               # useQuery ['product', id]
├── components/
│   ├── SearchBar.jsx               # molecule
│   ├── ProductCard.jsx             # molecule
│   ├── QuantityStepper.jsx         # molecule
│   ├── ProductGrid.jsx             # organism
│   ├── Pagination.jsx              # organism
│   └── ProductDetailInfo.jsx       # organism
├── pages/
│   ├── MarketplacePage.jsx
│   └── ProductDetailPage.jsx
├── utils/formatPrice.js            # formatRupiah(number)
├── config.js                       # FARMER_PROFILE_ENABLED = false
└── index.js

src/components/
├── atoms/       # tambah: Badge, Skeleton, ImageWithFallback (Button, Input, Spinner, Alert sudah ada dari Auth)
├── molecules/   # tambah: RatingStars, PriceTag
└── templates/   # tambah: MainLayout (bila belum ada)
```

Periksa dulu apa yang sudah ada dari modul Auth; **pakai ulang, jangan duplikasi**. Daftarkan route `/` dan `/products/:id` di router utama (di dalam `MainLayout`). Jika `/` sebelumnya placeholder dari Auth, gantikan dengan `MarketplacePage`.

## 5. Komponen

Atomic design. Organism hanya menampilkan data dan memanggil callback; **pemanggilan API hanya di hooks**.

| Level | Komponen | Props utama | Catatan |
|---|---|---|---|
| Atom | `Badge` | `children`, `tone` | Untuk "Stok habis" |
| Atom | `Skeleton` | `className` | Untuk loading grid dan detail |
| Atom | `ImageWithFallback` | `src`, `alt`, `ratio` | Placeholder saat `src` kosong atau `onError`; rasio tetap |
| Molecule | `RatingStars` | `value`, `count` | `count = 0` menampilkan "Belum ada rating". Ada teks angka (mis. "4,5") agar tidak hanya bergantung pada ikon |
| Molecule | `PriceTag` | `price`, `unit` | `Rp45.000/kg` |
| Molecule | `SearchBar` | `defaultValue`, `onSearch(keyword)` | Form dengan input + tombol Cari; Enter ikut mengirim |
| Molecule | `ProductCard` | `product` | Gambar, nama, `PriceTag`, nama petani, `RatingStars`, badge stok habis. Seluruh kartu menjadi link ke `/products/:id` |
| Molecule | `QuantityStepper` | `value`, `min`, `max`, `onChange` | Tombol +/- dengan label aksesibel |
| Organism | `ProductGrid` | `products`, `isLoading`, `skeletonCount` | Grid responsif; skeleton saat memuat |
| Organism | `Pagination` | `page`, `totalPages`, `onChange` | Disembunyikan bila `totalPages <= 1` |
| Organism | `ProductDetailInfo` | `product`, `userRole`, `isAuthenticated`, `onAddToCart` | Info lengkap, stepper, tombol sesuai aturan UI 10, bagian ulasan |
| Template | `MainLayout` | `children` | Header: nama aplikasi, tautan beranda, tombol Masuk/Daftar bila belum login, atau nama pengguna + Keluar + tautan Profil bila sudah (dari `AuthContext`) |
| Page | `MarketplacePage`, `ProductDetailPage` | — | Menyambungkan hook ke organism |

Grid: 2 kolom di mobile, 3 di tablet, 4 di desktop.

## 6. Kondisi UI

| Halaman | Loading | Error | Empty / lainnya |
|---|---|---|---|
| Marketplace | Grid skeleton (jumlah = `limit`). Saat ganti halaman, data lama tetap tampil (keepPreviousData) dengan indikator ringan | `Alert` dengan penjelasan singkat dan tombol "Coba lagi" (`refetch`) | Katalog kosong tanpa pencarian: "Belum ada produk tersedia." Hasil pencarian kosong: `Produk "{keyword}" tidak ditemukan.` dengan tombol "Lihat semua produk" |
| Detail | Skeleton untuk gambar dan teks | `404`: "Produk tidak ditemukan atau sudah tidak dijual" + tombol "Kembali ke katalog". Error lain: `Alert` + "Coba lagi" | Stok 0: badge dan tombol nonaktif. `reviews` kosong: "Belum ada ulasan." |

Kualitas minimum: responsif dari lebar 360px, fokus keyboard terlihat, `alt` gambar berisi nama produk, kontras warna memadai, dan animasi mengikuti `prefers-reduced-motion`.

## 7. Arah desain (usulan, boleh disesuaikan)

Ini sistem toko online hasil tani langsung dari petani lokal, jadi tampilannya harus terasa seperti pasar yang segar: **foto produk adalah pusat perhatian**, teks rapi dan mudah dipindai, harga paling jelas terbaca.

- **Warna** (usulan awal, putuskan final saat rencana desain):
  - Latar putih kehijauan `#F6F8F3`
  - Teks `#17261E`
  - Hijau daun `#2E6B4A` untuk aksi utama
  - Merah cabai `#C93A2B` hanya untuk status penting (stok habis, error)
  - Kuning jagung `#E9A81B` untuk bintang rating
- **Tipografi**: dua keluarga huruf Google Fonts yang berbeda jelas, satu untuk judul dan nama produk (mis. Bricolage Grotesque), satu untuk teks isi (mis. Instrument Sans). Harga memakai angka tabular agar rapi.
- **Tata letak**: kartu produk berbasis gambar (gambar besar, teks minimal di bawahnya), tanpa border dan bayangan berat pada setiap kartu. Hierarki jelas: nama dan harga menonjol, nama petani dan rating sekunder.
- **Hindari**: label huruf kapital semua di atas setiap judul, gradien dekoratif, efek hover pada semua elemen, animasi masuk di setiap bagian. Satu momen animasi saja cukup (mis. transisi halus saat daftar produk berganti).

Agen yang mengerjakan wajib menulis rencana desain singkat (palet, font, tata letak) lebih dulu, memeriksanya terhadap bagian ini, baru membangun.

## 8. Skenario Test

**Manual / komponen:**

| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Buka `/` tanpa login | Katalog tampil: gambar, nama, harga, petani, rating |
| 2 | Cari "tomat" | URL menjadi `/?search=tomat`, hanya produk tomat tampil, page kembali ke 1 |
| 3 | Kosongkan kolom lalu Cari | Param `search` hilang, seluruh katalog tampil |
| 4 | Cari kata yang tidak ada | Pesan produk tidak ditemukan + tombol "Lihat semua produk" |
| 5 | Pindah ke halaman 2 | Data berganti, URL ikut berubah, data lama tidak berkedip kosong |
| 6 | Refresh di `/?search=cabai&page=2` | Kondisi yang sama dipulihkan |
| 7 | `/?page=abc` dan `/?page=999` | Dianggap halaman 1 / pindah ke halaman terakhir |
| 8 | Backend mati | `Alert` error + "Coba lagi" berfungsi setelah backend nyala |
| 9 | Klik kartu produk | Masuk ke `/products/:id`, detail lengkap |
| 10 | Buka `/products/99999` | Pesan produk tidak ditemukan + tombol kembali |
| 11 | Produk stok 0 | Badge "Stok habis" di kartu dan detail, tombol nonaktif |
| 12 | Produk tanpa rating | "Belum ada rating" |
| 13 | Gambar kosong atau URL rusak | Placeholder, layout tidak bergeser |
| 14 | Stepper jumlah | Tidak bisa di bawah 1 atau di atas stok |
| 15 | Tambah ke keranjang saat belum login | Diarahkan ke `/login` |
| 16 | Tambah ke keranjang sebagai SELLER | Tombol nonaktif dengan keterangan |
| 17 | Tambah ke keranjang sebagai BUYER | Pesan "Fitur keranjang segera hadir" (sementara) |
| 18 | Lebar layar 360px | Tidak ada scroll horizontal, grid 2 kolom |
| 19 | Navigasi hanya dengan keyboard | Search, kartu, pagination, dan stepper bisa dijangkau dengan fokus terlihat |

Bila repo sudah memakai Vitest + Testing Library, tulis test komponen untuk minimal: `RatingStars` (count 0), `ProductCard` (stok habis, tanpa gambar), `QuantityStepper` (batas min/maks), dan `formatRupiah`.

## 9. Status

- [ ] Atoms/molecules baru (`Badge`, `Skeleton`, `ImageWithFallback`, `RatingStars`, `PriceTag`)
- [ ] `MainLayout`
- [ ] API + hooks (`useProducts`, `useProduct`)
- [ ] `MarketplacePage` end-to-end (katalog, search, pagination, URL state)
- [ ] `ProductDetailPage` end-to-end (stepper, aturan tombol per role)
- [ ] Test lulus + build/lint bersih
- [ ] Diuji dengan backend dan data seed
- [ ] (Nanti) Aktifkan `FARMER_PROFILE_ENABLED` setelah modul Farmer Profile
- [ ] (Nanti) Sambungkan `onAddToCart` ke modul Shopping Cart
- [ ] (Nanti) Tampilkan daftar ulasan dari modul Review & Rating
