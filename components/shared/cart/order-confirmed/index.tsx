'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/client-store';
import orderConfirmed from '@/public/order-confirmed.json';

type Props = {};

const OrderConfirmed = (props: Props) => {
  const { setCheckoutProgress } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">Thank you for your purchased</h2>
      <Link href={`/dashboard/orders`}>
        <Button
          onClick={() => {
            setCheckoutProgress('cart-page');
          }}
        >
          View your Orders
        </Button>
      </Link>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Lottie animationData={orderConfirmed} className="h-48 my-4" />
      </motion.div>
    </div>
  );
};

export default OrderConfirmed;
