'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

type Props = {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productID: number;
  image: string;
};

const SingleProductPageProductPick = (props: Props) => {
  const { id, color, productType, title, price, productID, image } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get('type' || productType);
  const handleNavigate = () =>
    router.push(
      `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}`,
      { scroll: false }
    );
  return (
    <div
      style={{ background: color }}
      className={cn(
        'w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hover: opacity-75',
        selectedColor === productType ? 'opacity-100' : 'opacity-50'
      )}
      onClick={handleNavigate}
    ></div>
  );
};

export default SingleProductPageProductPick;
