'use client';

import { FormEvent, useState } from 'react';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

import { useCartStore } from '@/lib/client-store';
import { Button } from '@/components/ui/button';
import { createPaymentIntent } from '@/server/actions/payment/create-payment-intent';
import { createOrder } from '@/server/actions/order/create-order';

type Props = {
  totalPrice: number;
};

const CartPaymentForm = (props: Props) => {
  const { totalPrice } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress } = useCartStore();

  const { execute } = useAction(createOrder, {
    onSuccess(data) {
      if (data?.data?.error) {
        setIsLoading(false);
        toast.error(data?.data?.error);
        return;
      }
      if (data?.data?.success) {
        setIsLoading(false);
        toast.success(data?.data?.success);
        setCheckoutProgress('confirmation-page');
      }
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }
    const data = await createPaymentIntent({
      amount: totalPrice * 100,
      currency: 'usd',
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });
    if (data?.data?.error) {
      setErrorMessage(data?.data?.error);
      setIsLoading(false);
      return;
    }
    if (data?.data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data?.data?.success?.clientSecretID!,
        redirect: 'if_required',
        confirmParams: {
          return_url: 'http://localhost:3000/success',
          receipt_email: data?.data?.success?.user as string,
        },
      });
      if (error) {
        setErrorMessage(error?.message!);
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        execute({
          total: totalPrice,
          status: 'pending',
          products: cart.map((item) => ({
            quantity: item?.variant?.quantity,
            variantID: item?.variant?.variantID,
            productID: item?.id,
          })),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement
        options={{
          mode: 'shipping',
        }}
      />
      <Button
        className="my-4 w-full"
        disabled={!stripe || !elements || isLoading}
      >
        <span>{isLoading ? 'Processing...' : 'Pay now'}</span>
      </Button>
    </form>
  );
};

export default CartPaymentForm;
