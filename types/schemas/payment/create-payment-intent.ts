import * as z from 'zod';

export const CreatePaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number(),
      productID: z.number(),
      price: z.number(),
      title: z.string(),
      image: z.string(),
    })
  ),
});
