'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCartStore } from '@/lib/client-store';
import { Button } from '@/components/ui/button';
import CartItems from '../items';

type Props = {};

const CartDrawer = (props: Props) => {
  const { cart } = useCartStore();
  return (
    <Drawer>
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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Card Stuff</DrawerTitle>
          <DrawerDescription>Your Shopping Card</DrawerDescription>
        </DrawerHeader>
        <CartItems />
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
