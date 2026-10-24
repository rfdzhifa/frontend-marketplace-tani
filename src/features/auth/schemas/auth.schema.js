import { z } from "zod";
import { ROLES } from "../../../constants/roles";

const INDONESIAN_PHONE_PREFIX_REGEX = /^(?:\+628|628|08)[0-9]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const nameField = z
  .string()
  .trim()
  .min(1, "Nama lengkap wajib diisi")
  .min(2, "Nama minimal 2 karakter")
  .max(100, "Nama maksimal 100 karakter");

const phoneField = z
  .string()
  .trim()
  .min(1, "Nomor telepon wajib diisi")
  .refine((val) => INDONESIAN_PHONE_PREFIX_REGEX.test(val), {
    message: "Nomor telepon harus diawali 08, 628, atau +628 dan berisi angka",
  })
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    },
    {
      message: "Nomor telepon harus terdiri dari 10 hingga 15 digit",
    },
  );

export const registerSchema = z.object({
  name: nameField,
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .max(100, "Email maksimal 100 karakter")
    .refine((val) => EMAIL_REGEX.test(val), {
      message: "Format email tidak valid",
    }),
  phone: phoneField,
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .refine((val) => /[A-Za-z]/.test(val) && /[0-9]/.test(val), {
      message: "Password harus mengandung huruf dan angka",
    }),
  role: z
    .string()
    .refine((val) => val === ROLES.BUYER || val === ROLES.SELLER, {
      message: "Pilih peran sebagai Pembeli atau Petani",
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .refine((val) => EMAIL_REGEX.test(val), {
      message: "Format email tidak valid",
    }),
  password: z.string().min(1, "Password wajib diisi"),
});

export const profileSchema = z.object({
  name: nameField,
  phone: phoneField,
});
