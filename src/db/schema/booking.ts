import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timePattern = "^([01][0-9]|2[0-3]):[0-5][0-9]$";

export const availabilityRules = pgTable(
  "availability_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    weekday: integer("weekday").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("availability_weekday_check", sql`${table.weekday} BETWEEN 0 AND 6`),
    check(
      "availability_time_check",
      sql`${table.startTime} ~ ${sql.raw(`'${timePattern}'`)} AND ${table.endTime} ~ ${sql.raw(`'${timePattern}'`)} AND ${table.startTime} < ${table.endTime}`,
    ),
    index("availability_weekday_idx").on(table.weekday),
    uniqueIndex("availability_rule_unique").on(
      table.weekday,
      table.startTime,
      table.endTime,
    ),
  ],
);

export const blockedDates = pgTable(
  "blocked_dates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date", { mode: "string" }).notNull(),
    startTime: text("start_time"),
    endTime: text("end_time"),
    reason: text("reason").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "blocked_dates_time_check",
      sql`(${table.startTime} IS NULL AND ${table.endTime} IS NULL) OR (${table.startTime} IS NOT NULL AND ${table.endTime} IS NOT NULL AND ${table.startTime} ~ ${sql.raw(`'${timePattern}'`)} AND ${table.endTime} ~ ${sql.raw(`'${timePattern}'`)} AND ${table.startTime} < ${table.endTime})`,
    ),
    index("blocked_dates_date_idx").on(table.date),
  ],
);

export const consultationBookings = pgTable(
  "consultation_bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    name: text("name").notNull(),
    whatsapp: text("whatsapp").notNull(),
    email: text("email"),
    organizationOrBusiness: text("organization_or_business")
      .notNull()
      .default(""),
    serviceInterest: text("service_interest").notNull().default(""),
    slotStart: timestamp("slot_start", { withTimezone: true }).notNull(),
    slotEnd: timestamp("slot_end", { withTimezone: true }).notNull(),
    consultationMode: text("consultation_mode")
      .$type<"google_meet" | "whatsapp_call" | "offline">()
      .notNull()
      .default("google_meet"),
    projectBrief: text("project_brief").notNull().default(""),
    status: text("status")
      .$type<"pending" | "confirmed" | "completed" | "cancelled">()
      .notNull()
      .default("pending"),
    meetingUrl: text("meeting_url"),
    adminNotes: text("admin_notes").notNull().default(""),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("booking_time_check", sql`${table.slotStart} < ${table.slotEnd}`),
    // A booking may never be stored for a slot that had already started. The
    // application clock (`consentAt` = server "now" at submit time) is the same
    // clock `createBooking` validates against, so this adds a last-resort guard
    // without depending on the database host's clock.
    check("booking_future_check", sql`${table.slotStart} > ${table.consentAt}`),
    check(
      "booking_mode_check",
      sql`${table.consultationMode} IN ('google_meet', 'whatsapp_call', 'offline')`,
    ),
    check(
      "booking_status_check",
      sql`${table.status} IN ('pending', 'confirmed', 'completed', 'cancelled')`,
    ),
    index("booking_status_start_idx").on(table.status, table.slotStart),
  ],
);
