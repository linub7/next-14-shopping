'use server';
import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';

import { db } from '@/server';
import { reviews } from '@/server/schema';
import { AddReviewSchema } from '@/types/schemas/reviews/create';
import { auth } from '@/server/auth';

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .schema(AddReviewSchema)
  .action(async ({ parsedInput: { productID, rating, comment } }) => {
    try {
      const session = await auth();
      if (!session) return { error: 'Please sign in' };

      const existedReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });
      if (existedReview)
        return { error: 'you have already reviewed this product.' };
      const newReview = await db
        .insert(reviews)
        .values({
          userID: session.user.id,
          productID,
          rating,
          comment,
        })
        .returning();
      revalidatePath(`/products/${productID}`);
      return { success: newReview[0] };
    } catch (error) {
      console.log({ error });
      return { error: JSON.stringify(error) };
    }
  });
