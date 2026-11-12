CREATE TABLE "digital_coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"discount_type" text DEFAULT 'percent' NOT NULL,
	"discount_value" integer NOT NULL,
	"min_order_amount" integer DEFAULT 0 NOT NULL,
	"max_discount_amount" integer,
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"product_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "digital_coupons_code_unique" UNIQUE("code"),
	CONSTRAINT "digital_coupons_type_check" CHECK ("digital_coupons"."discount_type" IN ('percent', 'fixed')),
	CONSTRAINT "digital_coupons_value_check" CHECK ("digital_coupons"."discount_value" > 0 AND ("digital_coupons"."discount_type" != 'percent' OR "digital_coupons"."discount_value" <= 100) AND "digital_coupons"."min_order_amount" >= 0 AND "digital_coupons"."used_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "digital_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"buyer_name" text NOT NULL,
	"license_tier" text DEFAULT 'single' NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"media_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'approved' NOT NULL,
	"admin_reply" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "digital_reviews_order_id_unique" UNIQUE("order_id"),
	CONSTRAINT "digital_reviews_rating_check" CHECK ("digital_reviews"."rating" >= 1 AND "digital_reviews"."rating" <= 5),
	CONSTRAINT "digital_reviews_status_check" CHECK ("digital_reviews"."status" IN ('approved', 'hidden'))
);
--> statement-breakpoint
ALTER TABLE "digital_orders" DROP CONSTRAINT "digital_orders_amount_check";--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "base_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "setup_fee_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "discount_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "coupon_code" text;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "include_setup_service" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "payment_proof_file_id" uuid;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD COLUMN "payment_proof_uploaded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "video_key" text;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "compare_at_price_single" integer;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "compare_at_price_commercial" integer;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "setup_service_price" integer;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "package_size_bytes" integer;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "changelog" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "sales_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "rating_average" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_products" ADD COLUMN "rating_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_coupons" ADD CONSTRAINT "digital_coupons_product_id_digital_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."digital_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_reviews" ADD CONSTRAINT "digital_reviews_product_id_digital_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."digital_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_reviews" ADD CONSTRAINT "digital_reviews_order_id_digital_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."digital_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "digital_coupons_active_idx" ON "digital_coupons" USING btree ("is_active","code");--> statement-breakpoint
CREATE INDEX "digital_reviews_product_idx" ON "digital_reviews" USING btree ("product_id","status","created_at");--> statement-breakpoint
ALTER TABLE "digital_orders" ADD CONSTRAINT "digital_orders_payment_proof_file_id_private_files_id_fk" FOREIGN KEY ("payment_proof_file_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_orders" ADD CONSTRAINT "digital_orders_amount_check" CHECK ("digital_orders"."amount" >= 0 AND "digital_orders"."download_count" >= 0 AND "digital_orders"."max_downloads" >= 0 AND "digital_orders"."base_amount" >= 0 AND "digital_orders"."setup_fee_amount" >= 0 AND "digital_orders"."discount_amount" >= 0);--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_compare_single_check" CHECK ("digital_products"."compare_at_price_single" IS NULL OR "digital_products"."compare_at_price_single" >= "digital_products"."price_single");--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_compare_commercial_check" CHECK ("digital_products"."compare_at_price_commercial" IS NULL OR ("digital_products"."price_commercial" IS NOT NULL AND "digital_products"."compare_at_price_commercial" >= "digital_products"."price_commercial"));--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_setup_price_check" CHECK ("digital_products"."setup_service_price" IS NULL OR "digital_products"."setup_service_price" >= 0);