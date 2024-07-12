'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useFieldArray, useFormContext } from 'react-hook-form';
import * as z from 'zod';
import { Trash } from 'lucide-react';
import { Reorder } from 'framer-motion';

import { AddVariantSchema } from '@/types/schemas/dashboard/variant';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UploadDropzone } from '@/app/api/uploadthing/upload';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {};

const AddVariantImages = (props: Props) => {
  const [active, setActive] = useState(0);

  const { getValues, control, setError } =
    useFormContext<z.infer<typeof AddVariantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: 'variantImages',
  });
  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <UploadDropzone
                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                onUploadError={(error) => {
                  setError('variantImages', {
                    type: 'validate',
                    message: error?.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={(files) => {
                  files.map((file) =>
                    append({
                      name: file?.name,
                      size: file?.size,
                      url: URL.createObjectURL(file),
                    })
                  );
                  return files;
                }}
                onClientUploadComplete={(files) => {
                  const images = getValues('variantImages');
                  images?.map((field, imgIDX) => {
                    if (field?.url?.search('blob:') === 0) {
                      const image = files.find(
                        (img) => img?.name === field?.name
                      );
                      if (image)
                        update(imgIDX, {
                          url: image?.url,
                          name: image?.name,
                          size: image?.size,
                          key: image?.key,
                        });
                    }
                  });
                  return;
                }}
                config={{ mode: 'auto' }}
                endpoint="variantUploader"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[active];
              e.map((item, idx) => {
                if (item === activeElement) {
                  move(active, idx);
                  setActive(idx);
                  return;
                }
                return;
              });
            }}
          >
            {fields.map((field, index) => (
              <Reorder.Item
                as="tr"
                key={field.id}
                id={field.id}
                value={field}
                onDragStart={() => setActive(index)}
                className={cn(
                  field.url.search('blob:') === 0
                    ? 'animate-pulse transition-all'
                    : '',
                  'text-sm font-bold text-muted-foreground hover:text-primary'
                )}
              >
                <TableCell>{index}</TableCell>
                <TableCell>{field?.name}</TableCell>
                <TableCell>
                  {(field?.size / (1024 * 1024)).toFixed(2)} MB
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Image
                      className="rounded-md"
                      src={field?.url}
                      alt={field?.name}
                      width={72}
                      height={48}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      remove(index);
                    }}
                    className="scale-75"
                    variant={'ghost'}
                  >
                    <Trash className="h-4" />
                  </Button>
                </TableCell>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
};

export default AddVariantImages;
