---
name: feature-workflow
description: Alur kerja agen per fitur dengan quality gate
---

# Feature Workflow

## Kapan digunakan
Untuk setiap tugas implementasi fitur frontend.

## Prosedur
1. Baca `AGENTS.md`, `ARCHITECTURE.md`, dokumen modul, conventions, dan SRS yang relevan.
2. Nyatakan use case, status backend VERIFIED/PROPOSED, rencana file, dan test plan; tunggu persetujuan sebelum edit.
3. Kerjakan satu feature saja: API layer → hooks → UI Atomic Design → pages → router.
4. Jangan menyentuh file di luar scope atau mengubah kontrak backend sepihak.
5. Tangani loading, error, empty, auth/permission, dan aksesibilitas.
6. Jalankan `npm run lint`, `npm run build`, dan tes relevan dari root app.
7. Jangan klaim E2E berhasil tanpa menjalankan integrasi nyata dengan backend.
8. Ringkas perubahan, pengujian, kendala, dan langkah berikutnya.
