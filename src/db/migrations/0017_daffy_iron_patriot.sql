ALTER TABLE "pages" ADD COLUMN "publication_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "publication_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "pages" SET "publication_enabled" = true WHERE "status" = 'published' AND "deleted_at" IS NULL;--> statement-breakpoint
UPDATE "projects" SET "publication_enabled" = true WHERE "status" = 'published' AND "deleted_at" IS NULL;
