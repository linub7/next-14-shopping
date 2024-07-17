import { Stripe, loadStripe } from '@stripe/stripe-js';

import { NEXT_PUBLIC_STRIPE_PUBLISH_KEY } from '@/utils/env';
import exp from 'constants';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise)
    stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISH_KEY!);
  return stripePromise;
};

export default getStripe;
