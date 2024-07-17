'use server';

import Stripe from 'stripe';
import { createSafeActionClient } from 'next-safe-action';

import { STRIPE_SECRET } from '@/utils/env';
import { CreatePaymentIntentSchema } from '@/types/schemas/payment/create-payment-intent';
import { auth } from '@/server/auth';

const stripe = new Stripe(STRIPE_SECRET!);

const actionClient = createSafeActionClient();

export const createPaymentIntent = actionClient
  .schema(CreatePaymentIntentSchema)
  .action(async ({ parsedInput: { amount, currency, cart } }) => {
    try {
      const session = await auth();
      if (!session) return { error: 'Please login to continue' };
      if (!amount) return { error: 'No Product to checkout' };

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          cart: JSON.stringify(cart),
        },
      });
      return {
        success: {
          paymentIntentID: paymentIntent.id,
          clientSecretID: paymentIntent.client_secret,
          user: session.user.email,
        },
      };
    } catch (error) {
      console.log({ error });
    }
  });
