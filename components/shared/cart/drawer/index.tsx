'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCartStore } from '@/lib/client-store';
import CartItems from '../items';
import CartMessage from '../message';
import CartPayment from '../payment';
import OrderConfirmed from '../order-confirmed';
import CartProgress from '../progress';

type Props = {};

const CartDrawer = (props: Props) => {
  const { cart, checkoutProgress, cartOpen, setCartOpen } = useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-0.5 right-0 w-4 h-4 bg-primary text-xs text-white font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-50vh">
        <DrawerHeader className="w-full flex flex-col items-center justify-center">
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        <div className="overflow-auto p-4">
          {checkoutProgress === 'cart-page' ? (
            <CartItems />
          ) : checkoutProgress === 'payment-page' ? (
            <CartPayment />
          ) : checkoutProgress === 'confirmation-page' ? (
            <OrderConfirmed />
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
