'use client';

import { useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useCartStore } from '@/lib/client-store';
import { Button } from '@/components/ui/button';

type Props = {};

const SingleProductPageAddToCart = (props: Props) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const params = useSearchParams();
  const title = params.get('title');
  const type = params.get('type');
  const id = Number(params.get('id'));
  const productID = Number(params.get('productID'));
  const price = Number(params.get('price'));
  const image = params.get('image');

  if (!id || !productID || !title || !type || !price || !image) {
    toast.error('Product not found');
    return redirect('/');
  }

  const handleAddToCart = () => {
    toast.success(`Added ${title} ${type} to your cart`);
    addToCart({
      id: productID,
      image,
      name: `${title} ${type}`,
      price,
      variant: {
        quantity,
        variantID: id,
      },
    });
  };
  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          variant={'secondary'}
          className="text-primary"
          onClick={() => quantity > 1 && setQuantity((prev) => prev - 1)}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          variant={'secondary'}
          className="text-primary"
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </>
  );
};

export default SingleProductPageAddToCart;
