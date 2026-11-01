CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"show_in_filter" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug"),
	CONSTRAINT "categories_sort_order_check" CHECK ("categories"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"service_package_id" uuid,
	"quote_request_id" uuid,
	"package_name" text,
	"package_price" integer,
	"package_billing_type" text,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text,
	"organization_or_business" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"source" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_notes" text DEFAULT '' NOT NULL,
	"ip_hash" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inquiries_reference_unique" UNIQUE("reference"),
	CONSTRAINT "inquiry_source_check" CHECK (("inquiries"."source" = 'package' AND "inquiries"."service_package_id" IS NOT NULL AND "inquiries"."quote_request_id" IS NULL AND "inquiries"."package_name" IS NOT NULL AND "inquiries"."package_price" IS NOT NULL AND "inquiries"."package_billing_type" IS NOT NULL) OR ("inquiries"."source" = 'contact' AND "inquiries"."service_package_id" IS NULL AND "inquiries"."quote_request_id" IS NULL AND "inquiries"."package_name" IS NULL AND "inquiries"."package_price" IS NULL AND "inquiries"."package_billing_type" IS NULL) OR ("inquiries"."source" = 'calculator' AND "inquiries"."quote_request_id" IS NOT NULL AND "inquiries"."service_package_id" IS NULL AND "inquiries"."package_name" IS NULL AND "inquiries"."package_price" IS NULL AND "inquiries"."package_billing_type" IS NULL)),
	CONSTRAINT "inquiry_package_price_check" CHECK ("inquiries"."package_price" IS NULL OR "inquiries"."package_price" >= 0),
	CONSTRAINT "inquiry_status_check" CHECK ("inquiries"."status" IN ('new', 'contacted', 'converted', 'dropped'))
);
--> statement-breakpoint
CREATE TABLE "service_addons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" integer NOT NULL,
	"billing_type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "addon_price_order_check" CHECK ("service_addons"."price" >= 0 AND "service_addons"."sort_order" >= 0),
	CONSTRAINT "addon_billing_check" CHECK ("service_addons"."billing_type" IN ('one_time', 'monthly', 'yearly'))
);
--> statement-breakpoint
CREATE TABLE "service_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"target_market" text DEFAULT '' NOT NULL,
	"price" integer NOT NULL,
	"discount_price" integer,
	"discount_ends_at" timestamp with time zone,
	"billing_type" text NOT NULL,
	"estimated_days" integer NOT NULL,
	"features" jsonb NOT NULL,
	"included_revisions" integer DEFAULT 2 NOT NULL,
	"extra_revision_price" integer,
	"revision_policy" jsonb,
	"cta_label" text DEFAULT '' NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_packages_slug_unique" UNIQUE("slug"),
	CONSTRAINT "package_price_check" CHECK ("service_packages"."price" >= 0 AND ("service_packages"."discount_price" IS NULL OR ("service_packages"."discount_price" >= 0 AND "service_packages"."discount_price" <= "service_packages"."price"))),
	CONSTRAINT "package_discount_check" CHECK (("service_packages"."discount_price" IS NULL AND "service_packages"."discount_ends_at" IS NULL) OR ("service_packages"."discount_price" IS NOT NULL AND "service_packages"."discount_ends_at" IS NOT NULL)),
	CONSTRAINT "package_numeric_check" CHECK ("service_packages"."estimated_days" >= 0 AND "service_packages"."included_revisions" >= 0 AND ("service_packages"."extra_revision_price" IS NULL OR "service_packages"."extra_revision_price" >= 0) AND "service_packages"."sort_order" >= 0),
	CONSTRAINT "package_billing_check" CHECK ("service_packages"."billing_type" IN ('one_time', 'subscription_yearly', 'custom')),
	CONSTRAINT "package_features_array_check" CHECK (jsonb_typeof("service_packages"."features") = 'array')
);
--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_service_package_id_service_packages_id_fk" FOREIGN KEY ("service_package_id") REFERENCES "public"."service_packages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_quote_request_id_quote_requests_id_fk" FOREIGN KEY ("quote_request_id") REFERENCES "public"."quote_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_packages" ADD CONSTRAINT "service_packages_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inquiry_status_created_idx" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "service_packages_category_idx" ON "service_packages" USING btree ("category_id");