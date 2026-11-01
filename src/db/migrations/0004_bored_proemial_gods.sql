CREATE TABLE "availability_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekday" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_weekday_check" CHECK ("availability_rules"."weekday" BETWEEN 0 AND 6),
	CONSTRAINT "availability_time_check" CHECK ("availability_rules"."start_time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND "availability_rules"."end_time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND "availability_rules"."start_time" < "availability_rules"."end_time")
);
--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"start_time" text,
	"end_time" text,
	"reason" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blocked_dates_time_check" CHECK (("blocked_dates"."start_time" IS NULL AND "blocked_dates"."end_time" IS NULL) OR ("blocked_dates"."start_time" IS NOT NULL AND "blocked_dates"."end_time" IS NOT NULL AND "blocked_dates"."start_time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND "blocked_dates"."end_time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND "blocked_dates"."start_time" < "blocked_dates"."end_time"))
);
--> statement-breakpoint
CREATE TABLE "consultation_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text,
	"organization_or_business" text DEFAULT '' NOT NULL,
	"service_interest" text DEFAULT '' NOT NULL,
	"slot_start" timestamp with time zone NOT NULL,
	"slot_end" timestamp with time zone NOT NULL,
	"consultation_mode" text DEFAULT 'google_meet' NOT NULL,
	"project_brief" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"meeting_url" text,
	"admin_notes" text DEFAULT '' NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consultation_bookings_reference_unique" UNIQUE("reference"),
	CONSTRAINT "booking_time_check" CHECK ("consultation_bookings"."slot_start" < "consultation_bookings"."slot_end"),
	CONSTRAINT "booking_mode_check" CHECK ("consultation_bookings"."consultation_mode" IN ('google_meet', 'whatsapp_call', 'offline')),
	CONSTRAINT "booking_status_check" CHECK ("consultation_bookings"."status" IN ('pending', 'confirmed', 'completed', 'cancelled'))
);
--> statement-breakpoint
CREATE INDEX "availability_weekday_idx" ON "availability_rules" USING btree ("weekday");--> statement-breakpoint
CREATE INDEX "blocked_dates_date_idx" ON "blocked_dates" USING btree ("date");--> statement-breakpoint
CREATE INDEX "booking_status_start_idx" ON "consultation_bookings" USING btree ("status","slot_start");