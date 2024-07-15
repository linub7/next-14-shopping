'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AddReviewSchema } from '@/types/schemas/reviews/create';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { addReview } from '@/server/actions/product/review/create';

type Props = {};

const ReviewsForm = (props: Props) => {
  const searchParams = useSearchParams();
  const productID = Number(searchParams.get('productID'));

  const form = useForm<z.infer<typeof AddReviewSchema>>({
    resolver: zodResolver(AddReviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      productID,
    },
    mode: 'onChange',
  });
  const { execute, status } = useAction(addReview, {
    onSuccess(data) {
      if (data?.data?.error) {
        toast.error(data?.data?.error);
      }
      if (data?.data?.success) {
        toast.success('Review added successfully.');
        form.reset();
      }
    },
    onError() {
      toast.error('OOPS! something went wrong');
    },
  });

  const handleSubmit = (values: z.infer<typeof AddReviewSchema>) =>
    execute({
      comment: values.comment,
      rating: values.rating,
      productID,
    });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={'secondary'}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave your review</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What's your opinion about this product?"
                        disabled={status === 'executing'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave your rating</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="hidden"
                        placeholder="Star rating"
                        disabled={status === 'executing'}
                      />
                    </FormControl>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <motion.div
                          key={val}
                          className="relative cursor-pointer"
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Star
                            key={val}
                            onClick={() =>
                              form.setValue('rating', val, {
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              'text-primary bg-transparent transition-all duration-300 ease-in-out',
                              form.getValues('rating') >= val
                                ? 'fill-primary'
                                : 'fill-muted'
                            )}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            <Button
              className="w-full"
              type="submit"
              disabled={status === 'executing'}
            >
              {status === 'executing' ? 'Adding Review...' : 'Add My Review'}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default ReviewsForm;
