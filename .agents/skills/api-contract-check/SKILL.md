---
name: api-contract-check
description: Memverifikasi kontrak API sebelum integrasi
---

# API Contract Check

## Kapan digunakan
Sebelum menulis Axios request, TanStack Query hook, validator, atau response mapper.

## Sumber wajib
`docs/modules/<module>.md` yang berasal dari backend teruji; `docs/api-contract.md`; `ARCHITECTURE.md`.

## Prosedur
1. Tandai status endpoint: VERIFIED hanya jika implementasi backend dan kontraknya diketahui; selain itu PROPOSED.
2. Jangan mengarang endpoint, field, error, pagination, atau status.
3. Base path `/api/v1`; gunakan `src/services/httpClient.js`.
4. Envelope sukses `{ success, message, data, meta? }`; error `{ success: false, message, errors? }`.
5. Pisahkan transformasi respons dari komponen UI.
6. Bila ada konflik kontrak, laporkan dan minta konfirmasi sebelum coding.

## Kontrak auth terverifikasi
`POST /auth/register`, `POST /auth/login`, `GET /auth/profile`, `PUT /auth/profile` (semuanya relatif terhadap `/api/v1`). JWT `data.token`, user `data.user` pada login. Role `BUYER`/`SELLER`. Detail wajib dibaca dari `docs/modules/auth.md`.
