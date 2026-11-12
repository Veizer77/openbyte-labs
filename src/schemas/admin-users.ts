import { z } from "zod";

export const adminUserCreateInputSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.email().trim().max(254).transform((value) => value.toLowerCase()),
    password: z.string().min(12).max(128),
    role: z.enum(["owner", "editor"]),
  })
  .strict();

export const adminUserUpdateInputSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.email().trim().max(254).transform((value) => value.toLowerCase()),
    role: z.enum(["owner", "editor"]),
    isActive: z.boolean(),
    password: z.string().min(12).max(128).optional(),
    resetTwoFactor: z.boolean().optional(),
  })
  .strict();

export const adminUserListOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
    query: z.string().trim().max(100).optional(),
  })
  .strict();

export const adminUserRecordSchema = z
  .object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    email: z.email().max(254),
    role: z.enum(["owner", "editor"]),
    isActive: z.boolean(),
    twoFactorEnabled: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type AdminUserCreateInput = z.output<typeof adminUserCreateInputSchema>;
export type AdminUserUpdateInput = z.output<typeof adminUserUpdateInputSchema>;
export type AdminUserListOptions = z.output<typeof adminUserListOptionsSchema>;
export type AdminUserRecord = z.output<typeof adminUserRecordSchema>;
