'use client';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReviewsWithUser } from '@/lib/infer-type';
import { getReviewAverage } from '@/lib/review-average';
import { ratingByStars } from '@/lib/rating-by-stars';
import { Progress } from '@/components/ui/progress';

type Props = {
  reviews: ReviewsWithUser[];
};

const ReviewsChart = (props: Props) => {
  const { reviews } = props;
  const totalRating = getReviewAverage(reviews?.map((r) => r.rating));

  const getRatingsByStars = useMemo(() => ratingByStars(reviews), [reviews]);

  return (
    <Card className="flex flex-col p-8 rounded-md gap-4">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription className="font-medium text-lg">
          {totalRating.toFixed(1)} Stars
        </CardDescription>
      </div>
      {getRatingsByStars.map((rating, index) => (
        <div key={index} className="flex gap-2 justify-between items-center">
          <p className="text-xs font-medium flex gap-1">
            {index + 1} <span>Stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
};

export default ReviewsChart;
