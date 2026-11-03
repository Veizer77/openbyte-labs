import { z } from "zod";
import { richTextSchema } from "./rich-text";

const amount = z.number().int().min(0).max(2_147_483_647);
const fields = {
  categoryId: z.uuid(),
  name: z.string().trim().min(1).max(250),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  targetMarket: z.string().trim().max(250),
  price: amount,
  discountPrice: amount.nullable(),
  billingType: z.enum(["one_time", "subscription_yearly", "custom"]),
  estimatedDays: amount,
  features: z.array(z.string().trim().min(1).max(500)).max(50),
  includedRevisions: amount,
  extraRevisionPrice: amount.nullable(),
  revisionPolicy: richTextSchema.nullable(),
  ctaLabel: z.string().trim().max(250),
  isPopular: z.boolean(),
  isActive: z.boolean(),
  sortOrder: amount,
};
const packageFields = z
  .object({ ...fields, discountEndsAt: z.date().nullable() })
  .strict();
function validatePackage(
  value: z.output<typeof packageFields>,
  ctx: z.RefinementCtx,
): void {
  if ((value.discountPrice === null) !== (value.discountEndsAt === null))
    ctx.addIssue({
      code: "custom",
      path: value.discountPrice === null ? ["discountPrice"] : ["discountEndsAt"],
      message: "Harga dan akhir diskon harus diisi bersama.",
    });
  if (value.discountPrice !== null && value.discountPrice > value.price)
    ctx.addIssue({
      code: "custom",
      path: ["discountPrice"],
      message: "Harga diskon tidak boleh lebih besar dari harga awal.",
    });
  if (
    value.isActive &&
    (!value.features.length || /\[ISI(?::|\])/i.test(JSON.stringify(value)))
  ) {
    ctx.addIssue({
      code: "custom",
      path: !value.features.length ? ["features"] : ["name"],
      message: "Paket aktif harus lengkap dan tidak boleh berisi [ISI].",
    });
  }
}
export const packageInputSchema = z
  .object({
    ...fields,
    discountEndsAt: z
      .preprocess(
        (val) => (val === "" || val === undefined ? null : val),
        z
          .union([
            z.date(),
            z.string().refine((val) => !isNaN(Date.parse(val)), {
              message: "Format tanggal tidak valid.",
            }),
          ])
          .nullable(),
      )
      .transform((value) => {
        if (!value) return null;
        return value instanceof Date ? value : new Date(value);
      }),
  })
  .strict()
  .superRefine(validatePackage);
export const packageRecordSchema = packageFields
  .extend({
    id: z.uuid(),
    deletedAt: z.date().nullable(),
    categoryActive: z.boolean(),
  })
  .superRefine(validatePackage);
export type PackageInput = z.output<typeof packageInputSchema>;
export type PackageRecord = z.output<typeof packageRecordSchema>;
