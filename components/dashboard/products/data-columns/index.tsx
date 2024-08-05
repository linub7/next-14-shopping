'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import Link from 'next/link';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductColumn } from '@/types/@types/product';
import { deleteProduct } from '@/server/actions/product/delete';
import { VariantsWithImagesTags } from '@/lib/infer-type';
import ProductVariant from '../product-variant';

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const { execute, status } = useAction(deleteProduct, {
    onSuccess(data) {
      if (data?.data?.success) toast.success(data?.data?.success);
      if (data?.data?.error) toast.error(data?.data?.error);
    },
  });

  const product = row.original;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'variants',
    header: 'Variants',
    cell: ({ row }) => {
      const variants = row.getValue('variants') as VariantsWithImagesTags[];
      return (
        <div className="flex items-center gap-2">
          {variants?.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      productID={variant.productID}
                      variant={variant}
                      editMode={true}
                    >
                      <div
                        className="h-5 w-5 rounded-full"
                        key={variant.id}
                        style={{ background: variant.color }}
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant?.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant productID={row.original.id} editMode={false}>
                    <span className="text-primary">
                      <PlusCircle className="h-5 w-5" />
                    </span>
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new Variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const cellImage = row.getValue('image') as string;
      const cellTitle = row.getValue('title') as string;
      return (
        <div className="">
          <Image
            className="rounded-md"
            src={cellImage}
            alt={cellTitle}
            width={50}
            height={50}
          />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ActionCell,
  },
];
