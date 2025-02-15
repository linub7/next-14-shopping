'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { VariantsWithImagesTagsProduct } from '@/lib/infer-type';
import { Badge } from '@/components/ui/badge';
import { priceFormatter } from '@/lib/price-formatter';

type Props = {
  variants: VariantsWithImagesTagsProduct[];
};

const HomeProducts = (props: Props) => {
  const { variants } = props;
  const searchParams = useSearchParams();
  const paramTag = searchParams.get('tag');

  const filteredVariants = useMemo(() => {
    if (!paramTag && variants) return variants;
    if (paramTag && variants)
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
  }, [paramTag]);
  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 h-[300px]">
      {filteredVariants?.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant?.product?.id}&price=${variant?.product?.price}&title=${variant?.product?.title}&type=${variant?.productType}&image=${variant.variantImages[0].url}`}
        >
          <div className="flex flex-col">
            <Image
              className="rounded-md w-full h-96 object-cover pb-2 flex-1"
              src={variant.variantImages[0].url}
              alt={variant.product.title}
              width={720}
              height={480}
              loading="lazy"
            />
            <div className="flex justify-between items-center">
              <div className="font-medium">
                <h2>{variant?.product?.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {variant?.productType}
                </p>
              </div>
              <div>
                <Badge className="text-sm" variant={'secondary'}>
                  {priceFormatter(variant?.product?.price)}
                </Badge>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
};

export default HomeProducts;
