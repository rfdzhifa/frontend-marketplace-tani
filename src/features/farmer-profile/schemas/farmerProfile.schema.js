import { z } from "zod";

const URL_REGEX = /^https?:\/\/.+/i;

export const farmerProfileSchema = z.object({
  farmName: z
    .string()
    .trim()
    .min(1, "Nama kebun atau usaha wajib diisi")
    .min(2, "Nama kebun minimal 2 karakter")
    .max(100, "Nama kebun maksimal 100 karakter"),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi kebun wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  location: z
    .string()
    .trim()
    .min(1, "Lokasi kebun wajib diisi")
    .min(2, "Lokasi minimal 2 karakter")
    .max(150, "Lokasi maksimal 150 karakter"),
  photoUrl: z
    .string()
    .trim()
    .max(191, "URL foto maksimal 191 karakter")
    .refine((val) => !val || URL_REGEX.test(val), {
      message: "URL foto harus diawali http:// atau https://",
    })
    .optional()
    .or(z.literal("")),
});
