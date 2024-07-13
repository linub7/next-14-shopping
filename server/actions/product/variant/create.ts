'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import algoliasearch from 'algoliasearch';

import { db } from '@/server';
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from '@/server/schema';
import { AddVariantSchema } from '@/types/schemas/dashboard/variant';
import {
  ALGOLIA_WRITE_API_KEY,
  NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
} from '@/utils/env';

const actionClient = createSafeActionClient();

const algoliaClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  ALGOLIA_WRITE_API_KEY!
);
const algoliaIndex = algoliaClient.initIndex('products');

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
          algoliaIndex.partialUpdateObject({
            objectID: updatedVariant[0]?.id?.toString(),
            id: updatedVariant[0]?.productID,
            productType: updatedVariant[0]?.productType,
            variantImages: newImgs[0]?.url,
          });
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
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });
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
          if (product) {
            algoliaIndex.saveObject({
              objectID: newVariant[0]?.id?.toString(),
              id: newVariant[0]?.productID,
              title: product?.title,
              price: product?.price,
              productType: newVariant[0]?.productType,
              variantImages: newImgs[0]?.url,
            });
          }
          revalidatePath('/dashboard/products');
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        console.log({ error });
        return { error: 'Failed to create variant' };
      }
    }
  );
