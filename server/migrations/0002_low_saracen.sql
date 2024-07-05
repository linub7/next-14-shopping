CREATE TABLE IF NOT EXISTS "email_token" (
	"identifier" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
