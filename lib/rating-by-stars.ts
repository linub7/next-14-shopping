import { ReviewsWithUser } from './infer-type';

export const ratingByStars = (reviews: ReviewsWithUser[]) => {
  const ratingValues = Array.from({ length: 5 }, () => 0);
  const totalReviews = reviews?.length;
  reviews.forEach((review) => {
    const starIndex = review.rating - 1;
    if (starIndex >= 0 && starIndex < 5) {
      ratingValues[starIndex]++;
    }
  });
  return ratingValues.map((rating) => (rating / totalReviews) * 100);
};
