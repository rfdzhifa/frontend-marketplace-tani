---
name: architecture-guard
description: Menjaga arsitektur Atomic Design dan batas modul
---

# Architecture Guard

## Kapan digunakan
Sebelum membuat/memindahkan komponen, folder, routing, atau mengubah arsitektur.

## Sumber wajib
Baca `ARCHITECTURE.md`, `AGENTS.md`, `docs/conventions.md` dari root workspace `frontend/`. Bila konflik, keputusan arsitektur lama menang.

## Prosedur
1. Pastikan root app `frontend-marketplace-tani/`, bukan root workspace.
2. Tempatkan shared UI dalam `src/components/atoms|molecules|organisms|templates/`; halaman dalam `src/features/<feature>/pages/`.
3. Satu shared component per folder: `Button/Button.jsx` dan `Button/index.js`.
4. UI presentational tidak memanggil API; network di feature `api/`, orkestrasi di hooks.
5. Cross-feature import lewat public `index.js`; jangan buat circular dependency.
6. Ajukan rencana file sebelum edit, tunggu persetujuan.

## Hasil
Daftar file terdampak, alasan level Atomic Design, dependency, dan validasi lint/build.
