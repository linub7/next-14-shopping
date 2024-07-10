'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';

import { AddProductSchema } from '@/types/schemas/dashboard/product';
import { db } from '@/server';
import { products } from '@/server/schema';

const actionClient = createSafeActionClient();

export const addProduct = actionClient
  .schema(AddProductSchema)
  .action(async ({ parsedInput: { title, description, price, id } }) => {
    try {
      if (id) {
        const existingProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!existingProduct) return { error: 'Product not found' };
        const updatedProduct = await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id))
          .returning();
        return {
          success: `Product ${updatedProduct[0].title} updated successfully`,
        };
      } else {
        const newProduct = await db
          .insert(products)
          .values({
            title,
            description,
            price,
          })
          .returning();
        return {
          success: `Product ${newProduct[0].title} created successfully`,
        };
      }
    } catch (error) {
      console.log({ error });
      return { error: JSON.stringify(error) };
    }
  });
