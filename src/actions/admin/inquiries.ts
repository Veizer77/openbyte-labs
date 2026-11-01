"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createInquiryAdminStore } from "@/db/inquiry-admin-store";
import {
  getAdminInquiry,
  listAdminInquiries,
  updateAdminInquiry,
} from "@/services/inquiry-admin";
import type { InquiryAdminDto } from "@/services/inquiry-admin";
import { ok, toFailure, type ActionResult } from "../result";

export async function listInquiriesAction(
  input: unknown,
): Promise<ActionResult<InquiryAdminDto[]>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminInquiries(
        createInquiryAdminStore(getDb()),
        principal,
        input,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function getInquiryAction(
  input: unknown,
): Promise<ActionResult<unknown>> {
  try {
    const id = z.uuid().parse(input);
    const principal = await requireAdmin();
    return ok(
      await getAdminInquiry(createInquiryAdminStore(getDb()), principal, id),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateInquiryAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, value } = z
      .object({ id: z.uuid(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await updateAdminInquiry(
      createInquiryAdminStore(getDb()),
      principal,
      id,
      value,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
