'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { MinusCircle, PlusCircle } from 'lucide-react';

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

type Props = {};

const CartItems = (props: Props) => {
  const { cart, addToCart, removeFromCart } = useCartStore();

  const totalPrice = useMemo(
    () =>
      cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0),
    [cart]
  );

  return (
    <div>
      {cart.length === 0 && (
        <div>
          <h1>Cart is empty</h1>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table>
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
    </div>
  );
};

export default CartItems;
