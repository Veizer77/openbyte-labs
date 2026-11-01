CREATE TABLE "seed_state" (
	"key" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "availability_rule_unique" ON "availability_rules" USING btree ("weekday","start_time","end_time");