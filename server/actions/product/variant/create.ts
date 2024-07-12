'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';

import { db } from '@/server';
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from '@/server/schema';
import { AddVariantSchema } from '@/types/schemas/dashboard/variant';

const actionClient = createSafeActionClient();

export const addVariant = actionClient
  .schema(AddVariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImgs,
      },
    }) => {
      try {
        if (editMode && id) {
          const updatedVariant = await db
            .update(productVariants)
            .set({
              color,
              productType,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, updatedVariant[0]?.id));
          await db.insert(variantTags).values(
            tags?.map((tag: any) => ({
              tag,
              variantID: updatedVariant[0]?.id,
            }))
          );

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, updatedVariant[0]?.id));
          await db.insert(variantImages).values(
            newImgs.map((img: any, index: number) => ({
              name: img?.name,
              size: img?.size,
              url: img?.url,
              variantID: updatedVariant[0]?.id,
              order: index,
            }))
          );
          revalidatePath('/dashboard/products');
          return { success: `Updated ${productType}` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();
          await db.insert(variantTags).values(
            tags?.map((tag: any) => ({
              tag,
              variantID: newVariant[0]?.id,
            }))
          );
          await db.insert(variantImages).values(
            newImgs.map((img: any, index: number) => ({
              name: img?.name,
              size: img?.size,
              url: img?.url,
              variantID: newVariant[0]?.id,
              order: index,
            }))
          );
          revalidatePath('/dashboard/products');
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        console.log({ error });
        return { error: 'Failed to create variant' };
      }
    }
  );
