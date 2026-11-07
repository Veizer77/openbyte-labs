import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import type { TrackingStore } from "@/db/tracking-store";
import { trackingLoginSchema, leadConversionSchema } from "@/schemas/tracking";
import type { TrackingSession } from "@/lib/tracking/security";
import { TrackingError } from "@/lib/tracking/errors";

export async function loginTracking(
  store: TrackingStore,
  input: unknown,
  ipHash: string,
  secret: string,
) {
  const parsed = trackingLoginSchema.safeParse(input);
  if (!parsed.success) throw new TrackingError("Kode atau PIN tidak sesuai.");
  const result = await store.login(
    parsed.data.code,
    parsed.data.pin,
    ipHash,
    secret,
  );
  if (!result) throw new TrackingError("Kode atau PIN tidak sesuai.");
  return result;
}
export async function listClientProjects(
  store: TrackingStore,
  principal: AdminPrincipal | null,
) {
  authorize(principal, "client-projects", "read");
  return store.listAdmin();
}
export async function readAdminClientProject(
  store: TrackingStore,
  principal: AdminPrincipal | null,
  id: string,
) {
  authorize(principal, "client-projects", "read");
  return store.adminDetail(z.uuid().parse(id));
}
export async function createClientProject(
  store: TrackingStore,
  principal: AdminPrincipal | null,
  input: unknown,
) {
  authorize(principal, "client-projects", "create");
  return store.createProject(input, principal.id);
}
export async function mutateAdminClientProject(
  store: TrackingStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
) {
  authorize(principal, "client-projects", "update");
  return store.adminMutate(z.uuid().parse(id), input, principal.id);
}

/**
 * Konversi satu lead (inquiry atau quote) menjadi proyek klien dalam satu
 * transaksi.
 *
 * Kenapa dipisah dari `createClientProject`: admin tidak boleh mengetik ulang
 * nama, WhatsApp, dan harga dari layar lain. Penyalinan manual adalah sumber
 * salah ketik nomor WhatsApp yang membuat klien tidak bisa login, dan sumber
 * harga proyek yang berbeda dari yang sudah dijanjikan ke klien.
 *
 * Sumbernya hanya boleh satu: inquiry ATAU quote. Keduanya bisa ada di satu
 * inquiry (inquiry dari kalkulator menyimpan `quoteRequestId`), jadi inquiry
 * diutamakan karena memuat identitas yang sudah diisi klien.
 */
export async function convertLeadToClientProject(
  store: TrackingStore,
  principal: AdminPrincipal | null,
  input: unknown,
) {
  authorize(principal, "client-projects", "create");
  authorize(principal, "inquiries", "update");
  const value = leadConversionSchema.parse(input);
  return store.convertLead(value, principal.id);
}
export async function mutateClientPortal(
  store: TrackingStore,
  session: TrackingSession,
  input: unknown,
  ipHash: string,
  userAgent: string,
) {
  await store.consumeBudget(session, ipHash);
  if (
    typeof input === "object" &&
    input !== null &&
    "kind" in input &&
    input.kind === "approve"
  )
    await store.consumeBudget(session, ipHash, true);
  await store.clientMutate(session, input, ipHash, userAgent);
}
