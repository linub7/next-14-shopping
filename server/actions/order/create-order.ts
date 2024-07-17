'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';

import { db } from '@/server';
import { orderProduct, orders, products } from '@/server/schema';
import { CreateOrderSchema } from '@/types/schemas/order/create';
import { auth } from '@/server/auth';

const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .schema(CreateOrderSchema)
  .action(async ({ parsedInput: { total, status, products } }) => {
    try {
      const session = await auth();
      if (!session) return { error: 'User not found!' };

      const newOrder = await db
        .insert(orders)
        .values({
          status,
          total,
          userID: session.user.id,
        })
        .returning();
      const orderProducts = products.map(
        async (el: {
          quantity: number;
          variantID: number;
          productID: number;
        }) => {
          const newOrderProduct = await db.insert(orderProduct).values({
            quantity: el.quantity,
            productID: el.productID,
            productVariantID: el.variantID,
            orderID: newOrder[0]?.id,
          });
        }
      );
      return { success: 'Order has been added' };
    } catch (error) {
      console.log({ error });
    }
  });
