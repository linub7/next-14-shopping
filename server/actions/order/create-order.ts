'use server';

import { createSafeActionClient } from 'next-safe-action';

import { db } from '@/server';
import { orderProduct, orders } from '@/server/schema';
import { CreateOrderSchema } from '@/types/schemas/order/create';
import { auth } from '@/server/auth';

const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .schema(CreateOrderSchema)
  .action(
    async ({ parsedInput: { total, status, products, paymentIntentID } }) => {
      try {
        const session = await auth();
        if (!session) return { error: 'User not found!' };

        const newOrder = await db
          .insert(orders)
          .values({
            status,
            paymentIntentID,
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
    }
  );
