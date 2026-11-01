import "server-only";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  settingsSchemas,
  type SettingsSection,
  type SettingsValue,
} from "@/schemas/site-settings";

export interface SettingsTransaction {
  ensureMediaReady(ids: readonly string[]): Promise<void>;
  /** Lock the singleton before replacing a section, to avoid concurrent lost updates. */
  lockAndReplaceSection(
    section: SettingsSection,
    value: unknown,
  ): Promise<void>;
  insertAudit(entry: {
    actorId: string;
    action: "update";
    collection: "site-settings";
    docId: "1";
    summary: string;
  }): Promise<void>;
}
export interface SettingsStore {
  readSection(section: SettingsSection): Promise<unknown>;
  transaction<T>(callback: (tx: SettingsTransaction) => Promise<T>): Promise<T>;
}

export class SettingsCacheInvalidationError extends Error {
  constructor() {
    super("Pengaturan sudah disimpan, tetapi cache belum berhasil diperbarui.");
    this.name = "SettingsCacheInvalidationError";
  }
}

/** Principal must originate from server-verified session and 2FA, never a client DTO. */
export async function readSettingsSection<K extends SettingsSection>(
  store: SettingsStore,
  principal: AdminPrincipal | null,
  section: K,
): Promise<SettingsValue<K>> {
  authorize(principal, "site-settings", "read", [section]);
  return settingsSchemas[section].parse(
    await store.readSection(section),
  ) as SettingsValue<K>;
}

/** Invalidation runs only after commit; failure must not be mistaken for a rollback. */
export async function updateSettingsSection<K extends SettingsSection>(
  store: SettingsStore,
  principal: AdminPrincipal | null,
  section: K,
  input: unknown,
  invalidateSettings: () => void | Promise<void>,
): Promise<SettingsValue<K>> {
  authorize(principal, "site-settings", "update", [section]);
  const value = settingsSchemas[section].parse(input) as SettingsValue<K>;
  const mediaIds =
    section === "general"
      ? [
          (value as SettingsValue<"general">).logoId,
          (value as SettingsValue<"general">).faviconId,
        ]
      : section === "hero"
        ? [(value as SettingsValue<"hero">).heroImageId]
        : section === "seo"
          ? [(value as SettingsValue<"seo">).defaultOgImageId]
          : [];
  const referencedMedia = [
    ...new Set(mediaIds.filter((id): id is string => id !== null)),
  ];
  await store.transaction(async (tx) => {
    if (referencedMedia.length) await tx.ensureMediaReady(referencedMedia);
    await tx.lockAndReplaceSection(section, value);
    await tx.insertAudit({
      actorId: principal.id,
      action: "update",
      collection: "site-settings",
      docId: "1",
      summary: `Memperbarui pengaturan ${section}`,
    });
  });
  try {
    await invalidateSettings();
  } catch {
    throw new SettingsCacheInvalidationError();
  }
  return value;
}
