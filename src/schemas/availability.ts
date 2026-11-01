import { z } from "zod";

const time = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Gunakan format jam HH:mm.");
export const availabilityRuleSchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    startTime: time,
    endTime: time,
    isActive: z.boolean(),
  })
  .strict()
  .refine((value) => value.startTime < value.endTime, {
    message: "Jam akhir harus setelah jam mulai.",
    path: ["endTime"],
  });

export type AvailabilityRuleInput = z.output<typeof availabilityRuleSchema>;
