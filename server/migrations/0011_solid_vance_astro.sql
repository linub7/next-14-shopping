ALTER TABLE "review" RENAME TO "reviews";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "review_userID_user_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "review_productID_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productID_product_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
