CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection" text NOT NULL,
	"doc_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"change_type" text NOT NULL,
	"actor_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_versions_collection_check" CHECK ("content_versions"."collection" IN ('pages', 'projects')),
	CONSTRAINT "content_versions_change_check" CHECK ("content_versions"."change_type" IN ('draft', 'publish', 'restore')),
	CONSTRAINT "content_versions_version_check" CHECK ("content_versions"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt" text DEFAULT '' NOT NULL,
	"variants" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"uploaded_by" text,
	"finalized_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_key_unique" UNIQUE("key"),
	CONSTRAINT "media_size_check" CHECK ("media"."size_bytes" >= 0),
	CONSTRAINT "media_finalize_check" CHECK ("media"."finalized_at" IS NULL OR length("media"."alt") > 0)
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"layout" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"og_image_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_status_check" CHECK ("pages"."status" IN ('draft', 'published')),
	CONSTRAINT "pages_publish_check" CHECK (("pages"."status" = 'draft' AND "pages"."published_at" IS NULL) OR ("pages"."status" = 'published' AND "pages"."published_at" IS NOT NULL)),
	CONSTRAINT "pages_layout_array_check" CHECK (jsonb_typeof("pages"."layout") = 'array')
);
--> statement-breakpoint
CREATE TABLE "project_categories" (
	"project_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_technologies" (
	"project_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_technologies_order_check" CHECK ("project_technologies"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"client_name" text,
	"year" integer,
	"published_at" timestamp with time zone,
	"featured_image_id" uuid,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"content_blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"og_image_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_status_check" CHECK ("projects"."status" IN ('draft', 'published')),
	CONSTRAINT "projects_publish_image_check" CHECK ("projects"."status" = 'draft' OR ("projects"."published_at" IS NOT NULL AND "projects"."featured_image_id" IS NOT NULL)),
	CONSTRAINT "projects_order_check" CHECK ("projects"."sort_order" >= 0),
	CONSTRAINT "projects_year_check" CHECK ("projects"."year" IS NULL OR ("projects"."year" BETWEEN 1900 AND 2200))
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_order_check" CHECK ("services"."sort_order" >= 0),
	CONSTRAINT "services_highlights_array_check" CHECK (jsonb_typeof("services"."highlights") = 'array')
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"color" text DEFAULT '#000000' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technologies_slug_unique" UNIQUE("slug"),
	CONSTRAINT "technologies_color_check" CHECK ("technologies"."color" ~ '^#[0-9A-Fa-f]{6}$')
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text DEFAULT '' NOT NULL,
	"quote" text NOT NULL,
	"photo_id" uuid,
	"project_id" uuid,
	"is_active" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonials_order_check" CHECK ("testimonials"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "client_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_code" text NOT NULL,
	"access_pin_hash" text NOT NULL,
	"pin_version" integer DEFAULT 1 NOT NULL,
	"client_name" text NOT NULL,
	"client_whatsapp" text NOT NULL,
	"client_email" text,
	"project_title" text NOT NULL,
	"category_id" uuid,
	"service_package_id" uuid,
	"project_id" uuid,
	"total_cost" integer DEFAULT 0 NOT NULL,
	"revisions_included" smallint DEFAULT 0 NOT NULL,
	"extra_revision_price" integer,
	"revision_policy_snapshot" jsonb,
	"is_review_open" boolean DEFAULT false NOT NULL,
	"review_opened_at" timestamp with time zone,
	"staging_url" text,
	"production_url" text,
	"github_url" text,
	"client_visibility" jsonb DEFAULT '{"staging":false,"production":false,"github":false,"payments":false,"documents":false,"timeline":false}'::jsonb NOT NULL,
	"start_date" date,
	"target_completion_date" date,
	"internal_notes" text DEFAULT '' NOT NULL,
	"archived_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"paid_amount" integer DEFAULT 0 NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"current_step" smallint DEFAULT 1 NOT NULL,
	"revisions_used" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_projects_tracking_code_check" CHECK ("client_projects"."tracking_code" ~ '^PRJ-[A-HJ-NP-Z2-9]{8}$'),
	CONSTRAINT "client_projects_pin_version_check" CHECK ("client_projects"."pin_version" > 0),
	CONSTRAINT "client_projects_money_check" CHECK ("client_projects"."total_cost" >= 0 AND "client_projects"."paid_amount" >= 0 AND ("client_projects"."extra_revision_price" IS NULL OR "client_projects"."extra_revision_price" >= 0)),
	CONSTRAINT "client_projects_derived_check" CHECK ("client_projects"."balance" = "client_projects"."total_cost" - "client_projects"."paid_amount" AND "client_projects"."revisions_used" >= 0 AND "client_projects"."revisions_included" >= 0),
	CONSTRAINT "client_projects_payment_status_check" CHECK ("client_projects"."payment_status" IN ('unpaid', 'down_payment', 'paid_off')),
	CONSTRAINT "client_projects_current_step_check" CHECK ("client_projects"."current_step" BETWEEN 1 AND 6),
	CONSTRAINT "client_projects_visibility_object_check" CHECK (jsonb_typeof("client_projects"."client_visibility") = 'object')
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"amount" integer NOT NULL,
	"method" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"proof_file_id" uuid,
	"is_visible_to_client" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_amount_check" CHECK ("payments"."amount" > 0),
	CONSTRAINT "payments_method_check" CHECK ("payments"."method" IN ('transfer', 'tunai', 'qris'))
);
--> statement-breakpoint
CREATE TABLE "private_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_by_type" text NOT NULL,
	"uploaded_by_admin_id" text,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "private_files_key_unique" UNIQUE("key"),
	CONSTRAINT "private_files_size_check" CHECK ("private_files"."size_bytes" >= 0),
	CONSTRAINT "private_files_uploader_check" CHECK ("private_files"."uploaded_by_type" IN ('admin', 'client'))
);
--> statement-breakpoint
CREATE TABLE "project_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"type" text NOT NULL,
	"approved_by_name" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"ip_hash" text NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL,
	"approved_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_approvals_type_check" CHECK ("project_approvals"."type" IN ('step_review', 'final_handover'))
);
--> statement-breakpoint
CREATE TABLE "project_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"revision_request_id" uuid,
	"author_type" text NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_comments_author_check" CHECK ("project_comments"."author_type" IN ('client', 'admin')),
	CONSTRAINT "project_comments_internal_check" CHECK (NOT "project_comments"."is_internal" OR "project_comments"."author_type" = 'admin')
);
--> statement-breakpoint
CREATE TABLE "project_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"file_id" uuid,
	"is_visible_to_client" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_documents_type_check" CHECK ("project_documents"."type" IN ('url', 'file') AND (("project_documents"."type" = 'url' AND "project_documents"."url" IS NOT NULL AND "project_documents"."file_id" IS NULL) OR ("project_documents"."type" = 'file' AND "project_documents"."file_id" IS NOT NULL AND "project_documents"."url" IS NULL))),
	CONSTRAINT "project_documents_url_check" CHECK ("project_documents"."url" IS NULL OR "project_documents"."url" ~ '^https://')
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_step_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_milestones_done_check" CHECK ("project_milestones"."is_completed" = ("project_milestones"."completed_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "project_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"step_number" smallint NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_steps_number_check" CHECK ("project_steps"."step_number" BETWEEN 1 AND 6),
	CONSTRAINT "project_steps_status_check" CHECK ("project_steps"."status" IN ('pending', 'in_progress', 'done')),
	CONSTRAINT "project_steps_done_check" CHECK (("project_steps"."status" = 'done') = ("project_steps"."completed_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "project_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" jsonb NOT NULL,
	"is_visible_to_client" boolean DEFAULT true NOT NULL,
	"created_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revision_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"round_number" integer NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"counts_toward_quota" boolean DEFAULT false NOT NULL,
	"is_extra" boolean DEFAULT false NOT NULL,
	"quoted_price" integer,
	"client_accepted_quote_at" timestamp with time zone,
	"admin_response" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "revision_requests_round_check" CHECK ("revision_requests"."round_number" > 0),
	CONSTRAINT "revision_requests_type_check" CHECK ("revision_requests"."type" IN ('revision', 'change_request', 'bug')),
	CONSTRAINT "revision_requests_status_check" CHECK ("revision_requests"."status" IN ('submitted', 'accepted', 'in_progress', 'done', 'rejected', 'needs_payment')),
	CONSTRAINT "revision_requests_quote_check" CHECK ("revision_requests"."quoted_price" IS NULL OR "revision_requests"."quoted_price" >= 0),
	CONSTRAINT "revision_requests_attachments_check" CHECK (jsonb_typeof("revision_requests"."attachments") = 'array' AND jsonb_array_length("revision_requests"."attachments") <= 5)
);
--> statement-breakpoint
CREATE TABLE "step_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"step_number" smallint NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"default_milestones" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "step_templates_number_check" CHECK ("step_templates"."step_number" BETWEEN 1 AND 6),
	CONSTRAINT "step_templates_milestones_array_check" CHECK (jsonb_typeof("step_templates"."default_milestones") = 'array')
);
--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_actor_id_admin_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_admin_profiles_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_service_package_id_service_packages_id_fk" FOREIGN KEY ("service_package_id") REFERENCES "public"."service_packages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_proof_file_id_private_files_id_fk" FOREIGN KEY ("proof_file_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_files" ADD CONSTRAINT "private_files_uploaded_by_admin_id_admin_profiles_id_fk" FOREIGN KEY ("uploaded_by_admin_id") REFERENCES "public"."admin_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_approvals" ADD CONSTRAINT "project_approvals_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_revision_request_id_revision_requests_id_fk" FOREIGN KEY ("revision_request_id") REFERENCES "public"."revision_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_file_id_private_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."private_files"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_step_id_project_steps_id_fk" FOREIGN KEY ("project_step_id") REFERENCES "public"."project_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_steps" ADD CONSTRAINT "project_steps_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_created_by_id_admin_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."admin_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD CONSTRAINT "revision_requests_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_versions_unique" ON "content_versions" USING btree ("collection","doc_id","version");--> statement-breakpoint
CREATE INDEX "content_versions_doc_idx" ON "content_versions" USING btree ("collection","doc_id");--> statement-breakpoint
CREATE INDEX "media_created_idx" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_active_unique" ON "pages" USING btree ("slug") WHERE "pages"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "project_categories_pair_unique" ON "project_categories" USING btree ("project_id","category_id");--> statement-breakpoint
CREATE INDEX "project_categories_category_idx" ON "project_categories" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_technologies_pair_unique" ON "project_technologies" USING btree ("project_id","technology_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_active_unique" ON "projects" USING btree ("slug") WHERE "projects"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "projects_public_idx" ON "projects" USING btree ("status","published_at","sort_order");--> statement-breakpoint
CREATE INDEX "services_active_order_idx" ON "services" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "testimonials_active_order_idx" ON "testimonials" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "client_projects_tracking_code_unique" ON "client_projects" USING btree ("tracking_code");--> statement-breakpoint
CREATE INDEX "client_projects_archived_idx" ON "client_projects" USING btree ("archived_at","deleted_at");--> statement-breakpoint
CREATE INDEX "payments_project_idx" ON "payments" USING btree ("client_project_id","paid_at");--> statement-breakpoint
CREATE INDEX "project_approvals_project_idx" ON "project_approvals" USING btree ("client_project_id","approved_at");--> statement-breakpoint
CREATE INDEX "project_comments_project_idx" ON "project_comments" USING btree ("client_project_id","created_at");--> statement-breakpoint
CREATE INDEX "project_documents_project_idx" ON "project_documents" USING btree ("client_project_id","sort_order");--> statement-breakpoint
CREATE INDEX "project_milestones_step_idx" ON "project_milestones" USING btree ("project_step_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_steps_number_unique" ON "project_steps" USING btree ("client_project_id","step_number");--> statement-breakpoint
CREATE INDEX "project_updates_project_idx" ON "project_updates" USING btree ("client_project_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "revision_requests_round_unique" ON "revision_requests" USING btree ("client_project_id","round_number");--> statement-breakpoint
CREATE INDEX "revision_requests_status_idx" ON "revision_requests" USING btree ("client_project_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "step_templates_number_unique" ON "step_templates" USING btree ("step_number");