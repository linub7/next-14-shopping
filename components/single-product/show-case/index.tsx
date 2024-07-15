'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { VariantsWithImagesTags } from '@/lib/infer-type';
import { cn } from '@/lib/utils';

type Props = {
  variants: VariantsWithImagesTags[];
};

const SingleProductPageShowCase = (props: Props) => {
  const { variants } = props;

  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);

  const searchParams = useSearchParams();
  const selectedColor = searchParams.get('type') || variants[0].productType;

  useEffect(() => {
    if (!api) return;
    api.on('slidesInView', (e) => setActiveThumbnail(e.slidesInView()));

    return () => {};
  }, [api]);

  const handleUpdatePreview = (index: number) => api?.scrollTo(index);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants?.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img) => (
              <CarouselItem key={img.url}>
                {img.url ? (
                  <Image
                    priority
                    className="rounded-md"
                    src={img.url}
                    alt={img.name}
                    width={1280}
                    height={720}
                  />
                ) : null}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants?.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, index) => (
              <div key={img.url}>
                {img.url ? (
                  <Image
                    className={cn(
                      index === activeThumbnail[0]
                        ? 'opacity-100'
                        : 'opacity-75',
                      'rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-110'
                    )}
                    src={img.url}
                    alt={img.name}
                    width={72}
                    height={48}
                    onClick={() => handleUpdatePreview(index)}
                  />
                ) : null}
              </div>
            ))
        )}
      </div>
    </Carousel>
  );
};

export default SingleProductPageShowCase;
