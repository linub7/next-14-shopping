import ReviewsForm from '../form/reviews';

type Props = {
  productID: number;
};

const SingleProductPageReviews = async (props: Props) => {
  const { productID } = props;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      <ReviewsForm />
    </section>
  );
};

export default SingleProductPageReviews;
