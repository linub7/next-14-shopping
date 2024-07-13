'use client';

import { forwardRef, ReactNode, useState } from 'react';

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

const ProductVariant = forwardRef<HTMLInputElement, Props>(
  ({ editMode, children, productID, variant }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <Dialog modal={false} open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[640px] rounded-md">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit' : 'Create'} your variant
            </DialogTitle>
            <DialogDescription>
              Manage your product variants. You can add tags, images and more.
            </DialogDescription>
          </DialogHeader>
          <AddVariantForm
            editMode={editMode}
            productID={productID}
            variant={variant}
            setIsModalOpen={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }
);

ProductVariant.displayName = 'ProductVariant';

export default ProductVariant;
