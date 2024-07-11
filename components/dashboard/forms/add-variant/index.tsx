'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';

import { AddVariantSchema } from '@/types/schemas/dashboard/variant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VariantsWithImagesTags } from '@/lib/infer-type';
import AddVariantInputTags from '../../products/input-tags';

type Props = {
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
};

const AddVariantForm = (props: Props) => {
  const { editMode, productID, variant } = props;
  const form = useForm<z.infer<typeof AddVariantSchema>>({
    resolver: zodResolver(AddVariantSchema),
    defaultValues: {
      color: '#000000',
      productType: 'Black Notebook',
      tags: [],
      variantImages: [],
      editMode,
      id: undefined,
      productID,
    },
    mode: 'onBlur',
  });
  // const handleSubmit = (values: z.infer<typeof AddVariantSchema>) =>
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
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Pick a title for your variant"
                    // disabled={status === 'executing'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="color"
                    // disabled={status === 'executing'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <AddVariantInputTags
                    {...field}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <AddVariantImages /> */}
        </>
        {editMode && variant && (
          <Button
            type="button"
            onClick={(e) => e.preventDefault()}
            //   disabled={
            //     status === 'executing' ||
            //     !form.formState.isValid ||
            //     !form.formState.isDirty
            //   }
          >
            Delete Variant
          </Button>
        )}
        <Button
          type="submit"
          //   disabled={
          //     status === 'executing' ||
          //     !form.formState.isValid ||
          //     !form.formState.isDirty
          //   }
        >
          {editMode ? 'Update Variant' : 'Create Variant'}
        </Button>
      </form>
    </Form>
  );
};

export default AddVariantForm;
