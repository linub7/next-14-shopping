'use client';

import { ShoppingBag } from 'lucide-react';

import { useCartStore } from '@/lib/client-store';

type Props = {};

const CartDrawer = (props: Props) => {
  const { cart } = useCartStore();
  return (
    <div>
      <ShoppingBag />
    </div>
  );
};

export default CartDrawer;
