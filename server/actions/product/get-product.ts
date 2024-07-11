'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { db } from '@/server';
import { products } from '@/server/schema';

const actionClient = createSafeActionClient();

export const getProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (!product) throw new Error('Product not found!');
      return {
        success: product,
      };
    } catch (error) {
      console.log({ error });
      return { error: 'Failed to get product' };
    }
  });
