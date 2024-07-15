CREATE TABLE IF NOT EXISTS "email_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "email_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "password_reset_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"productType" text NOT NULL,
	"updated" timestamp DEFAULT now(),
	"productID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"price" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	"userID" text,
	CONSTRAINT "two_factor_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
DROP TABLE "email_token";--> statement-breakpoint
DROP TABLE "password_reset_token";--> statement-breakpoint
DROP TABLE "product_variant";--> statement-breakpoint
DROP TABLE "product";--> statement-breakpoint
DROP TABLE "two_factor_token";--> statement-breakpoint
DROP TABLE "variant_image";--> statement-breakpoint
DROP TABLE "variant_tag";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_productID_product_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customerID" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_tokens" ADD CONSTRAINT "two_factor_tokens_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
