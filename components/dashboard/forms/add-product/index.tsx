'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DollarSign } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AddProductSchema } from '@/types/schemas/dashboard/product';
import FormErrorMessage from '@/components/shared/messages/error';
import FormSuccessMessage from '@/components/shared/messages/success';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Tiptap from '@/components/dashboard/add-product/tiptap';

type Props = {};

const DashboardAddProductForm = (props: Props) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  // const { execute, status } = useAction(updateSettings, {
  //   onSuccess(data) {
  //     if (data?.data?.error) {
  //       setError(data?.data?.error);
  //       setTimeout(() => {
  //         setError('');
  //       }, 3000);
  //     }
  //     if (data?.data?.success) {
  //       setSuccess(data?.data?.success);
  //       setTimeout(() => {
  //         setSuccess('');
  //       }, 3000);
  //     }
  //   },
  //   onError() {
  //     setError('OOPS! something went wrong');
  //   },
  // });

  // const handleSubmit = (values: z.infer<typeof DashboardSettingsSchema>) =>
  //   execute(values);
  const handleSubmit = () => {};
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Product Title"
                    // disabled={status === 'executing'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Tiptap val={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    <DollarSign size={36} className="p-2 bg-muted rounded-md" />
                    <Input
                      {...field}
                      type="number"
                      placeholder="Your price in USD"
                      step={'0.1'}
                      min={0}
                      // disabled={status === 'executing'}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
        <FormErrorMessage message={error} />
        <FormSuccessMessage message={success} />
        <Button
          type="submit"
          //   disabled={
          //     status === 'executing' ||
          //     !form.formState.isValid ||
          //     !form.formState.isDirty
          //   }
        >
          Create Product
        </Button>
      </form>
    </Form>
  );
};

export default DashboardAddProductForm;
