---
name: docs-sync
description: Menyelaraskan dokumentasi tanpa menebak kontrak
---

# Docs Sync

## Kapan digunakan
Ketika memperbarui `api-contract.md`, `conventions.md`, `ARCHITECTURE.md`, `AGENTS.md`, atau docs modul.

## Prosedur
1. Identifikasi sumber kebenaran: keputusan arsitektur lama untuk struktur; `docs/modules/auth.md` untuk auth yang terimplementasi.
2. Tandai kontrak selain auth sebagai PROPOSED sampai diverifikasi dari backend.
3. Jangan mengubah SRS atau kontrak backend tanpa persetujuan.
4. Pertahankan `/api/v1`, role uppercase, response envelope, Atomic Design.
5. Catat konflik yang belum terpecahkan; jangan menyamarkan asumsi menjadi fakta.
6. Dokumentasi dan `.agents/skills/` berada di luar repo Git app.
