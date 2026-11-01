import { z } from "zod";

const time = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Gunakan format jam HH:mm.");
export const blockedDateSchema = z
  .object({
    date: z.iso.date(),
    startTime: time.nullable(),
    endTime: time.nullable(),
    reason: z.string().trim().max(1000),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.startTime === null) !== (value.endTime === null)) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Isi kedua jam atau kosongkan keduanya.",
      });
    } else if (
      value.startTime !== null &&
      value.endTime !== null &&
      value.startTime >= value.endTime
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Jam akhir harus setelah jam mulai.",
      });
    }
  });
export type BlockedDateInput = z.output<typeof blockedDateSchema>;
