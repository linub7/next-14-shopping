'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductColumn } from '@/types/@types/product';
import { deleteProduct } from '@/server/actions/product/delete';

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const { execute, status } = useAction(deleteProduct, {
    onSuccess(data) {
      if (data?.data?.success) toast.success(data?.data?.success);
      if (data?.data?.error) toast.error(data?.data?.error);
    },
    onExecute(data) {
      toast.loading('Product is deleting');
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
