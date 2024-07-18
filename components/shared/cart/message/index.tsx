'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { useCartStore } from '@/lib/client-store';
import { DrawerDescription, DrawerTitle } from '@/components/ui/drawer';

type Props = {};

const CartMessage = (props: Props) => {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();
  return (
    <motion.div animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 10 }}>
      <DrawerTitle className="text-center">
        {checkoutProgress === 'cart-page'
          ? 'Your Cart Items'
          : checkoutProgress === 'payment-page'
          ? 'Choose a payment method'
          : checkoutProgress === 'confirmation-page'
          ? 'Order Confirmed'
          : null}
      </DrawerTitle>
      <DrawerDescription className="text-center py-1">
        {checkoutProgress === 'cart-page' ? (
          'View and edit your bag'
        ) : checkoutProgress === 'payment-page' ? (
          <span
            onClick={() => setCheckoutProgress('cart-page')}
            className="cursor-pointer flex flex-row-reverse items-center justify-center gap-2 hover:text-primary"
          >
            Head back to Cart
            <ArrowLeft size={14} />
          </span>
        ) : checkoutProgress === 'confirmation-page' ? (
          ''
        ) : null}
      </DrawerDescription>
    </motion.div>
  );
};

export default CartMessage;
