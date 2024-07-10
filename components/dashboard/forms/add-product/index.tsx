'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AddProductSchema } from '@/types/schemas/dashboard/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Tiptap from '@/components/dashboard/add-product/tiptap';
import { addProduct } from '@/server/actions/product/create';

type Props = {};

const DashboardAddProductForm = (props: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
    mode: 'onChange',
  });

  const { execute, status } = useAction(addProduct, {
    onSuccess(data) {
      if (data?.data?.error) {
        toast.error(data?.data?.error);
      }
      if (data?.data?.success) {
        toast.success(data?.data?.success);
        router.push('/dashboard/products');
      }
    },
    onError() {
      toast.error('OOPS! something went wrong');
    },
    onExecute(data) {
      toast.loading('Creating Product');
    },
  });

  const handleSubmit = (values: z.infer<typeof AddProductSchema>) =>
    execute(values);

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
                    disabled={status === 'executing'}
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
                      disabled={status === 'executing'}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
        <Button
          type="submit"
          disabled={
            status === 'executing' ||
            !form.formState.isValid ||
            !form.formState.isDirty
          }
        >
          Create Product
        </Button>
      </form>
    </Form>
  );
};

export default DashboardAddProductForm;
