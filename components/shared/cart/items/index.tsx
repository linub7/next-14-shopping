'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { createId } from '@paralleldrive/cuid2';

import emptyCart from '@/public/empty-box.json';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCartStore } from '@/lib/client-store';
import { priceFormatter } from '@/lib/price-formatter';
import { Button } from '@/components/ui/button';

type Props = {};

const CartItems = (props: Props) => {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();

  const totalPrice = useMemo(
    () =>
      cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0),
    [cart]
  );

  const priceInLetters = useMemo(
    () =>
      [...totalPrice.toFixed(2).toString()].map((letter) => ({
        letter,
        id: createId(),
      })),
    [totalPrice]
  );

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Lottie className="w-64 h-64" animationData={emptyCart} />
            <h2 className="text-2xl text-muted-foreground text-center">
              Your Cart is empty
            </h2>
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="h-88 w-full overflow-y-auto">
          <Table className="max-w-2xl mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{priceFormatter(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        priority
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 md:gap-8">
                      <MinusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() =>
                          removeFromCart({
                            ...item,
                            variant: {
                              variantID: item.variant.variantID,
                              quantity: 1,
                            },
                          })
                        }
                        size={14}
                      />
                      <p className="text-base font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() =>
                          addToCart({
                            ...item,
                            variant: {
                              variantID: item.variant.variantID,
                              quantity: 1,
                            },
                          })
                        }
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {cart.length > 0 && (
        <>
          <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
            <span className="text-base font-bold">Total: $</span>
            <AnimatePresence mode="popLayout">
              {priceInLetters.map((letter, i) => (
                <motion.div key={letter.id}>
                  <motion.span
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-base font-bold inline-block"
                  >
                    {letter.letter}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Button
            onClick={() => setCheckoutProgress('payment-page')}
            className="max-w-md w-full"
          >
            Checkout
          </Button>
        </>
      )}
    </motion.div>
  );
};

export default CartItems;
