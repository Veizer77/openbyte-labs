CREATE TABLE "calculator_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"selection_type" text NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calculator_groups_key_unique" UNIQUE("key"),
	CONSTRAINT "calculator_group_selection_check" CHECK ("calculator_groups"."selection_type" IN ('single', 'multiple')),
	CONSTRAINT "calculator_group_order_check" CHECK ("calculator_groups"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "calculator_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"label" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"pricing_type" text DEFAULT 'flat' NOT NULL,
	"unit_label" text,
	"max_units" integer,
	"price_min" integer DEFAULT 0 NOT NULL,
	"price_max" integer,
	"days_min" integer DEFAULT 0 NOT NULL,
	"days_max" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calculator_item_pricing_check" CHECK ("calculator_items"."pricing_type" IN ('flat', 'per_unit') AND ("calculator_items"."pricing_type" <> 'per_unit' OR ("calculator_items"."max_units" IS NOT NULL AND "calculator_items"."max_units" > 0))),
	CONSTRAINT "calculator_item_price_check" CHECK ("calculator_items"."price_min" >= 0 AND ("calculator_items"."price_max" IS NULL OR "calculator_items"."price_max" >= "calculator_items"."price_min")),
	CONSTRAINT "calculator_item_days_check" CHECK ("calculator_items"."days_min" >= 0 AND ("calculator_items"."days_max" IS NULL OR "calculator_items"."days_max" >= "calculator_items"."days_min")),
	CONSTRAINT "calculator_item_order_check" CHECK ("calculator_items"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "calculator_rules" (
	"item_id" uuid NOT NULL,
	"related_item_id" uuid NOT NULL,
	"rule_type" text NOT NULL,
	CONSTRAINT "calculator_rules_item_id_related_item_id_rule_type_pk" PRIMARY KEY("item_id","related_item_id","rule_type"),
	CONSTRAINT "calculator_rule_type_check" CHECK ("calculator_rules"."rule_type" IN ('requires', 'excludes')),
	CONSTRAINT "calculator_rule_self_check" CHECK ("calculator_rules"."item_id" <> "calculator_rules"."related_item_id")
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"selection" jsonb NOT NULL,
	"price_min" integer NOT NULL,
	"price_max" integer NOT NULL,
	"days_min" integer NOT NULL,
	"days_max" integer NOT NULL,
	"contact_name" text,
	"contact_whatsapp" text,
	"ip_hash" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quote_requests_reference_unique" UNIQUE("reference"),
	CONSTRAINT "quote_price_check" CHECK ("quote_requests"."price_min" >= 0 AND "quote_requests"."price_max" >= "quote_requests"."price_min"),
	CONSTRAINT "quote_days_check" CHECK ("quote_requests"."days_min" >= 0 AND "quote_requests"."days_max" >= "quote_requests"."days_min"),
	CONSTRAINT "quote_status_check" CHECK ("quote_requests"."status" IN ('new', 'contacted', 'converted', 'dropped'))
);
--> statement-breakpoint
ALTER TABLE "calculator_items" ADD CONSTRAINT "calculator_items_group_id_calculator_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."calculator_groups"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculator_rules" ADD CONSTRAINT "calculator_rules_item_id_calculator_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."calculator_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculator_rules" ADD CONSTRAINT "calculator_rules_related_item_id_calculator_items_id_fk" FOREIGN KEY ("related_item_id") REFERENCES "public"."calculator_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calculator_items_group_idx" ON "calculator_items" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "calculator_rules_related_idx" ON "calculator_rules" USING btree ("related_item_id");--> statement-breakpoint
CREATE INDEX "quote_status_created_idx" ON "quote_requests" USING btree ("status","created_at");