'use client';

import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
  rating: number;
  totalReviews?: number;
  size?: number;
};

const SingleProductPageReviewsListStars = (props: Props) => {
  const { rating, totalReviews, size = 14 } = props;

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            'text-primary bg-transparent transition-all duration-300 ease-in-out',
            rating >= star ? 'fill-primary' : 'fill-transparent'
          )}
        />
      ))}
      {totalReviews ? (
        <span className="text-secondary-foreground font-bold text-sm ml-2">
          {totalReviews} reviews
        </span>
      ) : null}
    </div>
  );
};

export default SingleProductPageReviewsListStars;
