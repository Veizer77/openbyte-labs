CREATE TABLE "project_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_project_id" uuid NOT NULL,
	"invoice_number" text NOT NULL,
	"title" text NOT NULL,
	"amount" integer NOT NULL,
	"due_at" date NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_invoices_invoice_number_unique" UNIQUE("invoice_number"),
	CONSTRAINT "project_invoices_amount_check" CHECK ("project_invoices"."amount" > 0),
	CONSTRAINT "project_invoices_number_check" CHECK ("project_invoices"."invoice_number" ~ '^INV-[0-9]{4}-[A-Z0-9-]{3,32}$'),
	CONSTRAINT "project_invoices_status_check" CHECK ("project_invoices"."status" IN ('draft', 'issued', 'void'))
);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "invoice_id" uuid;--> statement-breakpoint
ALTER TABLE "project_invoices" ADD CONSTRAINT "project_invoices_client_project_id_client_projects_id_fk" FOREIGN KEY ("client_project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_invoices" ADD CONSTRAINT "project_invoices_created_by_id_admin_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."admin_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_invoices_project_due_idx" ON "project_invoices" USING btree ("client_project_id","due_at");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_project_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."project_invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id","paid_at");