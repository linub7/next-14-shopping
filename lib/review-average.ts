export const getReviewAverage = (reviews: number[]) =>
  reviews?.length === 0
    ? 0
    : reviews.reduce((acc, review) => acc + review, 0) / reviews.length;
