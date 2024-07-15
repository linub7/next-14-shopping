import { eq } from 'drizzle-orm';

import { db } from '@/server';
import ReviewsForm from '../form/reviews';
import { reviews } from '@/server/schema';
import SingleProductPageReviewsList from './list';
import ReviewsChart from './chart';

type Props = {
  productID: number;
};

const SingleProductPageReviews = async (props: Props) => {
  const { productID } = props;
  const data = await db.query.reviews.findMany({
    where: eq(reviews.productID, productID),
    with: {
      user: true,
    },
    orderBy: (reviews, { desc }) => [desc(reviews.created)],
  });

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-12 justify-stretch">
        <div className="flex-1">
          <SingleProductPageReviewsList reviews={data} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewsForm />
          <ReviewsChart reviews={data} />
        </div>
      </div>
    </section>
  );
};

export default SingleProductPageReviews;
