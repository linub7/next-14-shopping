ALTER TABLE "email_token" DROP CONSTRAINT "email_token_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "email_token" ADD CONSTRAINT "email_token_id_token_pk" PRIMARY KEY("id","token");--> statement-breakpoint
ALTER TABLE "email_token" ADD COLUMN "id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_token" DROP COLUMN IF EXISTS "identifier";