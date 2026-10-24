---
name: atomic-ui
description: Membangun UI Atomic Design dan Tailwind v4
---

# Atomic UI

## Kapan digunakan
Saat membangun Button, Input, FormField, form auth, layout, dan halaman.

## Sumber wajib
`docs/design-system.md`, `docs/content-copy.md`, `docs/conventions.md`, `ARCHITECTURE.md`.

## Prosedur
1. Gunakan token Tailwind v4 dari `src/index.css` (`@theme`), jangan mengarang warna acak.
2. Atoms: elemen dasar; molecules: gabungan sederhana; organisms: section/form kompleks; templates: tata letak; pages: orkestrasi feature.
3. Shared UI di `src/components/`; UI khusus fitur di `src/features/<feature>/components/`.
4. Organisms menerima data, callback, loading/error melalui props; tanpa request API.
5. Pastikan label, keyboard navigation, focus states, error per field, responsive, dan copy Bahasa Indonesia.
6. Gunakan Radix hanya bila interaksi aksesibel kompleks dibutuhkan.
7. Periksa loading/error/empty states, jalankan lint dan build.
