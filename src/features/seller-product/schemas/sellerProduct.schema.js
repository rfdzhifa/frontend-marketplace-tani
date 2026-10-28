import { z } from "zod";

export const PRODUCT_UNITS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "ikat", label: "Ikat" },
  { value: "buah", label: "Buah" },
  { value: "liter", label: "Liter" },
];

export const ALLOWED_UNITS = ["kg", "g", "ikat", "buah", "liter"];

export const sellerProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi produk maksimal 1000 karakter")
    .optional()
    .default(""),
  price: z.coerce
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .int("Harga harus berupa bilangan bulat")
    .min(1, "Harga minimal Rp 1"),
  unit: z.enum(["kg", "g", "ikat", "buah", "liter"], {
    errorMap: () => ({ message: "Satuan produk tidak valid" }),
  }),
  stock: z.coerce
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int("Stok harus berupa bilangan bulat")
    .min(0, "Stok tidak boleh bernilai negatif"),
  imageUrl: z
    .string()
    .trim()
    .max(255, "URL gambar maksimal 255 karakter")
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          const url = new URL(val);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "URL gambar harus diawali dengan http:// atau https://" },
    )
    .transform((val) => (val && val.length > 0 ? val : null)),
});

export const updateStockSchema = z.object({
  stock: z.coerce
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int("Stok harus berupa bilangan bulat")
    .min(0, "Stok tidak boleh bernilai negatif"),
});

