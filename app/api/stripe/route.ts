import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { STRIPE_SECRET, STRIPE_WEBHOOK_SECRET } from '@/utils/env';
import { db } from '@/server';
import { orders } from '@/server/schema';

// export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(STRIPE_SECRET || '', {
    apiVersion: '2024-04-10',
  });
  const sig = req.headers.get('stripe-signature') || '';
  const signingSecret = STRIPE_WEBHOOK_SECRET || '';

  // Read the request body as text
  const reqText = await req.text();
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // Handle the event just an example!
  switch (event.type) {
    case 'payment_intent.succeeded':
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ['latest_charge'] }
      );
      const charge = retrieveOrder.latest_charge as Stripe.Charge;

      const customer = await db
        .update(orders)
        .set({
          status: 'succeeded',
          receiptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentID, event.data.object.id))
        .returning();

      // Then define and call a function to handle the event product.created
      break;

    default:
      console.log(`${event.type}`);
  }

  return new Response('ok', { status: 200 });
}
