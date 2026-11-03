import { randomBytes, randomInt, randomUUID } from "node:crypto";
import { inArray, sql as drizzleSql } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/db/connection";
import { consultationBookings } from "@/db/schema/booking";
import { media, projects } from "@/db/schema/content";
import { createPublicBookingAvailabilityStore } from "@/db/public-booking-availability-store";
import { createPublicProjectStore } from "@/db/public-project-store";
import { getPublicBookingMonthAvailability } from "@/services/public-booking-availability";
import { wibDay } from "@/lib/booking";
import { consumePublicFormBudget } from "@/security/public-form-rate-limit";
import { requireTestDatabaseUri } from "./target";

let client: postgres.Sql;
let db: Database;

/**
 * Drizzle rewrites the serializers of the postgres.js client it wraps: dates and
 * JSON are passed through untouched, so a raw `Date` reaches the driver with no
 * serializer and throws. Booking rows therefore go through the typed schema
 * builder, which sets the parameter types itself.
 */
const sql = drizzleSql;

beforeAll(async () => {
  client = postgres(requireTestDatabaseUri(process.env), {
    max: 16,
    prepare: false,
    connect_timeout: 10,
  });
  db = drizzle(client);
  const [tables] = await db.execute<{
    bookings: string | null;
    limits: string | null;
    settings: string | null;
    audit: string | null;
  }>(sql`SELECT to_regclass('public.consultation_bookings') AS bookings,
      to_regclass('public.rate_limits') AS limits,
      to_regclass('public.site_settings') AS settings,
      to_regclass('public.audit_logs') AS audit`);
  if (!tables?.bookings || !tables.limits || !tables.settings || !tables.audit) {
    throw new Error(
      "Skema belum tersedia. Jalankan pnpm db:migrate dan pnpm db:seed:foundation lebih dulu.",
    );
  }
});
afterAll(async () => {
  await client?.end({ timeout: 5 });
});

/** A far-future hour so the fixture never collides with real schedule data. */
function futureSlot(): { start: Date; end: Date } {
  const start = new Date(
    Date.UTC(2200, 0, 1) + randomInt(0, 365 * 24) * 3_600_000,
  );
  return { start, end: new Date(start.getTime() + 3_600_000) };
}

async function count(label: string): Promise<number> {
  const [row] = await db.execute<{ value: number }>(sql`
    SELECT count(*)::int AS value FROM consultation_bookings
    WHERE reference LIKE ${`${label}-%`} AND status IN ('pending', 'confirmed')`);
  return row.value;
}

describe("PostgreSQL test terisolasi", () => {
  it("rollback perubahan Settings dan audit bersamaan", async () => {
    const [initial] = await db.execute<{ data: unknown }>(
      sql`SELECT data FROM site_settings WHERE id = 1`,
    );
    if (!initial) throw new Error("Settings belum di-seed pada database test.");
    const marker = `integration-${randomUUID()}`;
    await expect(
      db.transaction(async (tx) => {
        await tx.execute(sql`SELECT id FROM site_settings WHERE id = 1 FOR UPDATE`);
        await tx.execute(
          sql`UPDATE site_settings SET data = jsonb_set(data, '{hero}', '{"headline":"rollback probe"}'::jsonb) WHERE id = 1`,
        );
        await tx.execute(sql`INSERT INTO audit_logs (actor_type, action, collection, doc_id, summary)
          VALUES ('system', 'update', 'site-settings', ${marker}, 'integration rollback')`);
        throw new Error("rollback-probe");
      }),
    ).rejects.toThrow("rollback-probe");
    const [after] = await db.execute<{ data: unknown }>(
      sql`SELECT data FROM site_settings WHERE id = 1`,
    );
    const audit = await db.execute(
      sql`SELECT id FROM audit_logs WHERE doc_id = ${marker}`,
    );
    expect(after.data).toEqual(initial.data);
    expect(audit).toHaveLength(0);
  });

  it("menolak booking tumpang tindih, tetapi menerima slot bersebelahan dan cancelled", async () => {
    const marker = `BKG-IT-${randomUUID()}`;
    const { start, end } = futureSlot();
    const halfHour = 1_800_000;
    const booking = (
      label: string,
      status: "pending" | "confirmed" | "completed" | "cancelled",
      from: Date,
      to: Date,
    ) => ({
      id: randomUUID(),
      reference: `${marker}-${label}`,
      name: "integration test",
      whatsapp: "6281234567890",
      organizationOrBusiness: "OpenByte Labs",
      serviceInterest: "Website",
      projectBrief: "integration probe",
      consultationMode: "google_meet" as const,
      slotStart: from,
      slotEnd: to,
      status,
      consentAt: new Date(),
    });
    const insert = (
      label: string,
      status: "pending" | "confirmed" | "completed" | "cancelled",
      from: Date,
      to: Date,
    ) => db.insert(consultationBookings).values(booking(label, status, from, to));
    // Drizzle wraps driver errors; the SQLSTATE lives on the cause.
    const reason = (error: { cause?: { code?: string }; code?: string }) =>
      error.cause?.code ?? error.code;
    try {
      await insert("first", "pending", start, end);
      // The same range, a shifted range, and one that only covers the tail.
      expect(await insert("same", "confirmed", start, end).catch(reason)).toBe(
        "23P01",
      );
      expect(
        await insert(
          "shifted",
          "confirmed",
          new Date(start.getTime() + halfHour),
          new Date(end.getTime() + halfHour),
        ).catch(reason),
      ).toBe("23P01");
      expect(
        await insert(
          "tail",
          "confirmed",
          new Date(start.getTime() - halfHour),
          new Date(start.getTime() + halfHour),
        ).catch(reason),
      ).toBe("23P01");
      // Half-open range: the next hour may start exactly when the previous ends.
      await insert("adjacent", "confirmed", end, new Date(end.getTime() + 3_600_000));
      // Cancelled and completed bookings do not block a slot.
      await insert("cancelled", "cancelled", start, end);
      await insert("completed", "completed", start, end);
      expect(await count(marker)).toBe(2);
    } finally {
      await db.execute(
        sql`DELETE FROM consultation_bookings WHERE reference LIKE ${`${marker}-%`}`,
      );
    }
  });

  it("pada percobaan paralel hanya satu booking aktif yang lolos", async () => {
    const marker = `BKG-PAR-${randomUUID()}`;
    const { start, end } = futureSlot();
    const ids = Array.from({ length: 8 }, () => randomUUID());
    try {
      const results = await Promise.allSettled(
        ids.map((id, index) =>
          db.transaction(async (tx) => {
            await tx.insert(consultationBookings).values({
              id,
              reference: `${marker}-${index}`,
              name: "integration test",
              whatsapp: "6281234567890",
              organizationOrBusiness: "OpenByte Labs",
              serviceInterest: "Website",
              projectBrief: "integration probe",
              consultationMode: "google_meet",
              slotStart: start,
              slotEnd: end,
              status: "pending",
              consentAt: new Date(),
            });
          }),
        ),
      );
      const failures = results.filter(
        (result): result is PromiseRejectedResult => result.status === "rejected",
      );
      // A gist exclusion index can deadlock under a burst; both outcomes must
      // still leave exactly one active booking and never duplicate a slot.
      const codes = failures.map(
        (result) =>
          (result.reason as { cause?: { code?: string }; code?: string }).cause
            ?.code ?? (result.reason as { code?: string }).code,
      );
      expect(codes.every((code) => ["23P01", "40P01"].includes(code!))).toBe(
        true,
      );
      expect(failures).toHaveLength(ids.length - 1);
      expect(await count(marker)).toBe(1);
    } finally {
      await db.execute(
        sql`DELETE FROM consultation_bookings WHERE reference LIKE ${`${marker}-%`}`,
      );
    }
  });

  it("menolak booking untuk slot yang jam mulainya sudah lewat", async () => {
    const marker = `BKG-PAST-${randomUUID()}`;
    const past = new Date(Date.now() - 3_600_000);
    const reason = (error: { cause?: { code?: string }; code?: string }) =>
      error.cause?.code ?? error.code;
    try {
      // consent_at (submit time) is now, slot_start an hour ago: the
      // booking_future_check constraint must reject the row.
      expect(
        await db
          .insert(consultationBookings)
          .values({
            id: randomUUID(),
            reference: `${marker}-past`,
            name: "integration test",
            whatsapp: "6281234567890",
            organizationOrBusiness: "OpenByte Labs",
            serviceInterest: "Website",
            projectBrief: "integration probe",
            consultationMode: "google_meet",
            slotStart: past,
            slotEnd: new Date(past.getTime() + 3_600_000),
            status: "pending",
            consentAt: new Date(),
          })
          .catch(reason),
      ).toBe("23514");
      expect(await count(marker)).toBe(0);
    } finally {
      await db.execute(
        sql`DELETE FROM consultation_bookings WHERE reference LIKE ${`${marker}-%`}`,
      );
    }
  });

  it("mengizinkan hanya lima permintaan form paralel pada satu hash IP", async () => {
    const key = randomBytes(32).toString("hex");
    try {
      const results = await Promise.all(
        Array.from({ length: 20 }, () => consumePublicFormBudget(db, key)),
      );
      expect(results.filter(Boolean)).toHaveLength(5);
      const [row] = await db.execute<{ count: number }>(sql`
        SELECT count FROM rate_limits
        WHERE scope = 'public-form' AND key_hash = ${key}`);
      expect(row.count).toBe(5);
    } finally {
      await db.execute(
        sql`DELETE FROM rate_limits WHERE scope = 'public-form' AND key_hash = ${key}`,
      );
    }
  });

  it("membaca jadwal kalender bulanan dari Settings dan tabel jadwal", async () => {
    const now = new Date();
    const month = `${wibDay(now).slice(0, 7)}-01`;
    const result = await getPublicBookingMonthAvailability(
      createPublicBookingAvailabilityStore(db),
      { month },
      now,
    );
    const [year, monthNumber] = month.slice(0, 7).split("-").map(Number);

    expect(result.month).toBe(month);
    expect(result.consultationModes.length).toBeGreaterThan(0);
    expect(result.days).toHaveLength(
      new Date(Date.UTC(year, monthNumber, 0)).getUTCDate(),
    );
  });

  it("tidak menampilkan proyek yang tanggal terbitnya masih di masa depan", async () => {
    const marker = randomUUID();
    const oldImageId = randomUUID();
    const futureImageId = randomUUID();
    const now = new Date();
    try {
      await db.insert(media).values([
        {
          id: oldImageId,
          key: `integration/${marker}-past.webp`,
          filename: `${marker}-past.webp`,
          mimeType: "image/webp",
          sizeBytes: 1,
          alt: "Gambar uji proyek",
          variants: { card: `integration/${marker}-past-card.webp` },
          finalizedAt: now,
        },
        {
          id: futureImageId,
          key: `integration/${marker}-future.webp`,
          filename: `${marker}-future.webp`,
          mimeType: "image/webp",
          sizeBytes: 1,
          alt: "Gambar uji proyek",
          variants: { card: `integration/${marker}-future-card.webp` },
          finalizedAt: now,
        },
      ]);
      await db.insert(projects).values([
        {
          id: randomUUID(),
          title: "Proyek uji terbit",
          publicationEnabled: true,
          slug: `integration-${marker}-past`,
          summary: "Proyek uji yang sudah terbit.",
          status: "published",
          publishedAt: new Date(now.getTime() - 60_000),
          featuredImageId: oldImageId,
        },
        {
          id: randomUUID(),
          title: "Proyek uji terjadwal",
          publicationEnabled: true,
          slug: `integration-${marker}-future`,
          summary: "Proyek uji yang belum terbit.",
          status: "published",
          publishedAt: new Date(now.getTime() + 86_400_000),
          featuredImageId: futureImageId,
        },
      ]);

      const result = await createPublicProjectStore(db).listPublished({
        limit: 100,
        offset: 0,
      });
      const slugs = result.map((project) => (project as { slug: string }).slug);
      expect(slugs).toContain(
        `integration-${marker}-past`,
      );
      expect(slugs).not.toContain(
        `integration-${marker}-future`,
      );
    } finally {
      await db
        .delete(projects)
        .where(sql`${projects.slug} LIKE ${`integration-${marker}-%`}`);
      await db.delete(media).where(inArray(media.id, [oldImageId, futureImageId]));
    }
  });
});
