import { z } from "zod";

const phoneRegex = /^(?:\+?62|0)8[0-9]{7,13}$/;

export const checkoutSchema = z.object({
  namaPenerima: z
    .string()
    .trim()
    .min(3, "Nama penerima minimal 3 karakter")
    .max(100, "Nama penerima maksimal 100 karakter"),
  noTelepon: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Format nomor telepon tidak valid (contoh: 081234567890)",
    }),
  alamatPengiriman: z
    .string()
    .trim()
    .min(10, "Alamat pengiriman minimal 10 karakter"),
  catatan: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter")
    .optional(),
});
