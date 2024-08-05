'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { db } from '@/server';
import { products } from '@/server/schema';

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath('/dashboard/products');
      revalidatePath('/');
      return {
        success: `Product ${deletedProduct[0].title} deleted successfully.`,
      };
    } catch (error) {
      console.log({ error });
      return { error: JSON.stringify(error) };
    }
  });
