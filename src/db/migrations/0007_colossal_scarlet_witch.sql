CREATE TABLE "rate_limits" (
	"scope" text NOT NULL,
	"key_hash" text NOT NULL,
	"count" integer NOT NULL,
	"window_started_at" timestamp with time zone NOT NULL,
	"locked_until" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rate_limits_scope_key_hash_pk" PRIMARY KEY("scope","key_hash"),
	CONSTRAINT "rate_limits_count_check" CHECK ("rate_limits"."count" >= 0)
);
