import { eq } from 'drizzle-orm';

import { db } from '@/server';
import { productVariants } from '@/server/schema';
import SingleProductPageProductType from '@/components/home/single-product/product-type';
import { Separator } from '@/components/ui/separator';
import { priceFormatter } from '@/lib/price-formatter';
import SingleProductPageProductPick from '@/components/home/single-product/product-pick';
import SingleProductPageShowCase from '@/components/home/single-product/show-case';
import SingleProductPageReviews from '@/components/home/single-product/reviews';

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      product: true,
      variantImages: true,
      variantTags: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (!data) return [];

  const slugIDs = data.map((variant) => ({ slug: variant.id.toString() }));
  return slugIDs;
}

type Props = {
  params: { slug: string };
};

const SingleProductPage = async (props: Props) => {
  const {
    params: { slug },
  } = props;
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
      variantImages: true,
      variantTags: true,
    },
  });
  if (variant) {
    return (
      <main>
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div className="flex-1">
            <SingleProductPageShowCase
              variants={variant.product.productVariants}
            />
          </div>
          <div className="flex  flex-col flex-1">
            <h2 className="text-2xl font-bold">{variant?.product?.title}</h2>
            <div>
              <SingleProductPageProductType
                variants={variant.product.productVariants}
              />
            </div>
            <Separator className="my-2" />
            <p className="text-2xl font-medium py-2">
              {priceFormatter(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground font-medium my-2">
              Available colors
            </p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((item) => (
                <SingleProductPageProductPick
                  key={item.id}
                  color={item.color}
                  id={item.id}
                  image={item.variantImages[0]?.url}
                  price={variant.product.price}
                  productID={variant.productID}
                  productType={item.productType}
                  title={variant.product.title}
                />
              ))}
            </div>
          </div>
        </section>
        <SingleProductPageReviews productID={variant.productID} />
      </main>
    );
  }
};

export default SingleProductPage;
