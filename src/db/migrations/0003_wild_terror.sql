CREATE TABLE "admin_session_assurances" (
	"session_id" text PRIMARY KEY NOT NULL,
	"admin_profile_id" text NOT NULL,
	"method" text NOT NULL,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "admin_session_assurance_method_check" CHECK ("admin_session_assurances"."method" IN ('totp', 'recovery_code')),
	CONSTRAINT "admin_session_assurance_expiry_check" CHECK ("admin_session_assurances"."expires_at" > "admin_session_assurances"."verified_at")
);
--> statement-breakpoint
ALTER TABLE "admin_session_assurances" ADD CONSTRAINT "admin_session_assurances_session_id_auth_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."auth_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_session_assurances" ADD CONSTRAINT "admin_session_assurances_admin_profile_id_admin_profiles_id_fk" FOREIGN KEY ("admin_profile_id") REFERENCES "public"."admin_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_session_assurance_profile_idx" ON "admin_session_assurances" USING btree ("admin_profile_id");