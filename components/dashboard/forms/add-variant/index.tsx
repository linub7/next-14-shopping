'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dispatch, SetStateAction, useEffect } from 'react';

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
import AddVariantImages from '../../products/add-variant-images';
import { addVariant } from '@/server/actions/product/variant/create';

type Props = {
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AddVariantForm = (props: Props) => {
  const { editMode, productID, variant, setIsModalOpen } = props;
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
  });

  useEffect(() => {
    setEdit();

    return () => {};
  }, [productID]);

  const setEdit = () => {
    if (!editMode) {
      form.reset();
      return;
    }
    if (editMode && variant) {
      form.setValue('editMode', true);
      form.setValue('id', variant?.id);
      form.setValue('productID', variant?.productID);
      form.setValue('color', variant?.color);
      form.setValue('productType', variant?.productType);
      form.setValue(
        'tags',
        variant?.variantTags?.map((item) => item.tag)
      );
      form.setValue(
        'variantImages',
        variant?.variantImages?.map((item) => ({
          name: item?.name,
          size: item?.size,
          url: item?.url,
        }))
      );
    }
  };

  const { execute, status } = useAction(addVariant, {
    onSuccess(data) {
      if (data?.data?.error) toast.error(data?.data?.error);
      if (data?.data?.success) toast.success(data?.data?.success);
      setIsModalOpen(false);
    },
    onError(error) {
      console.log(error);
      toast.error('OOPS! something went wrong');
    },
  });
  const handleSubmit = (values: z.infer<typeof AddVariantSchema>) =>
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
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Pick a title for your variant"
                    disabled={status === 'executing'}
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
                    disabled={status === 'executing'}
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
          <AddVariantImages />
        </>
        <div className="flex flex-col gap-4 items-center justify-center lg:flex-row">
          {editMode && variant && (
            <Button
              variant={'destructive'}
              type="button"
              onClick={(e) => e.preventDefault()}
              disabled={
                status === 'executing' ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
            >
              Delete Variant
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              status === 'executing' ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
          >
            {editMode ? 'Update Variant' : 'Create Variant'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVariantForm;
