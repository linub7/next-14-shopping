'use client';

import { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VariantsWithImagesTags } from '@/lib/infer-type';
import AddVariantForm from '../../forms/add-variant';

type Props = {
  editMode: boolean;
  children: ReactNode;
  productID?: number;
  variant?: VariantsWithImagesTags;
};

const ProductVariant = (props: Props) => {
  const { editMode, children, productID, variant } = props;
  return (
    <Dialog modal={false}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[640px] rounded-md">
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants. You can add tags, images and more.
          </DialogDescription>
        </DialogHeader>
        <AddVariantForm
          editMode={editMode}
          productID={productID}
          variant={variant}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariant;
