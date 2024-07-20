'use client';

import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import getStripe from '@/lib/get-stripe';
import { useCartStore } from '@/lib/client-store';
import CartPaymentForm from '../forms/payment';

type Props = {};

const stripe = getStripe();

const CartPayment = (props: Props) => {
  const { cart } = useCartStore();
  const { theme } = useTheme();

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.variant.quantity;
  }, 0);
  return (
    <motion.div className="max-w-2xl mx-auto">
      <Elements
        stripe={stripe}
        options={{
          mode: 'payment',
          currency: 'usd',
          amount: totalPrice * 100,
          appearance: { theme: theme === 'dark' ? 'night' : 'flat' },
        }}
      >
        <CartPaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
};

export default CartPayment;
