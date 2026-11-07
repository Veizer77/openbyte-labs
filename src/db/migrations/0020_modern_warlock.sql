ALTER TABLE "client_projects" ADD COLUMN "source_inquiry_id" uuid;--> statement-breakpoint
ALTER TABLE "client_projects" ADD COLUMN "source_quote_request_id" uuid;--> statement-breakpoint
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_source_inquiry_id_inquiries_id_fk" FOREIGN KEY ("source_inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_source_quote_request_id_quote_requests_id_fk" FOREIGN KEY ("source_quote_request_id") REFERENCES "public"."quote_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "client_projects_source_inquiry_unique" ON "client_projects" USING btree ("source_inquiry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_projects_source_quote_unique" ON "client_projects" USING btree ("source_quote_request_id");--> statement-breakpoint
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_single_source_check" CHECK ("client_projects"."source_inquiry_id" IS NULL OR "client_projects"."source_quote_request_id" IS NULL);