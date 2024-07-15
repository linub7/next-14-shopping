'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatDistance, subDays } from 'date-fns';

import placeholder from '@/public/placeholder_small.jpg';
import { ReviewsWithUser } from '@/lib/infer-type';
import { Card } from '@/components/ui/card';
import SingleProductPageReviewsListStars from '../stars';

type Props = {
  reviews: ReviewsWithUser[];
};

const SingleProductPageReviewsList = (props: Props) => {
  const { reviews } = props;
  return (
    <motion.div className="flex flex-col gap-4 my-2">
      {reviews?.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full"
              src={review?.user?.image ? review?.user?.image : placeholder.src}
              alt={review.user.name!}
              width={32}
              height={32}
            />
            <div>
              <p className="text-sm font-bold">{review?.user?.name}</p>
              <div className="flex items-center gap-2">
                <SingleProductPageReviewsListStars rating={review?.rating} />
                <p className="text-xs font-bold text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}
                </p>
              </div>
            </div>
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
          {/* <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      ))}
    </motion.div>
  );
};

export default SingleProductPageReviewsList;
