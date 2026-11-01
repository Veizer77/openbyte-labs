import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(120, "Nama terlalu panjang."),
  whatsapp: z
    .string()
    .refine(
      (value) => normalizeWhatsapp(value) !== null,
      "Masukkan nomor WhatsApp Indonesia yang valid.",
    ),
  email: z.union([z.literal(""), z.email("Alamat email tidak valid.")]),
  organization: z.string().trim().max(160, "Nama instansi terlalu panjang."),
  service: z.string().min(1, "Pilih kategori layanan."),
  message: z
    .string()
    .trim()
    .min(10, "Ceritakan kebutuhan Anda minimal 10 karakter.")
    .max(3500, "Maksimal 3.500 karakter."),
  consent: z
    .boolean()
    .refine(Boolean, "Persetujuan pengolahan data wajib dicentang."),
});
export type ContactValues = z.infer<typeof contactSchema>;
