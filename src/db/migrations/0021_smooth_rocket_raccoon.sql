CREATE TABLE "digital_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_code" text NOT NULL,
	"product_id" uuid NOT NULL,
	"license_tier" text DEFAULT 'single' NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_whatsapp" text NOT NULL,
	"buyer_email" text NOT NULL,
	"buyer_github" text,
	"notes" text DEFAULT '' NOT NULL,
	"amount" integer NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"access_pin_hash" text,
	"pin_version" integer DEFAULT 1 NOT NULL,
	"license_fingerprint" text NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"max_downloads" integer DEFAULT 3 NOT NULL,
	"expires_at" timestamp with time zone,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"revoked_reason" text,
	"paid_at" timestamp with time zone,
	"last_downloaded_at" timestamp with time zone,
	"last_download_ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "digital_orders_order_code_unique" UNIQUE("order_code"),
	CONSTRAINT "digital_orders_tier_check" CHECK ("digital_orders"."license_tier" IN ('single', 'commercial')),
	CONSTRAINT "digital_orders_payment_status_check" CHECK ("digital_orders"."payment_status" IN ('pending', 'paid', 'cancelled', 'refunded')),
	CONSTRAINT "digital_orders_amount_check" CHECK ("digital_orders"."amount" >= 0 AND "digital_orders"."download_count" >= 0 AND "digital_orders"."max_downloads" >= 0)
);
--> statement-breakpoint
CREATE TABLE "digital_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"product_type" text DEFAULT 'source_code' NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"thumbnail_media_id" uuid,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"demo_url" text,
	"related_project_id" uuid,
	"price_single" integer NOT NULL,
	"price_commercial" integer,
	"tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"included_files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"version" text DEFAULT '1.0.0' NOT NULL,
	"private_file_id" uuid,
	"github_repo_info" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "digital_products_type_check" CHECK ("digital_products"."product_type" IN ('source_code', 'ui_template')),
	CONSTRAINT "digital_products_status_check" CHECK ("digital_products"."status" IN ('draft', 'published')),
	CONSTRAINT "digital_products_price_check" CHECK ("digital_products"."price_single" >= 0 AND ("digital_products"."price_commercial" IS NULL OR "digital_products"."price_commercial" >= "digital_products"."price_single"))
);
--> statement-breakpoint
ALTER TABLE "digital_orders" ADD CONSTRAINT "digital_orders_product_id_digital_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."digital_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_thumbnail_media_id_media_id_fk" FOREIGN KEY ("thumbnail_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_private_file_id_private_files_id_fk" FOREIGN KEY ("private_file_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "digital_orders_product_idx" ON "digital_orders" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "digital_orders_status_idx" ON "digital_orders" USING btree ("payment_status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "digital_products_slug_active_unique" ON "digital_products" USING btree ("slug") WHERE "digital_products"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "digital_products_public_idx" ON "digital_products" USING btree ("status","product_type","sort_order");