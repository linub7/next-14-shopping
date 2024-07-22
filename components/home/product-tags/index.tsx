'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {};

const ProductTags = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  const handleSetFilter = (tag: string) => {
    if (tag) router.push(`?tag=${tag}`);
    else router.push('/');
  };
  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        onClick={() => handleSetFilter('')}
        className={cn(
          'cursor-pointer hover:bg-black dark:bg-white dark:text-black hover:opacity-100',
          !tag
            ? 'opacity-100 bg-black/75 dark:bg-white dark:text-black'
            : 'opacity-50 bg-muted-foreground'
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => handleSetFilter('blue')}
        className={cn(
          'cursor-pointer bg-blue-500 hover:bg-blue-600 hover:opacity-100',
          tag === 'blue' ? 'opacity-100' : 'opacity-50'
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => handleSetFilter('green')}
        className={cn(
          'cursor-pointer bg-green-500 hover:bg-green-600 hover:opacity-100',
          tag === 'green' ? 'opacity-100' : 'opacity-50'
        )}
      >
        Green
      </Badge>
      <Badge
        onClick={() => handleSetFilter('purple')}
        className={cn(
          'cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100',
          tag === 'purple' ? 'opacity-100' : 'opacity-50'
        )}
      >
        Purple
      </Badge>
      <Badge
        onClick={() => handleSetFilter('yellow')}
        className={cn(
          'cursor-pointer bg-yellow-500 hover:bg-yellow-600 hover:opacity-100',
          tag === 'yellow' ? 'opacity-100' : 'opacity-50'
        )}
      >
        Yellow
      </Badge>
      <Badge
        onClick={() => handleSetFilter('red')}
        className={cn(
          'cursor-pointer bg-red-500 hover:bg-red-600 hover:opacity-100',
          tag === 'red' ? 'opacity-100' : 'opacity-50'
        )}
      >
        Red
      </Badge>
    </div>
  );
};

export default ProductTags;
