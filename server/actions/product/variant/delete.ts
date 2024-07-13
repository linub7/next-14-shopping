'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { db } from '@/server';
import { productVariants, variantImages, variantTags } from '@/server/schema';

const actionClient = createSafeActionClient();

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      await db
        .delete(variantTags)
        .where(eq(variantTags.variantID, deletedVariant[0]?.id));

      await db
        .delete(variantImages)
        .where(eq(variantImages.variantID, deletedVariant[0]?.id));

      revalidatePath('/dashboard/products');
      return {
        success: `Variant ${deletedVariant[0]?.productType} has been deleted`,
      };
    } catch (error) {
      console.log({ error });
      return { error: 'Failed to delete variant' };
    }
  });
